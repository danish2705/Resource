import { useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  User as UserIcon,
  ListChecks,
  RefreshCw,
  Moon,
  Sun,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useUser } from "@/store/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/demand": "Demand Management",
  "/allocation": "Resource Allocation",
  "/resources": "Resource Information",
  "/reports": "Reporting Dashboard",
  "/forecast": "Resource Forecast",
  "/data-management": "Data Management",
  "/profile": "My Profile",
  "/my-allocations": "My Allocations",
};

const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] ?? "Resource Management";
  const { current, users, setUser } = useUser();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    window.location.reload();
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-base font-semibold text-foreground truncate">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* REFRESH with last-updated tooltip */}
              <div className="relative group">
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                  aria-label="Refresh"
                >
                  <RefreshCw className="h-5 w-5 text-muted-foreground" />
                </button>
                <div className="absolute right-0 top-full mt-1 z-50 hidden group-hover:block">
                  <div className="bg-popover text-popover-foreground text-xs rounded-md shadow-md border px-3 py-2 whitespace-nowrap">
                    Last updated: {formatLastUpdated(lastUpdated)}
                  </div>
                </div>
              </div>
              <button
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
              </button>
              {/* USER MENU — Dark Mode toggle inside */}
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
                    <span className="text-xs text-muted-foreground font-normal">
                      {current.email}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {current.role}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Portfolio: {current.portfolio}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {/* DARK MODE TOGGLE */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setDarkMode((prev) => !prev);
                    }}
                    className="cursor-pointer"
                  >
                    {darkMode ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="h-4 w-4 mr-2" /> My Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/my-allocations")}>
                    <ListChecks className="h-4 w-4 mr-2" /> My Allocations
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Switch user (demo)
                  </DropdownMenuLabel>

                  <DropdownMenuRadioGroup
                    value={current.id}
                    onValueChange={(id) => {
                      setUser(id);
                      toast.success(
                        `Switched to ${users.find((u) => u.id === id)?.name}`,
                      );
                    }}
                  >
                    {users.map((u) => (
                      <DropdownMenuRadioItem
                        key={u.id}
                        value={u.id}
                        className="text-sm"
                      >
                        {u.name}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {u.portfolio}
                        </span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() =>
                      toast.info("Logout simulated — session ended")
                    }
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
  {children}
</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
