import Link from "next/link";
import { Fragment, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const PortfolioIsotope = ({ noViewMore }) => {
  const { t } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState(null);

  const openLightbox = (imageSrc, title) => {
    setLightboxImage({ src: imageSrc, title: title });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const projects = t('projects') || [];

  return (
    <Fragment>
      <div className="works-box">
        <div className="works-items works-masonry-items row">
          {projects.map((project, index) => (
            <div key={project.id} className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div
                className="works-item scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <div className="image">
                  <div className="img">
                    <div 
                      onClick={() => openLightbox(`assets/images/portfolio/${project.id}.png`, project.title)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        decoding="async"
                        src={`assets/images/portfolio/${project.id}.png`}
                        alt={project.title}
                      />
                      <span className="overlay" />
                    </div>
                  </div>
                </div>
                <div className="desc">
                  <h5 className="name">
                    {project.title}
                  </h5>
                  <div className="text">
                    <p>
                      {project.description}
                    </p>
                  </div>
                </div>
                <div
                  className="bg-img"
                  style={{
                    backgroundImage: "url(assets/images/pat-2.png)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {!noViewMore && (
          <div className="load-more-link">
            <Link legacyBehavior href="/works">
              <a
                className="btn scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <span>{t('viewMore')}</span>
              </a>
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="lightbox-overlay"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          <div 
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              cursor: 'default'
            }}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              {lightboxImage.title}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default PortfolioIsotope;