(() => {
  // ---------- LOADER ----------
  const loader = document.getElementById('loader');
  const num = document.getElementById('loaderNum');
  let pct = 0;
  const tick = () => {
    pct += Math.random() * 12 + 4;
    if (pct >= 100) {
      pct = 100;
      num.textContent = 100;
      setTimeout(() => {
        loader.classList.add('is-done');
        startReveals();
      }, 350);
      return;
    }
    num.textContent = Math.floor(pct);
    setTimeout(tick, 90 + Math.random() * 120);
  };
  window.addEventListener('load', () => setTimeout(tick, 120));

  // ---------- CUSTOM CURSOR ----------
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`; });
  const raf = () => {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  };
  raf();
  document.querySelectorAll('a,button,.svc__row,.skill,.proj__media').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  // ---------- STICKY NAV ----------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-stuck'); else nav.classList.remove('is-stuck');
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
    });
  });

  // ---------- INTERSECTION REVEALS ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const el = en.target;
        // stagger children reveals inside the same block
        const parent = el.closest('section, .hero, .contact');
        if (parent && !parent.dataset.staggered) {
          parent.dataset.staggered = '1';
          const items = parent.querySelectorAll('.reveal, .reveal-up, .reveal-media');
          items.forEach((it, i) => {
            setTimeout(() => it.classList.add('is-in'), i * 80);
          });
        } else {
          el.classList.add('is-in');
        }
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  function startReveals() {
    document.querySelectorAll('.reveal, .reveal-up, .reveal-media').forEach(el => io.observe(el));
    // counters
    document.querySelectorAll('.stat__num').forEach(el => {
      const target = +el.dataset.count;
      const cio = new IntersectionObserver((es) => {
        es.forEach(e => {
          if (e.isIntersecting) {
            let n = 0;
            const step = Math.max(1, Math.round(target / 60));
            const int = setInterval(() => {
              n += step;
              if (n >= target) { n = target; clearInterval(int); }
              el.textContent = n;
            }, 24);
            cio.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      cio.observe(el);
    });
  }

  // ---------- MAGNETIC BUTTONS ----------
  document.querySelectorAll('.btn, .nav__cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // ---------- PARALLAX PROJECT IMAGES ----------
  const imgs = document.querySelectorAll('.proj__img');
  window.addEventListener('scroll', () => {
    imgs.forEach(img => {
      const r = img.getBoundingClientRect();
      const mid = r.top + r.height / 2 - window.innerHeight / 2;
      const p = Math.max(-1, Math.min(1, -mid / window.innerHeight));
      img.style.transform = `scale(1.1) translateY(${p * 30}px)`;
    });
  }, { passive: true });
})();
