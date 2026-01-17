import "./globals.css";
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const minhaFonte = localFont({
  src: '../fonts/big_noodle_titling_oblique.ttf',
  weight: '700',
  style: 'normal',
});
export const metadata = {
  title: "Overdle",
  description: "Overwatch guessing Game",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
    
      <body className={minhaFonte.className} suppressHydrationWarning={true}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}