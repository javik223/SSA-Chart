import { ChartInitializer } from '@/components/ChartInitializer';
import { AlertDialogProvider } from '@/components/ui/alert-dialog-simple';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

const canvaSans = localFont( {
  src: [
    {
      path: '../public/fonts/CanvaSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CanvaSans-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/CanvaSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/CanvaSans-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/CanvaSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/CanvaSans-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-canva-sans',
  display: 'swap',
} );

export const metadata: Metadata = {
  title: 'Claude Charts - Data Visualization Studio',
  description:
    'A frontend-only web application for creating advanced, interactive data visualizations',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang='en'>
      <body
        className={ `${ canvaSans.variable } font-sans antialiased` }
        suppressHydrationWarning
      >
        <AlertDialogProvider>
          { children }
          <ChartInitializer />
          <Toaster />
        </AlertDialogProvider>
      </body>
    </html >
  );
}
