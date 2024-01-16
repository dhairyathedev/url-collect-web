import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"
import './globals.css'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Email Collector Dashboard',
  description: 'Email Collector Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <body className={inter.className}>
        <main>{children}</main>
        <Toaster />
        </body>
    </html>
  )
}
