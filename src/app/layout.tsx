"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/open-sans.css";
import "@/css/style.css";
import React, { useEffect, useState, useContext } from "react";
import { Contexts } from "./Contexts";
import Loader from "@/components/common/Loader";
import { AppProvider } from './Contexts';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const {shop} = useContext(Contexts)
  return (
    <html lang="en">
      <head>
          
          <link rel="shortcut icon" href="https://res.cloudinary.com/dxtslecpc/image/upload/v1733943866/shopbangiayuit/logo.png.png" />
        </head>
      <body suppressHydrationWarning={true}>
        <ToastContainer/>
        <AppProvider>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {children}
        </div>
        </AppProvider>
      </body>
    </html>
  );
}
