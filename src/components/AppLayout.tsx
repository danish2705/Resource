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

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/auth/useAuth";
import { ROLE_LABELS } from "@/auth/rbac";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

import {
  useState,
  useEffect,
} from "react";

const pageTitles: Record<
  string,
  string
> = {
  "/": "Dashboard",

  "/demand":
    "Demand Management",

  "/allocation":
    "Resource Allocation",

  "/resources":
    "Resource Information",

  "/reports":
    "Reporting Dashboard",

  "/forecast":
    "Resource Forecast",

  "/data-management":
    "Data Management",

  "/profile":
    "My Profile",

  "/my-allocations":
    "My Allocations",
};

const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();

  const navigate = useNavigate();
  const title = pageTitles[location.pathname] ?? "Resource Management";
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "theme",
        ) === "dark"
      );
    });

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState<Date>(new Date());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "dark",
      );
    } else {
      document.documentElement.classList.remove(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "light",
      );
    }
  }, [darkMode]);

  const handleRefresh = () => {
    setLastUpdated(new Date());

    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
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

  const displayName = user ? ROLE_LABELS[user.role] : "";
  const avatarText = user ? initials(ROLE_LABELS[user.role]) : "??";

  return (
    <SidebarProvider>

      {/* ROOT */}

      <div
        className="
          h-screen
          w-full
          overflow-hidden
          flex
          bg-background
          transition-all
          duration-200
          ease-out
        "
      >

        {/* SIDEBAR */}

        <AppSidebar />

        {/* MAIN WRAPPER */}

        <div
          className="
            flex-1
            min-w-0
            h-screen
            overflow-hidden
            flex
            flex-col
            transition-all
            duration-200
            ease-out
          "
        >

          {/* HEADER */}

          <header
            className="
              h-14
              shrink-0
              flex
              items-center
              justify-between
              border-b
              bg-card
              px-4
              shadow-sm
              transition-all
              duration-200
              ease-out
            "
          >

            {/* LEFT */}

            <div
              className="
                flex
                items-center
                gap-2
                transition-all
                duration-200
                ease-out
              "
            >

              

              <h1
                className="
                  text-base
                  font-semibold
                  text-foreground
                  truncate
                  transition-all
                  duration-200
                  ease-out
                "
              >
                {title}
              </h1>

            </div>

            {/* RIGHT */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              {/* REFRESH */}

              <div className="relative group">

                <button
                  onClick={
                    handleRefresh
                  }
                  className="
                    p-2
                    rounded-md
                    hover:bg-muted
                    transition-all
                    duration-200
                    ease-out
                  "
                  aria-label="Refresh"
                >
                  <RefreshCw className="h-5 w-5 text-muted-foreground" />
                </button>

                <div className="absolute right-0 top-full mt-1 z-50 hidden group-hover:block">

                  <div
                    className="
                      bg-popover
                      text-popover-foreground
                      text-xs
                      rounded-md
                      shadow-md
                      border
                      px-3
                      py-2
                      whitespace-nowrap
                    "
                  >
                    Last updated:
                    {" "}
                    {formatLastUpdated(
                      lastUpdated,
                    )}
                  </div>

                </div>
              </div>

              {/* SETTINGS */}

              <button
                className="
                  p-2
                  rounded-md
                  hover:bg-muted
                  transition-all
                  duration-200
                  ease-out
                "
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* USER MENU */}
              <DropdownMenu>

                <DropdownMenuTrigger
                  className="
                    rounded-full
                    focus:outline-none
                    focus:ring-2
                    focus:ring-ring
                  "
                >

                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {avatarText}
                    </AvatarFallback>

                  </Avatar>

                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex flex-col gap-1 py-2">
                    <span className="font-semibold">{displayName}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      @{user?.username}
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {displayName}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Portfolio: {user?.portfolio}
                      </Badge>

                    </div>

                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {/* DARK MODE */}

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();

                      setDarkMode(
                        (prev) =>
                          !prev,
                      );
                    }}
                    className="cursor-pointer"
                  >

                    {darkMode ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}

                    {darkMode
                      ? "Light Mode"
                      : "Dark Mode"}

                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* PROFILE */}

                  <DropdownMenuItem
                    onClick={() =>
                      navigate(
                        "/profile",
                      )
                    }
                  >
                    <UserIcon className="h-4 w-4 mr-2" />

                    My Profile

                  </DropdownMenuItem>

                  {/* ALLOCATIONS */}

                  <DropdownMenuItem
                    onClick={() =>
                      navigate(
                        "/my-allocations",
                      )
                    }
                  >
                    <ListChecks className="h-4 w-4 mr-2" />

                    My Allocations

                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* LOGOUT */}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 font-medium focus:text-red-500 focus:bg-red-500/10 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2 text-red-500" /> Logout
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