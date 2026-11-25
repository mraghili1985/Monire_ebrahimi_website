# Generates projects/<id>.html for every project in assets/projects-data.js
# Usage: py build_pages.py   (run from the repo root; re-run after editing projects-data.js)
import re, json, html, os

root = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(root, 'assets/projects-data.js'), encoding='utf-8').read()
ids = re.findall(r"^\s{8}id: '([^']+)'", src, re.M)


def field(pid, name):
    block = src.split("id: '%s'" % pid, 1)[1].split("\n      {", 1)[0]
    m = re.search(r"\b%s: '((?:[^'\\]|\\.)*)'" % name, block)
    return m.group(1).replace("\\'", "'") if m else ''


TEMPLATE = '''<!DOCTYPE html>
<html lang="fa" dir="rtl" class="light scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | منیره ابراهیمی</title>
  <meta name="description" content="{desc}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="../{img}">
  <meta property="og:type" content="article">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Bebas+Neue&family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="../assets/tailwind-config.js"></script>
  <link rel="stylesheet" href="../assets/style.css">
  <script>try{{var d=document.documentElement;if(localStorage.getItem('theme')==='dark'){{d.classList.add('dark');d.classList.remove('light')}}if(localStorage.getItem('lang')==='en'){{d.lang='en';d.dir='ltr'}}}}catch(e){{}}</script>
</head>
<body class="antialiased min-h-screen">
  <header class="sticky top-0 z-40 glass-nav">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="../index.html" class="flex items-center gap-3">
        <span class="w-9 h-9 rounded-full border border-brand-lavender/40 flex items-center justify-center font-bold text-brand-lavenderDark">M</span>
        <span id="brandName" class="font-bold text-slate-900 dark:text-white">منیره ابراهیمی</span>
      </a>
      <nav class="flex items-center gap-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <a id="navHome" href="../index.html" class="hidden sm:inline hover:text-brand-lavenderDark">صفحه اصلی</a>
        <a id="navWorks" href="../index.html#projects" class="hidden sm:inline hover:text-brand-lavenderDark">نمونه‌کارها</a>
        <button onclick="toggleTheme()" aria-label="theme" class="w-9 h-9 rounded-full border border-brand-lavender/30 flex items-center justify-center"><i id="themeIcon" data-lucide="moon" class="w-4 h-4"></i></button>
        <button onclick="toggleLanguage()" class="px-3 py-1.5 rounded-full border border-brand-lavender/30 text-xs font-bold"><span id="langText">EN</span></button>
      </nav>
    </div>
  </header>
  <main id="app" class="max-w-5xl mx-auto px-4 sm:px-6 py-10"></main>
  <script src="../assets/projects-data.js"></script>
  <script>const PROJECT_ID = {pid};</script>
  <script src="../assets/project-page.js"></script>
</body>
</html>
'''

os.makedirs(os.path.join(root, 'projects'), exist_ok=True)
for pid in ids:
    page = TEMPLATE.format(
        title=html.escape(field(pid, 'titleFa')),
        desc=html.escape(field(pid, 'descFa')[:160]),
        img=field(pid, 'heroImg'),
        pid=json.dumps(pid))
    open(os.path.join(root, 'projects', pid + '.html'), 'w', encoding='utf-8').write(page)
print(len(ids), 'pages generated')
