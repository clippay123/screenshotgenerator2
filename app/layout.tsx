import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";



const poppins = Poppins({
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'], // Adjust weights as needed
  variable: '--font-poppins' // Optional: Use it in CSS
});

export const metadata: Metadata = {
  title: "Strand — Screenshot Generator",
  description: "Strand — Screenshot Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}`}
      >
        <Toaster/>
        <main>

        {children}
        </main>
        
      </body>
    </html>
  );
}
