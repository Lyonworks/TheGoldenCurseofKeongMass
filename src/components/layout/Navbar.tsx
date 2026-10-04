'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand" href="/">
          <img src="/teks.png" alt="Logo" style={{ maxHeight: '33px' }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
          aria-controls="menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#about">
                ABOUT
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#merchandise">
                MERCHANDISE
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/news">
                NEWS
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
