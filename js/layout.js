/*
 * 공통 레이아웃 (헤더 · 하위 메뉴 바 · 푸터 · 모바일 하단 바)
 * 메뉴를 바꾸려면 아래 MENU 만 수정하면 모든 페이지에 반영됩니다.
 *
 * 사용법 (각 페이지)
 *   <body data-page="about">
 *     <script src="js/layout.js"></script>        ← 이 위치에 헤더 출력
 *     ...
 *     <script>SiteLayout.localNav()</script>      ← 이 위치에 페이지 하위 메뉴 바 출력 (서브 페이지)
 *     ...
 *     <script>SiteLayout.footer()</script>        ← 이 위치에 푸터 · 모바일 하단 바 출력
 */
(function () {
  const MENU = [
    {
      id: 'about', label: '학원 소개', href: 'about.html',
      eyebrow: 'ABOUT', lead: '안전한 첫 운전을 함께 시작하는 곳',
      children: [
        { label: '인사말', href: '#greeting' },
        {
          label: '학원 특장점', href: '#features',
          children: [
            { label: '학원에서 바로 보는 시험', href: '#feature-exam' },
            { label: '오토바이부터 대형까지', href: '#feature-license' },
            { label: '주간 · 야간 · 주말반', href: '#feature-classes' },
          ],
        },
        { label: '학원갤러리', href: '#gallery' },
        { label: '셔틀버스 안내', href: '#shuttle' },
        { label: '찾아오시는 길', href: '#location' },
      ],
    },
    {
      id: 'admission', label: '입학 안내', href: 'admission.html',
      eyebrow: 'ADMISSION', lead: '등록부터 면허 발급까지 한눈에',
      children: [
        {
          label: '면허 취득 절차', href: '#process',
          children: [
            { label: '01 상담 · 등록', href: '#step-1' },
            { label: '02 학과 교육', href: '#step-2' },
            { label: '03 기능 교육 · 검정', href: '#step-3' },
            { label: '04 도로주행 교육 · 검정', href: '#step-4' },
            { label: '05 면허 발급', href: '#step-5' },
          ],
        },
        { label: '교육 시간표', href: '#timetable' },
        { label: '수강료 안내', href: '#tuition' },
      ],
    },
    {
      id: 'courses', label: '교육과정', href: 'courses.html',
      eyebrow: 'COURSES', lead: '체험부터 신규 취득, 도로 연수까지',
      children: [
        { label: '주니어 익스피리언스', href: '#junior' },
        {
          label: '신규 취득', href: '#license',
          children: [
            { label: '2종 보통', href: '#lic-2-normal' },
            { label: '1종 보통', href: '#lic-1-normal' },
            { label: '1종 대형', href: '#lic-1-large' },
            { label: '2종 소형', href: '#lic-2-small' },
            { label: '원동기', href: '#lic-moped' },
          ],
        },
        {
          label: '도로 연수', href: '#training',
          children: [
            { label: '장롱면허 연수', href: '#tr-refresh' },
            { label: 'ROAD FIT', href: '#tr-roadfit' },
          ],
        },
        { label: 'SIM 드라이빙 익스피리언스', href: '#sim' },
      ],
    },
    {
      id: 'schedule', label: '운영 일정', href: 'schedule.html',
      eyebrow: 'SCHEDULE', lead: '내 일정에 맞는 반을 골라 보세요',
      children: [
        {
          label: '주간 · 야간 · 주말반', href: '#classes',
          children: [
            { label: '주간반', href: '#class-day' },
            { label: '야간반', href: '#class-night' },
            { label: '주말반', href: '#class-weekend' },
          ],
        },
        { label: '운영 시간 안내', href: '#hours' },
      ],
    },
    {
      id: 'community', label: '커뮤니티', href: 'community.html',
      eyebrow: 'COMMUNITY', lead: '학원 소식과 학과 공부 자료',
      children: [
        { label: '공지사항', href: '#notice' },
        { label: 'Q&A', href: '#qna' },
        { label: '학과 요점 정리', href: '#study' },
        { label: '모의고사', href: '#mock-test' },
        { label: '수강 후기', href: '#reviews' },
      ],
    },
  ];

  const CONTACT_URL = 'index.html#contact';
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const current = document.body.dataset.page || 'home';

  const subList = (page, items, cls) => `
    <ul class="${cls}">${items.map((c) => `
      <li${c.children ? ' class="has-sub2"' : ''}>
        <a href="${page.href}${c.href}">${esc(c.label)}</a>
        ${c.children ? subList(page, c.children, 'sub-menu2') : ''}
      </li>`).join('')}
    </ul>`;

  const header = () => `
  <header class="header" id="header">
    <div class="container header-inner">
      <a href="index.html" class="logo" aria-label="000자동차운전전문학원 홈">
        <span class="logo-mark">000</span>
        <span class="logo-text">
          <strong>000 DRIVING ACADEMY</strong>
          <small>000자동차운전전문학원</small>
        </span>
      </a>
      <nav class="nav" id="nav" aria-label="주 메뉴">
        ${MENU.map((m) => `
        <div class="nav-item has-sub">
          <a href="${m.href}" class="nav-toggle${m.id === current ? ' is-current' : ''}"${m.id === current ? ' aria-current="page"' : ''} aria-expanded="false" aria-controls="sub-${m.id}">${esc(m.label)}</a>
          ${subList(m, m.children, 'sub-menu').replace('<ul class="sub-menu">', `<ul class="sub-menu" id="sub-${m.id}">`)}
        </div>`).join('')}
        <a href="${CONTACT_URL}" class="btn btn-accent nav-cta">상담 신청</a>
      </nav>
      <button class="menu-btn" id="menuBtn" aria-label="메뉴 열기" aria-expanded="false" aria-controls="nav">
        <span></span><span></span>
      </button>
    </div>
  </header>`;

  // 서브 페이지 상단 타이틀 + 페이지 안 하위 메뉴 바
  const localNav = () => {
    const page = MENU.find((m) => m.id === current);
    if (!page) return '';
    return `
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">${page.eyebrow}</p>
        <h1>${esc(page.label)}</h1>
        <p class="page-lead">${esc(page.lead)}</p>
      </div>
    </section>
    <nav class="local-nav" aria-label="${esc(page.label)} 하위 메뉴">
      <div class="container local-nav-inner">
        ${page.children.map((c) => `<a href="${c.href}">${esc(c.label)}</a>`).join('')}
      </div>
    </nav>`;
  };

  const footer = () => `
  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <p class="footer-logo">000 DRIVING ACADEMY</p>
        <p>000자동차운전전문학원 · 주소 입력 · 대표전화 000-0000-0000</p>
        <p>사업자등록번호 000-00-00000 · 대표자 000</p>
      </div>
      <p class="copy">© 2026 000 Driving Academy. All rights reserved.</p>
    </div>
  </footer>

  <div class="mobile-bar" aria-label="빠른 상담">
    <a href="tel:0000000000">전화 상담</a>
    <a href="#" aria-label="카카오톡 상담 (채널 연결 예정)">카톡 상담</a>
    <a href="${CONTACT_URL}" class="is-primary">상담 신청</a>
  </div>`;

  // 호출한 <script> 바로 앞에 HTML을 끼워 넣음 (파싱 중 실행되므로 깜빡임 없음)
  const put = (html) => document.currentScript.insertAdjacentHTML('beforebegin', html);

  window.SiteLayout = {
    menu: MENU,
    localNav: () => put(localNav()),
    footer: () => put(footer()),
  };

  put(header());
})();
