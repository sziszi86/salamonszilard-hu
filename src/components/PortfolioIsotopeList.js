import Link from "next/link";
import { Fragment } from "react";
import { useLanguage } from "../contexts/LanguageContext";
const PortfolioIsotopeList = ({ noViewMore }) => {
  const { t } = useLanguage();
  return (
    <Fragment>
      <div className="works-box works-list">
        <div className="works-items works-list-items row">
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/portfolio/dijlovasok.png"
                        alt={t('projects')[0]?.title}
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>{t('projects')[0]?.title}</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                    {t('projects')[0]?.description}
                  </p>
                </div>
                <Link legacyBehavior href="/work-single">
                  <a className="lnk">{t('viewProject')}</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/portfolio/eskuvo.png"
                        alt={t('projects')[1]?.title}
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>{t('projects')[1]?.title}</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                    {t('projects')[1]?.description}
                  </p>
                </div>
                <Link legacyBehavior href="/work-single">
                  <a className="lnk">{t('viewProject')}</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/portfolio/granit.png"
                        alt={t('projects')[2]?.title}
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>{t('projects')[2]?.title}</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                    {t('projects')[2]?.description}
                  </p>
                </div>
                <Link legacyBehavior href="/work-single">
                  <a className="lnk">{t('viewProject')}</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/portfolio/granitblog.png"
                        alt={t('projects')[3]?.title}
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>{t('projects')[3]?.title}</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                    {t('projects')[3]?.description}
                  </p>
                </div>
                <Link legacyBehavior href="/work-single">
                  <a className="lnk">{t('viewProject')}</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/portfolio/humda.png"
                        alt={t('projects')[4]?.title}
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>{t('projects')[4]?.title}</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                    {t('projects')[4]?.description}
                  </p>
                </div>
                <Link legacyBehavior href="/work-single">
                  <a className="lnk">{t('viewProject')}</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/portfolio/invest.png"
                        alt={t('projects')[5]?.title}
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>{t('projects')[5]?.title}</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                    {t('projects')[5]?.description}
                  </p>
                </div>
                <Link legacyBehavior href="/work-single">
                  <a className="lnk">{t('viewProject')}</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default PortfolioIsotopeList;
