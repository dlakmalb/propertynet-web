'use client';

import { useRouter } from 'next/navigation';
import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Menu as MenuIcon, User, Settings, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { useMe, meQueryKey } from '@/modules/auth/hooks/useMe';
import { logout } from '@/lib/api/auth';

const { Header } = Layout;
const { Text } = Typography;

interface TopNavProps {
  onMenuToggle: () => void;
  isMobile: boolean;
}

export default function TopNav({ onMenuToggle, isMobile }: TopNavProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useMe();

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.removeQueries({ queryKey: meQueryKey });
      router.replace('/extranet/login');
    } catch {
      // Still redirect even if logout API fails
      router.replace('/extranet/login');
    }
  };

  const profileMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <User size={16} />,
      onClick: () => router.push('/extranet/profile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings size={16} />,
      onClick: () => router.push('/extranet/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogOut size={16} />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        height: 64,
        lineHeight: '64px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      <Button
        type="text"
        icon={<MenuIcon size={20} color="#000" />}
        onClick={onMenuToggle}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />

      <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" trigger={['click']}>
        <Space style={{ cursor: 'pointer' }}>
          <Avatar
            style={{
              backgroundColor: '#1677ff',
              verticalAlign: 'middle',
            }}
            size="default"
          >
            {user?.name ? getInitials(user.name) : <User size={16} />}
          </Avatar>
          {!isMobile && (
            <Text strong style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.88)' }}>
              {user?.name || 'Admin'}
            </Text>
          )}
        </Space>
      </Dropdown>
    </Header>
  );
}
