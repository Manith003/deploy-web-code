import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/features/dashboard/action";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const playgrounds = await getAllPlaygroundForUser();
  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    ANGULAR: "Terminal",
  }

  const formattedPlaygroundData = playgrounds?.map((playground) => ({
    id: playground.id,
    name: playground.title,
    starred: playground.Starmark?.[0]?.isMarked || false,
    icon: technologyIconMap[playground.template] || "Code2",
  })) || [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <DashboardSidebar initialPlaygroundData={formattedPlaygroundData}/>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
