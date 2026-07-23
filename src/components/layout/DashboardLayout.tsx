import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useOutletContext } from 'react-router-dom';

export interface PageHeaderContext {
  setHeader: (title: string, subtitle?: string) => void;
}

export function useDashboardHeader(title: string, subtitle?: string) {
  const { setHeader } = useOutletContext<PageHeaderContext>();
  // Appelé à chaque rendu — setHeader est stable (useState setter), pas de boucle.
  setHeader(title, subtitle);
}

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [header, setHeaderState] = useState<{ title: string; subtitle?: string }>({ title: 'Dashboard' });

  function setHeader(title: string, subtitle?: string) {
    setHeaderState((prev) => (prev.title === title && prev.subtitle === subtitle ? prev : { title, subtitle }));
  }

  return (
    <div className={clsx('app-shell', collapsed && 'is-collapsed')}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div>
        <Topbar title={header.title} subtitle={header.subtitle} />
        <main className="main-content">
          <Outlet context={{ setHeader } satisfies PageHeaderContext} />
        </main>
      </div>
    </div>
  );
}
