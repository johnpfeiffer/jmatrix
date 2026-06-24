import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";

describe("JMatrix MVP", () => {
  it("adds a pending task to the selected matrix section", async () => {
    const user = userEvent.setup();

    renderApp();

    await user.type(screen.getByRole("textbox", { name: "Title" }), "Ship MVP");
    await user.click(screen.getByLabelText("Urgent"));
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByDisplayValue("Ship MVP")).toBeInTheDocument();
    expect(screen.getAllByText("Urgent").length).toBeGreaterThan(0);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("only shows due time after a due date is selected", async () => {
    const user = userEvent.setup();

    renderApp();

    expect(screen.queryByLabelText("Due time")).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Due date"), "2026-06-24");

    expect(screen.getByLabelText("Due time")).toBeInTheDocument();
  });

  it("keeps status changes local until Save", async () => {
    const user = userEvent.setup();

    renderApp();

    await user.type(screen.getByRole("textbox", { name: "Title" }), "Finish report");
    await user.click(screen.getByRole("button", { name: "Add" }));

    const importantLessUrgent = screen.getByRole("region", {
      name: "Important Less urgent",
    });
    const completed = screen.getByRole("region", { name: "Completed Done" });

    await user.click(within(importantLessUrgent).getByRole("button", { name: "Pending" }));
    await user.click(within(importantLessUrgent).getByRole("button", { name: "In Progress" }));

    expect(within(importantLessUrgent).getByDisplayValue("Finish report")).toBeInTheDocument();
    expect(within(importantLessUrgent).getByRole("button", { name: "Done" })).toBeInTheDocument();
    expect(within(completed).queryByText("Finish report")).not.toBeInTheDocument();

    await user.click(within(importantLessUrgent).getByRole("button", { name: "Save" }));

    expect(within(completed).getByText("Finish report")).toBeInTheDocument();
  });

  it("shows cancel changes only while an item has a local draft", async () => {
    const user = userEvent.setup();

    renderApp();

    await user.type(screen.getByRole("textbox", { name: "Title" }), "Draft item");
    await user.click(screen.getByRole("button", { name: "Add" }));

    const itemTitle = screen.getByDisplayValue("Draft item");
    await user.clear(itemTitle);
    await user.type(itemTitle, "Changed draft");

    expect(screen.getByRole("button", { name: "Cancel changes" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel changes" }));

    expect(screen.getByDisplayValue("Draft item")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancel changes" })).not.toBeInTheDocument();
  });

  it("defaults all items in a multi-item section to collapsed cards", async () => {
    const user = userEvent.setup();

    renderApp();

    await addItem(user, "First");
    await addItem(user, "Second");

    expect(screen.getByRole("button", { name: "Expand First" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Expand Second" })).toBeInTheDocument();
    expect(screen.queryByDisplayValue("First")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Expand First" }));

    expect(screen.getByRole("button", { name: "Collapse First" })).toHaveTextContent("^");
    expect(screen.getByDisplayValue("First")).toBeInTheDocument();
  });

  it("renders shared matrix area labels", () => {
    renderApp();

    expect(screen.getAllByText("Important").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Urgent").length).toBeGreaterThan(0);
  });
});

function renderApp() {
  render(
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <App />
    </ThemeProvider>,
  );
}

async function addItem(user: ReturnType<typeof userEvent.setup>, title: string) {
  const form = screen.getByRole("form", { name: "Add item" });
  await user.type(within(form).getByRole("textbox", { name: "Title" }), title);
  await user.click(within(form).getByRole("button", { name: "Add" }));
}
