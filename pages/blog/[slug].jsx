import Link from "next/link";
import Layout from "../../src/layouts/Layout";
import { useLanguage } from "../../src/contexts/LanguageContext";

const BlogSingle = ({ post, latestPosts }) => {
  const { t, language } = useLanguage();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hu' ? 'hu-HU' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const currentTitle = language === 'hu' ? post.frontMatter.title : (post.frontMatter.titleDe || post.frontMatter.title);
  const currentCategory = language === 'hu' ? post.frontMatter.category : (post.frontMatter.categoryDe || post.frontMatter.category);
  const currentTags = language === 'hu' ? post.frontMatter.tags : (post.frontMatter.tagsDe || post.frontMatter.tags);

  return (
    <Layout>
      {/* Section Started Heading */}
      <section className="section section-inner started-heading">
        <div className="container">
          {/* Heading */}
          <div className="m-titles align-center">
            <div
              className="m-category scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <Link legacyBehavior href="/blog">
                <a>{currentCategory}</a>
              </Link>
              {currentTags && currentTags.length > 0 && (
                <>
                  {currentTags.slice(0, 2).map((tag, index) => (
                    <span key={tag}>
                      , <Link legacyBehavior href={`/blog?tag=${encodeURIComponent(tag)}`}><a>{tag}</a></Link>
                    </span>
                  ))}
                </>
              )}
              {' '} / {formatDate(post.frontMatter.date)} / by {post.frontMatter.author}
            </div>
            <h1
              className="m-title scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              {currentTitle}
            </h1>
          </div>
        </div>
      </section>
      
      {/* Single Post Image */}
      <div className="section section-inner m-image-large">
        <div className="container">
          <div className="v-line-right v-line-top">
            <div className="v-line-block">
              <span />
            </div>
          </div>
        </div>
        <div className="image">
          <div
            className="img scrolla-element-anim-1 scroll-animate"
            data-animate="active"
            style={{ backgroundImage: `url(${post.frontMatter.image})` }}
          />
        </div>
      </div>
      
      {/* Section - Blog Content */}
      <section className="section section-inner m-archive">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
              {/* Blog Content */}
              <div className="m-titles">
                <div 
                  className="blog-content scrolla-element-anim-1 scroll-animate"
                  data-animate="active"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content[language] || post.content.hu 
                  }}
                />
              </div>

              {/* Tags */}
              {currentTags && currentTags.length > 0 && (
                <div className="post-tags scrolla-element-anim-1 scroll-animate" data-animate="active">
                  <div className="tags">
                    <div className="lui-subtitle">
                      <span>{language === 'hu' ? 'Címkék:' : 'Tags:'}</span>
                    </div>
                    {currentTags.map((tag, index) => (
                      <span key={tag}>
                        <Link legacyBehavior href={`/blog?tag=${encodeURIComponent(tag)}`}>
                          <a className="lui-subtitle">{tag}</a>
                        </Link>
                        {index < currentTags.length - 1 && <span className="tag-separator">, </span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="post-navigation scrolla-element-anim-1 scroll-animate" data-animate="active">
                <Link legacyBehavior href="/blog">
                  <a className="post-nav-link">
                    <i className="fas fa-arrow-left" />
                    <span>{language === 'hu' ? 'Vissza a bloghoz' : 'Zurück zum Blog'}</span>
                  </a>
                </Link>
              </div>
            </div>
            
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
              {/* Sidebar */}
              <div className="col__sedebar">
                <div className="blog-menu scrolla-element-anim-1 scroll-animate" data-animate="active">
                  <h5 className="lui-title">
                    <span>{language === 'hu' ? 'Legfrissebb cikkek' : 'Neueste Artikel'}</span>
                  </h5>
                  <div className="recent-posts">
                    {latestPosts.filter(p => p.slug !== post.slug).slice(0, 3).map(latestPost => (
                      <div key={latestPost.slug} className="recent-post">
                        <div className="image">
                          <Link legacyBehavior href={`/blog/${latestPost.slug}`}>
                            <a>
                              <img 
                                src={latestPost.image} 
                                alt={language === 'hu' ? latestPost.title : (latestPost.titleDe || latestPost.title)}
                                loading="lazy"
                              />
                            </a>
                          </Link>
                        </div>
                        <div className="desc">
                          <h6 className="lui-title">
                            <Link legacyBehavior href={`/blog/${latestPost.slug}`}>
                              <a>
                                {language === 'hu' ? latestPost.title : (latestPost.titleDe || latestPost.title)}
                              </a>
                            </Link>
                          </h6>
                          <div className="date lui-subtitle">
                            <span>{formatDate(latestPost.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="blog-menu scrolla-element-anim-1 scroll-animate" data-animate="active">
                  <h5 className="lui-title">
                    <span>{language === 'hu' ? 'Kapcsolódó témák' : 'Verwandte Themen'}</span>
                  </h5>
                  <div className="archive-links">
                    <ul>
                      <li><Link legacyBehavior href="/blog?tag=React"><a>React</a></Link></li>
                      <li><Link legacyBehavior href="/blog?tag=NextJS"><a>Next.js</a></Link></li>
                      <li><Link legacyBehavior href="/blog?tag=CSS"><a>CSS</a></Link></li>
                      <li><Link legacyBehavior href={`/blog?tag=${encodeURIComponent(language === 'hu' ? 'Webfejlesztés' : 'Webentwicklung')}`}><a>{language === 'hu' ? 'Webfejlesztés' : 'Webentwicklung'}</a></Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticPaths() {
  const { getAllBlogSlugs } = require('../../src/utils/blog');
  const paths = getAllBlogSlugs();
  
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { getBlogPost, getLatestBlogPosts } = require('../../src/utils/blog');
  const post = getBlogPost(params.slug);
  const latestPosts = getLatestBlogPosts(4);
  
  return {
    props: {
      post,
      latestPosts,
    },
  };
}

export default BlogSingle;