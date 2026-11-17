(function () {
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');

  // 스크롤 시 헤더 배경
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // 모바일 메뉴
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

  // 대메뉴 드롭다운 (PC: 마우스 오버 / 모바일: 클릭 아코디언)
  const desktopMq = window.matchMedia('(min-width: 861px) and (hover: hover)');
  const subItems = nav.querySelectorAll('.has-sub');
  const setSub = (item, open) => {
    item.classList.toggle('is-open', open);
    item.querySelector('.nav-toggle').setAttribute('aria-expanded', String(open));
  };
  const closeAllSubs = () => subItems.forEach((item) => setSub(item, false));
  subItems.forEach((item) => {
    let closeTimer;
    item.addEventListener('mouseenter', () => {
      if (!desktopMq.matches) return;
      clearTimeout(closeTimer);
      closeAllSubs();
      setSub(item, true);
    });
    item.addEventListener('mouseleave', () => {
      if (!desktopMq.matches) return;
      closeTimer = setTimeout(() => setSub(item, false), 150);
    });
    // 키보드 포커스가 메뉴 밖으로 나가면 닫기
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) setSub(item, false);
    });
    // 키보드로 대메뉴에 포커스하면 서브 메뉴 열기 (PC)
    item.addEventListener('focusin', () => {
      if (!desktopMq.matches || item.classList.contains('is-open')) return;
      closeAllSubs();
      setSub(item, true);
    });
  });

  // 대메뉴 클릭: PC는 해당 섹션으로 이동, 모바일·터치는 서브 메뉴 펼치기
  nav.querySelectorAll('.nav-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      const item = toggle.closest('.has-sub');
      if (desktopMq.matches) {
        closeAllSubs();
        return; // 기본 링크 이동
      }
      e.preventDefault();
      e.stopImmediatePropagation(); // 아래의 '링크 클릭 시 메뉴 닫기'가 실행되지 않도록
      const open = !item.classList.contains('is-open');
      closeAllSubs();
      setSub(item, open);
    });
  });
  desktopMq.addEventListener('change', closeAllSubs);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-sub')) closeAllSubs();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const opened = nav.querySelector('.has-sub.is-open .nav-toggle');
    closeAllSubs();
    if (opened) opened.focus();
  });

  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { closeAllSubs(); setMenu(false); }));

  // 프로그램 탭
  const tabs = document.querySelectorAll('.tab');
  const activateTab = (tab) => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => activateTab(tab)));


  // FOR YOU 카드 → 해당 탭 열기
  document.querySelectorAll('.persona[data-tab]').forEach((card) => {
    card.addEventListener('click', () => activateTab(document.getElementById(card.dataset.tab)));
  });

  // 스크롤 등장 애니메이션
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // 후기 스와이프 (터치 스와이프 · 마우스 드래그 · 화살표 버튼 · 키보드)
  const swipe = document.getElementById('reviewSwipe');
  if (swipe) {
    const slides = Array.from(swipe.children);
    const prev = document.getElementById('reviewPrev');
    const next = document.getElementById('reviewNext');
    const dotsWrap = document.getElementById('reviewDots');
    const gap = () => parseFloat(getComputedStyle(swipe).columnGap) || 0;
    const step = () => slides[0].offsetWidth + gap();
    const maxScroll = () => swipe.scrollWidth - swipe.clientWidth;

    // 한 화면에 보이는 카드 수에 따라 넘길 수 있는 위치만큼 점 표시
    let dots = [];
    const buildDots = () => {
      const perView = Math.max(1, Math.floor((swipe.clientWidth + gap() + 1) / step()));
      const count = Math.max(1, slides.length - perView + 1);
      if (count === dots.length) return;
      dotsWrap.innerHTML = '';
      dots = Array.from({ length: count }, () => dotsWrap.appendChild(document.createElement('span')));
      dotsWrap.hidden = count < 2;
    };
    const update = () => {
      buildDots();
      const max = maxScroll();
      const idx = swipe.scrollLeft >= max - 2 ? dots.length - 1 : Math.round(swipe.scrollLeft / step());
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      prev.disabled = swipe.scrollLeft <= 2;
      next.disabled = swipe.scrollLeft >= max - 2;
    };
    let raf;
    swipe.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);

    prev.addEventListener('click', () => swipe.scrollBy({ left: -step() }));
    next.addEventListener('click', () => swipe.scrollBy({ left: step() }));
    swipe.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); swipe.scrollBy({ left: -step() }); }
      if (e.key === 'ArrowRight') { e.preventDefault(); swipe.scrollBy({ left: step() }); }
    });

    // 데스크톱 마우스 드래그 (터치는 브라우저 기본 스와이프 사용)
    let startX = 0, startLeft = 0, dragging = false, moved = false;
    swipe.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = false;
      startX = e.clientX; startLeft = swipe.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) { moved = true; swipe.classList.add('is-dragging'); }
      if (moved) swipe.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      if (!moved) return;
      const dx = swipe.scrollLeft - startLeft;
      const base = Math.round(startLeft / step());
      const target = Math.abs(dx) > 40 ? base + Math.sign(dx) : base;
      swipe.classList.remove('is-dragging');
      swipe.scrollTo({ left: Math.min(Math.max(target, 0), slides.length - 1) * step() });
    });
    swipe.addEventListener('dragstart', (e) => e.preventDefault());

    update();
  }

  // 서브 페이지 하위 메뉴 바: 현재 보고 있는 섹션 표시
  const localLinks = Array.from(document.querySelectorAll('.local-nav a'));
  if (localLinks.length && 'IntersectionObserver' in window) {
    const targets = localLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const mark = (id) => localLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) mark(entry.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach((t) => spy.observe(t));
  }

  // 연락처 자동 하이픈 (상담 신청 폼이 있는 페이지에서만)
  const phone = document.getElementById('f-phone');
  if (!phone) return;
  phone.addEventListener('input', () => {
    const d = phone.value.replace(/\D/g, '').slice(0, 11);
    phone.value = d.length < 4 ? d
      : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}`
      : `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
  });

  // 상담 신청 폼 (백엔드 연동 전: 검증 후 안내 메시지만 표시)
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const program = form.elements.program;
    const agree = form.elements.agree;
    const phoneOk = /^01\d-\d{3,4}-\d{4}$/.test(phone.value);

    [name, phone, program].forEach((el) => el.classList.remove('is-invalid'));
    const invalid = [];
    if (!name.value.trim()) invalid.push(name);
    if (!phoneOk) invalid.push(phone);
    if (!program.value) invalid.push(program);
    invalid.forEach((el) => el.classList.add('is-invalid'));

    msg.className = 'form-msg';
    if (invalid.length) {
      msg.textContent = '입력하지 않았거나 형식이 맞지 않는 항목을 확인해 주세요.';
      msg.classList.add('is-error');
      invalid[0].focus();
      return;
    }
    if (!agree.checked) {
      msg.textContent = '개인정보 수집·이용에 동의해 주세요.';
      msg.classList.add('is-error');
      return;
    }

    // TODO: Supabase 연동 시 여기서 상담 신청 데이터를 저장
    msg.textContent = `${name.value.trim()}님, 상담 신청이 접수되었습니다. 곧 연락드릴게요!`;
    msg.classList.add('is-ok');
    form.reset();
  });
})();
