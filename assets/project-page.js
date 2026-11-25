// Renders a single project page. PROJECT_ID is set by the generated page in /projects/.
(function () {
  const BASE = '../';
  const T = {
    fa: {
      home: 'صفحه اصلی', works: 'نمونه‌کارها', client: 'کارفرما / برند', year: 'سال', category: 'دسته‌بندی',
      print: 'روش چاپ', material: 'متریال', narrative: 'استراتژی و روایت طراحی',
      palette: 'پالت رنگی و کدهای چاپ', gallery: 'تصاویر پروژه', related: 'پروژه‌های مرتبط',
      inquire: 'استعلام پروژه مشابه در واتس‌اپ', prev: 'پروژه قبلی', next: 'پروژه بعدی',
      all: 'همه نمونه‌کارها', copied: 'کد رنگ کپی شد', nf: 'پروژه پیدا نشد',
      brand: 'منیره ابراهیمی'
    },
    en: {
      home: 'Home', works: 'Portfolio', client: 'Client / Brand', year: 'Year', category: 'Category',
      print: 'Printing Method', material: 'Material / Substrate', narrative: 'Design Strategy & Narrative',
      palette: 'Color Palette & Print Codes', gallery: 'Project Gallery', related: 'Related Projects',
      inquire: 'Inquire a Similar Project on WhatsApp', prev: 'Previous project', next: 'Next project',
      all: 'All projects', copied: 'Color code copied', nf: 'Project not found',
      brand: 'Monire Ebrahimi'
    }
  };

  let lang = localStorage.getItem('lang') === 'en' ? 'en' : 'fa';
  let theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';

  const $ = (id) => document.getElementById(id);
  const pick = (p, fa, en) => (lang === 'fa' ? p[fa] : p[en]);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const img = (src) => BASE + src;
  const href = (id) => id + '.html';

  function applyShell() {
    const h = document.documentElement;
    h.lang = lang; h.dir = lang === 'fa' ? 'rtl' : 'ltr';
    h.classList.toggle('dark', theme === 'dark');
    h.classList.toggle('light', theme !== 'dark');
    $('langText').textContent = lang === 'fa' ? 'EN' : 'FA';
    $('themeIcon').setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    $('brandName').textContent = T[lang].brand;
    $('navHome').textContent = T[lang].home;
    $('navWorks').textContent = T[lang].works;
  }

  function card(p) {
    return `<a href="${href(p.id)}" class="group block rounded-2xl overflow-hidden glass-card">
      <div class="h-52 overflow-hidden bg-slate-100"><img loading="lazy" src="${img(p.heroImg)}" alt="${esc(pick(p, 'titleFa', 'titleEn'))}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>
      <div class="p-4"><div class="text-[11px] font-semibold text-brand-lavenderDark mb-1">${esc(pick(p, 'categoryFa', 'categoryEn'))}</div>
      <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">${esc(pick(p, 'titleFa', 'titleEn'))}</h3></div></a>`;
  }

  function render() {
    const t = T[lang];
    const i = projectsData.findIndex((x) => x.id === PROJECT_ID);
    const app = $('app');
    if (i < 0) { app.innerHTML = `<p class="py-32 text-center text-lg">${t.nf}</p>`; return; }
    const p = projectsData[i];
    const title = pick(p, 'titleFa', 'titleEn');
    const cat = pick(p, 'categoryFa', 'categoryEn');
    const desc = pick(p, 'descFa', 'descEn');
    document.title = title + ' | ' + t.brand;

    const prev = projectsData[(i - 1 + projectsData.length) % projectsData.length];
    const next = projectsData[(i + 1) % projectsData.length];
    const related = projectsData.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
    const more = related.length ? related : [prev, next];
    const rtl = lang === 'fa';
    const meta = [[t.client, p.client], [t.year, p.year], [t.category, cat], [t.print, p.printMethod], [t.material, p.material]]
      .filter((m) => m[1])
      .map((m) => `<div><dt class="text-[11px] font-bold uppercase tracking-wider text-brand-lavenderDark">${m[0]}</dt><dd class="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">${esc(m[1])}</dd></div>`).join('');
    const swatches = (p.palette || []).map((c) => `<button type="button" data-hex="${c.hex}" class="swatch flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-lavenderDark transition-colors">
        <span class="w-5 h-5 rounded-full border border-slate-300" style="background:${c.hex}"></span>
        <span class="flex flex-col text-start"><span class="text-[11px] font-bold leading-none text-slate-800 dark:text-slate-100">${esc(c.name)}</span><span class="hexlabel text-[10px] font-mono mt-1 leading-none text-slate-500">${c.hex}</span></span></button>`).join('');
    const gallery = (p.gallery || []).map((g) => `<figure class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white"><img loading="lazy" src="${img(g)}" alt="${esc(title)}" class="w-full h-auto block"></figure>`).join('');
    const wa = 'https://wa.me/989226056014?text=' + encodeURIComponent(rtl ? `سلام خانم ابراهیمی، درباره پروژه "${title}" سوال داشتم.` : `Hello, I have a question about the project "${title}".`);
    const arrow = rtl ? 'arrow-right' : 'arrow-left', arrowN = rtl ? 'arrow-left' : 'arrow-right';

    app.innerHTML = `
      <nav class="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mb-6" aria-label="breadcrumb">
        <a href="${BASE}index.html" class="hover:text-brand-lavenderDark">${t.home}</a><span>/</span>
        <a href="${BASE}index.html#projects" class="hover:text-brand-lavenderDark">${t.works}</a><span>/</span>
        <span class="text-slate-700 dark:text-slate-200">${esc(cat)}</span></nav>
      <header class="mb-10">
        <span class="text-xs font-bold uppercase tracking-widest text-brand-lavenderDark">${esc(cat)}</span>
        <h1 class="mt-2 text-3xl sm:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">${esc(title)}</h1>
      </header>
      <dl class="grid grid-cols-2 lg:grid-cols-5 gap-6 py-6 mb-10 border-y border-brand-lavender/20">${meta}</dl>
      <figure class="rounded-3xl overflow-hidden border border-brand-lavender/20 bg-white mb-6"><img src="${img(p.heroImg)}" alt="${esc(title)}" class="w-full h-auto block"></figure>
      ${gallery ? `<div class="space-y-6 mb-16" aria-label="${t.gallery}">${gallery}</div>` : '<div class="mb-16"></div>'}
      <section class="max-w-3xl mb-14">
        <h2 class="text-xl font-bold mb-4 text-slate-900 dark:text-white">${t.narrative}</h2>
        <p class="leading-loose text-slate-700 dark:text-slate-300">${esc(desc)}</p>
      </section>
      ${swatches ? `<section class="mb-14"><h2 class="text-xl font-bold mb-4 text-slate-900 dark:text-white">${t.palette}</h2><div class="flex flex-wrap gap-3">${swatches}</div></section>` : ''}
      <a href="${wa}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-brand-lavenderDark text-white text-sm font-bold transition-colors mb-20">
        <i data-lucide="message-square" class="w-4 h-4 text-brand-beigeLight"></i>${t.inquire}</a>
      <section class="mb-16"><h2 class="text-xl font-bold mb-6 text-slate-900 dark:text-white">${t.related}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">${more.map(card).join('')}</div></section>
      <div class="flex items-center justify-between gap-4 pt-8 border-t border-brand-lavender/20 text-sm font-bold">
        <a href="${href(prev.id)}" class="inline-flex items-center gap-2 hover:text-brand-lavenderDark"><i data-lucide="${arrow}" class="w-4 h-4"></i>${t.prev}</a>
        <a href="${BASE}index.html#projects" class="hidden sm:inline text-slate-500 hover:text-brand-lavenderDark">${t.all}</a>
        <a href="${href(next.id)}" class="inline-flex items-center gap-2 hover:text-brand-lavenderDark">${t.next}<i data-lucide="${arrowN}" class="w-4 h-4"></i></a>
      </div>`;

    app.querySelectorAll('.swatch').forEach((b) => b.addEventListener('click', () => {
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.hex);
      const s = b.querySelector('.hexlabel'); const old = s.textContent;
      s.textContent = t.copied; setTimeout(() => (s.textContent = old), 1200);
    }));
    if (window.lucide) lucide.createIcons();
  }

  window.toggleLanguage = function () { lang = lang === 'fa' ? 'en' : 'fa'; localStorage.setItem('lang', lang); applyShell(); render(); if (window.lucide) lucide.createIcons(); };
  window.toggleTheme = function () { theme = theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('theme', theme); applyShell(); if (window.lucide) lucide.createIcons(); };

  document.addEventListener('DOMContentLoaded', () => { applyShell(); render(); if (window.lucide) lucide.createIcons(); });
})();
