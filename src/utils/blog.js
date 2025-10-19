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
  // Look for the "---" separator that divides languages
  const sections = content.split(/\n---\n\n/);
  let hungarianContent, germanContent;
  
  if (sections.length >= 2) {
    hungarianContent = sections[0];
    germanContent = sections[1];
  } else {
    // Fallback: if no separator found, use same content for both languages
    hungarianContent = content;
    germanContent = content;
  }
  
  // Simplified markdown to HTML conversion
  const formatMarkdownToHTML = (text) => {
    if (!text) return '';
    
    return text
      // Convert headings
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      
      // Convert code blocks first (before other replacements)
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      
      // Convert bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Convert unordered lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/((<li>.*<\/li>\n?)+)/gm, '<ul>\n$1</ul>')
      
      // Convert ordered lists  
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      
      // Convert paragraphs (split by double newlines)
      .split('\n\n')
      .map(paragraph => {
        paragraph = paragraph.trim();
        if (!paragraph) return '';
        if (paragraph.startsWith('<h') || paragraph.startsWith('<ul') || paragraph.startsWith('<ol') || paragraph.startsWith('<pre') || paragraph.startsWith('<div')) {
          return paragraph;
        }
        return `<p>${paragraph}</p>`;
      })
      .join('\n')
      
      // Convert single line breaks to <br> within paragraphs
      .replace(/(<p>.*?)<\/p>/gs, (match, content) => {
        return content.replace(/\n/g, '<br>') + '</p>';
      });
  };
  
  return {
    slug,
    frontMatter: data,
    content: {
      hu: formatMarkdownToHTML(hungarianContent),
      de: formatMarkdownToHTML(germanContent)
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