import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { getNewsById } from '@/services/news';
import { formatDate, imageSrc } from '@/lib/utils/formatters';

export const metadata = {
  title: 'News Detail - The Golden Curse of Keong Mas',
};

export default async function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const newsId = parseInt(params.id, 10);
  const news = await getNewsById(newsId);

  if (!news) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1" style={{ marginTop: '80px' }}>
          <div className="container mt-5 py-5">
            <p className="text-center">News not found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1" style={{ marginTop: '80px' }}>
        <div className="container mt-5 py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="card news-cardd shadow-lg border-0 rounded-4 p-4">
                <h1 className="fw-bold mb-2">{news.title}</h1>

                <div className="d-flex align-items-center gap-3 text-muted mb-4">
                  <span>
                    <img
                      src="/assets/icons/person.png"
                      alt="Author"
                      style={{
                        height: '16px',
                        width: '16px',
                        filter: 'invert(1)',
                      }}
                    />
                    Written by <strong>{news.author}</strong>
                  </span>
                  <span>|</span>
                  <span>
                    <img
                      src="/assets/icons/calendar_month.png"
                      alt="Calendar"
                      style={{
                        height: '16px',
                        width: '16px',
                        filter: 'invert(1)',
                      }}
                    />
                    {formatDate(news.created_at, 'short')}
                  </span>
                </div>

                {news.image && (
                  <div className="mb-4">
                    <img
                      src={imageSrc(news.image, 'news/')}
                      alt={news.title}
                      className="img-fluid rounded-3 w-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}

                <p className="fs-5">
                  {news.content.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>

                <div className="mt-4">
                  <Link href="/news" className="btn btn-secondary px-4">
                    BACK
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
