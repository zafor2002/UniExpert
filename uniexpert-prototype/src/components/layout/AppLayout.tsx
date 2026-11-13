import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import DemoRoleSwitcher from './DemoRoleSwitcher';
import Footer from './Footer';
import { Toaster } from '../shared/Toast';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FF] text-[#334155]">
      {/* Fixed top bar */}
      <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content area */}
      <main
        className="flex-1 flex flex-col pt-16 pb-16 transition-all duration-300 md:ml-64 bg-[#F4F8FF]"
      >
        <div className="flex-1 p-4 md:p-6 max-w-screen-2xl w-full mx-auto">
          {children}
        </div>
        <Footer />
      </main>

      {/* Floating demo role switcher */}
      <DemoRoleSwitcher />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default AppLayout;
