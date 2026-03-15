'use client';

import { useState, useEffect } from 'react';
import { Layout, Drawer, theme } from 'antd';

import Sidebar from './Sidebar';
import TopNav from './TopNav';
import styles from './DashboardLayout.module.css';

const { Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const MOBILE_BREAKPOINT = 768;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuToggle = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Layout className={styles.layout}>
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar collapsed={collapsed} onMenuClick={() => {}} />}

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={handleMobileMenuClose}
        open={mobileMenuOpen}
        size={250}
        closable={false}
        styles={{
          header: { display: 'none' },
          body: { padding: 0, background: '#001529' },
        }}
        className={styles.mobileDrawer}
      >
        <Sidebar collapsed={false} onMenuClick={handleMobileMenuClose} />
      </Drawer>

      <Layout>
        <TopNav onMenuToggle={handleMenuToggle} isMobile={isMobile} />
        <Content
          className={styles.content}
          style={{
            margin: isMobile ? '16px 8px' : '24px 16px',
            padding: isMobile ? 16 : 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
