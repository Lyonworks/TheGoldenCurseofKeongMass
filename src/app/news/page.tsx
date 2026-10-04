import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { getLatestNews } from '@/services/news';
import { formatDate, truncateText } from '@/lib/utils/formatters';

export const metadata = {
  title: 'News - The Golden Curse of Keong Mas',
  description: 'Latest news and updates about The Golden Curse of Keong Mas',
};

export default async function NewsPage() {
  const news = await getLatestNews(100);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1" style={{ marginTop: '80px' }}>
        <section className="news-list mt-5 py-5">
          <div className="container">
            <h2 className="text-center mb-5">NEWS</h2>

            <div className="row g-4">
              {news.length > 0 ? (
                news.map((n) => (
                  <div key={n.id_news} className="col-lg-4 col-md-6">
                    <Link
                      href={`/news/${n.id_news}`}
                      className="text-decoration-none text-white"
                    >
                      <div className="card news-card h-100 border-0 shadow-sm">
                        <img
                          src={`/assets/img/news/${n.image}`}
                          alt={n.title}
                          className="card-img-top"
                          style={{ objectFit: 'cover', height: '200px' }}
                        />

                        <div className="card-body">
                          <small className="text-warning">
                            {formatDate(n.created_at, 'short')}
                          </small>

                          <h5 className="card-title mt-2">{n.title}</h5>

                          <p className="card-text opacity-75">
                            {truncateText(n.content.replace(/<[^>]*>/g, ''), 120)}
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
      </main>
      <Footer />
    </div>
  );
}
