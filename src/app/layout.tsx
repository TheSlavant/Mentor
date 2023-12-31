import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import GoogleAnalytics from "./GoogleAnalytics";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mentor',
  description: 'Feel the difference.',
  twitter: {
    card: "summary_large_image",
    title: "Mentor",
    description: "Feel the difference.",
    creator: "@TheSlavant",
    images: [
      {
        url: "/twitter-image.jpg",
        alt: "Mentor UI",
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

