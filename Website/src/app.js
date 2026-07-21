import { initializeNavigation } from './utils/navigation.js';
import { animateTerminal, triggerAnimations, animateSkillBars } from './utils/animations.js';
import { initializeModals, initializeProjectUI } from './utils/projects.js';
import { initializeForm } from './utils/contact.js';
import { initParticles } from './utils/particles.js';
import { initializeAboutPage } from './utils/about.js';

function initializeApp() {
  console.log('🚀 Portfolio redesign loaded');

  // Initialize particle background
  initParticles();

  // Animate terminal
  animateTerminal();

  // Trigger animations for the initial page
  setTimeout(() => triggerAnimations(), 300);

  // Navigation
  initializeNavigation();
  initializeProjectUI();
  initializeModals();
  initializeForm();

  // Navbar scroll effect
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // Re-trigger fade-up elements on scroll
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => observer.observe(el));

  // Animate skill bars
  animateSkillBars();

  if (document.getElementById('tools-spiderweb')) {
    initializeAboutPage();
  }

  // --- Mode switch (travail/détente) ---
  const modeToggle = document.getElementById('mode-toggle');
  const body = document.body;
  const divider = document.querySelector('.personal-divider');

  if (modeToggle && divider) {
    const updateMode = () => {
      const dividerTop = divider.getBoundingClientRect().top + window.pageYOffset;
      const shouldActivate = window.scrollY > dividerTop - window.innerHeight * 0.5;
      if (modeToggle.checked !== shouldActivate) {
        modeToggle.checked = shouldActivate;
        body.classList.toggle('relaxed', shouldActivate);
      }
    };
    updateMode();
    window.addEventListener('scroll', () => requestAnimationFrame(updateMode));
    window.addEventListener('resize', () => requestAnimationFrame(updateMode));
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);
