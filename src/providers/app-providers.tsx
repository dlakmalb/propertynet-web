"use client";

import React from "react";
import { ConfigProvider, theme } from "antd";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#2563EB",
          colorBgLayout: "#F5F7FB",
          colorBgContainer: "#FFFFFF",
          colorText: "#111827",
          colorTextSecondary: "#6B7280",
          colorBorder: "#E5E7EB",

          borderRadius: 12,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
