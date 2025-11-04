import "./globals.css";
import localFont from 'next/font/local';

const minhaFonte = localFont({
  src: '../fonts/big_noodle_titling_oblique.ttf',
  weight: '700',
  style: 'normal',
});

export const metadata = {
  title: "Overdle",
  description: "O jogo de adivinhação de Overwatch",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      
      <body className={minhaFonte.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}