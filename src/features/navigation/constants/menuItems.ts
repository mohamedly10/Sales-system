import { 
  Users, 
  Send,
  Inbox,
  BarChart3
} from 'lucide-react';
import { NavigationItem } from '../types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'people',
    label: 'إدارة المستخدمين',
    icon: Users,
    category: 'إدارة العمليات'
  },
  {
    id: 'exports',
    label: 'إدارة الصادرات',
    icon: Send,
    category: 'إدارة العمليات'
  },
  {
    id: 'imports',
    label: 'إدارة الواردات',
    icon: Inbox,
    category: 'إدارة العمليات'
  },
  {
    id: 'reports',
    label: 'التقارير',
    icon: BarChart3,
    category: 'إدارة العمليات'
  }
];


