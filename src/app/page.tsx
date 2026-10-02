'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface About {
  description: string
}

interface Image {
  id_image: number
  image: string
}

interface News {
  id_news: number
  title: string
  content: string
  author: string
  image: string
  created_at: string
}

interface Merchandise {
  id: number
  name: string
  description: string
  price: number
  stock: number
  limited: number
  image: string
}

interface Comment {
  id_comments: number
  name: string
  message: string
  created_at: string
  user_token: string
  replies?: Comment[]
}

export default function Home() {
  const [about, setAbout] = useState<About | null>(null)
  const [images, setImages] = useState<Image[]>([])
  const [news, setNews] = useState<News[]>([])
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [userToken, setUserToken] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate or retrieve user token from localStorage
    const storedToken = localStorage.getItem('user_token')
    if (storedToken) {
      setUserToken(storedToken)
    } else {
      const newToken = Math.random().toString(36).substring(2, 15)
      localStorage.setItem('user_token', newToken)
      setUserToken(newToken)
    }

    // Fetch all data
    Promise.all([
      fetch('/api/about').then((r) => r.json()),
      fetch('/api/news').then((r) => r.json()),
      fetch('/api/merchandise').then((r) => r.json()),
      fetch('/api/comments').then((r) => r.json()),
    ])
      .then(([aboutData, newsData, merchData, commentsData]) => {
        setAbout(aboutData.about)
        setImages(aboutData.images || [])
        setNews(newsData)
        setMerchandise(merchData)
        setComments(commentsData)
      })
      .catch((err) => console.error('Error fetching data:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          message: formData.get('message'),
          id_parent: formData.get('id_parent') || null,
          user_token: userToken,
        }),
      })

      if (response.ok) {
        form.reset()
        // Refresh comments
        const data = await fetch('/api/comments').then((r) => r.json())
        setComments(data)
      }
    } catch (err) {
      console.error('Error posting comment:', err)
    }
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div className="pt-20">
      {/* HOME SECTION */}
      <section
        id="home"
        className="vh-100 d-flex align-items-center text-center py-20"
      >
        <div className="container">
          <div className="row align-items-center mt-5">
            <div className="col-md-6">
              <img
                src="/assets/keong.gif"
                className="img-fluid rounded"
                alt="Keong Mas"
              />
            </div>
            <div className="col-md-6">
              <img
                src="/assets/teks.png"
                style={{ maxWidth: '100%' }}
                alt="Title"
              />
              <h3 className="text-white mt-4">
                The Golden Journey to Break the Curse
              </h3>
              <a
                href="https://ikmalionn.itch.io/the-golden-curse-of-keong-mas"
                className="btn btn-lg btn-warning fw-bold mt-5"
                target="_blank"
                rel="noopener noreferrer"
              >
                GET THE GAME
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRAILER SECTION */}
      <section id="trailer" className="py-5 text-center">
        <div className="container">
          <h2 className="mb-4">GAME TRAILER</h2>
          <div
            className="trailer-wrapper"
            data-bs-toggle="modal"
            data-bs-target="#trailerModal"
            style={{ cursor: 'pointer' }}
          >
            <div className="trailer-thumbnail position-relative">
              <img
                src="/assets/Thumbnail.png"
                className="img-fluid rounded-4"
                alt="Trailer"
              />
              <div className="trailer-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <div className="play-button">
                  <img
                    src="/assets/play.png"
                    alt="Play"
                    width="50"
                    height="50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">ABOUT GAME</h2>
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              {images.length > 0 && (
                <div className="about-images-wrapper">
                  <div className="about-images-container">
                    {images.map((img, idx) => (
                      <div
                        key={img.id_image}
                        className="about-image-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          const modal = document.getElementById(
                            'aboutImageModal'
                          ) as any
                          const img_el = document.getElementById(
                            'aboutModalImage'
                          ) as HTMLImageElement
                          if (img_el && modal) {
                            img_el.src = `/assets/img/${img.image}`
                            new (window as any).bootstrap.Modal(modal).show()
                          }
                        }}
                      >
                        <img
                          src={`/assets/img/${img.image}`}
                          alt={`About ${idx + 1}`}
                          className="img-fluid rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-md-6">
              {about && (
                <p className="text-justify">
                  {about.description.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER SECTION */}
      <section id="developer" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">ABOUT DEVELOPER</h2>
          <div className="row align-items-center">
            <div className="col-md-8 mt-4 mt-md-0">
              <h4 className="fw-bold">IKMALION ARDYANSYAH</h4>
              <p className="opacity-80">
                Indie game & web developer who loves Indonesian folklore.
                <strong> The Golden Curse of Keong Mas</strong> is a passion
                project to revive local legends through games and interactive
                media.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="pixel-frame">
                <img src="/assets/developer.jpg" alt="Developer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MERCHANDISE SECTION */}
      <section id="merchandise" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">MERCHANDISE</h2>
          <div className="row g-4">
            {merchandise && merchandise.length > 0 ? merchandise.map((m) => (
              <div key={m.id} className="col-lg-4 col-md-6 col-sm-6 col-12">
                <div
                  className="card merchandise-card text-center position-relative"
                  data-bs-toggle="modal"
                  data-bs-target="#merchandiseModal"
                  onClick={() => {
                    const modal = document.getElementById(
                      'merchandiseModal'
                    ) as any
                    document.getElementById('modalName')!.textContent = m.name
                    document.getElementById('modalPrice')!.textContent =
                      m.price.toLocaleString()
                    document.getElementById('modalDescription')!.textContent =
                      m.description || ''
                    ;(document.getElementById(
                      'modalStock'
                    ) as HTMLElement).textContent =
                      m.stock <= 0 ? 'Out of Stock' : `${m.stock} available`
                    ;(document.getElementById(
                      'modalImage'
                    ) as HTMLImageElement).src = `/assets/img/${m.image}`
                    ;(document.getElementById(
                      'waBtn'
                    ) as HTMLAnchorElement).href = `https://wa.me/?text=I%20want%20to%20order%20${m.name}`
                    new (window as any).bootstrap.Modal(modal).show()
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {m.stock <= 0 && (
                    <span className="badge badge-soldout">SOLD OUT</span>
                  )}
                  {m.limited && m.stock > 0 && (
                    <span className="badge badge-limited">LIMITED</span>
                  )}
                  <img
                    src={`/assets/img/${m.image}`}
                    className={`card-img-top ${
                      m.stock <= 0 ? 'img-soldout' : ''
                    }`}
                    alt={m.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title mb-0">{m.name}</h5>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center col-12">No merchandise available</p>
            )}
          </div>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section id="news" className="py-5 text-white">
        <div className="container">
          <h2 className="text-center mb-4">LATEST NEWS</h2>
          <div className="row g-4">
            {news && news.length > 0 ? news.map((n) => (
              <div key={n.id_news} className="col-lg-4 col-md-6 col-12">
                <Link
                  href={`/articles/${n.id_news}`}
                  className="text-decoration-none text-white"
                >
                  <div className="card h-100 border-0 news-card">
                    <img
                      src={`/assets/img/articles/${n.image}`}
                      className="card-img-top"
                      alt={n.title}
                    />
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">
                          {n.title.substring(0, 30)}...
                        </h5>
                        <small className="opacity-80 text-nowrap ms-2">
                          {new Date(n.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </small>
                      </div>
                      <p className="card-text text-dark opacity-75">
                        {n.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                        ...
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )) : (
              <p className="text-center col-12">No news available</p>
            )}
          </div>
        </div>
      </section>

      {/* COMMENTS SECTION */}
      <section id="comment" className="py-5 bg-dark text-white">
        <div className="container">
          <h2 className="text-center mb-4">FORUM</h2>

          <form onSubmit={handleCommentSubmit} className="mb-4">
            <input
              type="hidden"
              name="id_parent"
              value=""
            />
            <input
              type="text"
              name="name"
              className="form-control mb-2"
              placeholder="Name"
              required
            />
            <textarea
              name="message"
              className="form-control mb-2"
              placeholder="Comment"
              required
            ></textarea>
            <button type="submit" className="btn btn-warning">
              Submit
            </button>
          </form>

          <hr />

          <div className="comment-list">
            {comments && comments.length > 0 ? comments.map((c) => (
              <div
                key={c.id_comments}
                className="comment-box mb-3 p-3 rounded bg-secondary"
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <strong>{c.name}</strong>
                  <small className="text-light opacity-75">
                    {new Date(c.created_at).toLocaleString()}
                  </small>
                </div>
                <p className="comment-text">
                  {c.message.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </p>

                {c.replies && c.replies.length > 0 && (
                  <div className="reply-list">
                    {c.replies.map((r) => (
                      <div
                        key={r.id_comments}
                        className="reply-box ms-4 mt-3 p-2 rounded bg-secondary"
                      >
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <strong>{r.name}</strong>
                          <small className="text-light opacity-75">
                            {new Date(r.created_at).toLocaleString()}
                          </small>
                        </div>
                        <p className="comment-text">
                          {r.message.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <p className="text-center">No comments yet</p>
            )}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <div
        className="modal fade"
        id="aboutImageModal"
        tabIndex={-1}
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
              <img id="aboutModalImage" className="img-fluid rounded" alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Merchandise Modal */}
      <div
        className="modal fade"
        id="merchandiseModal"
        tabIndex={-1}
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
              <div className="row align-items-center g-4">
                <div className="col-md-6 text-center">
                  <div className="modal-image-wrapper">
                    <img
                      id="modalImage"
                      className="img-fluid rounded-4 shadow-sm"
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column" style={{ height: '320px' }}>
                  <h3 className="modal-title" id="modalName"></h3>
                  <p id="modalDescription" className="small mb-3 flex-grow-1"></p>
                  <div className="price-box mb-2">
                    <span className="currency">Rp</span>
                    <span id="modalPrice" className="price-value"></span>
                  </div>
                  <div className="stock-box mb-auto">
                    <span className="stock-label">Stock</span>
                    <span id="modalStock" className="badge badge-info"></span>
                  </div>
                  <a
                    id="waBtn"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-lg mt-3 w-100"
                  >
                    <img
                      src="/assets/whatsapp.png"
                      alt="WhatsApp"
                      width="20"
                      height="20"
                      className="me-2"
                    />
                    Order
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <div
        className="modal fade"
        id="trailerModal"
        tabIndex={-1}
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
              <div className="ratio ratio-16x9">
                <iframe
                  id="trailerVideo"
                  src="https://www.youtube.com/embed/nYIoeeYhpxM"
                  title="Game Trailer"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

