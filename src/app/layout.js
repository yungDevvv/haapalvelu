import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./calendar.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hääpalvelu - Wedding Service",
  description: "Wedding planning and management service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400&family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Allura&family=Parisienne&family=Montserrat:wght@300;400;600;700&family=Raleway:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
