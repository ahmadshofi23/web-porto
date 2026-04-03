import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ahmad Shofi | Flutter Developer Expert",
  description: "Membangun Aplikasi Cepat, Kuat & Skalabel dengan Flutter. Portofolio profesional mobile developer.",
  openGraph: {
    title: "Ahmad Shofi | Flutter Developer",
    description: "Premium App Experience with Flutter & NEXT.js",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-slate-950 text-slate-200 selection:bg-brand selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
