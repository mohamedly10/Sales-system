import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeType?: 'default' | 'danger' | 'info';
  category?: string;
}

export interface SidebarConfig {
  collapsed: boolean;
  activeItemId: string;
}
