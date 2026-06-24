import { MatrixItem, SectionId, sectionForItem, sortItems } from "./item";

export interface BoardSection {
  id: SectionId;
  title: string;
  subtitle: string;
  items: MatrixItem[];
}

export const BASE_SECTION_IDS: SectionId[] = [
  "important-less-urgent",
  "important-urgent",
  "less-important-less-urgent",
  "less-important-urgent",
];

export const SECTION_DEFINITIONS: Omit<BoardSection, "items">[] = [
  {
    id: "important-less-urgent",
    title: "Important",
    subtitle: "Less urgent",
  },
  {
    id: "important-urgent",
    title: "Important",
    subtitle: "Urgent",
  },
  {
    id: "less-important-less-urgent",
    title: "Less important",
    subtitle: "Less urgent",
  },
  {
    id: "less-important-urgent",
    title: "Less important",
    subtitle: "Urgent",
  },
  {
    id: "cancelled",
    title: "Cancelled",
    subtitle: "Won't do",
  },
  {
    id: "completed",
    title: "Completed",
    subtitle: "Done",
  },
];

export function buildBoardSections(items: MatrixItem[]): BoardSection[] {
  return SECTION_DEFINITIONS.map((section) => ({
    ...section,
    items: sortItems(items.filter((item) => sectionForItem(item) === section.id)),
  }));
}
