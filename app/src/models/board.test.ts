import { describe, expect, it } from "vitest";
import { BASE_SECTION_IDS, buildBoardSections } from "./board";
import type { MatrixItem } from "./item";

describe("board model", () => {
  it("keeps at least four underlying Eisenhower sections", () => {
    expect(BASE_SECTION_IDS).toHaveLength(4);
  });

  it("groups items into visible sections", () => {
    const sections = buildBoardSections([
      item({ id: "a", important: true, urgent: true }),
      item({ id: "b", status: "Done" }),
      item({ id: "c", status: "Won't Do" }),
    ]);

    expect(sectionIds(sections, "important-urgent")).toEqual(["a"]);
    expect(sectionIds(sections, "completed")).toEqual(["b"]);
    expect(sectionIds(sections, "cancelled")).toEqual(["c"]);
  });
});

function sectionIds(
  sections: ReturnType<typeof buildBoardSections>,
  id: string,
): string[] {
  return sections.find((section) => section.id === id)?.items.map((item) => item.id) ?? [];
}

function item(overrides: Partial<MatrixItem>): MatrixItem {
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
