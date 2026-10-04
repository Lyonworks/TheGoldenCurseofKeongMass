'use client';

import { useEffect, useState } from 'react';
import type { About, AboutImage } from '@/types';
import { getAbout, getAboutImages } from '@/services/about';
import { imageSrc } from '@/lib/utils/formatters';

export function HomeAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [images, setImages] = useState<AboutImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [aboutData, imagesData] = await Promise.all([
        getAbout(),
        getAboutImages(),
      ]);
      setAbout(aboutData);
      setImages(imagesData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">ABOUT GAME</h2>
          <p className="text-center">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4" data-aos="fade-up">
          ABOUT GAME
        </h2>
        <div className="row align-items-center mb-5">
          <div className="col-md-6" data-aos="zoom-in">
            {images.length > 0 && (
              <div className="about-images-wrapper">
                <div className="about-images-container">
                  {images.map((img, key) => (
                    <div
                      key={img.id_image}
                      className="about-image-card"
                      style={{ '--delay': key } as React.CSSProperties}
                    >
                      <img
                        src={imageSrc(img.image, 'about/')}
                        alt={`About Image ${key + 1}`}
                        className="about-clickable"
                        onClick={() => setSelectedImage(imageSrc(img.image, 'about/'))}
                        data-bs-toggle="modal"
                        data-bs-target="#aboutImageModal"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="col-md-6" data-aos="fade-left">
            {about && (
              <p className="text-justify">{about.description}</p>
            )}
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="aboutImageModal"
        tabIndex={-1}
        aria-labelledby="aboutImageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark border-0">
            <div className="modal-body text-center p-0 position-relative">
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3 bg-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
              {selectedImage && (
                <img
                  id="aboutModalImage"
                  src={selectedImage}
                  alt="About"
                  className="img-fluid rounded"
                  style={{ maxHeight: '80vh', objectFit: 'contain' }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
