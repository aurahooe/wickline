import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Wickline',
  description: 'A quiet press. One note held up to the hour.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-serif antialiased">
        <div className="grain" />
        <header className="px-6 md:px-12 py-6 flex items-end justify-between">
          <Link href="/" className="group">
            <p className="text-[11px] tracking-[0.28em] uppercase text-brass">the hourly press</p>
            <h1 className="text-3xl md:text-4xl tracking-tight leading-none mt-1 group-hover:text-rust transition-colors duration-500">Wickline</h1>
          </Link>
          <nav className="flex gap-6 text-sm font-sans tracking-wide">
            <Link href="/wall" className="hover:text-rust transition-colors">Wall</Link>
            <Link href="/desk" className="hover:text-rust transition-colors">Desk</Link>
            <Link href="/login" className="hover:text-rust transition-colors">Sign in</Link>
          </nav>
        </header>
        <div className="rule mx-6 md:mx-12" />
        <main>{children}</main>
      </body>
    </html>
  );
}
