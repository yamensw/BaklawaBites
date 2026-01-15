(() => {
  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    // Trigger hero glass fade-in.
    document.body.classList.add('loaded');

    // Reveal animations (safe even if elements are missing).
    const revealEls = Array.from(document.querySelectorAll('.card'));
    if (!revealEls.length || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('inView'));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('inView');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealEls.forEach((el) => obs.observe(el));

    // Smooth scroll for in-page anchors.
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });
})();
