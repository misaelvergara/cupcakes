export interface Cupcake {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface CartItem {
  cupcake: Cupcake;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: string;
  paymentMethod: 'credit' | 'pix';
  status: 'pending' | 'sent' | 'completed' | 'cancelled';
  date: Date;
}
