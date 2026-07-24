export interface Product {
  id: string;
  name: string;
  age: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  tags: string[];
  description: string;
  plot: string;
  title: string;
  funFact: string;
  status: string;
  openScene?: string;
}

export interface BugReport {
  id: string;
  characterName: string;
  errorTypes: string[];
  timestamp: string;
  details?: string;
}
