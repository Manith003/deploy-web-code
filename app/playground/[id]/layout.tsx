import { SidebarProvider } from "@/components/ui/sidebar";

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarProvider className="bg-neutral-900">{children}</SidebarProvider>;
}
