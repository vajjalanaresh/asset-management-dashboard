export type Asset = {
  id: string;
  building_id: string;
  name: string;
  type?: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  created_at: string;
};
