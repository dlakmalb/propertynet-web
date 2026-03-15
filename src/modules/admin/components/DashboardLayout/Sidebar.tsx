'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard,
  Building2,
  ListTree,
  Tags,
  PlusCircle,
  Users,
  UserCircle,
  Shield,
} from 'lucide-react';

import styles from './DashboardLayout.module.css';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const menuItems: MenuItem[] = [
  getItem('Dashboard', '/extranet/dashboard', <LayoutDashboard size={18} />),
  getItem('Properties', 'properties', <Building2 size={18} />, [
    getItem('All Properties', '/extranet/properties', <ListTree size={16} />),
    getItem('Add Property', '/extranet/properties/new', <PlusCircle size={16} />),
    getItem('Categories', '/extranet/properties/categories', <Tags size={16} />),
  ]),
  getItem('Users', 'users', <Users size={18} />, [
    getItem('All Users', '/extranet/users', <UserCircle size={16} />),
    getItem('Roles & Permissions', '/extranet/users/roles', <Shield size={16} />),
  ]),
];

interface SidebarProps {
  collapsed: boolean;
  onMenuClick: () => void;
}

export default function Sidebar({ collapsed, onMenuClick }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    router.push(e.key);
    onMenuClick();
  };

  // Determine which menu items should be open based on current path
  const getOpenKeys = () => {
    if (pathname.includes('/extranet/properties')) return ['properties'];
    if (pathname.includes('/extranet/users')) return ['users'];
    return [];
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div className={styles.logo}>
        <h1 className={`${styles.logoText} ${collapsed ? styles.logoCollapsed : ''}`}>
          {collapsed ? 'PN' : 'PropertyNet'}
        </h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}
