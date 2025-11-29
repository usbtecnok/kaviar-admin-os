import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "KAVIAR Admin",
  description: "Painel administrativo premium KAVIAR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
