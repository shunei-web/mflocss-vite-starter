const observeAnimations = () => {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll('[data-animate]:not([data-no-observe]), [data-stagger]');

  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  targets.forEach((target) => observer.observe(target));
};

const initStaggerDelays = () => {

  const containers = document.querySelectorAll('[data-stagger]');

  containers.forEach((container) => {
    Array.from(container.children).forEach((child, index) => {
      child.style.setProperty('--stagger-delay', `${index * 0.15}s`);
    });
  });
};

const markCurrentNav = () => {
  const path = window.location.pathname;
  const links = document.querySelectorAll('[data-nav-link]');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (path === href || (href !== '/' && path.startsWith(href))) {
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
    }
  });
};

const initBackToTop = () => {
  const button = document.querySelector('[data-back-to-top]');
  if (!button) return;

  const toggleVisibility = () => {
    if (window.scrollY >= 300) {
      button.classList.add('is-active');
    } else {
      button.classList.remove('is-active');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  button.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0 });
  });
};

const initMobileNav = () => {
  const button = document.querySelector('[data-hamburger]');
  const nav = document.querySelector('[data-nav]');

  if (!button || !nav) return;

  const focusableSelector = 'a[href], button:not([disabled])';

  const closeNav = () => {
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'メニューを開く');
    nav.classList.remove('is-open');
  };

  const trapFocus = (e) => {
    if (e.key !== 'Tab') return;

    const focusable = [button, ...nav.querySelectorAll(focusableSelector)];
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeNav();
    } else {
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'メニューを閉じる');
      nav.classList.add('is-open');
      nav.querySelector('a')?.focus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!nav.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeNav();
      button.focus();
      return;
    }

    trapFocus(e);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  markCurrentNav();
  initMobileNav();
  initBackToTop();
  initStaggerDelays();
  observeAnimations();
});
