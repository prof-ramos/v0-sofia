import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SOFIA - Sistema de Orientação Funcional e Informação Administrativa',
  description: 'Assistente virtual da ASOF para orientação da carreira de Oficial de Chancelaria do Ministério das Relações Exteriores.',
  generator: 'v0.app',
  keywords: ['SOFIA', 'ASOF', 'Oficial de Chancelaria', 'MRE', 'Itamaraty', 'carreira', 'orientação'],
  authors: [{ name: 'ASOF - Associação dos Oficiais de Chancelaria' }],
  icons: {
    icon: [
      { url: '/favicon.svg' },
      { url: '/favicon-light.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.png', media: '(prefers-color-scheme: dark)' }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/shortcut-icon.png'
  },
}

export const viewport: Viewport = {
  themeColor: '#0F2240',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
