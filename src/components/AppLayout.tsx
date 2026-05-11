import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, User as UserIcon, ListChecks } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useUser } from '@/store/useUser';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/demand': 'Demand Management',
  '/allocation': 'Resource Allocation',
  '/resources': 'Resource Information',
  '/reports': 'Reporting Dashboard',
  '/forecast': 'Resource Forecast',
  '/data-management': 'Data Management',
  '/profile': 'My Profile',
  '/my-allocations': 'My Allocations',
};

const initials = (n: string) => n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] ?? 'Resource Management';
  const { current, users, setUser } = useUser();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-md hover:bg-muted transition-colors" aria-label="Notifications">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <button className="p-2 rounded-md hover:bg-muted transition-colors" aria-label="Settings">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {initials(current.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="flex flex-col gap-1 py-2">
                    <span className="font-semibold">{current.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{current.email}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{current.role}</Badge>
                      <Badge variant="outline" className="text-xs">Portfolio: {current.portfolio}</Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserIcon className="h-4 w-4 mr-2" /> My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-allocations')}>
                    <ListChecks className="h-4 w-4 mr-2" /> My Allocations
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Switch user (demo)</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={current.id} onValueChange={(id) => { setUser(id); toast.success(`Switched to ${users.find((u) => u.id === id)?.name}`); }}>
                    {users.map((u) => (
                      <DropdownMenuRadioItem key={u.id} value={u.id} className="text-sm">
                        {u.name} <span className="ml-auto text-xs text-muted-foreground">{u.portfolio}</span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info('Logout simulated — session ended')}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
