import React from 'react'
import Header from './Header'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className={cn('flex-1 container mx-auto px-4 py-8', className)}>
        {children}
      </main>
      <footer className='py-6 border-t border-border/40 backdrop-blur-sm'>
        <div className='container mx-auto px-4 text-center text-sm text-muted-foreground'>
          <p>
            © {new Date().getFullYear()} Stock Price Prediction. All rights
            reserved. <strong>TEAM AQUARIUS</strong>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
