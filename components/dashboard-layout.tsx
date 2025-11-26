'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Save, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Create Chart', href: '/create', icon: BarChart3 },
  { name: 'Saved Charts', href: '/saved', icon: Save },
];

export function DashboardLayout( { children }: { children: React.ReactNode; } ) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */ }
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <BarChart3 className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                SSA Charts
              </span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
            { navigation.map( ( item ) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={ item.href }
                  href={ item.href }
                  className={ cn(
                    'flex items-center gap-2 transition-colors hover:text-foreground/80',
                    isActive ? 'text-foreground' : 'text-foreground/60'
                  ) }
                >
                  <Icon className="h-4 w-4" />
                  { item.name }
                </Link>
              );
            } ) }
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */ }
      <main className="flex-1">{ children }</main>
    </div>
  );
}
