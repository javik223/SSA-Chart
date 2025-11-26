import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chart Renderer | Claude Charts',
  description: 'View and share interactive charts created with Claude Charts',
  openGraph: {
    title: 'Chart Renderer | Claude Charts',
    description: 'View and share interactive charts created with Claude Charts',
    type: 'website',
  },
};

export default function RenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
