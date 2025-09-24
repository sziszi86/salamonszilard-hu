const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDirectory = path.join(process.cwd(), 'content/blog');

function getAllBlogSlugs() {
  const fileNames = fs.readdirSync(blogDirectory);
  return fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => ({
      params: {
        slug: name.replace(/\.md$/, '')
      }
    }));
}

function getBlogPost(slug) {
  const filePath = path.join(blogDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Parse content into Hungarian and German sections
  const sections = content.split('---\n\n# ');
  const hungarianContent = sections[0].replace(/^# /, '');
  const germanContent = sections[1] || hungarianContent;
  
  // For now, return plain text content - will implement markdown parsing later
  const formatPlainText = (text) => {
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };
  
  return {
    slug,
    frontMatter: data,
    content: {
      hu: formatPlainText(hungarianContent),
      de: formatPlainText(germanContent)
    },
    rawContent: {
      hu: hungarianContent,
      de: germanContent
    }
  };
}

function getAllBlogPosts() {
  const fileNames = fs.readdirSync(blogDirectory);
  const allPostsData = fileNames
    .filter(name => name.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const filePath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug,
        ...data,
        date: typeof data.date === 'object' ? data.date.toISOString().split('T')[0] : data.date
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date but keep as strings

  return allPostsData;
}

function getLatestBlogPosts(count = 3) {
  const allPosts = getAllBlogPosts();
  return allPosts.slice(0, count);
}

module.exports = {
  getAllBlogSlugs,
  getBlogPost,
  getAllBlogPosts,
  getLatestBlogPosts
};