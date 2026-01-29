const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Footer year
(() => {
  const y = new Date().getFullYear();
  const el = $("#footerText");
  if (el) el.textContent = `© ${y} MD. Asaduzzaman Rony. All rights reserved.`;
})();

// Theme toggle (persist)
(() => {
  const body = document.body;
  const btn = $(".themeBtn");
  const icon = $("#themeIcon");
  const KEY = "rony_theme";

  const apply = (mode) => {
    const isLight = mode === "light";
    body.classList.toggle("light", isLight);
    if (icon) icon.textContent = isLight ? "☀" : "☾";
  };

  apply(localStorage.getItem(KEY) || "dark");

  btn?.addEventListener("click", () => {
    const next = body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem(KEY, next);
    apply(next);
  });
})();

// Mobile menu
(() => {
  const toggle = $(".nav__toggle");
  const links = $(".nav__links");

  const setOpen = (open) => {
    links?.classList.toggle("is-open", open);
    toggle?.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle?.addEventListener("click", () => {
    setOpen(!links.classList.contains("is-open"));
  });

  $$(".nav__link").forEach(a => a.addEventListener("click", () => setOpen(false)));

  document.addEventListener("click", (e) => {
    if (!links || !toggle) return;
    const inside = links.contains(e.target) || toggle.contains(e.target);
    if (!inside) setOpen(false);
  });
})();

// Smooth scroll
(() => {
  $$(".nav__link, .brand").forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

// Active section glow
(() => {
  const sections = $$(".glowSection");
  const links = $$(".nav__link");

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
    sections.forEach(s => s.classList.toggle("is-glowing", s.id === id));
  };

  const obs = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(visible.target.id);
  }, {
    threshold: [0.18, 0.3, 0.45, 0.6],
    rootMargin: "-18% 0px -55% 0px"
  });

  sections.forEach(s => obs.observe(s));

  links.forEach(a => {
    const id = a.dataset.target;
    const sec = id ? document.getElementById(id) : null;
    if (!sec) return;

    a.addEventListener("mouseenter", () => sec.classList.add("is-glowing"));
    a.addEventListener("mouseleave", () => {
      const activeId = $(".nav__link.active")?.dataset.target;
      if (activeId !== id) sec.classList.remove("is-glowing");
    });
  });
})();

// Hero picture rotate + modal sync
(() => {
  const img = $("#profilePic");
  const modalPic = $("#modalPic");
  if (!img) return;

  let i = 1;
  const total = 7;

  for (let k = 1; k <= total; k++) {
    const im = new Image();
    im.src = `image/pic${k}.jpg`;
  }

  const setPic = (n) => {
    img.style.opacity = "0";
    setTimeout(() => {
      img.src = `image/pic${n}.jpg`;
      img.onload = () => {
        img.style.opacity = "1";
        if (modalPic) modalPic.src = img.src;
      };
    }, 240);
  };

  if (modalPic) modalPic.src = img.src;

  setInterval(() => {
    i = i + 1;
    if (i > total) i = 1;
    setPic(i);
  }, 2800);
})();

// Name letter-by-letter typing
(() => {
  const el = $("#nameType");
  if (!el) return;

  const text = "MD. ASADUZZAMAN RONY";
  let idx = 0;
  el.textContent = "";

  const tick = () => {
    if (idx >= text.length) return;
    el.textContent += text[idx];
    idx += 1;
    setTimeout(tick, 90);
  };

  setTimeout(tick, 250);
})();

// Modals (profile + cert)
(() => {
  const profileModal = $("#profileModal");
  const certModal = $("#certModal");
  const certBig = $("#certBig");

  const openModal = (m) => {
    if (!m) return;
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = (m) => {
    if (!m) return;
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  $(".hero__picBtn")?.addEventListener("click", () => openModal(profileModal));

  $$(".certCard").forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-cert");
      if (!src || !certBig) return;
      certBig.src = src;
      openModal(certModal);
    });
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const key = t.getAttribute("data-close");
    if (key === "profile") closeModal(profileModal);
    if (key === "cert") closeModal(certModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (profileModal?.classList.contains("is-open")) closeModal(profileModal);
    if (certModal?.classList.contains("is-open")) closeModal(certModal);
  });
})();

// Projects: mobile tap flip toggle (tap again = unflip)
(() => {
  const cards = $$(".flipCard");
  if (!cards.length) return;

  const isCoarse = window.matchMedia && window.matchMedia("(hover: none)").matches;

  const toggleCard = (card) => {
    card.classList.toggle("is-flipped");
  };

  const closeOthers = (current) => {
    cards.forEach(c => { if (c !== current) c.classList.remove("is-flipped"); });
  };

  cards.forEach(card => {
    // prevent toggle when clicking the View Code button
    const btn = $(".btn", card);
    btn?.addEventListener("click", (e) => e.stopPropagation());

    // on touch devices: click toggles
    card.addEventListener("click", () => {
      if (!isCoarse) return;
      const willFlip = !card.classList.contains("is-flipped");
      closeOthers(card);
      if (willFlip) card.classList.add("is-flipped");
      else card.classList.remove("is-flipped");
    });

    // keyboard support
    card.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      closeOthers(card);
      toggleCard(card);
    });
  });

  // tap outside closes flipped
  document.addEventListener("click", (e) => {
    if (!isCoarse) return;
    const inside = e.target instanceof HTMLElement && e.target.closest(".flipCard");
    if (!inside) cards.forEach(c => c.classList.remove("is-flipped"));
  });
})();
