import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'yourname | Software engineer, backend and platform',
  description:
    'Software engineer building backend systems and platforms. Selected projects, CTF writeups, code samples, engineering notes, and contact details.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Theme is applied before paint via an inline script to avoid flash */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=localStorage.getItem('theme');if(s==='light'||s==='dark')document.documentElement.setAttribute('data-theme',s)}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
