export type Asset = {
  id: string;
  building_id: string;
  name: string;
  type?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
};
