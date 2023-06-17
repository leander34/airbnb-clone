import Navbar from "@/components/Navbar/Navbar";
import "./globals.css";
import { Nunito } from "next/font/google";
import RegisterModal from "@/components/Modals/RegisterModal";
import ToasterProvider from "@/providers/ToasterProvider";
import LoginModal from "@/components/Modals/LoginModal";
import getCurrentUser from "@/actions/getCurrentUser";
import RentModal from "@/components/Modals/RentModal";
import SearchModal from "@/components/Modals/SearchModal";

const font = Nunito({
  subsets: ["latin"],
});

export const metadata = {
  title: "Airbnb",
  description: "Airbnb clone",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="pt-br">
      <body className={font.className}>
        <RegisterModal />
        <LoginModal />
        <RentModal />
        <SearchModal />
        <Navbar currentUser={currentUser} />
        <ToasterProvider />
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
