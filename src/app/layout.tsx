import type { Metadata } from "next";
import { Fondamento, Georama } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";

const inter = Georama({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

const shadows = Fondamento({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-secondary",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Prophecy Pool",
  description: "Bet on Episodes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${shadows.variable} font-regular tracking-wide`}>
      <div className="fixed left-0 top-0 -z-10 h-full w-full">
          <div className="absolute inset-0 -z-10 h-screen w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#160b04_40%,#643212_100%)]"></div>
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
         {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
