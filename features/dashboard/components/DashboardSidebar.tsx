"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Code2,
  Compass,
  Database,
  FlameIcon,
  History,
  Home,
  Lightbulb,
  LucideIcon,
  Settings,
  Star,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PlaygroundDataProps {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const lucideIconsMap: Record<string, LucideIcon> = {
  Zap: Zap,
  Lightbulb: Lightbulb,
  Database: Database,
  Compass: Compass,
  FlameIcon: FlameIcon,
  Terminal: Terminal,
  Code2: Code2,
};

const DashboardSidebar = ({
  initialPlaygroundData,
}: {
  initialPlaygroundData: PlaygroundDataProps[];
}) => {
  const pathname = usePathname();
  // const [starredPlaygrounds, setStarredPlaygrounds] = useState(
  //   initialPlaygroundData.filter((playground) => playground.starred)
  // );
  // const [recentPlaygrounds, setRecentPlaygrounds] = useState(
  //   initialPlaygroundData
  // );

  const starredPlaygrounds = initialPlaygroundData.filter(
    (playground) => playground.starred,
  );

  const recentPlaygrounds = initialPlaygroundData;

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-r bg-neutral-800"
    >
      <SidebarHeader className="bg-neutral-800 text-white">
        <div className="flex items-center justify-center gap-2 px-4 py-3">
          <span className="text-xs sm:text-sm lg:text-[12px] w-full px-2 flex justify-center items-center text-center uppercase tracking-tight leading-tight">
            WEB.CODE IDE
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-neutral-800 text-white">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip={"Home"}
              >
                <Link href={"/"}>
                  <Home className="size-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            <Star className="size-4 mr-2" />
            Starred Playgrounds
          </SidebarGroupLabel>
          {/* <SidebarGroupAction
            title="Add starred Playground"
            className="text-white"
          >
            <Plus className="size-4" />
          </SidebarGroupAction> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 &&
              recentPlaygrounds.length === 0 ? (
                <div className="text-center text-muted-foreground py-4 w-full">
                  Create Your Playground
                </div>
              ) : (
                starredPlaygrounds.map((playground) => {
                  const IconComponent =
                    lucideIconsMap[playground.icon] || Code2;
                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                      >
                        <Link href={`/playground/${playground.id}`}>
                          {IconComponent && (
                            <IconComponent className="size-4" />
                          )}
                          <span>{playground.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            <History className="h-4 w-4 mr-2" />
            Recent Playgrounds
          </SidebarGroupLabel>
          {/* <SidebarGroupAction
            title="Create new playground "
            className="text-white"
          >
            <FolderPlus className="h-4 w-4" />
          </SidebarGroupAction> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 && recentPlaygrounds.length === 0
                ? null
                : recentPlaygrounds.map((playground) => {
                    const IconComponent =
                      lucideIconsMap[playground.icon] || Code2;
                    return (
                      <SidebarMenuItem key={playground.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/playground/${playground.id}`}
                          tooltip={playground.name}
                        >
                          <Link href={`/playground/${playground.id}`}>
                            {IconComponent && (
                              <IconComponent className="h-4 w-4" />
                            )}
                            <span>{playground.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View all">
                  <Link href="/playgrounds">
                    <span className="text-sm text-muted-foreground">
                      View all playgrounds
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* <SidebarFooter className="bg-neutral-800 text-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
