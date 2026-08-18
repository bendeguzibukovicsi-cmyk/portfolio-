import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import "../portfolio.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bendegúz Bukovics — Web Designer & Developer" },
      { name: "description", content: "Bendegúz Bukovics builds modern websites that help businesses grow. Based in Budapest, Hungary." },
      { property: "og:title", content: "Bendegúz Bukovics — Web Designer & Developer" },
      { property: "og:description", content: "Modern websites built with Lovable, Framer, Webflow, WordPress and custom code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Loader
    let pct = 0;
    const tick = () => {
      pct += Math.random() * 14 + 6;
      if (pct >= 100) {
        pct = 100;
        if (numRef.current) numRef.current.textContent = "100";
        setTimeout(() => {
          loaderRef.current?.classList.add("is-done");
          startReveals();
        }, 300);
        return;
      }
      if (numRef.current) numRef.current.textContent = String(Math.floor(pct));
      setTimeout(tick, 80 + Math.random() * 100);
    };
    const loaderTimer = setTimeout(tick, 150);

    // Cursor
    let cx = 0, cy = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
    };
    window.addEventListener("mousemove", onMove);
    let rafId = 0;
    const raf = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(raf);
    };
    raf();

    const hoverables = document.querySelectorAll("a,button,.svc__row,.skill,.proj__media");
    const onEnter = () => cursorRef.current?.classList.add("is-hover");
    const onLeave = () => cursorRef.current?.classList.remove("is-hover");
    hoverables.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // Sticky nav
    const onScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 40) navRef.current.classList.add("is-stuck");
      else navRef.current.classList.remove("is-stuck");
      // parallax
      document.querySelectorAll<HTMLElement>(".proj__img").forEach(img => {
        const r = img.getBoundingClientRect();
        const mid = r.top + r.height / 2 - window.innerHeight / 2;
        const p = Math.max(-1, Math.min(1, -mid / window.innerHeight));
        img.style.transform = `scale(1.1) translateY(${p * 30}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Smooth scroll
    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const onAnchor = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const id = a.getAttribute("href") || "";
      if (id.length < 2) return;
      const t = document.querySelector(id) as HTMLElement | null;
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 20, behavior: "smooth" });
    };
    anchors.forEach(a => a.addEventListener("click", onAnchor));

    // Magnetic buttons
    const magnets = document.querySelectorAll<HTMLElement>(".btn, .nav__cta");
    const magMove = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement;
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    };
    const magLeave = (e: MouseEvent) => { (e.currentTarget as HTMLElement).style.transform = ""; };
    magnets.forEach(b => {
      b.addEventListener("mousemove", magMove as EventListener);
      b.addEventListener("mouseleave", magLeave as EventListener);
    });

    // Reveals
    let io: IntersectionObserver | null = null;
    function startReveals() {
      io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement;
            const parent = el.closest("section, .hero, .contact") as HTMLElement | null;
            if (parent && !parent.dataset.staggered) {
              parent.dataset.staggered = "1";
              const items = parent.querySelectorAll<HTMLElement>(".reveal, .reveal-up, .reveal-media");
              items.forEach((it, i) => setTimeout(() => it.classList.add("is-in"), i * 70));
            } else {
              el.classList.add("is-in");
            }
            io!.unobserve(el);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".reveal, .reveal-up, .reveal-media").forEach(el => io!.observe(el));

      document.querySelectorAll<HTMLElement>(".stat__num").forEach(el => {
        const target = +(el.dataset.count || "0");
        const cio = new IntersectionObserver(es => {
          es.forEach(e => {
            if (e.isIntersecting) {
              let n = 0;
              const step = Math.max(1, Math.round(target / 60));
              const int = setInterval(() => {
                n += step;
                if (n >= target) { n = target; clearInterval(int); }
                el.textContent = String(n);
              }, 24);
              cio.unobserve(el);
            }
          });
        }, { threshold: 0.4 });
        cio.observe(el);
      });
    }

    return () => {
      clearTimeout(loaderTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      hoverables.forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      anchors.forEach(a => a.removeEventListener("click", onAnchor));
      magnets.forEach(b => {
        b.removeEventListener("mousemove", magMove as EventListener);
        b.removeEventListener("mouseleave", magLeave as EventListener);
      });
      io?.disconnect();
    };
  }, []);

  return (
    <div className="pf">
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-dot" ref={dotRef} />

      <div className="loader" ref={loaderRef}>
        <div className="loader__inner">
          <span className="loader__num" ref={numRef}>0</span>
          <span className="loader__pct">%</span>
        </div>
      </div>

      <header className="nav" ref={navRef} id="nav">
        <a href="#top" className="nav__brand">
          <span className="nav__mark">BB</span>
          <span className="nav__name">Bendegúz Bukovics</span>
        </a>
        <nav className="nav__links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="nav__cta">
          <span>Let's talk</span>
          <span className="nav__dot" />
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__meta">
            <span className="tag"><span className="tag__dot" />Available for Q1 2026</span>
            <span className="hero__loc">Budapest · HU</span>
          </div>

          <h1 className="hero__title">
            <span className="line"><span className="reveal">I&nbsp;build</span></span>
            <span className="line"><span className="reveal">websites <em>that&nbsp;help</em></span></span>
            <span className="line"><span className="reveal">businesses <span className="hero__amp">grow.</span></span></span>
          </h1>

          <div className="hero__foot">
            <p className="hero__sub reveal-up">
              Modern websites crafted with Lovable, Framer, Webflow, WordPress and custom code — designed for speed, clarity and conversion.
            </p>
            <div className="hero__actions reveal-up">
              <a href="#work" className="btn btn--primary">
                <span>View Projects</span>
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
              </a>
              <a href="#contact" className="btn btn--ghost"><span>Contact Me</span></a>
            </div>
          </div>

          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              {Array.from({ length: 2 }).map((_, i) => (
                <span key={i} className="marquee__group">
                  <span>Web Design</span><span>·</span><span>Development</span><span>·</span><span>Framer</span><span>·</span><span>Webflow</span><span>·</span><span>Lovable</span><span>·</span><span>WordPress</span><span>·</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <div className="section__head">
            <span className="eyebrow">01 — About</span>
            <h2 className="section__title reveal-up">
              A studio-of-one focused on <em>clean design</em>, real speed and websites that quietly do their job.
            </h2>
          </div>
          <div className="about__grid">
            <div className="about__col reveal-up">
              <p>I'm a web designer and developer building modern websites for local businesses across Europe. Every project starts with the same question — how does this site actually help the business grow?</p>
              <p>From the first sketch to the last line of CSS, I care about typography, rhythm and pace. Sites should feel calm, load instantly, and turn visitors into customers.</p>
            </div>
            <div className="about__col reveal-up">
              <p>I use AI-native tools like Lovable to move quickly without cutting corners, and reach for Framer, Webflow, WordPress or custom code depending on what the project truly needs.</p>
              <p>The result: premium websites, delivered in weeks — not months.</p>
            </div>
          </div>
          <div className="stats">
            <div className="stat reveal-up"><span className="stat__num" data-count="40">0</span><span className="stat__label">Projects shipped</span></div>
            <div className="stat reveal-up"><span className="stat__num" data-count="12">0</span><span className="stat__label">Happy clients</span></div>
            <div className="stat reveal-up"><span className="stat__num" data-count="98">0</span><span className="stat__label">Avg. PageSpeed</span></div>
            <div className="stat reveal-up"><span className="stat__num" data-count="4">0</span><span className="stat__label">Years crafting</span></div>
          </div>
        </section>

        <section className="services" id="services">
          <div className="section__head">
            <span className="eyebrow">02 — Services</span>
            <h2 className="section__title reveal-up">Everything a modern business needs to <em>show up</em> online.</h2>
          </div>
          <ul className="svc">
            {[
              ["01","Website Design","Editorial, brand-driven design systems."],
              ["02","Business Websites","Multi-page sites tuned for trust."],
              ["03","Landing Pages","Focused pages that convert traffic."],
              ["04","SEO Optimization","Technical + on-page fundamentals."],
              ["05","Website Maintenance","Care plans, updates and monitoring."],
              ["06","AI Integrations","Chat, automations, content workflows."],
            ].map(([n,name,desc]) => (
              <li className="svc__row" key={n}>
                <span className="svc__num">/{n}</span>
                <span className="svc__name">{name}</span>
                <span className="svc__desc">{desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="work" id="work">
          <div className="section__head">
            <span className="eyebrow">03 — Selected Work</span>
            <h2 className="section__title reveal-up">Recent projects & <em>concepts.</em></h2>
          </div>

          {[
            { i:"01", title:"SwimX", desc:"Modern website for a swimming club with responsive design and clean branding.", year:"2025", tags:["Framer","Branding","Sports"], img:"https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600&q=80&auto=format&fit=crop", side:"left" },
            { i:"02", title:"Barber Studio", desc:"Premium website concept for a modern barber shop.", year:"2025", tags:["Webflow","Concept","Booking"], img:"https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&q=80&auto=format&fit=crop", side:"right" },
            { i:"03", title:"Fitness Club", desc:"Modern gym and fitness website focused on membership growth.", year:"2024", tags:["Lovable","Concept","Growth"], img:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&auto=format&fit=crop", side:"left" },
            { i:"04", title:"Beauty Salon", desc:"Luxury beauty salon website with online booking.", year:"2024", tags:["WordPress","Booking","Luxury"], img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80&auto=format&fit=crop", side:"right" },
          ].map(p => (
            <article key={p.i} className={`proj proj--${p.side}`}>
              <div className="proj__media reveal-media">
                <div className="proj__img" style={{ backgroundImage:`url('${p.img}')` }} />
                <span className="proj__year">{p.year}</span>
              </div>
              <div className="proj__info">
                <span className="proj__idx">{p.i} / 04</span>
                <h3 className="proj__title reveal-up">{p.title}</h3>
                <p className="proj__desc reveal-up">{p.desc}</p>
                <div className="proj__tags reveal-up">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
                <a href="#contact" className="btn btn--ghost proj__btn">
                  <span>Case study</span>
                  <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
                </a>
              </div>
            </article>
          ))}
        </section>

        <section className="skills">
          <div className="section__head">
            <span className="eyebrow">04 — Toolkit</span>
            <h2 className="section__title reveal-up">The stack behind the <em>craft.</em></h2>
          </div>
          <div className="skills__grid">
            {["Lovable","Framer","Webflow","WordPress","HTML","CSS","JavaScript","React"].map(s => (
              <div key={s} className="skill reveal-up"><span>{s}</span></div>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <span className="eyebrow">05 — Contact</span>
          <h2 className="contact__title">
            <span className="line"><span className="reveal">Let's build</span></span>
            <span className="line"><span className="reveal">something <em>great.</em></span></span>
          </h2>
          <a href="mailto:bendeguzi.bukovicsi@gmail.com" className="contact__mail reveal-up">bendeguzi.bukovicsi@gmail.com</a>
          <div className="reveal-up" style={{ display:"flex", justifyContent:"center" }}>
            <a href="mailto:bendeguzi.bukovicsi@gmail.com" className="btn btn--primary btn--lg">
              <span>Start a Project</span>
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
            </a>
          </div>
        </section>

        <footer className="foot">
          <div className="foot__col"><span className="foot__label">Based in</span><span>Budapest, Hungary</span></div>
          <div className="foot__col"><span className="foot__label">Elsewhere</span><a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">Dribbble</a></div>
          <div className="foot__col"><span className="foot__label">© 2026</span><span>Bendegúz Bukovics</span></div>
        </footer>
      </main>
    </div>
  );
}
