import { useMemo, useState } from "react";
import { buildBoardSections } from "../models/board";
import {
  MatrixItem,
  NewItemInput,
  createItem,
  updateItem,
  type ItemUpdate,
} from "../models/item";

export function useMatrixItems() {
  const [items, setItems] = useState<MatrixItem[]>([]);

  const sections = useMemo(() => buildBoardSections(items), [items]);

  function addItem(input: NewItemInput) {
    const now = new Date().toISOString();
    const id = createId();
    setItems((current) => [...current, createItem(input, now, id)]);
  }

  function saveItem(id: string, update: ItemUpdate) {
    const now = new Date().toISOString();
    setItems((current) =>
      current.map((item) => (item.id === id ? updateItem(item, update, now) : item)),
    );
  }

  return {
    items,
    sections,
    addItem,
    saveItem,
  };
}

function createId(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
