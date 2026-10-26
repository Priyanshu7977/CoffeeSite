export interface SectionData {
  id: string;
  num: string;
  title: string;
  subtitle: string;
}

export interface FlavorNote {
  name: string;
  category: string;
  intensity: number;
  description: string;
  color: string;
  accentHex: string;
}

export interface ReserveBatch {
  id: string;
  name: string;
  vintage: string;
  origin: string;
  region: string;
  altitude: string;
  varietal: string;
  process: string;
  notes: string[];
  allocationLeft: number;
  totalAllocations: number;
  roastLevel: string;
  price: string;
  badge: string;
  description: string;
}

export interface Product {
  id: string;
  num: string;
  name: string;
  origin: string;
  region: string;
  altitude: string;
  process: string;
  roastLevel: string;
  notes: string[];
  description: string;
  brewRecommendation: string;
  acidity: number;
  body: number;
  sweetness: number;
  price: string;
  image: string;
  badge: string;
  year: string;
}

export interface BrewMethod {
  id: string;
  name: string;
  tagline: string;
  time: string;
  grind: string;
  temp: string;
  ratio: string;
  description: string;
  image: string;
  proTip: string;
  yieldVolume: string;
}

export interface CollectionItem {
  product: Product;
  quantity: number;
  grind: string;
  certificateId: string;
}
