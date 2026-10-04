'use client';

interface HeroProps {
  buttonUrl: string;
  buttonText: string;
}

export function HomeHero({ buttonUrl, buttonText }: HeroProps) {
  return (
    <section id="home" className="vh-100 d-flex align-items-center text-center">
      <div className="container">
        <div className="row align-items-center mt-5">
          <div className="col-md-6" data-aos="fade-right">
            <video
              className="img-fluid rounded"
              style={{ maxWidth: '100%' }}
              autoPlay
              muted
              loop
              playsInline
              aria-label="Keong Mas"
            >
              <source src="/keong.webm" type="video/webm" />
              <source src="/keong.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="col-md-6" data-aos="fade-left">
            <img
              src="/teks.png"
              alt="The Golden Curse of Keong Mas"
              style={{ maxWidth: '100%' }}
            />
            <h3 className="text-white mt-4">
              The Golden Journey to Break the Curse
            </h3>
            <a
              href={buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-warning fw-bold mt-5"
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
