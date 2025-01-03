import type { Metadata } from "next";
import "../../public/scss/main.scss";
import Provider from "@/state/provider";

export const metadata: Metadata = {
  title: "3D Table Configurator",
  description: "A 3d table configurator for digital tails as an assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html lang="en" className="">
        <body>{children}</body>
      </html>
    </Provider>
  );
}
