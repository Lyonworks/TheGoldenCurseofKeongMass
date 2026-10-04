export function HomeDeveloper() {
  return (
    <section id="developer" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4" data-aos="fade-up">
          ABOUT DEVELOPER
        </h2>
        <div className="row align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-8 mt-4 mt-md-0" data-aos="fade-right">
            <h4 className="fw-bold">IKMALION ARDYANSYAH</h4>
            <p className="opacity-80">
              Indie game & web developer who loves Indonesian folklore.{' '}
              <strong>The Golden Curse of Keong Mas</strong> is a passion project
              to revive local legends through games and interactive media.
            </p>
          </div>
          <div className="col-md-4 text-center" data-aos="zoom-in">
            <div className="pixel-frame">
              <img src="/developer.jpg" alt="Developer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
