import "./global.css";
import Header from "../shared/widgets/header";
import { Roboto, Poppins } from "next/font/google";
import Providers from "./providers";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Welcome to E-Shop",
  description: "Generated by Arun Kumar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable} font-Poppins`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
