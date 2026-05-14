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
  Clock,
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

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, end: true },
];

const demandSubItems = [
  {
    title: "Create Demand",
    url: "/demand?action=create",
    icon: PlusCircle,
  },
  {
    title: "Demand Status",
    url: "/demand-status",
    icon: TrendingUp,
  },
  {
    title: "Demand Summary",
    url: "/demand",
    icon: ListChecks,
    end: true,
  },
];

const lowerItems = [
  { title: "Allocation", url: "/allocation", icon: Users },
  { title: "Resource", url: "/resources", icon: UserCircle },
  { title: "Projects", url: "/projects", icon: ClipboardList },
  { title: "Timesheets & Actuals", url: "/timesheets-actuals", icon: Clock },
  { title: "Reporting Dashboard", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const location = useLocation();

  const demandActive =
    location.pathname.startsWith("/demand") ||
    location.pathname.startsWith("/demand-status");

  const [demandOpen, setDemandOpen] = useState(demandActive);

  const linkBase =
    "flex items-center gap-2 w-full transition-colors rounded-md";

  const linkInactive =
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  const linkActive =
    "bg-sidebar-accent text-sidebar-accent-foreground font-medium";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
            RM
          </div>

          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-sidebar-foreground">
                Resource Management
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
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
              ))}

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
                        {demandSubItems.map((sub) => (
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
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {lowerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={linkBase + " " + linkInactive}
                      activeClassName={linkActive}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />

                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
