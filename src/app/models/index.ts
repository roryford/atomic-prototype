export interface Project {
  id: number;
  name: string;
  description: string;
  owner: string;
  ownerInitials: string;
  status: string;
  statusSeverity: 'success' | 'info' | 'warn' | 'danger';
  avatar: string;
  color: string;
  members: number;
  deadline: string;
  createdDate: string;
  category: string;
}

export interface DashboardStats {
  label: string;
  value: string;
  icon: string;
}
