'use client';

import { useEffect, useState } from 'react';
import type { Merchandise } from '@/types';
import { getAllMerchandise } from '@/services/merchandise';
import { WHATSAPP_PHONE } from '@/lib/utils/constants';
import { imageSrc } from '@/lib/utils/formatters';

export function HomeMerchandise() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Merchandise | null>(null);

  useEffect(() => {
    async function loadMerchandise() {
      setLoading(false);
      const data = await getAllMerchandise();
      setMerchandise(data);
    }
    loadMerchandise();
  }, []);

  const getWhatsAppUrl = (item: Merchandise): string => {
    const message = `Halo admin\nSaya ingin memesan merchandise:\nProduk : ${item.name}\nHarga : Rp ${item.price.toLocaleString('id-ID')}\nApakah masih tersedia?`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <section id="merchandise" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">MERCHANDISE</h2>
          <p className="text-center">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="merchandise" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">MERCHANDISE</h2>

        <div className="row g-4">
          {merchandise.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div
                className="card merchandise-card text-center position-relative"
                data-aos="zoom-in"
                data-aos-delay="100"
                onClick={() => setSelectedItem(item)}
                data-bs-toggle="modal"
                data-bs-target="#merchandiseModal"
                style={{ cursor: 'pointer' }}
              >
                {item.stock <= 0 && (
                  <span className="badge badge-soldout">SOLD OUT</span>
                )}
                {item.limited && item.stock > 0 && (
                  <span className="badge badge-limited">LIMITED</span>
                )}

                <img
                  src={imageSrc(item.image, 'merchandise/')}
                  alt={item.name}
                  className={`card-img-top ${item.stock <= 0 ? 'img-soldout' : ''}`}
                  style={{ objectFit: 'cover', height: '300px' }}
                />

                <div className="card-body">
                  <h5 className="card-title mb-0">{item.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="modal fade"
        id="merchandiseModal"
        tabIndex={-1}
        aria-labelledby="merchandiseModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body py-4">
              {selectedItem && (
                <div className="row align-items-center g-4">
                  <div className="col-md-6 text-center">
                    <div className="modal-image-wrapper">
                      <img
                        src={imageSrc(selectedItem.image, 'merchandise/')}
                        alt={selectedItem.name}
                        className="img-fluid rounded-4 shadow-sm"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 d-flex flex-column" style={{ height: '320px' }}>
                    <h3 className="modal-title">{selectedItem.name}</h3>

                    <p className="small mb-3 flex-grow-1">{selectedItem.description}</p>

                    <div className="price-box mb-2">
                      <span className="currency">Rp</span>
                      <span className="price-value">
                        {selectedItem.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="stock-box mb-auto">
                      <span className="stock-label">Stock</span>
                      <span className="badge-stock">{selectedItem.stock}</span>
                    </div>

                    <a
                      href={getWhatsAppUrl(selectedItem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn btn-success btn-lg mt-3 w-100 ${
                        selectedItem.stock <= 0 ? 'disabled' : ''
                      }`}
                    >
                      <img
                        src="/whatsapp.png"
                        alt="WhatsApp"
                        width="20"
                        height="20"
                        className="me-2"
                      />
                      {selectedItem.stock <= 0 ? '❌ SOLD OUT' : 'Order'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
