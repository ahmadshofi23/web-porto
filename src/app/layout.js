import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
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
        <Toaster position="bottom-center" />
        {children}
      </body>
    </html>
  );
}
