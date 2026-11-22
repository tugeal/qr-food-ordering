/** What the cart needs to know about a menu item. The server supplies it, so prices stay current. */
export type CatalogItem = {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
};

export type CartLine = {
  item: CatalogItem;
  quantity: number;
};
