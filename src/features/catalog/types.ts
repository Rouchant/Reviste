export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  tag?: string;
  rating?: number;
  reviews?: number | string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  link: string;
  buttonText: string;
}
