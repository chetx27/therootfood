export type ProductCategory =
  | "flours-powders"
  | "roots-herbal"
  | "eggs-dairy"
  | "meat-poultry"
  | "bakery"
  | "wellness";

export type PriceType = "fixed" | "enquiry" | "custom-form";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  priceType: PriceType;
  price?: number;            // only set when priceType === "fixed"
  unit?: string;              // e.g. "per kg", "per 10g", "for 12 eggs", "per 100g"
  imageSrc: string;
  imageAlt: string;
  shortNote?: string;         // e.g. "Stone-ground in small batches"
  whatsappTemplate: string;   // e.g. "Hi, I'd like to order {productName}."
  available?: boolean;        // defaults to true; set false to show "Unavailable"
}
