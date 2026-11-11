(function () {
  const C = SITE_CONTENT;
  const $ = (id) => document.getElementById(id);
  const setText = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };
  const setHTML = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };

  // 导航
  const logoEl = $("logo");
  if (logoEl) logoEl.innerHTML = C.logo.replace(C.logoHighlight, `<span>${C.logoHighlight}</span>`);
  const navLinks = $("navLinks");
  if (navLinks) navLinks.innerHTML = C.nav.map(n => `<li><a href="${n.href}">${n.text}</a></li>`).join("");

  // Hero
  setText("heroTitle", C.hero.title);
  setText("heroSubtitle", C.hero.subtitle);
  const heroBtns = $("heroButtons");
  if (heroBtns) heroBtns.innerHTML = C.hero.buttons.map(b => `<a href="${b.href}" class="btn ${b.style || ''}">${b.text}</a>`).join("");

  // 关于
  setText("aboutTitle", C.about.title);
  setHTML("aboutParagraphs", C.about.paragraphs.map(p => `<p style="margin-bottom:12px;">${p}</p>`).join(""));
  const aboutTags = $("aboutTags");
  if (aboutTags) aboutTags.innerHTML = C.about.tags.map(t => `<span class="tag">${t}</span>`).join("");

  // 故事书
  setText("storybookTitle", C.storybook.title);
  setText("storybookSubtitle", C.storybook.subtitle);
  setText("storybookDesc", C.storybook.description);
  setText("storybookChannelTitle", C.storybook.channelTitle);
  setText("storybookChannelDesc", C.storybook.channelDesc);
  const sbBtn = $("storybookBtn");
  if (sbBtn) { sbBtn.textContent = C.storybook.buttonText; sbBtn.href = C.storybook.buttonLink; }

  // Flora
  setText("floraTitle", C.flora.title);
  setText("floraSubtitle", C.flora.subtitle);
  setText("floraDesc", C.flora.description);
  const floraTags = $("floraTags");
  if (floraTags) floraTags.innerHTML = C.flora.productTags.map(t => `<span class="product-tag">${t}</span>`).join("");
  const floraBtn = $("floraBtn");
  if (floraBtn) { floraBtn.textContent = C.flora.buttonText; floraBtn.href = C.flora.buttonLink; }

  // 音乐
  setText("musicTitle", C.music.title);
  setText("musicSubtitle", C.music.subtitle);
  setText("musicChannelTitle", C.music.channelTitle);
  setText("musicChannelDesc", C.music.channelDesc);
  const musicBtn = $("musicBtn");
  if (musicBtn) { musicBtn.textContent = C.music.buttonText; musicBtn.href = C.music.buttonLink; }

  // AI
  setText("aiTitle", C.aiLab.title);
  setText("aiSubtitle", C.aiLab.subtitle);
  const aiList = $("aiList");
  if (aiList) aiList.innerHTML = C.aiLab.items.map(i => `<li>${i}</li>`).join("");

  // 博客（标题 + 摘要 + 可选外链）
  setText("blogTitle", C.blog.title);
  setText("blogSubtitle", C.blog.subtitle);
  const blogList = $("blogList");
  if (blogList) {
    blogList.innerHTML = C.blog.posts.map(p => {
      const hasLink = p.link && p.link.trim() !== "" && p.link !== "#";
      const content = `
        <div class="blog-card-content">
          <div class="blog-card-title">${p.title}</div>
          ${p.excerpt ? `<div class="blog-card-excerpt">${p.excerpt}</div>` : ""}
        </div>`;
      if (hasLink) {
        return `<a class="blog-card blog-card-link" href="${p.link}" target="${p.target || "_blank"}" rel="noopener">${content}<span class="blog-card-arrow">↗</span></a>`;
      }
      return `<div class="blog-card">${content}</div>`;
    }).join("");
  }

  // FAQ
  setText("faqTitle", C.faq.title);
  const faqList = $("faqList");
  if (faqList) {
    faqList.innerHTML = C.faq.items.map(item => `
      <div class="faq-item">
        <div class="faq-question"><span>${item.q}</span><span class="faq-icon">+</span></div>
        <div class="faq-answer"><p>${item.a}</p></div>
      </div>`).join("");
    faqList.querySelectorAll(".faq-item").forEach(el => {
      el.querySelector(".faq-question").addEventListener("click", () => el.classList.toggle("active"));
    });
  }

  // 页脚
  setText("footerMotto", C.footer.motto);
  const footerLinks = $("footerLinks");
  if (footerLinks) footerLinks.innerHTML = C.footer.links.map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.text}</a>`).join("");
  setText("footerCopyright", C.footer.copyright);
})();