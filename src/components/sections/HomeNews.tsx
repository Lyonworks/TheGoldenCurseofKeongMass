'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { News } from '@/types';
import { getLatestNews } from '@/services/news';
import { formatDate, truncateText, imageSrc } from '@/lib/utils/formatters';

export function HomeNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      const data = await getLatestNews(6);
      setNews(data);
      setLoading(false);
    }
    loadNews();
  }, []);

  if (loading) {
    return (
      <section id="news" className="py-5 text-white">
        <div className="container">
          <h2 className="text-center mb-4">LATEST NEWS</h2>
          <p className="text-center">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-5 text-white">
      <div className="container">
        <h2 className="text-center mb-4" data-aos="fade-up">
          LATEST NEWS
        </h2>

        <div className="row g-4">
          {news.length > 0 ? (
            news.map((n) => (
              <div key={n.id_news} className="col-lg-4 col-md-6 col-12" data-aos="fade-up">
                <Link
                  href={`/news/${n.id_news}`}
                  className="text-decoration-none text-white"
                >
                  <div className="card h-100 border-0 news-card">
                    <img
                      src={imageSrc(n.image, 'news/')}
                      alt={n.title}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '200px' }}
                    />

                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{truncateText(n.title, 30)}</h5>
                        <small className="opacity-80 text-nowrap ms-2">
                          {formatDate(n.created_at, 'short')}
                        </small>
                      </div>
                      <p className="card-text text-dark opacity-75">
                        {truncateText(n.content.replace(/<[^>]*>/g, ''), 100)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center opacity-75">No news available</p>
          )}
        </div>
      </div>
    </section>
  );
}
