import { useState } from "react";
import { useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCircle,
  BarChart3,
  ChevronDown,
  ListChecks,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  ScrollText,
  Lock,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavLink } from "@/components/NavLink";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuth } from "@/auth/useAuth";
import { hasPermission, type Permission } from "@/auth/rbac";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  permission?: Permission;
}

const mainItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    end: true,
    permission: "view_dashboard",
  },
];

const demandSubItems: NavItem[] = [
  {
    title: "Create Demand",
    url: "/demand/create",
    icon: PlusCircle,
    permission: "create_demand",
  },
  {
    title: "Demand Status",
    url: "/demand-status",
    icon: TrendingUp,
    permission: "view_dashboard",
  },
  {
    title: "Demand Summary",
    url: "/demand",
    icon: ListChecks,
    end: true,
    permission: "view_dashboard",
  },
];

const lowerItems: NavItem[] = [
  {
    title: "Allocation Details",
    url: "/allocation",
    icon: Users,
    permission: "view_allocation",
  },
  {
    title: "Resource Information",
    url: "/resources",
    icon: UserCircle,
    permission: "view_resource_info",
  },
  {
    title: "Resource Review",
    url: "/resource-review",
    icon: ShieldCheck,
    permission: "approve_demand",
  },
  {
    title: "Projects",
    url: "/projects",
    icon: ClipboardList,
    permission: "view_projects",
  },
  {
    title: "Reporting Dashboard",
    url: "/reports",
    icon: BarChart3,
    permission: "view_reporting",
  },
  {
    title: "Audit Log",
    url: "/audit-log",
    icon: ScrollText,
    permission: "view_audit_logs",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user } = useAuth();

  const can = (permission?: Permission) => {
    if (!permission) return true;
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const canSeeDemand = can("view_demand");

  const demandActive =
    location.pathname.startsWith(
      "/demand",
    ) ||
    location.pathname.startsWith(
      "/demand-status",
    );

  const [demandOpen, setDemandOpen] =
    useState(demandActive);

  const linkBase =
    "flex items-center gap-2 w-full transition-colors rounded-md";
  const linkInactive =
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  const linkActive =
    "bg-sidebar-accent text-sidebar-accent-foreground font-medium";
  const linkDisabled =
    "opacity-60 cursor-not-allowed pointer-events-none select-none";

  const renderNavItem = (item: NavItem) => {
    const allowed = can(item.permission);

    if (allowed) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title}>
            <NavLink
              to={item.url}
              end={item.end}
              className={linkBase + " " + linkInactive}
              activeClassName={linkActive}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={
                linkBase +
                " " +
                linkDisabled +
                " px-2 py-1.5 text-sm text-sidebar-foreground/60"
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  <Lock className="h-3 w-3 ml-auto opacity-60" />
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            You don't have access to {item.title}
          </TooltipContent>
        </Tooltip>
      </SidebarMenuItem>
    );
  };

  const renderSubItem = (sub: NavItem) => {
    const allowed = can(sub.permission);

    if (allowed) {
      return (
        <SidebarMenuSubItem key={sub.title}>
          <SidebarMenuSubButton asChild>
            <NavLink
              to={sub.url}
              end={sub.end}
              className={linkBase + " " + linkInactive}
              activeClassName={linkActive}
            >
              <sub.icon className="h-3.5 w-3.5 shrink-0" />
              <span>{sub.title}</span>
            </NavLink>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    }

    return (
      <SidebarMenuSubItem key={sub.title}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={
                linkBase +
                " " +
                linkDisabled +
                " px-2 py-1 text-xs text-sidebar-foreground/60"
              }
            >
              <sub.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1">{sub.title}</span>
              <Lock className="h-3 w-3 ml-auto opacity-60" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            You don't have access to {sub.title}
          </TooltipContent>
        </Tooltip>
      </SidebarMenuSubItem>
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="
        transition-all
        duration-200
        ease-out
        border-r
      "
    >
      {/* HEADER */}

      <SidebarHeader className="h-14 border-b border-sidebar-border flex justify-center">

        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
            RM
          </div>
          {!collapsed && (
            <div
              className="
                flex
                flex-col
                leading-tight
                transition-all
                duration-200
                ease-out
              "
            >
              <span className="text-sm font-semibold text-sidebar-foreground">
                Resource Management
              </span>
            </div>
          )}
        </div>

      </SidebarHeader>

      {/* CONTENT */}

      <SidebarContent
        className="
          transition-all
          duration-200
          ease-out
        "
      >
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>

            <SidebarMenu>
              {/* Main items */}
              {mainItems.map(renderNavItem)}

              {/* Demand Management — entirely disabled for resource role */}
              {canSeeDemand ? (
                <Collapsible
                  open={collapsed ? false : demandOpen}
                  onOpenChange={setDemandOpen}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Demand Management"
                        className={demandActive ? linkActive : linkInactive}
                      >
                        <ClipboardList className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span>Demand Management</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {!collapsed && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {demandSubItems.map(renderSubItem)}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                // Entire Demand Management group disabled
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={
                          linkBase +
                          " " +
                          linkDisabled +
                          " px-2 py-1.5 text-sm text-sidebar-foreground/60"
                        }
                      >
                        <ClipboardList className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">Demand Management</span>
                            <Lock className="h-3 w-3 ml-auto opacity-60" />
                          </>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">
                      You don't have access to Demand Management
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              )}

              {/* Lower items */}
              {lowerItems.map(renderNavItem)}
            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}