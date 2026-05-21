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
  PanelLeft,
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
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    end: true,
  },
];

const demandSubItems = [
  {
    title: "Create Demand",
    url: "/demand/create",
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
  {
    title: "Allocation Details",
    url: "/allocation",
    icon: Users,
  },

  {
    title: "Resource Information",
    url: "/resources",
    icon: UserCircle,
  },

  {
    title: "Resource Review",
    url: "/resource-review",
    icon: ShieldCheck,
  },

  {
    title: "Projects",
    url: "/projects",
    icon: ClipboardList,
  },

  {
    title: "Reporting Dashboard",
    url: "/reports",
    icon: BarChart3,
  },

  {
    title: "Audit Log",
    url: "/audit-log",
    icon: ScrollText,
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } =
    useSidebar();

  const collapsed =
    state === "collapsed";

  const location = useLocation();

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
    "flex items-center gap-2 w-full rounded-md transition-all duration-200 ease-out";

  const linkInactive =
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  const linkActive =
    "bg-sidebar-accent text-sidebar-accent-foreground font-medium";

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

          {/* TOGGLE BUTTON */}

          <button
            onClick={toggleSidebar}
            className="
              h-8
              w-8
              shrink-0
              rounded-md
              flex
              items-center
              justify-center
              hover:bg-sidebar-accent
              transition-all
              duration-200
              ease-out
            "
          >
            <PanelLeft className="h-4 w-4" />
          </button>

          {/* TITLE */}

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

          <SidebarGroupContent>

            <SidebarMenu>

              {/* MAIN */}

              {mainItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                >
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className={`${linkBase} ${linkInactive}`}
                      activeClassName={
                        linkActive
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />

                      {!collapsed && (
                        <span>
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* DEMAND MANAGEMENT */}

              <Collapsible
                open={
                  collapsed
                    ? false
                    : demandOpen
                }
                onOpenChange={
                  setDemandOpen
                }
                className="group/collapsible"
              >
                <SidebarMenuItem>

                  <CollapsibleTrigger asChild>

                    <SidebarMenuButton
                      tooltip="Demand Management"
                      className={
                        demandActive
                          ? linkActive
                          : linkInactive
                      }
                    >
                      <ClipboardList className="h-4 w-4 shrink-0" />

                      {!collapsed && (
                        <>
                          <span>
                            Demand Management
                          </span>

                          <ChevronDown
                            className="
                              ml-auto
                              h-4
                              w-4
                              transition-transform
                              duration-200
                              ease-out
                              group-data-[state=open]/collapsible:rotate-180
                            "
                          />
                        </>
                      )}
                    </SidebarMenuButton>

                  </CollapsibleTrigger>

                  {!collapsed && (
                    <CollapsibleContent
                      className="
                        transition-all
                        duration-200
                        ease-out
                      "
                    >
                      <SidebarMenuSub>

                        {demandSubItems.map(
                          (sub) => (
                            <SidebarMenuSubItem
                              key={sub.title}
                            >
                              <SidebarMenuSubButton asChild>

                                <NavLink
                                  to={sub.url}
                                  end={sub.end}
                                  className={`${linkBase} ${linkInactive}`}
                                  activeClassName={
                                    linkActive
                                  }
                                >
                                  <sub.icon className="h-3.5 w-3.5 shrink-0" />

                                  <span>
                                    {sub.title}
                                  </span>

                                </NavLink>

                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ),
                        )}

                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}

                </SidebarMenuItem>
              </Collapsible>

              {/* LOWER ITEMS */}

              {lowerItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                >
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      className={`${linkBase} ${linkInactive}`}
                      activeClassName={
                        linkActive
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />

                      {!collapsed && (
                        <span>
                          {item.title}
                        </span>
                      )}
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