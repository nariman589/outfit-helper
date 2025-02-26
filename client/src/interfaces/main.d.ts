// API Response Types
interface SearchResult {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  imageUrl: string;
  productUrl: string;
  shop: "wildberries" | "kaspi" | "lamoda" | "amazon" | "aliexpress" | "asos";
}

interface ItemGroup {
  type: string;
  products: SearchResult[];
}

interface ApiResponse {
  success: boolean;
  query: {
    original: string;
    parsed: ParsedRequest;
  };
  results: ItemGroup[];
}

interface ApiError {
  code: string;
  message: string;
}

interface RequiredShops {
  Wildberries?: boolean;
  Kaspi?: boolean;
  Lamoda?: boolean;
  Asos?: boolean;
  FarFetch?: boolean;
}

type PictureProperty = "on_image" | "by_image" | "selfie";

// Search State
interface SearchState {
  query: string;
  requiredShops: RequiredShops;
  results: ItemGroup[] | null;
  itemsQuantity: number;
  loading: boolean;
  pictureProperty?: PictureProperty;
  error: string | null;
}

// ParsedRequest Types (matching backend)
interface ParsedRequest {
  query: string;
  style: string;
  items: ParsedItem[];
  common: CommonAttributes;
  requirements: Requirements;
}

interface ParsedItem {
  name: string;
  type: string;
  category: string;
  colors?: string[];
  patterns?: string[];
  materials?: string[];
  details?: string[];
  style_tags?: string[];
}

interface CommonAttributes {
  gender?: string;
  age_group?: string;
  size?: string;
  fit?: string;
  season?: string[];
  occasion?: string[];
  brand?: string;
  price_range?: {
    min: number;
    max: number;
    currency: string;
  };
  weather_conditions?: string[];
}

interface Requirements {
  must_have?: string[];
  nice_to_have?: string[];
  exclude?: string[];
}
