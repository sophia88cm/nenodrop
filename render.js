(function () {
  const C = SITE_CONTENT;
  const $ = (id) => document.getElementById(id);
  const setText = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };
  const setHTML = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };

  // --- 基础内容渲染（保留原有功能） ---
  const logoEl = $("logo");
  if (logoEl) logoEl.innerHTML = C.logo.replace(C.logoHighlight, `<span>${C.logoHighlight}</span>`);
  const navLinks = $("navLinks");
  if (navLinks) navLinks.innerHTML = C.nav.map(n => `<li><a href="${n.href}">${n.text}</a></li>`).join("");
  setText("heroTitle", C.hero.title);
  setText("heroSubtitle", C.hero.subtitle);
  const heroBtns = $("heroButtons");
  if (heroBtns) heroBtns.innerHTML = C.hero.buttons.map(b => `<a href="${b.href}" class="btn ${b.style || ''}">${b.text}</a>`).join("");
  
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
  // 核心：抓取后台文章并生成可点击的卡片
  // ==========================================
  setText("blogTitle", C.blog.title);
  setText("blogSubtitle", C.blog.subtitle);
  const blogList = $("blogList");
  
  if (blogList) {
    fetch('https://api.github.com/repos/sophia88cm/nenodrop/contents/posts')
      .then(res => {
        if(!res.ok) throw new Error('暂无文章');
        return res.json();
      })
      .then(files => {
        const mdFiles = files.filter(f => f.name.endsWith('.md'));
        if (mdFiles.length === 0) {
          blogList.innerHTML = '<p style="color:var(--text-soft);">还没有发布文章哦~</p>';
          return;
        }
        
        Promise.all(mdFiles.map(f => fetch(f.download_url).then(r => r.text())))
          .then(contents => {
            const html = contents.map((text, index) => {
              const lines = text.split('\n');
              let title = "无标题", excerpt = "", link = "", slug = mdFiles[index].name.replace('.md', '');
              
              lines.forEach(line => {
                if(line.startsWith('title:')) title = line.replace('title:', '').trim().replace(/['"]/g, '');
                if(line.startsWith('excerpt:')) excerpt = line.replace('excerpt:', '').trim().replace(/['"]/g, '');
                if(line.startsWith('link:')) link = line.replace('link:', '').trim().replace(/['"]/g, '');
              });

              // 如果后台填了外链，就跳外链；没填外链，就跳本地生成的阅读页 article.html
              const finalLink = link ? link : `article.html?slug=${slug}`;
              
              const cardContent = `
                <div class="blog-card-content">
                  <div class="blog-card-title">《${title}》</div>
                  ${excerpt ? `<div class="blog-card-excerpt">${excerpt}</div>` : ""}
                </div>`;
                
              return `<a class="blog-card blog-card-link" href="${finalLink}" ${link ? 'target="_blank"' : ''} rel="noopener">${cardContent}<span class="blog-card-arrow">↗</span></a>`;
            }).join('');
            
            blogList.innerHTML = html;
          });
      })
      .catch(err => {
        blogList.innerHTML = '<p style="color:var(--text-soft);">暂无文章（或正在同步中）。</p>';
      });
  }

  // --- FAQ 与页脚渲染 ---
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
