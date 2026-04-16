(function() {
  'use strict';

  // ── SCROLL PROGRESS BAR ──
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  // ── SCROLL SPY ──
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const navElement = document.querySelector('.nav');
  const sections = [];
  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, link });
  });

  function updateScrollSpy() {
    const navOffset = navElement ? navElement.offsetHeight + 64 : 120;
    const scrollY = window.scrollY + navOffset;
    let current = sections[0];
    for (const s of sections) {
      if (s.el.offsetTop <= scrollY) current = s;
    }
    navLinks.forEach(l => {
      l.classList.remove('active');
      l.removeAttribute('aria-current');
    });
    if (current) {
      current.link.classList.add('active');
      current.link.setAttribute('aria-current', 'page');
    }
  }

  // ── BACK TO TOP ──
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Throttled scroll handler
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateScrollSpy();
        updateBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ── REVEAL ON SCROLL ──
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // ── HAMBURGER ──
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const open = navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinksEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // ── SEARCH ──
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchCount = document.getElementById('searchCount');
  let searchOpen = false;

  function toggleSearch() {
    searchOpen = !searchOpen;
    searchBar.classList.toggle('visible', searchOpen);
    if (searchOpen) {
      searchInput.focus();
    } else {
      searchInput.value = '';
      clearSearch();
    }
  }

  searchToggle.addEventListener('click', toggleSearch);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleSearch();
    }
    if (e.key === 'Escape' && searchOpen) {
      toggleSearch();
    }
  });

  function clearSearch() {
    document.querySelectorAll('.search-hidden').forEach(el => el.classList.remove('search-hidden'));
    document.querySelectorAll('mark').forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
    searchCount.textContent = '';
  }

  function highlightText(node, term) {
    if (node.nodeType === 3) {
      const idx = node.textContent.toLowerCase().indexOf(term);
      if (idx >= 0) {
        const span = document.createElement('mark');
        const mid = node.splitText(idx);
        mid.splitText(term.length);
        span.appendChild(mid.cloneNode(true));
        mid.parentNode.replaceChild(span, mid);
        return 1;
      }
      return 0;
    }
    if (node.nodeType === 1 && node.tagName !== 'MARK' && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      let count = 0;
      for (let i = 0; i < node.childNodes.length; i++) {
        count += highlightText(node.childNodes[i], term);
      }
      return count;
    }
    return 0;
  }

  let searchDebounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(performSearch, 200);
  });

  function performSearch() {
    clearSearch();
    const term = searchInput.value.trim().toLowerCase();
    if (!term) return;

    let matchCount = 0;

    // Search table rows
    document.querySelectorAll('.cmd-table tbody tr').forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(term)) {
        matchCount++;
        highlightText(row, term);
      } else {
        row.classList.add('search-hidden');
      }
    });

    // Search marker cards
    document.querySelectorAll('.marker-card').forEach(card => {
      const text = (card.textContent + ' ' + (card.dataset.search || '')).toLowerCase();
      if (text.includes(term)) {
        matchCount++;
        highlightText(card, term);
      } else {
        card.classList.add('search-hidden');
      }
    });

    if (term) {
      searchCount.textContent = matchCount === 0
        ? 'No matches found'
        : matchCount + ' match' + (matchCount !== 1 ? 'es' : '') + ' found';
    }
  }

  // Init
  updateProgress();
  updateScrollSpy();
})();
