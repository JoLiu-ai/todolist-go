import type { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface HeaderProps {
  username?: string;
  onLogout?: () => void;
}

export interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
} 