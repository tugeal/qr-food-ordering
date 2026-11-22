"use client";

import { useState, type ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ALL_CATEGORIES } from "../constants";
import type { MenuCategory } from "../types";
import { CategoryChips } from "./category-chips";
import { MenuGrid } from "./menu-grid";

type Props = {
  categories: MenuCategory[];
  itemActions?: Record<string, ReactNode>;
};

/** The customer menu: category chips that filter instantly, no page reload. */
export function MenuBrowser({ categories, itemActions }: Props) {
  const [selected, setSelected] = useState(ALL_CATEGORIES);

  if (categories.length === 0) {
    return <EmptyState title="The menu is empty">Please check back soon.</EmptyState>;
  }

  const visible =
    selected === ALL_CATEGORIES
      ? categories
      : categories.filter((category) => category.id === selected);

  return (
    <>
      <CategoryChips categories={categories} selected={selected} onSelect={setSelected} />
      <MenuGrid categories={visible} itemActions={itemActions} />
    </>
  );
}
