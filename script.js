const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const sections = Array.from(document.querySelectorAll('main section[id]'));
const isBlogPage = window.location.pathname.includes('blog.html');

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const isHomeLink = href === '#home' || href === 'index.html#home';
    const isBlogLink = href === 'blog.html';
    const matches =
      (isHomeLink && id === 'home') ||
      (href && href.includes(id)) ||
      (isBlogLink && isBlogPage);
    link.classList.toggle('active', matches);
  });
};

if (!isBlogPage) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveLink(id);
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  sections.forEach((section) => observer.observe(section));
} else {
  setActiveLink('blog');
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.style.display = expanded ? 'none' : 'flex';
  });
}

const blogSearch = document.getElementById('blog-search');
const featuredPostContainer = document.getElementById('featured-post-container');
const postsList = document.getElementById('posts-list');
const blogPagination = document.getElementById('blog-pagination');
const blogTitle = document.getElementById('blog-title');
const blogHeroMeta = document.getElementById('blog-hero-meta');
const blogBackButton = document.getElementById('blog-back-button');
const postsPerPage = 5;
let allPosts = [];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createSlug(title, index) {
  const slug = String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug ? `${slug}-${index + 1}` : `post-${index + 1}`;
}

function getPostSlug(post, index) {
  return post.slug || createSlug(post.title, index);
}

function getPreview(body, maxLength = 140) {
  const plainText = String(body || '').replace(/\s+/g, ' ').trim();

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
}

function getCurrentPage(totalPages) {
  const params = new URLSearchParams(window.location.search);
  const page = Number.parseInt(params.get('page'), 10);

  if (Number.isNaN(page)) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

function setBlogHero(title, meta = '', showBackButton = false) {
  if (blogTitle) {
    blogTitle.textContent = title;
  }

  if (blogHeroMeta) {
    blogHeroMeta.textContent = meta;
    blogHeroMeta.hidden = !meta;
  }

  if (blogBackButton) {
    blogBackButton.hidden = !showBackButton;
  }
}

function renderPagination(totalPages, currentPage) {
  if (!blogPagination) return;

  if (totalPages <= 1) {
    blogPagination.innerHTML = '';
    return;
  }

  blogPagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    const isCurrent = page === currentPage;

    return `
      <a
        class="page-link${isCurrent ? ' active' : ''}"
        href="blog.html?page=${page}"
        ${isCurrent ? 'aria-current="page"' : ''}
      >${page}</a>
    `;
  }).join('');
}

function renderPostList(posts) {
  setBlogHero('Blog posts.');

  const totalPages = Math.max(Math.ceil(posts.length / postsPerPage), 1);
  const currentPage = getCurrentPage(totalPages);
  const start = (currentPage - 1) * postsPerPage;
  const visiblePosts = posts.slice(start, start + postsPerPage);

  if (featuredPostContainer) {
    featuredPostContainer.innerHTML = '';
  }

  postsList.innerHTML = visiblePosts.length
    ? visiblePosts
        .map((post, index) => {
          const postIndex = start + index;
          const slug = encodeURIComponent(getPostSlug(post, postIndex));

          return `
            <article class="post-card">
              <a class="post-link" href="blog.html?post=${slug}">
                <p class="post-meta">${escapeHtml(post.date)} &bull; ${escapeHtml(post.time)}</p>
                <h2>${escapeHtml(post.title)}</h2>
                <p class="post-preview">${escapeHtml(getPreview(post.body))}</p>
                <span class="read-more">Read full post</span>
              </a>
            </article>
          `;
        })
        .join('')
    : '<p class="contact-note">No posts found.</p>';

  renderPagination(totalPages, currentPage);
}

function renderFullPost(posts) {
  const params = new URLSearchParams(window.location.search);
  const requestedSlug = params.get('post');
  const post = posts.find((item, index) => getPostSlug(item, index) === requestedSlug);

  if (!requestedSlug || !post) {
    renderPostList(posts);
    return;
  }

  if (featuredPostContainer) {
    featuredPostContainer.innerHTML = '';
  }

  if (blogPagination) {
    blogPagination.innerHTML = '';
  }

  postsList.innerHTML = `
    <article class="full-post">
      <div class="full-post-body">${escapeHtml(post.body).replace(/\n/g, '<br>')}</div>
    </article>
  `;

  setBlogHero(post.title, `${post.date || ''} - ${post.time || ''}`, true);
}

if (blogBackButton) {
  blogBackButton.addEventListener('click', () => {
    window.location.href = 'blog.html';
  });
}

function renderPosts() {
  if (!featuredPostContainer || !postsList) return;

  fetch('posts.json')
    .then((response) => response.json())
    .then((posts) => {
      allPosts = Array.isArray(posts)
        ? posts.map((post, index) => ({
            ...post,
            slug: getPostSlug(post, index),
          }))
        : [];
      renderFullPost(allPosts);
    })
    .catch(() => {
      featuredPostContainer.innerHTML = '<p class="contact-note">Unable to load posts.</p>';
      postsList.innerHTML = '';
      if (blogPagination) {
        blogPagination.innerHTML = '';
      }
    });
}

function updateSearchVisibility() {
  if (!blogSearch) return;
  const query = blogSearch.value.toLowerCase();
  const filteredPosts = allPosts.filter((post) => {
    const searchableText = `${post.title || ''} ${post.date || ''} ${post.time || ''} ${post.body || ''}`.toLowerCase();
    return searchableText.includes(query);
  });

  renderPostList(filteredPosts);
}

if (blogSearch) {
  blogSearch.addEventListener('input', updateSearchVisibility);
}

renderPosts();
