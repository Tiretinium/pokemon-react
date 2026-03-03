import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NaveBar';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
