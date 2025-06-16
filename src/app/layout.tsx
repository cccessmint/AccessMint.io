import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Web3Provider from '@/components/Web3Provider'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AccessMint',
  description: 'Mintanje ulaznica putem blockchaina',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body className={inter.className + ' bg-gray-100 text-gray-900 min-h-screen'}>
        <Web3Provider>
          <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold">AccessMint</h1>
            <ConnectButton />
          </header>

          <main className="p-6 max-w-4xl mx-auto">
            {children}
          </main>
        </Web3Provider>
      </body>
    </html>
  )
}

