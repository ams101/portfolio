import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900">
      <aside className="hidden md:block w-60 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0">
        <Sidebar />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenu={() => setMenuOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
