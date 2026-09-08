import type { Metadata } from "next";
import { Poppins, Bree_Serif, Satisfy } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const breeSerif = Bree_Serif({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-bree",
});

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-satisfy",
});

export const metadata: Metadata = {
  title: "Wina Dulces y Pasteles",
  description: "Tortas, postres y dulces artesanales en Guayaquil. Haz tu pedido y retíralo en el local.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${poppins.variable} ${breeSerif.variable} ${satisfy.variable}`}>
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: "12px",
                  background: "#6B4226",
                  color: "#fff",
                  fontFamily: "var(--font-poppins)",
                  fontSize: "14px",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
