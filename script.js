/* ============================================================
   script.js — Barraca de Sandra
   Funcionalidades: menu mobile, scroll suave, animações,
   header dinâmico, botão voltar ao topo, ano automático.
   JavaScript puro (Vanilla JS), sem dependências externas.
   ============================================================ */

/* ---------- 1. ANO AUTOMÁTICO NO FOOTER ---------- */
// Insere o ano atual dinamicamente
(function setAno() {
  const el = document.getElementById('ano');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ---------- 2. MENU MOBILE (Hambúrguer) ---------- */
(function initMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  const links     = nav.querySelectorAll('.nav__link');

  // Abre/fecha o menu
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);

    // Acessibilidade: impede scroll do body quando menu está aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fecha o menu ao clicar em um link
  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Fecha o menu ao pressionar ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();


/* ---------- 3. HEADER — muda visual ao fazer scroll ---------- */
(function initHeader() {
  const header = document.getElementById('header');

  const toggleScrolled = () => {
    // Adiciona .scrolled quando o usuário rola mais de 60px
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  // Escuta o scroll com otimização via requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        toggleScrolled();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Verifica estado inicial (útil ao recarregar com scroll já feito)
  toggleScrolled();
})();


/* ---------- 4. SCROLL SUAVE (links de navegação) ---------- */
// O CSS já tem `scroll-behavior: smooth`, mas este código
// garante compatibilidade e um offset extra para o header fixo.
(function initSmoothScroll() {
  const HEADER_HEIGHT = 72; // px — ajuste se necessário

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // Ignora "#" simples

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const offsetTop = target.getBoundingClientRect().top
                        + window.scrollY
                        - HEADER_HEIGHT;

      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
})();


/* ---------- 5. ANIMAÇÃO FADE-IN AO ROLAR (Intersection Observer) ---------- */
(function initFadeIn() {
  // Seleciona todos os elementos com a classe .fade-in
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Para de observar após animar (performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   // Dispara quando 12% do elemento está visível
      rootMargin: '0px 0px -40px 0px' // Pequena margem negativa na base
    }
  );

  elements.forEach(el => observer.observe(el));

  // Fallback: se o browser não suportar IntersectionObserver, mostra tudo
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
  }
})();


/* ---------- 6. BOTÃO VOLTAR AO TOPO (flutuante) ---------- */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  // Mostra/esconde conforme a posição do scroll
  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  // Rola suavemente para o topo ao clicar
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Verifica estado inicial
  toggleVisibility();
})();


/* ---------- 7. ANIMAÇÃO EXTRA: pulsação no badge "Aberto agora!" ---------- */
(function initBadgePulse() {
  const badge = document.querySelector('.hero__badge');
  if (!badge) return;

  // Cria um keyframe de pulsação dinâmico via CSS inline
  badge.style.cssText += `
    animation: badgePulse 2.5s ease-in-out infinite;
  `;

  // Injeta o keyframe no <head>
  const style = document.createElement('style');
  style.textContent = `
    @keyframes badgePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,102,0,0); }
      50%       { box-shadow: 0 0 0 8px rgba(255,102,0,.15); }
    }
  `;
  document.head.appendChild(style);
})();


/* ---------- 8. LINK ATIVO NO MENU (highlight por seção visível) ---------- */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  const setActive = () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  // CSS para o link ativo (injeta dinamicamente)
  const style = document.createElement('style');
  style.textContent = `
    .nav__link.active { color: var(--laranja) !important; }
    .nav__link.active::after { width: 100% !important; }
  `;
  document.head.appendChild(style);

  window.addEventListener('scroll', setActive, { passive: true });
  setActive(); // Verifica estado inicial
})();
