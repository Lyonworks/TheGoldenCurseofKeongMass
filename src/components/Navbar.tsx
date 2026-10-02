'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <img
            src="/assets/teks.png"
            alt="Logo"
            style={{ maxHeight: '33px' }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
          id="menu"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/#about" className="nav-link">
                ABOUT
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/#merchandise" className="nav-link">
                MERCHANDISE
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/news" className="nav-link">
                NEWS
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
