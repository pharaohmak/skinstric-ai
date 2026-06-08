// @ts-ignore: Allow side-effect CSS imports without type declarations
import "./globals.css";
// @ts-ignore: Allow side-effect CSS imports without type declarations
import "react-toastify/dist/ReactToastify.css";


export const metadata = {
  title: "Skinstric | Home",
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href='https://skinstric-nine.vercel.app/img/favicon/favicon-16x16.png'
          type="image/png"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}