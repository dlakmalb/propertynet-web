'use client';
import React from 'react';

export default function AdminDashboardPage() {
  const [count, setCount] = React.useState(0);
  return (
    <main style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <p>Placeholder page</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </main>
  );
}
