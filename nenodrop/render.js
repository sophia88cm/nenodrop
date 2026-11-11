(function () {
  const C = SITE_CONTENT;
  const $ = (id) => document.getElementById(id);
  const setText = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };
  const setHTML = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };

  // 渲染基础信息（导航、Hero、品牌等）
  const logoEl = $("logo");
  if (logoEl) logoEl.innerHTML = C.logo.replace(C.logoHighlight, `<span>${C.logoHighlight}</span>`);
  const navLinks = $("navLinks");
  if (navLinks) navLinks.innerHTML = C.nav.map(n => `<li><a href="${n.href}">${n.text}</a></li>`).join("");
  setText("heroTitle", C.hero.title);
  setText("heroSubtitle", C.hero.subtitle);
  const heroBtns = $("heroButtons");
  if (heroBtns) heroBtns.innerHTML = C.hero.buttons.map(b => `<a href="${b.href}" class="btn ${b.style || ''}">${b.text}</a>`).join("");
  setText("aboutTitle", C.about.title);
  setHTML("aboutParagraphs", C.about.paragraphs.map(p => `<p style="margin-bottom:12px;">${p}</p>`).join(""));
  const aboutTags = $("aboutTags");
  if (aboutTags) aboutTags.innerHTML = C.about.tags.map(t => `<span class="tag">${t}</span>`).join("");
  setText("storybookTitle", C.storybook.title);
  setText("storybookSubtitle", C.storybook.subtitle);
  setText("storybookDesc", C.storybook.description);
  setText("storybookChannelTitle", C.storybook.channelTitle);
  setText("storybookChannelDesc", C.storybook.channelDesc);
  const sbBtn = $("storybookBtn");
  if (sbBtn) { sbBtn.textContent = C.storybook.buttonText; sbBtn.href = C.storybook.buttonLink; }
  setText("floraTitle", C.flora.title);
  setText("floraSubtitle", C.flora.subtitle);
  setText("floraDesc", C.flora.description);
  const floraTags = $("floraTags");
  if (floraTags) floraTags.innerHTML = C.flora.productTags.map(t => `<span class="product-tag">${t}</span>`).join("");
  const floraBtn = $("floraBtn");
  if (floraBtn) { floraBtn.textContent = C.flora.buttonText; floraBtn.href = C.flora.buttonLink; }
  setText("musicTitle", C.music.title);
  setText("musicSubtitle", C.music.subtitle);
  setText("musicChannelTitle", C.music.channelTitle);
  setText("musicChannelDesc", C.music.channelDesc);
  const musicBtn = $("musicBtn");
  if (musicBtn) { musicBtn.textContent = C.music.buttonText; musicBtn.href = C.music.buttonLink; }
  setText("aiTitle", C.aiLab.title);
  setText("aiSubtitle", C.aiLab.subtitle);
  const aiList = $("aiList");
  if (aiList) aiList.innerHTML = C.aiLab.items.map(i => `<li>${i}</li>`).join("");

  // ==========================================
  // 💡 核心升级：自动从 GitHub 读取 CMS 写的文章
  // ==========================================
  setText("blogTitle", C.blog.title);
  setText("blogSubtitle", C.blog.subtitle);
  const blogList = $("blogList");
  
  if (blogList) {
    // 通过 GitHub API 获取 posts 文件夹里的内容
    fetch('https://api.github.com/repos/sophia88cm/nenodrop/contents/posts')
      .then(res => {
        if(!res.ok) throw new Error('暂无文章');
        return res.json();
      })
      .then(files => {
        // 过滤出 .md 文件
        const mdFiles = files.filter(f => f.name.endsWith('.md'));
        if (mdFiles.length === 0) {
          blogList.innerHTML = '<p style="color:var(--text-soft);">还没有发布文章哦~</p>';
          return;
        }
        
        // 并发请求所有文章的具体内容
        Promise.all(mdFiles.map(f => fetch(f.download_url).then(r => r.text())))
          .then(contents => {
            const html = contents.map((text, index) => {
              // 简单的 Markdown 解析：提取标题、摘要、链接
              const lines = text.split('\n');
              let title = "无标题", excerpt = "", link = "";
              
              lines.forEach(line => {
                if(line.startsWith('title:')) title = line.replace('title:', '').trim().replace(/['"]/g, '');
                if(line.startsWith('excerpt:')) excerpt = line.replace('excerpt:', '').trim().replace(/['"]/g, '');
                if(line.startsWith('link:')) link = line.replace('link:', '').trim().replace(/['"]/g, '');
              });

              const cardContent = `
                <div class="blog-card-content">
                  <div class="blog-card-title">《${title}》</div>
                  ${excerpt ? `<div class="blog-card-excerpt">${excerpt}</div>` : ""}
                </div>`;
                
              if (link) {
                return `<a class="blog-card blog-card-link" href="${link}" target="_blank" rel="noopener">${cardContent}<span class="blog-card-arrow">↗</span></a>`;
              }
              return `<div class="blog-card">${cardContent}</div>`;
            }).join('');
            
            blogList.innerHTML = html;
          });
      })
      .catch(err => {
        blogList.innerHTML = '<p style="color:var(--text-soft);">暂无文章（或正在同步中）。</p>';
      });
  }

  // 渲染 FAQ 和 页脚
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
  setText("footerMotto", C.footer.motto);
  const footerLinks = $("footerLinks");
  if (footerLinks) footerLinks.innerHTML = C.footer.links.map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.text}</a>`).join("");
  setText("footerCopyright", C.footer.copyright);
})();