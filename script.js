/* Doctor Solutions — interações */
(() => {
  const WA_NUMBER = '5521997851223';
  const WA_DEFAULT = 'Olá! Conheci a Doctor Solutions pelo site e gostaria de conversar sobre um projeto.';

  /* Vídeos do carrossel: adicione os arquivos em /videos e liste aqui.
     Ex.: { src: 'videos/obra-1.mp4', poster: 'img/sr-depois-1.webp', title: 'Sobrerodas' } */
  const VIDEOS = [];

  const GALLERIES = {
    sr: { name: 'Sobrerodas', items: [
      ['sr-antes-1','antes'],['sr-antes-2','antes'],['sr-antes-3','antes'],
      ['sr-durante-1','durante'],['sr-durante-2','durante'],['sr-durante-3','durante'],
      ['sr-depois-1','depois'],['sr-depois-2','depois'],['sr-depois-3','depois'],['sr-depois-4','depois'],['sr-depois-5','depois']
    ]},
    sh: { name: 'Showroom automotivo', items: [
      ['sh-antes-1','antes'],['sh-antes-2','antes'],['sh-durante-1','durante'],
      ['sh-depois-1','depois'],['sh-depois-2','depois'],['sh-depois-3','depois'],['sh-depois-4','depois'],['sh-depois-5','depois'],['sh-depois-6','depois']
    ]},
    lj: { name: 'Loja de celulares', items: [
      ['lj-antes-1','antes'],['lj-depois-1','depois'],['lj-depois-2','depois'],['lj-depois-3','depois'],['lj-depois-4','depois']
    ]},
    st: { name: 'Sala comercial — estúdio', items: [
      ['st-antes-1','antes'],['st-antes-2','antes'],['st-depois-1','depois']
    ]}
  };
  const STAGE = { antes: ['Antes','tag--before'], durante: ['Durante','tag--during'], depois: ['Depois','tag--after'] };

  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* WhatsApp */
  document.querySelectorAll('[data-wa]').forEach(a => {
    const msg = a.getAttribute('data-wa') || WA_DEFAULT;
    a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    a.target = '_blank';
    a.rel = 'noopener';
  });
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* Abertura: logo aparece, fica 1,5 s e some */
  const intro = document.getElementById('intro');
  const FADE_IN = reduce ? 0 : 800, HOLD = 1500;
  setTimeout(() => {
    intro.classList.add('is-out');
    body.classList.remove('is-intro');
    body.classList.add('is-ready');
    setTimeout(() => intro.remove(), 700);
  }, FADE_IN + HOLD);

  /* Header */
  const header = document.getElementById('header');
  const wa = document.querySelector('.wa-float');
  const hero = document.getElementById('inicio');
  const onScroll = () => {
    const yy = window.scrollY;
    header.classList.toggle('is-solid', yy > 40);
    wa.classList.toggle('is-on', yy > hero.offsetHeight * .6);
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Menu mobile */
  const burger = document.getElementById('burger'), nav = document.getElementById('nav');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* Link ativo no menu */
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['inicio','empresa','servicos','projetos','metodologia','contato'].forEach(id => { const s = document.getElementById(id); s && spy.observe(s); });

  /* Serviços: abas (desktop) / acordeão (mobile) */
  const items = [...document.querySelectorAll('.svc__item')];
  const mqMobile = window.matchMedia('(max-width: 960px)');
  items.forEach(item => {
    item.querySelector('.svc__head').addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      if (mqMobile.matches) {
        item.classList.toggle('is-open', !isOpen);
        item.querySelector('.svc__head').setAttribute('aria-expanded', !isOpen);
        if (!isOpen) setTimeout(() => item.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }), 30);
      } else {
        items.forEach(o => { o.classList.toggle('is-open', o === item); o.querySelector('.svc__head').setAttribute('aria-expanded', o === item); });
      }
    });
  });
  const idxBtns = [...document.querySelectorAll('.svc-index button')];
  const syncIdx = () => idxBtns.forEach(b => b.classList.toggle('is-on', items[+b.dataset.svc - 1].classList.contains('is-open')));
  idxBtns.forEach(b => b.addEventListener('click', () => {
    const item = items[+b.dataset.svc - 1];
    if (!item.classList.contains('is-open')) item.querySelector('.svc__head').click();
    syncIdx();
    document.getElementById('svc').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }));
  items.forEach(it => it.querySelector('.svc__head').addEventListener('click', () => setTimeout(syncIdx)));
  syncIdx();
  mqMobile.addEventListener('change', e => {
    if (!e.matches && !items.some(i => i.classList.contains('is-open'))) items[0].classList.add('is-open');
    if (!e.matches) { let first = true; items.forEach(i => { const keep = i.classList.contains('is-open') && first; if (keep) first = false; i.classList.toggle('is-open', keep); }); }
  });

  /* Revelação ao rolar */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    const sib = el.parentElement.querySelectorAll(':scope > .reveal');
    const idx = [...sib].indexOf(el);
    if (sib.length > 1) el.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
    io.observe(el);
  });

  /* Lightbox */
  const lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'),
        lbTag = document.getElementById('lbTag'), lbCap = document.getElementById('lbCap'), lbCount = document.getElementById('lbCount');
  let cur = null, idx = 0, lastFocus = null;
  const altFor = (g, i) => {
    const el = document.querySelector(`[data-open="${g}"][data-index="${i}"] img`);
    return el ? el.alt : `${GALLERIES[g].name} — foto ${i + 1}`;
  };
  const show = () => {
    const [file, stage] = GALLERIES[cur].items[idx];
    lbImg.src = `img/${file}.webp`;
    lbImg.alt = altFor(cur, idx);
    lbTag.textContent = STAGE[stage][0];
    lbTag.className = 'tag ' + STAGE[stage][1];
    lbCap.textContent = GALLERIES[cur].name;
    lbCount.textContent = `${idx + 1} / ${GALLERIES[cur].items.length}`;
    const n = GALLERIES[cur].items[(idx + 1) % GALLERIES[cur].items.length][0];
    new Image().src = `img/${n}.webp`;
  };
  const open = (g, i) => { cur = g; idx = i; lastFocus = document.activeElement; show(); lb.hidden = false; body.style.overflow = 'hidden'; lb.querySelector('.lb__close').focus(); };
  const close = () => { lb.hidden = true; body.style.overflow = ''; lastFocus && lastFocus.focus(); };
  const step = d => { const n = GALLERIES[cur].items.length; idx = (idx + d + n) % n; show(); };
  document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => open(b.dataset.open, +b.dataset.index)));
  lb.querySelector('.lb__close').addEventListener('click', close);
  lb.querySelector('.lb__prev').addEventListener('click', () => step(-1));
  lb.querySelector('.lb__next').addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  let tx = null;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); tx = null; });

  /* Carrossel de vídeos */
  const vSec = document.getElementById('videos');
  if (VIDEOS.length) {
    vSec.hidden = false;
    const car = document.getElementById('carousel'), dots = document.getElementById('carDots');
    VIDEOS.forEach((v, i) => {
      const card = document.createElement('div');
      card.className = 'vcard';
      card.innerHTML = `<video src="${v.src}" ${v.poster ? `poster="${v.poster}"` : ''} preload="metadata" playsinline loop></video>
        <button class="vcard__play" aria-label="Reproduzir vídeo${v.title ? ': ' + v.title : ''}"><span><svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg></span></button>`;
      const video = card.querySelector('video');
      card.querySelector('.vcard__play').addEventListener('click', () => {
        car.querySelectorAll('video').forEach(o => { if (o !== video) { o.pause(); o.parentElement.classList.remove('is-playing'); o.controls = false; } });
        video.controls = true; video.play(); card.classList.add('is-playing');
      });
      video.addEventListener('pause', () => { if (video.ended || video.paused) card.classList.remove('is-playing'); });
      car.appendChild(card);
      const d = document.createElement('button'); d.setAttribute('aria-label', `Ir para o vídeo ${i + 1}`);
      d.addEventListener('click', () => car.scrollTo({ left: card.offsetLeft - car.offsetLeft, behavior: 'smooth' }));
      dots.appendChild(d);
    });
    const cards = [...car.children], dotBtns = [...dots.children];
    const upd = () => {
      const w = cards[0].offsetWidth + 16, a = Math.round(car.scrollLeft / w);
      dotBtns.forEach((d, i) => d.classList.toggle('is-on', i === a));
    };
    car.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); upd();
    vSec.querySelectorAll('[data-car]').forEach(b => b.addEventListener('click', () => {
      const w = cards[0].offsetWidth + 16;
      car.scrollBy({ left: b.dataset.car === 'next' ? w : -w, behavior: 'smooth' });
    }));
  }
})();

/* Transições entre seções, títulos e botões */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const root = document.documentElement;
  root.classList.add('fx');

  // Títulos palavra por palavra
  const split = el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const inner = document.createElement('span'); inner.textContent = p; inner.style.setProperty('--i', i++);
            w.appendChild(inner); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.matches('svg')) walk(n);
      });
    };
    walk(el);
    el.classList.add('split');
  };
  const heads = document.querySelectorAll('.h2, .contact__title, .ceo__name, .hero__title, .work__name > :first-child, .work__name');
  document.querySelectorAll('.h2, .contact__title, .ceo__name, .hero__title').forEach(split);

  // Botões entram em sequência
  document.querySelectorAll('main .btn, main .link-btn').forEach(b => { if (!b.closest('.svc__body')) b.classList.add('pre'); });

  const seen = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const t = en.target;
      t.classList.add('in');
      if (t.matches('section')) {
        t.querySelectorAll('.btn.pre, .link-btn.pre').forEach(() => {});
      }
      seen.unobserve(t);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .05 });

  document.querySelectorAll('main > section, .split, .btn.pre, .link-btn.pre, .eyebrow').forEach(el => {
    if (el.closest('.hero')) return; // o hero entra depois da abertura
    seen.observe(el);
  });

  // Hero: anima depois do logo de abertura
  const startHero = () => document.querySelectorAll('.hero .split, .hero .btn.pre, .hero .eyebrow').forEach((el, k) => setTimeout(() => el.classList.add('in'), 120 + k * 60));
  if (document.body.classList.contains('is-ready')) startHero();
  else new MutationObserver((m, o) => { if (document.body.classList.contains('is-ready')) { o.disconnect(); startHero(); } }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Atraso em cascata para botões irmãos
  document.querySelectorAll('.hero__actions, .diffs__foot, .works__close').forEach(g => g.querySelectorAll('.btn.pre').forEach((b, k) => b.style.transitionDelay = (k * 110 + 150) + 'ms, ' + (k * 110 + 150) + 'ms, 0ms, 0ms, 0ms, 0ms, 0ms'));
})();
