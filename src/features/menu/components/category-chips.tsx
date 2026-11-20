"use client";

import { Chip } from "@/components/ui/chip";
import { ALL_CATEGORIES } from "../constants";
import styles from "./category-chips.module.css";

type Props = {
  categories: { id: string; name: string }[];
  selected: string;
  onSelect: (id: string) => void;
};

export function CategoryChips({ categories, selected, onSelect }: Props) {
  return (
    <nav className={styles.chips} aria-label="Menu categories">
      {[{ id: ALL_CATEGORIES, name: "All" }, ...categories].map((category) => (
        <Chip
          key={category.id}
          selected={selected === category.id}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </Chip>
      ))}
    </nav>
  );
}
