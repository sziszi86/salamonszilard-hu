import Link from "next/link";
import { Fragment, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const PortfolioIsotopeList = ({ noViewMore }) => {
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
      <div className="works-box works-list">
        <div className="works-items works-list-items row">
          {projects.slice(0, 6).map((project, index) => (
            <div key={project.id} className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div
                className="works-item scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <div className="image">
                  <div className="img">
                    <div
                      onClick={() => openLightbox(`assets/images/portfolio/${project.image || project.id + '.png'}`, project.title)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        decoding="async"
                        src={`assets/images/portfolio/${project.image || project.id + '.png'}`}
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
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', marginTop: '8px', gap: '6px', color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        {project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </a>
                    )}
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
export default PortfolioIsotopeList;