import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BebeTrack",
  description: "Seguimiento de gemelos - alimentacion, panales y mas",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BebeTrack",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A15",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} font-sans antialiased`}>
        <div className="w-full max-w-[440px] mx-auto min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  );
}
