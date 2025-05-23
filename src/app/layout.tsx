'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body>{children} <Toaster /></body>
      </html>
    </QueryClientProvider>
  );
}
