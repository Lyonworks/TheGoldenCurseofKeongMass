import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "The Golden Curse of Keong Mas",
  description: "Indie game inspired by Indonesian folklore",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/icon.png" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/aos@2.3.1/dist/aos.css"
        />
      </head>
      <body className="d-flex flex-column min-vh-100">
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://unpkg.com/aos@2.3.1/dist/aos.js"
          strategy="afterInteractive"
        />
        <Script id="aos-init" strategy="afterInteractive">
          {`
            (function initAOS() {
              if (typeof window.AOS === 'undefined') {
                setTimeout(initAOS, 100);
                return;
              }
              window.AOS.init({
                duration: 1000,
                once: false,
                easing: 'ease-in-out',
                mirror: true,
              });
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
