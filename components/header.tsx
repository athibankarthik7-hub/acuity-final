"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"

  return (
    <header className="bg-card border-b border-border">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-lg text-foreground">ACUITY</span>
          </Link>

          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className={`transition-colors ${isActive("/dashboard")}`}>
              Dashboard
            </Link>
            <Link href="/products" className={`transition-colors ${isActive("/products")}`}>
              Products
            </Link>
            <Link href="/analytics" className={`transition-colors ${isActive("/analytics")}`}>
              Analytics
            </Link>
            <Link href="/simulator" className={`transition-colors ${isActive("/simulator")}`}>
              Simulator
            </Link>
            <Link href="/settings" className={`transition-colors ${isActive("/settings")}`}>
              Settings
            </Link>
            <Link href="/inside-acuity" className={`transition-colors ${isActive("/inside-acuity")}`}>
              Inside ACUITY
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
