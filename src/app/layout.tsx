import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import GoogleAnalytics from "./GoogleAnalytics";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Macintosh Fine-Tune',
  description: 'Chat and feel the difference.',
  twitter: {
    card: "summary_large_image",
    title: "The Macintosh Fine-Tune",
    description: "Chat and feel the difference.",
    creator: "@TheSlavant",
    images: [
      {
        url: "/twitter-image.jpg",
        alt: "The Macintosh Fine-Tune UI",
      },
    ],
  },
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {process.env.GA_TRACKING_ID && (
        <GoogleAnalytics GA_TRACKING_ID={process.env.GA_TRACKING_ID} />
      )}
      <body className={inter.className}>{children}</body>
    </html>
  )
}

