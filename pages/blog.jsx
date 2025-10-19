import Link from "next/link";
import Layout from "../src/layouts/Layout";
import { useLanguage } from "../src/contexts/LanguageContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Blog = ({ posts }) => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [selectedTag, setSelectedTag] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hu' ? 'hu-HU' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const { tag } = router.query;
    if (tag) {
      setSelectedTag(tag);
      const filtered = posts.filter(post => {
        const postTags = language === 'hu' ? post.tags : (post.tagsDe || post.tags);
        return postTags && postTags.includes(tag);
      });
      setFilteredPosts(filtered);
    } else {
      setSelectedTag(null);
      setFilteredPosts(posts);
    }
  }, [router.query, posts, language]);

  return (
    <Layout>
      {/* Section Started Heading */}
      <section className="section section-inner started-heading">
        <div className="container">
          {/* Heading */}
          <div className="m-titles align-center">
            <h1
              className="m-title splitting-text-anim-1 scroll-animate"
              data-splitting="words"
              data-animate="active"
            >
              <span> {selectedTag ? `${selectedTag}` : t('latestBlog')} </span>
            </h1>
            <div
              className="m-subtitle splitting-text-anim-1 scroll-animate"
              data-splitting="words"
              data-animate="active"
            >
              <span> {selectedTag ? (language === 'hu' ? `Cikkek ${selectedTag} témakörben` : `Artikel zu ${selectedTag}`) : t('myArticles')} </span>
            </div>
          </div>
        </div>
      </section>
      {/* Section - Blog */}
      <div className="section section-inner m-archive">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
              {/* Clear Filter Button */}
              {selectedTag && (
                <div className="filter-info" style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <Link legacyBehavior href="/blog">
                    <a className="btn" style={{ display: 'inline-block', padding: '10px 20px', background: '#41a587', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
{t('allArticles')}
                    </a>
                  </Link>
                </div>
              )}
              {/* Blog Items */}
              <div className="articles-container">
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.slug}
                    className="archive-item scrolla-element-anim-1 scroll-animate"
                    data-animate="active"
                  >
                    <div className="image">
                      <Link legacyBehavior href={`/blog/${post.slug}`}>
                        <a>
                          <img
                            src={post.image}
                            alt={language === 'hu' ? post.title : (post.titleDe || post.title)}
                            loading="lazy"
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="desc">
                      <div className="category lui-subtitle">
                        <span>{language === 'hu' ? post.category : (post.categoryDe || post.category)}</span>
                      </div>
                      <h5 className="lui-title">
                        <Link legacyBehavior href={`/blog/${post.slug}`}>
                          <a>
                            {language === 'hu' ? post.title : (post.titleDe || post.title)}
                          </a>
                        </Link>
                      </h5>
                      <div className="lui-text">
                        <p>
                          {language === 'hu' ? post.excerpt : (post.excerptDe || post.excerpt)}
                        </p>
                        <div className="readmore">
                          <Link legacyBehavior href={`/blog/${post.slug}`}>
                            <a className="lnk">
                              {t('readMore')}
                            </a>
                          </Link>
                        </div>
                      </div>
                      <div className="bottom">
                        <div className="date lui-subtitle">
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="author lui-subtitle">
                          <span>by {post.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
              {/* Sidebar */}
              <div className="col__sedebar">
                <div className="blog-menu scrolla-element-anim-1 scroll-animate" data-animate="active">
                  <h5 className="lui-title">
                    <span>{t('categories')}</span>
                  </h5>
                  <div className="archive-links">
                    <ul>
                      {[...new Set(posts.map(post => language === 'hu' ? post.category : (post.categoryDe || post.category)))].map(category => (
                        <li key={category}>
                          <a>{category}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="blog-menu scrolla-element-anim-1 scroll-animate" data-animate="active">
                  <h5 className="lui-title">
                    <span>{t('latestPosts')}</span>
                  </h5>
                  <div className="recent-posts">
                    {posts.slice(0, 3).map(post => (
                      <div key={post.slug} className="recent-post">
                        <div className="image">
                          <Link legacyBehavior href={`/blog/${post.slug}`}>
                            <a>
                              <img 
                                src={post.image} 
                                alt={language === 'hu' ? post.title : (post.titleDe || post.title)}
                                loading="lazy"
                              />
                            </a>
                          </Link>
                        </div>
                        <div className="desc">
                          <h6 className="lui-title">
                            <Link legacyBehavior href={`/blog/${post.slug}`}>
                              <a>
                                {language === 'hu' ? post.title : (post.titleDe || post.title)}
                              </a>
                            </Link>
                          </h6>
                          <div className="date lui-subtitle">
                            <span>{formatDate(post.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  const { getAllBlogPosts } = require('../src/utils/blog');
  const posts = getAllBlogPosts();
  
  return {
    props: {
      posts,
    },
  };
}

export default Blog;