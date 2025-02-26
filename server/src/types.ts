export interface ClothingItem {
  query: string;
  type: string; // Тип предмета (футболка, брюки, платье и т.д.)
}

export interface ParsedRequest {
  query: string; // исходный текст запроса
  items: ClothingItem[]; // предметы одежды
}

export interface RequiredShops {
  Wildberries?: boolean;
  Kaspi?: boolean;
  Lamoda?: boolean;
  Asos?: boolean;
  FarFetch?: boolean;
  Aliexpress?: boolean;
  Amazon?: boolean;
}

export type PictureProperty = "on_image" | "by_image" | "selfie";
