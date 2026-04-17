export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  tag?: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  link: string;
}
