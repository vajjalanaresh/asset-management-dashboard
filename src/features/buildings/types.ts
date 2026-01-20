export type Building = {
  id: string;
  customer_id: string;
  name: string;
  address?: string;
  status: 'Active' | 'Inactive';
  square_footage?: number;
  
  created_at: string;
  
};
