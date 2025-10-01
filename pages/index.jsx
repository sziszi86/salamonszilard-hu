import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import Resume from "../src/components/Resume";
import Layout from "../src/layouts/Layout";
import { useLanguage } from "../src/contexts/LanguageContext";
import {
  servicesSliderProps,
} from "../src/sliderProps";
import emailjs from '@emailjs/browser';
const PortfolioIsotope = dynamic(
  () => import("../src/components/PortfolioIsotope"),
  {
    ssr: false,
  }
);
const Index = ({ latestPosts }) => {
  const { t, language, isClient } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);
    setError('');

    try {
      // EmailJS configuration from environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        from_name: e.target.name.value,
        from_email: e.target.email.value,
        subject: e.target.subject.value,
        message: e.target.message.value,
        to_email: 'salamonszilard@gmail.com'
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      setShowSuccess(true);
      e.target.reset(); // Clear the form
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Hiba történt az üzenet küldése során. Kérlek próbáld újra.');
      setShowError(true);
      // Hide error message after 5 seconds
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hu' ? 'hu-HU' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return (
    <Layout key={language} pageClassName={"home"}>
      {/* Section - Hero Started */}
      <section
        className="lui-section lui-section-hero lui-gradient-top"
        id="started-section"
      >
        <div className="container">
          {/* Hero Started */}
          <div className="lui-started v-line v-line-left">
            <div className="section hero-started">
              <div
                className="content scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <div className="titles">
                  <div className="lui-subtitle">
                    <span>
                      {" "}
                      {t('greeting')}, <b>{t('myNameIs')}</b>
                    </span>
                  </div>
                  <h1
                    className="title splitting-text-anim-1 scroll-animate"
                    data-splitting="chars"
                    data-animate="active"
                  >
                    <span>
                      <b>{t('name')}</b>
                    </span>
                  </h1>
                  <div className="label lui-subtitle">
                    {" "}
                    {t('iAm')} <strong>{t('title')}</strong>
                  </div>
                </div>
                <div className="description">
                  <div>
                    <p>
                      {t('extendedIntro')}
                    </p>
                  </div>
                </div>
                <div className="bts">
                  <a
                    target="_blank"
                    href="https://drive.google.com/"
                    className="btn"
                  >
                    <span>{t('downloadCV')}</span>
                  </a>
                  <a href="#skills-section" className="btn-lnk">
                    {t('mySkills')}
                  </a>
                </div>
              </div>
              <div
                className="slide scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <img
                  decoding="async"
                  src="assets/images/profile2.png"
                  alt={t('name')}
                />
                <span className="circle circle-1" />
                <span
                  className="circle img-1"
                  style={{
                    backgroundImage: "url(assets/images/pat-1.png)",
                  }}
                />
                <span
                  className="circle img-2"
                  style={{
                    backgroundImage: "url(assets/images/pat-2.png)",
                  }}
                />
                <span
                  className="circle img-3"
                  style={{
                    backgroundImage: "url(assets/images/pat-2.png)",
                  }}
                />
                <div className="info-list">
                  <ul>
                    <li>
                      <span className="num">
                        15 <strong>+</strong>
                      </span>
                      <span className="value">
                        {t('yearsExperience')} <strong>{t('experience', 'common')}</strong>
                      </span>
                    </li>
                    <li>
                      <span className="num">150</span>
                      <span className="value">
                        {t('completedProjects')} <strong>{t('projects', 'common')}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="lui-bgtitle">
              <span> Web Developer </span>
            </div>
          </div>
        </div>
      </section>
      {/* Section - Services */}
      <section
        className="lui-section lui-gradient-bottom"
        id="services-section"
      >
        {/* Heading */}
        <div className="lui-heading">
          <div className="container">
            <div className="m-titles align-center">
              <h2
                className="m-title splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span suppressHydrationWarning> {t('whatIDo')} </span>
              </h2>
              <div
                className="m-subtitle splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span>
                  {t('servicesSubtitle')}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Services */}
        <div className="v-line v-line-right">
          <div className="container">
            <Swiper
              {...servicesSliderProps}
              className="swiper-container js-services scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <SwiperSlide className="swiper-slide">
                <div className="services-item">
                  <div className="lui-subtitle">
                    <span> {language === 'hu' ? 'Webfejlesztés' : 'Webentwicklung'} </span>
                  </div>
                  <div className="icon" />
                  <h5 className="lui-title">
                    <span> {t('landingPageTitle')} </span>
                  </h5>
                  <div className="lui-text">
                    <div>
                      {t('landingPageDescription')}
                    </div>
                  </div>
                  <a href="#contact-section" className="lnk">
                    {t('contactMe')}
                  </a>
                  <div
                    className="image"
                    style={{
                      backgroundImage: "url(assets/images/pat-2.png)",
                    }}
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="services-item">
                  <div className="lui-subtitle">
                    <span> {language === 'hu' ? 'Webfejlesztés' : 'Webentwicklung'} </span>
                  </div>
                  <div className="icon" />
                  <h5 className="lui-title">
                    <span> {t('corporateWebTitle')} </span>
                  </h5>
                  <div className="lui-text">
                    <div>
                      <p>
                        {t('corporateWebDescription')}
                      </p>
                    </div>
                  </div>
                  <a href="#contact-section" className="lnk">
                    {t('contactMe')}
                  </a>
                  <div
                    className="image"
                    style={{
                      backgroundImage: "url(assets/images/pat-2.png)",
                    }}
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="services-item">
                  <div className="lui-subtitle">
                    <span> SEO </span>
                  </div>
                  <div className="icon" />
                  <h5 className="lui-title">
                    <span> {t('seoTitle')} </span>
                  </h5>
                  <div className="lui-text">
                    <div>
                      {t('seoDescription')}
                    </div>
                  </div>
                  <a href="#contact-section" className="lnk">
                    {t('contactMe')}
                  </a>
                  <div
                    className="image"
                    style={{
                      backgroundImage: "url(assets/images/pat-2.png)",
                    }}
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="services-item">
                  <div className="lui-subtitle">
                    <span> E-commerce </span>
                  </div>
                  <div className="icon" />
                  <h5 className="lui-title">
                    <span> {t('cmsWebshopTitle')} </span>
                  </h5>
                  <div className="lui-text">
                    <div>
                      {t('cmsWebshopDescription')}
                    </div>
                  </div>
                  <a href="#contact-section" className="lnk">
                    {t('contactMe')}
                  </a>
                  <div
                    className="image"
                    style={{
                      backgroundImage: "url(assets/images/pat-2.png)",
                    }}
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="services-item">
                  <div className="lui-subtitle">
                    <span> WordPress </span>
                  </div>
                  <div className="icon" />
                  <h5 className="lui-title">
                    <span> {t('wordpressTitle')} </span>
                  </h5>
                  <div className="lui-text">
                    <div>
                      {t('wordpressDescription')}
                    </div>
                  </div>
                  <a href="#contact-section" className="lnk">
                    {t('contactMe')}
                  </a>
                  <div
                    className="image"
                    style={{
                      backgroundImage: "url(assets/images/pat-2.png)",
                    }}
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="services-item">
                  <div className="lui-subtitle">
                    <span> Sitebuilding </span>
                  </div>
                  <div className="icon" />
                  <h5 className="lui-title">
                    <span> {t('sitebuildingTitle')} </span>
                  </h5>
                  <div className="lui-text">
                    <div>
                      {t('sitebuildingDescription')}
                    </div>
                  </div>
                  <a href="#contact-section" className="lnk">
                    {t('contactMe')}
                  </a>
                  <div
                    className="image"
                    style={{
                      backgroundImage: "url(assets/images/pat-2.png)",
                    }}
                  />
                </div>
              </SwiperSlide>
              <div className="swiper-pagination" />
            </Swiper>
            <div className="lui-bgtitle">
              <span> {t('myServices')} </span>
            </div>
          </div>
        </div>
      </section>
      {/* Section - Skills */}
      <section className="lui-section lui-gradient-center" id="skills-section">
        {/* Heading */}
        <div className="lui-heading">
          <div className="container">
            <div className="m-titles align-center">
              <h2
                className="m-title splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span suppressHydrationWarning> {t('professionalSkills')} </span>
              </h2>
              <div
                className="m-subtitle splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span suppressHydrationWarning>
                  {t('myTalent')}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Skills */}
        <div className="v-line v-line-left">
          <div className="container">
            <div className="row">
              {(() => {
                const skillsArray = Object.entries(t('skills'));
                const skillsPerColumn = Math.ceil(skillsArray.length / 3);
                const columns = [];
                
                for (let i = 0; i < 3; i++) {
                  const columnSkills = skillsArray.slice(i * skillsPerColumn, (i + 1) * skillsPerColumn);
                  columns.push(
                    <div key={i} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                      <div className="skills-items">
                        {columnSkills.map(([key, skill]) => (
                          <div
                            key={key}
                            className="skills-item scrolla-element-anim-1 scroll-animate"
                            data-animate="active"
                          >
                            <h6 className="name">
                              <span> {skill.name} </span>
                            </h6>
                            <div className="text">
                              <div>
                                <p>
                                  {skill.description}
                                </p>
                              </div>
                            </div>
                            <div className="dots">
                              <div className="dot" style={{ width: `${skill.percentage}%` }}>
                                <span />
                              </div>
                            </div>
                            <div className="value">
                              <span className="num">
                                {skill.percentage} <span>%</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                return columns;
              })()}
            </div>
            <div className="lui-bgtitle">
              <span> Skills </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section - Works */}
      <section className="lui-section lui-gradient-top" id="works-section">
        {/* Heading */}
        <div className="lui-heading">
          <div className="container">
            <div className="m-titles align-center">
              <h2
                className="m-title splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span> Portfolio </span>
              </h2>
              <div
                className="m-subtitle splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span>
                  {" "}
                  my <b>Cases</b>
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Works */}
        <div className="v-line v-line-right">
          <div className="container">
            <PortfolioIsotope />
            <div className="lui-bgtitle">
              <span> Portfolio </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section - Resume */}
      <Resume key={language} />
      {/* Section - Blog */}
      <section className="lui-section lui-gradient-top" id="blog-section">
        {/* Heading */}
        <div className="lui-heading">
          <div className="container">
            <div className="m-titles align-center">
              <h2
                className="m-title splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span> {t('latestBlog')} </span>
              </h2>
              <div
                className="m-subtitle splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span>
                  {t('myArticles')}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Archive */}
        <div className="v-line v-line-right">
          <div className="container">
            <div className="blog-items row">
              {latestPosts && latestPosts.slice(0, 3).map((post, index) => (
                <div key={post.slug} className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <div
                    className="archive-item scrolla-element-anim-1 scroll-animate"
                    data-animate="active"
                  >
                    <div className="image">
                      <Link legacyBehavior href={`/blog/${post.slug}`}>
                        <a>
                          <img
                            decoding="async"
                            src={post.image}
                            alt={language === 'hu' ? post.title : (post.titleDe || post.title)}
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="desc">
                      <div className="category lui-subtitle">
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <h5 className="lui-title">
                        <Link legacyBehavior href={`/blog/${post.slug}`}>
                          <a>{language === 'hu' ? post.title : (post.titleDe || post.title)}</a>
                        </Link>
                      </h5>
                      <div className="lui-text">
                        <p>
                          {language === 'hu' ? post.excerpt : (post.excerptDe || post.excerpt)}
                        </p>
                        <div className="readmore">
                          <Link legacyBehavior href={`/blog/${post.slug}`}>
                            <a className="lnk">{t('readMore')}</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="load-more">
              <Link legacyBehavior href="/blog">
                <a
                  className="btn scrolla-element-anim-1 scroll-animate"
                  data-animate="active"
                >
                  <span>{t('viewBlog')}</span>
                </a>
              </Link>
            </div>
            <div className="lui-bgtitle">
              <span> {t('latestBlog')} </span>
            </div>
          </div>
        </div>
      </section>
      {/* Section - Contacts */}
      <section className="lui-section lui-gradient-bottom" id="contact-section">
        {/* Heading */}
        <div className="lui-heading">
          <div className="container">
            <div className="m-titles align-center">
              <h2
                className="m-title splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span> {t('contactMe')} </span>
              </h2>
              <div
                className="m-subtitle splitting-text-anim-1 scroll-animate"
                data-splitting="words"
                data-animate="active"
              >
                <span>
                  {" "}
                  {t('letsTalk')}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Contact */}
        <div className="lui-contacts v-line v-line-left">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                <div className="numbers-items">
                  <div
                    className="numbers-item scrolla-element-anim-1 scroll-animate"
                    data-animate="active"
                  >
                    <div className="icon">
                      <i aria-hidden="true" className="far fa-map" />
                    </div>
                    <div className="title">
                      <span> {t('address')} </span>
                    </div>
                    <div className="lui-text">
                      <span> {t('addressText')} </span>
                    </div>
                  </div>
                  <div
                    className="numbers-item scrolla-element-anim-1 scroll-animate"
                    data-animate="active"
                  >
                    <div className="icon">
                      <i aria-hidden="true" className="far fa-user" />
                    </div>
                    <div className="title">
                      <span> {t('freelance')} </span>
                    </div>
                    <div className="lui-text">
                      <span> {t('availableNow')} </span>
                    </div>
                  </div>
                  <div
                    className="numbers-item scrolla-element-anim-1 scroll-animate"
                    data-animate="active"
                  >
                    <div className="icon">
                      <i aria-hidden="true" className="far fa-envelope" />
                    </div>
                    <div className="title">
                      <span> {t('email')} </span>
                    </div>
                    <div className="lui-text">
                      <span> {t('contactEmail')} </span>
                    </div>
                  </div>
                  <div
                    className="numbers-item scrolla-element-anim-1 scroll-animate"
                    data-animate="active"
                  >
                    <div className="icon">
                      <i aria-hidden="true" className="far fa-address-book" />
                    </div>
                    <div className="title">
                      <span> {t('phone')} </span>
                    </div>
                    <div className="lui-text">
                      <span> {t('contactPhone')} </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                <div
                  className="contacts-form scrolla-element-anim-1 scroll-animate"
                  data-animate="active"
                >
                  <div
                    className="bg-img"
                    style={{
                      backgroundImage: "url(assets/images/pat-1.png)",
                    }}
                  />
                  <div className="contacts-form">
                    <form onSubmit={handleSubmit} id="cform">
                      <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                          <div className="group">
                            <label>
                              {t('yourFullName')} <b>*</b>
                              <input type="text" name="name" required />
                            </label>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                          <div className="group">
                            <label>
                              {t('yourEmail')} <b>*</b>
                              <input type="email" name="email" required />
                            </label>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <div className="group">
                            <label>
                              {t('yourSubject')} <b>*</b>
                              <input type="text" name="subject" required />
                            </label>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <div className="group">
                            <label>
                              {t('yourMessage')} <b>*</b>
                              <textarea name="message" required defaultValue={""} />
                            </label>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 align-right">
                          <div className="terms-label">
                            {t('acceptTerms')}
                          </div>
                          <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting}
                          >
                            <span>{isSubmitting ? t('loading') : t('sendMessage')}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                    <div className="alert-success" style={{ display: showSuccess ? "block" : "none" }}>
                      <p>{t('thankYouMessage')}</p>
                    </div>
                    <div className="alert-error" style={{ display: showError ? "block" : "none", color: "red" }}>
                      <p>{error || "Hiba történt az üzenet küldése során."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lui-bgtitle">
              <span> {t('contactMe')} </span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const { getLatestBlogPosts } = require('../src/utils/blog');
  const latestPosts = getLatestBlogPosts(3);
  
  return {
    props: {
      latestPosts,
    },
  };
}

export default Index;
