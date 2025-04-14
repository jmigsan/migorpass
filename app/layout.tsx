// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Mig or Pass',
  description: 'Help Miguel choose some glasses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
