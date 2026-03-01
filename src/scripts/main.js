import '../css/style.css';

const observeAnimations = () => {
  const targets = document.querySelectorAll('[class*="a-fade-in"], .a-stagger');

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
  const containers = document.querySelectorAll('.a-stagger');

  containers.forEach((container) => {
    Array.from(container.children).forEach((child, index) => {
      child.style.setProperty('--_delay', `${index * 0.1}s`);
    });
  });
};

const markCurrentNav = () => {
  const path = window.location.pathname;
  const links = document.querySelectorAll('.p-header__nav-link');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (path === href || (href !== '/' && path.startsWith(href))) {
      link.classList.add('is-current');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  markCurrentNav();
  initStaggerDelays();
  observeAnimations();
});
