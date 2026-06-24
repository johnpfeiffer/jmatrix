import { describe, expect, it } from "vitest";
import {
  createItem,
  cycleStatus,
  formatDate,
  sectionForItem,
  sortItems,
  updateItem,
  type MatrixItem,
} from "./item";

describe("item model", () => {
  it("creates pending items with required timestamps", () => {
    const item = createItem(
      {
        title: "  Write spec  ",
        urgent: true,
        important: true,
        description: "  first pass  ",
      },
      "2026-06-23T10:00:00.000Z",
      "item-1",
    );

    expect(item).toMatchObject({
      id: "item-1",
      title: "Write spec",
      urgent: true,
      important: true,
      createdAt: "2026-06-23T10:00:00.000Z",
      modifiedAt: "2026-06-23T10:00:00.000Z",
      status: "Pending",
      description: "first pass",
    });
  });

  it("keeps createdAt immutable and changes modifiedAt on update", () => {
    const item = createItem(
      {
        title: "One",
        urgent: false,
        important: true,
        description: "clear me",
        dueAt: "2026-06-24T12:00:00.000Z",
      },
      "2026-06-23T10:00:00.000Z",
      "item-1",
    );

    const updated = updateItem(
      item,
      { title: "Two", urgent: true, description: "", dueAt: "" },
      "2026-06-23T11:00:00.000Z",
    );

    expect(updated.createdAt).toBe(item.createdAt);
    expect(updated.modifiedAt).toBe("2026-06-23T11:00:00.000Z");
    expect(updated.title).toBe("Two");
    expect(updated.urgent).toBe(true);
    expect(updated.description).toBeUndefined();
    expect(updated.dueAt).toBeUndefined();
  });

  it("cycles statuses through the kernel status domain", () => {
    expect(cycleStatus("Pending")).toBe("In Progress");
    expect(cycleStatus("In Progress")).toBe("Done");
    expect(cycleStatus("Done")).toBe("Won't Do");
    expect(cycleStatus("Won't Do")).toBe("Pending");
  });

  it("routes done and won't do items to bottom status areas", () => {
    const base = makeItem({ urgent: true, important: true });

    expect(sectionForItem(base)).toBe("important-urgent");
    expect(sectionForItem({ ...base, status: "Done" })).toBe("completed");
    expect(sectionForItem({ ...base, status: "Won't Do" })).toBe("cancelled");
  });

  it("sorts by due date, status, then latest modifiedAt", () => {
    const sorted = sortItems([
      makeItem({
        id: "late-modified",
        dueAt: "2026-06-24T12:00:00.000Z",
        status: "Pending",
        modifiedAt: "2026-06-23T12:00:00.000Z",
      }),
      makeItem({
        id: "soon",
        dueAt: "2026-06-23T12:00:00.000Z",
        status: "Pending",
      }),
      makeItem({
        id: "done",
        dueAt: "2026-06-24T12:00:00.000Z",
        status: "Done",
      }),
      makeItem({
        id: "older-modified",
        dueAt: "2026-06-24T12:00:00.000Z",
        status: "Pending",
        modifiedAt: "2026-06-23T11:00:00.000Z",
      }),
      makeItem({ id: "no-due" }),
    ]);

    expect(sorted.map((item) => item.id)).toEqual([
      "soon",
      "done",
      "late-modified",
      "older-modified",
      "no-due",
    ]);
  });

  it("formats ISO dates as YYYY-MM-DD", () => {
    expect(formatDate("2026-06-23T12:30:00.000Z")).toBe("2026-06-23");
  });
});

function makeItem(overrides: Partial<MatrixItem> = {}): MatrixItem {
  return {
    id: "item",
    title: "Task",
    urgent: false,
    important: false,
    createdAt: "2026-06-23T10:00:00.000Z",
    modifiedAt: "2026-06-23T10:00:00.000Z",
    status: "Pending",
    ...overrides,
  };
}
