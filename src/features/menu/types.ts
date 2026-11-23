export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  imageUrl: string | null;
  isAvailable: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

/** A category as the restaurant manages it, with the number of items inside. */
export type AdminCategory = {
  id: string;
  name: string;
  itemCount: number;
};

/** A food item as the restaurant manages it: sold-out items included. */
export type AdminMenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  imageUrl: string | null;
  isAvailable: boolean;
};
