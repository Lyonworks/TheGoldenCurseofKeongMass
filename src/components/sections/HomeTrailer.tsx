'use client';

import { useEffect, useState } from 'react';

export function HomeTrailer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section id="trailer" className="py-5 text-center">
      <div className="container">
        <h2 className="mb-4" data-aos="fade-up">
          GAME TRAILER
        </h2>

        <div className="trailer-wrapper" data-aos="zoom-in">
          <div
            className="trailer-thumbnail"
            data-bs-toggle="modal"
            data-bs-target="#trailerModal"
            style={{ cursor: 'pointer' }}
          >
            <img src="/tgcokm.png" alt="Trailer" className="img-fluid rounded-4" />
            <div className="trailer-overlay">
              <div className="play-button" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="trailerModal"
        tabIndex={-1}
        aria-labelledby="trailerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark border-0">
            <div className="modal-body p-0 position-relative">
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3 bg-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>

              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src="https://www.youtube.com/embed/nYIoeeYhpxM"
                  title="Game Trailer"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
