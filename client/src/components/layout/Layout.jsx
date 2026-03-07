import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  const prevPathname = useRef(pathname)

  // Only scroll to top when the actual route path changes (not hash changes)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      window.scrollTo(0, 0)
      prevPathname.current = pathname
    }
  }, [pathname])

  // On home page, hero is full-screen so no top padding needed
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${isHome ? '' : 'pt-16'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
