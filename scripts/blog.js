const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
navLinks.forEach((link) => {
  link.classList.toggle("active", link.dataset.page === "blog");
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

const blogSearch = document.getElementById("blog-search");
const featuredPostContainer = document.getElementById(
  "featured-post-container",
);
const postsList = document.getElementById("posts-list");
const blogPagination = document.getElementById("blog-pagination");
const blogTitle = document.getElementById("blog-title");
const blogHeroMeta = document.getElementById("blog-hero-meta");
const blogBackButton = document.getElementById("blog-back-button");
const postsPerPage = 5;
let allPosts = [];

const markdownRenderer = window
  .markdownit({
    html: true,
    linkify: true,
    typographer: true,
  })
  .use(window.markdownitFootnote)
  .use(window.markdownitSub)
  .use(window.markdownitSup)
  .use(window.markdownitMark)
  .use(window.markdownitDeflist)
  .use(window.markdownitEmoji)
  .use(window.markdownitTaskLists, { enabled: true })
  .use((renderer) => {
    const createHeadingId = (text) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    renderer.inline.ruler.before("text", "youtubeEmbed", (state, silent) => {
      const match = state.src
        .slice(state.pos)
        .match(/^\{\{youtube:\s*([^}\s]+)\s*\}\}/);
      if (!match) return false;
      if (silent) return true;

      const videoId = match[1];
      if (!/^[a-zA-Z0-9_-]{6,}$/.test(videoId)) return false;

      const token = state.push("youtube_embed", "iframe", 0);
      token.meta = { videoId };
      state.pos += match[0].length;
      return true;
    });

    renderer.renderer.rules.youtube_embed = (tokens, index) => {
      const videoId = tokens[index].meta.videoId;
      return `<iframe class="youtube-embed" src="https://www.youtube-nocookie.com/embed/${videoId}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    };

    renderer.core.ruler.push("headingIds", (state) => {
      const usedIds = new Map();

      state.tokens.forEach((token, index) => {
        if (token.type !== "heading_open") return;

        const inlineToken = state.tokens[index + 1];
        const baseId =
          createHeadingId(inlineToken?.content || "heading") || "heading";
        const count = usedIds.get(baseId) || 0;
        usedIds.set(baseId, count + 1);
        token.attrSet("id", count ? `${baseId}-${count + 1}` : baseId);
      });
    });

    renderer.block.ruler.before(
      "paragraph",
      "callout",
      (state, startLine, endLine, silent) => {
        const start = state.bMarks[startLine] + state.tShift[startLine];
        const end = state.eMarks[startLine];
        const opening = state.src
          .slice(start, end)
          .match(/^:::(note|warning|tip)\s*$/i);
        if (!opening) return false;
        if (silent) return true;

        let nextLine = startLine + 1;
        while (nextLine < endLine) {
          const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
          const lineEnd = state.eMarks[nextLine];
          if (state.src.slice(lineStart, lineEnd).trim() === ":::") break;
          nextLine += 1;
        }

        if (nextLine >= endLine) return false;

        const contentStart = state.bMarks[startLine + 1] || state.src.length;
        const contentEnd = state.bMarks[nextLine] || state.src.length;
        const token = state.push("callout", "aside", 0);
        token.meta = {
          type: opening[1].toLowerCase(),
          content: state.src.slice(contentStart, contentEnd).trim(),
        };
        state.line = nextLine + 1;
        return true;
      },
    );

    renderer.renderer.rules.callout = (tokens, index, options, env) => {
      const { type, content } = tokens[index].meta;
      const label = type[0].toUpperCase() + type.slice(1);
      return `<aside class="callout callout-${type}" role="note"><strong class="callout-title">${label}</strong>${renderer.render(content, options, env)}</aside>`;
    };

    renderer.inline.ruler.before("emphasis", "underline", (state, silent) => {
      if (state.src.slice(state.pos, state.pos + 2) !== "__") {
        return false;
      }

      const contentStart = state.pos + 2;
      const contentEnd = state.src.indexOf("__", contentStart);
      if (contentEnd < contentStart || contentEnd === contentStart) {
        return false;
      }

      if (silent) return true;

      const token = state.push("underline", "u", 0);
      token.content = state.src.slice(contentStart, contentEnd);
      token.children = [];
      state.md.inline.parse(token.content, state.md, state.env, token.children);
      state.pos = contentEnd + 2;
      return true;
    });

    renderer.renderer.rules.underline = (tokens, index, options, env) =>
      `<u>${renderer.renderer.renderInline(tokens[index].children, options, env)}</u>`;

    renderer.block.ruler.before(
      "paragraph",
      "discordSubtext",
      (state, startLine, endLine, silent) => {
        const start = state.bMarks[startLine] + state.tShift[startLine];
        const end = state.eMarks[startLine];
        const line = state.src.slice(start, end);

        if (
          !line.startsWith("-#") ||
          (line.length > 2 && !/\s/.test(line[2]))
        ) {
          return false;
        }

        if (silent) return true;

        const token = state.push("paragraph_open", "p", 1);
        token.attrs = [["class", "discord-subtext"]];
        token.map = [startLine, startLine + 1];

        const inlineToken = state.push("inline", "", 0);
        inlineToken.content = line.slice(2).trim();
        inlineToken.map = [startLine, startLine + 1];
        inlineToken.children = [];

        state.push("paragraph_close", "p", -1);
        state.line = startLine + 1;
        return true;
      },
    );
  });

function renderMarkdown(markdown) {
  let html = markdownRenderer.render(markdown);

  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, expression) =>
    window.katex.renderToString(expression.trim(), { displayMode: true }),
  );
  return html.replace(/\$([^$\n]+?)\$/g, (_, expression) =>
    window.katex.renderToString(expression.trim()),
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createSlug(title, index) {
  const slug = String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `${slug}-${index + 1}` : `post-${index + 1}`;
}

function getPostSlug(post, index) {
  return post.slug || createSlug(post.title, index);
}

function getPreview(body, maxLength = 140) {
  const plainText = String(body || "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*_>`~\[\]()!-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
}

function getCurrentPage(totalPages) {
  const params = new URLSearchParams(window.location.search);
  const page = Number.parseInt(params.get("page"), 10);

  if (Number.isNaN(page)) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

function setBlogHero(title, meta = "", showBackButton = false) {
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
    blogPagination.innerHTML = "";
    return;
  }

  blogPagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    const isCurrent = page === currentPage;

    return `
      <a
        class="page-link${isCurrent ? " active" : ""}"
        href="index.html?page=${page}"
        ${isCurrent ? 'aria-current="page"' : ""}
      >${page}</a>
    `;
  }).join("");
}

function renderPostList(posts) {
  setBlogHero("Blog posts.");

  const totalPages = Math.max(Math.ceil(posts.length / postsPerPage), 1);
  const currentPage = getCurrentPage(totalPages);
  const start = (currentPage - 1) * postsPerPage;
  const visiblePosts = posts.slice(start, start + postsPerPage);

  if (featuredPostContainer) {
    featuredPostContainer.innerHTML = "";
  }

  postsList.innerHTML = visiblePosts.length
    ? visiblePosts
        .map((post, index) => {
          const postIndex = start + index;
          const slug = encodeURIComponent(getPostSlug(post, postIndex));

          return `
            <article class="post-card">
              <a class="post-link" href="index.html?post=${slug}">
                <p class="post-meta">${escapeHtml(post.date)} &bull; ${escapeHtml(post.readTime || post.time || "")}</p>
                <h2>${escapeHtml(post.title)}</h2>
                <p class="post-preview">${escapeHtml(post.preview || getPreview(post.body))}</p>
                <span class="read-more">Read full post</span>
              </a>
            </article>
          `;
        })
        .join("")
    : '<p class="contact-note">No posts found.</p>';

  renderPagination(totalPages, currentPage);
}

function renderFullPost(posts) {
  const params = new URLSearchParams(window.location.search);
  const requestedSlug = params.get("post");
  const post = posts.find(
    (item, index) => getPostSlug(item, index) === requestedSlug,
  );

  if (!requestedSlug || !post) {
    renderPostList(posts);
    return;
  }

  if (featuredPostContainer) {
    featuredPostContainer.innerHTML = "";
  }

  if (blogPagination) {
    blogPagination.innerHTML = "";
  }

  postsList.innerHTML = `
    <article class="full-post">
      <div class="full-post-body">${renderMarkdown(post.body)}</div>
    </article>
  `;

  setBlogHero(
    post.title,
    `${post.date || ""} - ${post.readTime || post.time || ""}`,
    true,
  );
}

if (blogBackButton) {
  blogBackButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

function renderPosts() {
  if (!featuredPostContainer || !postsList) return;

  fetch("posts.json")
    .then((response) => response.json())
    .then((posts) => {
      if (!Array.isArray(posts)) return [];

      return Promise.all(
        posts.map((post) => {
          const markdownPath = post.body || post.file || post.path;
          if (!markdownPath) return { ...post, body: "" };

          return fetch(markdownPath)
            .then((response) => {
              if (!response.ok)
                throw new Error(`Unable to load ${markdownPath}`);
              return response.text();
            })
            .then((body) => ({ ...post, body }));
        }),
      );
    })
    .then((posts) => {
      allPosts = posts.map((post, index) => ({
        ...post,
        slug: getPostSlug(post, index),
      }));
      renderFullPost(allPosts);
    })
    .catch(() => {
      featuredPostContainer.innerHTML =
        '<p class="contact-note">Unable to load posts.</p>';
      postsList.innerHTML = "";
      if (blogPagination) {
        blogPagination.innerHTML = "";
      }
    });
}

function updateSearchVisibility() {
  if (!blogSearch) return;
  const query = blogSearch.value.toLowerCase();
  const filteredPosts = allPosts.filter((post) => {
    const searchableText =
      `${post.title || ""} ${post.date || ""} ${post.time || ""} ${post.body || ""}`.toLowerCase();
    return searchableText.includes(query);
  });

  renderPostList(filteredPosts);
}

if (blogSearch) {
  blogSearch.addEventListener("input", updateSearchVisibility);
}

renderPosts();
