export type Screen =
  | 'home'
  | 'discover'
  | 'messages'
  | 'profile'
  | 'auth'
  | 'onboarding'
  | 'swipe'
  | 'services'
  | 'products'
  | 'search'
  | 'pricing'
  | 'dashboard'
  | 'chat'
  | 'listing'
  | 'profileView';

export type UserRole = 'earn' | 'find' | 'both';

export type Category =
  | 'Teaching'
  | 'Tailoring'
  | 'Cooking'
  | 'Gardening'
  | 'Childcare'
  | 'Handicrafts'
  | 'Music'
  | 'Languages'
  | 'Consulting'
  | 'Beauty'
  | 'Repairs'
  | 'Art';

export interface Provider {
  id: string;
  name: string;
  age: number;
  category: Category;
  skillTitle: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  rating: number;
  reviews: number;
  priceFrom: number;
  distanceKm: number;
  matchScore: number;
  avatar: string;
  locationArea: string;
  availability: string;
  languages: string[];
  verified: boolean;
  completedJobs: number;
  responseTime: string;
}

export interface Product {
  id: string;
  title: string;
  category: Category;
  price: number;
  rating: number;
  reviews: number;
  sellerName: string;
  sellerId: string;
  distanceKm: number;
  image: string;
  description: string;
  tags: string[];
}

export interface ChatThread {
  id: string;
  providerId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  voice?: boolean;
  duration?: string;
}

export interface Booking {
  id: string;
  providerId: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'pending';
  price: number;
}

export interface AppUser {
  id?: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  role: UserRole;
  onboarded: boolean;
  profile?: Partial<Provider>;
}
