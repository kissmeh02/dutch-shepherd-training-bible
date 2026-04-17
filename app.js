(function() {
  'use strict';

  // Add compact layout automatically when embedded in an iframe (ex: Notion).
  const isEmbeddedFrame = window.self !== window.top;
  const forceEmbedMode = new URLSearchParams(window.location.search).get('embed') === '1';
  if (isEmbeddedFrame || forceEmbedMode) {
    document.body.classList.add('embed-mode');
  }

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
  const commandJumpLinks = document.querySelectorAll('.command-jump-links a[href^="#"]');
  const spyLinks = [...navLinks, ...commandJumpLinks];
  const navElement = document.querySelector('.nav');
  const sections = [];
  const sectionIds = new Set();
  spyLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el && !sectionIds.has(id)) {
      sectionIds.add(id);
      sections.push({ id, el });
    }
  });

  function updateScrollSpy() {
    const navOffset = navElement ? navElement.offsetHeight + 64 : 120;
    const scrollY = window.scrollY + navOffset;
    let current = sections[0];
    for (const s of sections) {
      if (s.el.offsetTop <= scrollY) current = s;
    }
    spyLinks.forEach(l => {
      l.classList.remove('active');
      l.removeAttribute('aria-current');
    });
    if (current) {
      spyLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${current.id}`) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
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
  const commandJumpSelect = document.getElementById('commandJumpSelect');
  if (commandJumpSelect) {
    commandJumpSelect.addEventListener('change', () => {
      const targetId = commandJumpSelect.value;
      if (!targetId) return;
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      commandJumpSelect.value = '';
    });
  }

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

  // ── AUDIO COACH ──
  const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const audioState = {
    mode: 'both',
    rate: 0.95,
    trainerMode: false,
    preferMale: true,
    dutchVoiceUri: 'auto',
    englishVoiceUri: 'auto',
    lastPhrase: null,
    activeButton: null
  };
  const audioStorageKey = 'dsd-audio-coach-settings-v1';
  const synth = speechSupported ? window.speechSynthesis : null;
  const voiceState = { all: [], dutch: [], english: [], dutchMale: [], englishMale: [] };
  let commandDataset = { commands: [], markers: [] };
  let updateVoiceStatusUI = null;

  function loadAudioSettings() {
    try {
      const raw = localStorage.getItem(audioStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.mode === 'dutch' || parsed.mode === 'english' || parsed.mode === 'both') {
        audioState.mode = parsed.mode;
      } else if (typeof parsed.includeEnglish === 'boolean') {
        // Backward compatibility with old boolean setting.
        audioState.mode = parsed.includeEnglish ? 'both' : 'dutch';
      }
      if (typeof parsed.trainerMode === 'boolean') audioState.trainerMode = parsed.trainerMode;
      if (typeof parsed.preferMale === 'boolean') audioState.preferMale = parsed.preferMale;
      if (typeof parsed.dutchVoiceUri === 'string') audioState.dutchVoiceUri = parsed.dutchVoiceUri;
      if (typeof parsed.englishVoiceUri === 'string') audioState.englishVoiceUri = parsed.englishVoiceUri;
      if (typeof parsed.rate === 'number' && parsed.rate >= 0.7 && parsed.rate <= 1.2) audioState.rate = parsed.rate;
    } catch (_err) {
      // Ignore malformed settings and use defaults.
    }
  }

  function saveAudioSettings() {
    try {
      localStorage.setItem(audioStorageKey, JSON.stringify({
        mode: audioState.mode,
        rate: audioState.rate,
        trainerMode: audioState.trainerMode,
        preferMale: audioState.preferMale,
        dutchVoiceUri: audioState.dutchVoiceUri,
        englishVoiceUri: audioState.englishVoiceUri
      }));
    } catch (_err) {
      // Ignore storage failures (private mode, quota limits).
    }
  }

  async function loadCommandDataset() {
    try {
      const response = await fetch('commands-data.json', { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      if (!payload || !Array.isArray(payload.commands) || !Array.isArray(payload.markers)) return;
      commandDataset = {
        commands: payload.commands,
        markers: payload.markers
      };
    } catch (_err) {
      // Fail silently and fallback to DOM-driven behavior.
    }
  }

  function refreshVoices() {
    if (!speechSupported) return;
    voiceState.all = synth.getVoices();
    voiceState.dutch = voiceState.all.filter(v => v.lang.toLowerCase().startsWith('nl'));
    voiceState.english = voiceState.all.filter(v => v.lang.toLowerCase().startsWith('en'));
    voiceState.dutchMale = voiceState.dutch.filter(isLikelyMaleVoice);
    voiceState.englishMale = voiceState.english.filter(isLikelyMaleVoice);
    if (typeof updateVoiceStatusUI === 'function') updateVoiceStatusUI();
  }

  function isLikelyMaleVoice(voice) {
    const id = `${voice.name} ${voice.lang}`.toLowerCase();
    return /(male|man|david|george|thomas|maarten|xander|bart|willem|hans|bas|guy|daniel|paul)/.test(id);
  }

  function pickVoice(language) {
    if (!speechSupported) return null;

    const findByUri = (voices, uri) => {
      if (!uri || uri === 'auto') return null;
      return voices.find((voice) => voice.voiceURI === uri) || null;
    };

    if (language === 'nl-NL') {
      const explicitlyChosenDutch = findByUri(voiceState.dutch, audioState.dutchVoiceUri) || findByUri(voiceState.all, audioState.dutchVoiceUri);
      if (explicitlyChosenDutch) return explicitlyChosenDutch;
      if (audioState.preferMale && voiceState.dutchMale.length) return voiceState.dutchMale[0];
      return voiceState.dutch[0] || voiceState.english[0] || voiceState.all[0] || null;
    }
    const explicitlyChosenEnglish = findByUri(voiceState.english, audioState.englishVoiceUri) || findByUri(voiceState.all, audioState.englishVoiceUri);
    if (explicitlyChosenEnglish) return explicitlyChosenEnglish;
    if (audioState.preferMale && voiceState.englishMale.length) return voiceState.englishMale[0];
    return voiceState.english[0] || voiceState.all[0] || null;
  }

  function createUtterance(text, language) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = audioState.rate;
    const voice = pickVoice(language);
    if (voice) utterance.voice = voice;
    return utterance;
  }

  function voiceLabel(voice, fallback) {
    if (!voice) return fallback;
    return `${voice.name} (${voice.lang})`;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setActiveAudioButton(button) {
    if (audioState.activeButton) {
      audioState.activeButton.classList.remove('is-speaking');
    }
    audioState.activeButton = button || null;
    if (audioState.activeButton) {
      audioState.activeButton.classList.add('is-speaking');
    }
  }

  function clearActiveAudioButton() {
    setActiveAudioButton(null);
  }

  function speakPhrase(dutchText, englishText, originButton) {
    if (!speechSupported || !dutchText) return;

    const trimmedDutch = dutchText.trim();
    const trimmedEnglish = (englishText || '').trim();
    if (!trimmedDutch) return;

    synth.cancel();
    setActiveAudioButton(originButton || null);

    audioState.lastPhrase = {
      dutch: trimmedDutch,
      english: trimmedEnglish
    };

    const dutchUtterance = createUtterance(trimmedDutch, 'nl-NL');
    const hasEnglish = Boolean(trimmedEnglish);
    const mode = audioState.mode;
    const speakDutch = mode === 'dutch' || mode === 'both' || (mode === 'english' && !hasEnglish);
    const speakEnglish = (mode === 'english' || mode === 'both') && hasEnglish;

    if (!speakDutch && !speakEnglish) {
      clearActiveAudioButton();
      return;
    }

    dutchUtterance.onend = () => {
      if (!speakEnglish) {
        clearActiveAudioButton();
        return;
      }
      const englishUtterance = createUtterance(trimmedEnglish, 'en-US');
      englishUtterance.onend = clearActiveAudioButton;
      englishUtterance.onerror = clearActiveAudioButton;
      synth.speak(englishUtterance);
    };
    dutchUtterance.onerror = clearActiveAudioButton;

    if (speakDutch) {
      synth.speak(dutchUtterance);
      return;
    }

    const englishUtterance = createUtterance(trimmedEnglish, 'en-US');
    englishUtterance.onend = clearActiveAudioButton;
    englishUtterance.onerror = clearActiveAudioButton;
    synth.speak(englishUtterance);
  }

  function sanitizeDutchTerm(text) {
    return text.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function phraseKey(dutchText, englishText) {
    return `${(dutchText || '').toLowerCase().trim()}|${(englishText || '').toLowerCase().trim()}`;
  }

  function createAudioButton(labelText, dutchText, englishText) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'audio-play-btn';
    btn.setAttribute('aria-label', `Play pronunciation for ${labelText}`);
    btn.setAttribute('title', 'Play pronunciation');
    btn.dataset.dutch = dutchText;
    btn.dataset.english = englishText || '';
    btn.dataset.key = phraseKey(dutchText, englishText || '');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19 5a7 7 0 0 1 0 14"></path><path d="M15.5 8.5a3.5 3.5 0 0 1 0 7"></path></svg><span>Audio</span>';
    return btn;
  }

  function injectAudioButtons() {
    // Command tables
    document.querySelectorAll('.cmd-table tbody tr').forEach((row) => {
      const dutchCell = row.querySelector('.t-dutch');
      const englishCell = row.querySelector('.t-english');
      if (!dutchCell || dutchCell.querySelector('.audio-play-btn')) return;

      const dutchText = sanitizeDutchTerm(dutchCell.textContent);
      const englishText = englishCell ? englishCell.textContent.trim() : '';
      if (!dutchText) return;

      const btn = createAudioButton(dutchText, dutchText, englishText);
      dutchCell.appendChild(btn);
    });

    // Marker cards
    document.querySelectorAll('.marker-card').forEach((card) => {
      const word = card.querySelector('.m-word');
      const type = card.querySelector('.m-type');
      if (!word || word.querySelector('.audio-play-btn')) return;

      const dutchText = sanitizeDutchTerm(word.textContent.trim());
      const englishText = type ? type.textContent.trim() : '';
      if (!dutchText) return;

      const btn = createAudioButton(dutchText, dutchText, englishText);
      btn.classList.add('compact');
      word.appendChild(btn);
    });
  }

  function setupAudioCoach() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const audioToggle = document.createElement('button');
    audioToggle.type = 'button';
    audioToggle.className = 'search-toggle audio-toggle';
    audioToggle.id = 'audioToggle';
    audioToggle.setAttribute('aria-label', 'Toggle audio coach');
    audioToggle.setAttribute('title', 'Audio coach');
    audioToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19 5a7 7 0 0 1 0 14"></path></svg>';
    nav.insertBefore(audioToggle, hamburger);

    const panel = document.createElement('aside');
    panel.className = 'audio-coach';
    panel.id = 'audioCoach';
    panel.setAttribute('aria-label', 'Audio coach settings');
    panel.innerHTML = [
      '<div class="audio-coach-header">Audio Coach</div>',
      '<div class="audio-row audio-mode-row"><span>Mode</span><div class="audio-mode-group" role="radiogroup" aria-label="Audio playback mode">',
      '  <button type="button" class="audio-mode-btn" data-mode="dutch" role="radio">Dutch</button>',
      '  <button type="button" class="audio-mode-btn" data-mode="english" role="radio">English</button>',
      '  <button type="button" class="audio-mode-btn" data-mode="both" role="radio">Both</button>',
      '</div></div>',
      '<label class="audio-row trainer-row"><input type="checkbox" id="audioTrainerMode"> <span>Trainer mode (slow + both)</span></label>',
      '<label class="audio-row trainer-row"><input type="checkbox" id="audioPreferMale"> <span>Prefer male voice</span></label>',
      '<label class="audio-row"><span>Dutch voice</span><select id="audioDutchVoice" class="audio-select"></select></label>',
      '<label class="audio-row"><span>English voice</span><select id="audioEnglishVoice" class="audio-select"></select></label>',
      '<label class="audio-row audio-speed-row"><span>Speed</span> <input type="range" id="audioRate" min="0.7" max="1.2" step="0.05"></label>',
      '<div class="audio-voice-info" id="audioVoiceInfo" aria-live="polite"></div>',
      '<div class="audio-actions">',
      '  <button type="button" id="audioVoiceTest">Voice test</button>',
      '  <button type="button" id="audioRepeatLast">Repeat last</button>',
      '  <button type="button" id="audioRandom">Random command</button>',
      '</div>',
      '<div class="audio-hint">Tip: press <kbd>Alt</kbd> + <kbd>A</kbd> to repeat.</div>'
    ].join('');
    document.body.appendChild(panel);

    const modeButtons = Array.from(panel.querySelectorAll('.audio-mode-btn'));
    const trainerToggle = panel.querySelector('#audioTrainerMode');
    const preferMaleToggle = panel.querySelector('#audioPreferMale');
    const dutchVoiceSelect = panel.querySelector('#audioDutchVoice');
    const englishVoiceSelect = panel.querySelector('#audioEnglishVoice');
    const rateInput = panel.querySelector('#audioRate');
    const voiceInfo = panel.querySelector('#audioVoiceInfo');
    const voiceTestButton = panel.querySelector('#audioVoiceTest');
    const repeatButton = panel.querySelector('#audioRepeatLast');
    const randomButton = panel.querySelector('#audioRandom');

    function renderModeButtons() {
      modeButtons.forEach((btn) => {
        const isActive = btn.dataset.mode === audioState.mode;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });
    }

    function renderVoiceInfo() {
      const dutchVoice = pickVoice('nl-NL');
      const englishVoice = pickVoice('en-US');
      const maleTag = audioState.preferMale ? ' | male preferred' : '';
      voiceInfo.textContent = `NL: ${voiceLabel(dutchVoice, 'System default')} | EN: ${voiceLabel(englishVoice, 'System default')}${maleTag}`;
    }

    function populateVoiceSelect(select, voices, selectedUri) {
      const previous = selectedUri || 'auto';
      const options = ['<option value="auto">Auto select</option>']
        .concat(voices.map((voice) => `<option value="${escapeHtml(voice.voiceURI)}">${escapeHtml(voice.name)} (${escapeHtml(voice.lang)})</option>`));
      select.innerHTML = options.join('');
      if (voices.some((voice) => voice.voiceURI === previous)) {
        select.value = previous;
      } else {
        select.value = 'auto';
      }
    }

    function renderVoiceSelectors() {
      populateVoiceSelect(dutchVoiceSelect, voiceState.dutch.length ? voiceState.dutch : voiceState.all, audioState.dutchVoiceUri);
      populateVoiceSelect(englishVoiceSelect, voiceState.english.length ? voiceState.english : voiceState.all, audioState.englishVoiceUri);
    }

    function applyTrainerPreset(enabled) {
      audioState.trainerMode = enabled;
      if (enabled) {
        audioState.mode = 'both';
        audioState.rate = 0.8;
      }
      renderModeButtons();
      trainerToggle.checked = audioState.trainerMode;
      rateInput.value = String(audioState.rate);
      saveAudioSettings();
    }

    renderModeButtons();
    trainerToggle.checked = audioState.trainerMode;
    preferMaleToggle.checked = audioState.preferMale;
    rateInput.value = String(audioState.rate);
    updateVoiceStatusUI = renderVoiceInfo;
    renderVoiceSelectors();
    renderVoiceInfo();

    audioToggle.addEventListener('click', () => {
      panel.classList.toggle('visible');
    });

    modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextMode = btn.dataset.mode;
        if (!nextMode || nextMode === audioState.mode) return;
        audioState.mode = nextMode;
        audioState.trainerMode = false;
        trainerToggle.checked = false;
        renderModeButtons();
        saveAudioSettings();
      });
    });

    trainerToggle.addEventListener('change', () => {
      applyTrainerPreset(trainerToggle.checked);
    });

    preferMaleToggle.addEventListener('change', () => {
      audioState.preferMale = preferMaleToggle.checked;
      saveAudioSettings();
      renderVoiceInfo();
    });

    dutchVoiceSelect.addEventListener('change', () => {
      audioState.dutchVoiceUri = dutchVoiceSelect.value || 'auto';
      saveAudioSettings();
      renderVoiceInfo();
    });

    englishVoiceSelect.addEventListener('change', () => {
      audioState.englishVoiceUri = englishVoiceSelect.value || 'auto';
      saveAudioSettings();
      renderVoiceInfo();
    });

    rateInput.addEventListener('input', () => {
      audioState.rate = Number(rateInput.value);
      if (audioState.trainerMode && Math.abs(audioState.rate - 0.8) > 0.001) {
        audioState.trainerMode = false;
        trainerToggle.checked = false;
      }
      saveAudioSettings();
    });

    voiceTestButton.addEventListener('click', () => {
      speakPhrase('Goed zo', 'Good job', null);
    });

    repeatButton.addEventListener('click', () => {
      if (!audioState.lastPhrase) return;
      speakPhrase(audioState.lastPhrase.dutch, audioState.lastPhrase.english, null);
    });

    randomButton.addEventListener('click', () => {
      const datasetItems = commandDataset.commands
        .map((item) => ({
          dutch: item.voiceDutch || item.dutch || '',
          english: item.english || ''
        }))
        .concat(commandDataset.markers.map((item) => ({
          dutch: item.voiceDutch || item.dutch || '',
          english: item.english || ''
        })))
        .filter((item) => item.dutch);

      const domButtons = Array.from(document.querySelectorAll('.audio-play-btn'));
      if (datasetItems.length > 0) {
        const pick = datasetItems[Math.floor(Math.random() * datasetItems.length)];
        const key = phraseKey(pick.dutch, pick.english);
        const randomBtn = (window.CSS && typeof window.CSS.escape === 'function')
          ? document.querySelector(`.audio-play-btn[data-key="${window.CSS.escape(key)}"]`)
          : domButtons.find((btn) => btn.dataset.key === key);
        if (randomBtn) {
          randomBtn.closest('tr, .marker-card')?.classList.add('audio-target-flash');
          setTimeout(() => {
            randomBtn.closest('tr, .marker-card')?.classList.remove('audio-target-flash');
          }, 1200);
          randomBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          speakPhrase(randomBtn.dataset.dutch || '', randomBtn.dataset.english || '', randomBtn);
          return;
        }
        speakPhrase(pick.dutch, pick.english, null);
        return;
      }

      if (domButtons.length === 0) return;
      const randomBtn = domButtons[Math.floor(Math.random() * domButtons.length)];
      randomBtn.closest('tr, .marker-card')?.classList.add('audio-target-flash');
      setTimeout(() => {
        randomBtn.closest('tr, .marker-card')?.classList.remove('audio-target-flash');
      }, 1200);
      randomBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      speakPhrase(randomBtn.dataset.dutch || '', randomBtn.dataset.english || '', randomBtn);
    });

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== audioToggle && !audioToggle.contains(e.target)) {
        panel.classList.remove('visible');
      }
    });

    if (!speechSupported) {
      audioToggle.disabled = true;
      audioToggle.title = 'Speech synthesis is not supported in this browser';
      panel.classList.add('visible');
      panel.innerHTML = '<div class="audio-coach-header">Audio Coach</div><div class="audio-hint">Speech synthesis is not available in this browser. Try Chrome, Edge, or Safari.</div>';
      updateVoiceStatusUI = null;
    }

    updateVoiceStatusUI = () => {
      renderVoiceSelectors();
      renderVoiceInfo();
    };
  }

  if (speechSupported) {
    refreshVoices();
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = refreshVoices;
    }
  }

  loadAudioSettings();
  injectAudioButtons();
  loadCommandDataset();
  setupAudioCoach();

  document.addEventListener('click', (e) => {
    const audioButton = e.target.closest('.audio-play-btn');
    if (!audioButton) return;
    speakPhrase(audioButton.dataset.dutch || '', audioButton.dataset.english || '', audioButton);
  });

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'a' && audioState.lastPhrase) {
      e.preventDefault();
      speakPhrase(audioState.lastPhrase.dutch, audioState.lastPhrase.english, null);
    }
  });

  // Init
  updateProgress();
  updateScrollSpy();
})();
