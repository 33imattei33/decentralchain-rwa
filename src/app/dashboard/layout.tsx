import DashboardShell from "@/components/dashboard/DashboardShell";
import { WalletProvider } from "@/contexts/WalletContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <DashboardShell>{children}</DashboardShell>
    </WalletProvider>
  );
}
