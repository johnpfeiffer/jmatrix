export const STATUSES = ["Pending", "In Progress", "Done", "Won't Do"] as const;
export type ItemStatus = (typeof STATUSES)[number];

export const STATUS_SORT_ORDER: ItemStatus[] = [
  "Done",
  "In Progress",
  "Pending",
  "Won't Do",
];

export type SectionId =
  | "important-urgent"
  | "important-less-urgent"
  | "less-important-urgent"
  | "less-important-less-urgent"
  | "completed"
  | "cancelled";

export interface MatrixItem {
  id: string;
  title: string;
  urgent: boolean;
  important: boolean;
  createdAt: string;
  modifiedAt: string;
  status: ItemStatus;
  description?: string;
  dueAt?: string;
}

export interface NewItemInput {
  title: string;
  urgent: boolean;
  important: boolean;
  description?: string;
  dueAt?: string;
}

export interface ItemUpdate {
  title?: string;
  urgent?: boolean;
  important?: boolean;
  status?: ItemStatus;
  description?: string;
  dueAt?: string;
}

export function createItem(
  input: NewItemInput,
  nowIso: string,
  id: string,
): MatrixItem {
  return {
    id,
    title: input.title.trim(),
    urgent: input.urgent,
    important: input.important,
    createdAt: nowIso,
    modifiedAt: nowIso,
    status: "Pending",
    ...(cleanOptional(input.description) ? { description: input.description?.trim() } : {}),
    ...(cleanOptional(input.dueAt) ? { dueAt: input.dueAt } : {}),
  };
}

export function updateItem(
  item: MatrixItem,
  update: ItemUpdate,
  nowIso: string,
): MatrixItem {
  const next: MatrixItem = {
    ...item,
    ...update,
    title: update.title === undefined ? item.title : update.title.trim(),
    createdAt: item.createdAt,
    modifiedAt: nowIso,
  };

  if (update.description !== undefined) {
    const description = update.description.trim();
    if (description) {
      next.description = description;
    } else {
      delete next.description;
    }
  }

  if (update.dueAt !== undefined) {
    if (update.dueAt) {
      next.dueAt = update.dueAt;
    } else {
      delete next.dueAt;
    }
  }

  return next;
}

export function cycleStatus(status: ItemStatus): ItemStatus {
  const index = STATUSES.indexOf(status);
  return STATUSES[(index + 1) % STATUSES.length];
}

export function sectionForItem(item: MatrixItem): SectionId {
  if (item.status === "Done") {
    return "completed";
  }

  if (item.status === "Won't Do") {
    return "cancelled";
  }

  if (item.important && item.urgent) {
    return "important-urgent";
  }

  if (item.important && !item.urgent) {
    return "important-less-urgent";
  }

  if (!item.important && item.urgent) {
    return "less-important-urgent";
  }

  return "less-important-less-urgent";
}

export function sortItems(items: MatrixItem[]): MatrixItem[] {
  return [...items].sort(compareItems);
}

export function compareItems(left: MatrixItem, right: MatrixItem): number {
  const leftDue = dueRank(left.dueAt);
  const rightDue = dueRank(right.dueAt);

  if (leftDue !== rightDue) {
    return leftDue - rightDue;
  }

  const leftStatus = STATUS_SORT_ORDER.indexOf(left.status);
  const rightStatus = STATUS_SORT_ORDER.indexOf(right.status);

  if (leftStatus !== rightStatus) {
    return leftStatus - rightStatus;
  }

  return Date.parse(right.modifiedAt) - Date.parse(left.modifiedAt);
}

export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

export function formatTimeWithZone(iso: string): string {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);

  return time.replace(/^24:/, "00:");
}

function dueRank(iso?: string): number {
  if (!iso) {
    return Number.POSITIVE_INFINITY;
  }

  return Date.parse(iso);
}

function cleanOptional(value?: string): boolean {
  return Boolean(value && value.trim().length > 0);
}
