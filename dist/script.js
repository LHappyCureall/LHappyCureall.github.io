(() => {
  'use strict';
  const root = document.documentElement;
  const languageButtons = [...document.querySelectorAll('[data-language]')];
  const languageLabels = {
    en: { profile: 'Profile', sections: 'Sections', language: 'Language', pause: 'Pause animations', play: 'Play animations' },
    'zh-CN': { profile: '个人资料', sections: '页面导航', language: '语言', pause: '暂停动画', play: '播放动画' }
  };
  function setLanguage(language) {
    if (!languageLabels[language]) language = 'en';
    root.lang = language;
    languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.querySelector('.profile').setAttribute('aria-label', languageLabels[language].profile);
    document.querySelector('.section-nav').setAttribute('aria-label', languageLabels[language].sections);
    document.querySelector('.language-switch').setAttribute('aria-label', languageLabels[language].language);
    try { localStorage.setItem('haochen-homepage-language', language); } catch (_) { /* Storage is optional. */ }
  }
  let savedLanguage;
  try { savedLanguage = localStorage.getItem('haochen-homepage-language'); } catch (_) { /* Keep the English default. */ }
  setLanguage(savedLanguage || 'en');
  languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));

  const navigationLinks = [...document.querySelectorAll('.section-nav a')];
  const sections = navigationLinks.map(link => document.querySelector(link.getAttribute('href')));
  let pending = false;
  function updateNavigation() {
    let activeSection = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 135) activeSection = section;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 12) activeSection = sections[sections.length - 1];
    navigationLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${activeSection.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    pending = false;
  }
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; window.requestAnimationFrame(updateNavigation); }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();

  const profile = document.querySelector('.profile');
  function positionProfile() {
    const top = Math.min(28, window.innerHeight - profile.offsetHeight - 28);
    profile.style.setProperty('--profile-top', `${top}px`);
  }
  window.addEventListener('resize', positionProfile);
  if ('ResizeObserver' in window) new ResizeObserver(positionProfile).observe(profile);
  positionProfile();

  const animationButton = document.querySelector('#animation-toggle');
  const simulationImages = [...document.querySelectorAll('[data-animation]')];
  simulationImages.forEach(image => { image.dataset.poster = image.getAttribute('src'); });
  animationButton.hidden = false;
  let animationsPlaying = false;
  animationButton.addEventListener('click', () => {
    animationsPlaying = !animationsPlaying;
    simulationImages.forEach(image => { image.src = animationsPlaying ? image.dataset.animation : image.dataset.poster; });
    animationButton.setAttribute('aria-pressed', String(animationsPlaying));
    for (const language of ['en', 'zh-CN']) {
      animationButton.querySelector(`[lang="${language}"]`).textContent = languageLabels[language][animationsPlaying ? 'pause' : 'play'];
    }
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
