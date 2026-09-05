/* RECOCULTURE — 메인 인터랙션 (GSAP + ScrollTrigger + Lenis) */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const isFine = matchMedia('(pointer: fine)').matches;
  if (reduced || !hasGsap) document.documentElement.classList.add('reduced');
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  // ── 스무스 스크롤
  let lenis = null;
  if (!reduced && hasGsap && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -64 }); }
    }));
  }

  // ── 네비
  const nav = document.getElementById('nav');
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ── 포맷
  const fmt = {
    ko(n) {
      if (n >= 1e8) return { v: (n / 1e8).toFixed(1).replace(/\.0$/, ''), u: '억' };
      if (n >= 1e4) return { v: Math.round(n / 1e4).toLocaleString(), u: '만' };
      return { v: n.toLocaleString(), u: '' };
    },
    views(n) { const k = fmt.ko(n); return k.v + k.u + ' 회'; },
    ago(iso) {
      const d = (Date.now() - new Date(iso)) / 864e5;
      if (d < 1) return '오늘 업로드'; if (d < 2) return '어제 업로드';
      if (d < 7) return Math.floor(d) + '일 전'; if (d < 30) return Math.floor(d / 7) + '주 전';
      return Math.floor(d / 30) + '개월 전';
    },
    esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); },
  };

  // ── 히어로 인트로
  if (!reduced && hasGsap) {
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('#h1 .line > span', { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.1)
      .from('[data-hero]', { y: 24, opacity: 0, duration: .9, stagger: .1 }, 0.5);
    gsap.to('[data-blob]', { y: 60, x: -40, scale: 1.08, duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    // 플로팅 요소: 등장 → 느린 부유 + 마우스 시차 + 근접 기울기 + 드래그
    const fls = gsap.utils.toArray('.fl');
    gsap.from(fls, { y: 40, opacity: 0, scale: .92, duration: 1.4, stagger: .1, ease: 'power3.out', delay: 1 });
    fls.forEach((el, i) => {
      const d = +el.dataset.float || 2;
      el.__f = { d };
      gsap.to(el, { y: `+=${8 + d * 3}`, duration: 7 + i * .9, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: -i * 1.3 });
      gsap.to(el, { rotation: (i % 2 ? 1 : -1) * (1.5 + d * .4), duration: 9 + i, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
    if (isFine) {
      const wrapEl = document.querySelector('.hero__inner');
      const par = fls.map(el => ({ x: gsap.quickTo(el, 'x', { duration: 2.2, ease: 'power2' }), rx: gsap.quickTo(el, 'rotationX', { duration: 1.2, ease: 'power2' }), ry: gsap.quickTo(el, 'rotationY', { duration: 1.2, ease: 'power2' }) }));
      addEventListener('pointermove', e => {
        const dx = e.clientX / innerWidth - .5;
        fls.forEach((el, i) => {
          if (el.__drag) return;
          par[i].x(-dx * el.__f.d * 14);
          const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy), R = 260;
          if (dist < R) { const k = 1 - dist / R; par[i].ry((e.clientX - cx) / r.width * 18 * k); par[i].rx(-(e.clientY - cy) / r.height * 18 * k); }
          else { par[i].ry(0); par[i].rx(0); }
        });
      }, { passive: true });
      gsap.set(fls, { transformPerspective: 800 });
      if (typeof Draggable !== 'undefined') {
        gsap.registerPlugin(Draggable, typeof InertiaPlugin !== 'undefined' ? InertiaPlugin : undefined);
        fls.filter(el => !el.classList.contains('cursor')).forEach(el => Draggable.create(el, {
          type: 'x,y', bounds: wrapEl, inertia: typeof InertiaPlugin !== 'undefined', edgeResistance: .8,
          onPress() { el.__drag = true; gsap.to(el, { scale: 1.05, duration: .25 }); },
          onRelease() { gsap.to(el, { scale: 1, duration: .4 }); },
          onThrowComplete() { el.__drag = false; },
          onDragEnd() { if (!this.tween) el.__drag = false; },
          onClick(e) { if (el.tagName === 'A' && el.href && !el.href.endsWith('#')) window.open(el.href, '_blank', 'noopener'); },
        }));
        fls.forEach(el => el.addEventListener('click', e => { if (el.tagName === 'A') e.preventDefault(); }));
      }
    }
    // REC 타이머
    const rt = document.getElementById('rec-time');
    if (rt) { const t0 = Date.now(); setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); rt.textContent = [s / 3600, s / 60 % 60, s % 60].map(n => String(Math.floor(n)).padStart(2, '0')).join(':'); }, 1000); }
  }

  // ── 단어 로테이터 (선택 프레임이 폭에 맞춰 늘어남)
  const rot = document.getElementById('rot'), rotTag = document.getElementById('rot-tag'), sel = document.getElementById('sel');
  if (rot && !reduced && hasGsap) {
    const words = [['영향력', 'INFLUENCE'], ['전문성', 'EXPERTISE'], ['진심', 'SINCERITY'], ['첫인상', 'IMPRESSION']];
    let i = 0;
    const measure = w => { const c = rot.cloneNode(); c.textContent = w; c.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap'; rot.parentNode.appendChild(c); const wd = c.getBoundingClientRect().width; c.remove(); return wd; };
    gsap.set(sel, { width: sel.getBoundingClientRect().width });
    setInterval(() => {
      i = (i + 1) % words.length;
      const [w, tag] = words[i];
      const pad = sel.getBoundingClientRect().width - rot.getBoundingClientRect().width;
      gsap.timeline()
        .to(rot, { yPercent: -60, opacity: 0, duration: .35, ease: 'power2.in' })
        .to(sel, { width: measure(w) + pad, duration: .5, ease: 'power3.inOut' }, '<.1')
        .add(() => { rot.textContent = w; rotTag.textContent = tag; })
        .fromTo(rot, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: 'power3.out' });
    }, 2600);
    addEventListener('resize', () => gsap.set(sel, { width: 'auto' }));
  }

  // ── 스크롤 리빌
  function reveal(scope) {
    if (reduced || !hasGsap) return;
    const els = gsap.utils.toArray((scope || document).querySelectorAll('[data-reveal]:not(.is-in)'));
    els.forEach(el => el.classList.add('is-in'));
    ScrollTrigger.batch(els, {
      start: 'top 88%',
      onEnter: b => gsap.fromTo(b, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true }),
    });
  }
  reveal();

  // ── 마그네틱 버튼
  if (!reduced && hasGsap && isFine) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const xTo = gsap.quickTo(el, 'x', { duration: .4, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: .4, ease: 'power3' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  // ── CTA 마우스 글로우
  const cta = document.getElementById('cta-box');
  if (cta && isFine) cta.addEventListener('pointermove', e => {
    const r = cta.getBoundingClientRect();
    cta.style.setProperty('--mx', (e.clientX - r.left) + 'px'); cta.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  // ── 원칙: 스택 카드 — 다음 카드가 올라올수록 이전 카드 축소·어둡게
  const scards = hasGsap ? gsap.utils.toArray('.scard') : [];
  if (scards.length && !reduced && hasGsap) scards.forEach((card, i) => {
    const next = scards[i + 1]; if (!next) return;
    gsap.to(card, { scale: .94, opacity: .55, ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top+=120', scrub: true } });
  });

  // ── 프로세스 라인
  const fill = document.getElementById('timeline-fill');
  if (fill && !reduced && hasGsap) {
    gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 60%', end: 'bottom 60%', scrub: .5 } });
    document.querySelectorAll('.tl').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 60%', toggleClass: { targets: el, className: 'is-on' } }));
  } else document.querySelectorAll('.tl').forEach(el => el.classList.add('is-on'));

  // ── 카운트업
  function countUp(el, n, suffix) {
    const { v, u } = fmt.ko(n);
    const target = parseFloat(v.replace(/,/g, '')), dec = (v.split('.')[1] || '').length;
    const render = x => { el.innerHTML = x.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + `<small>${u}${suffix}</small>`; };
    if (reduced || !hasGsap) return render(target);
    const o = { x: 0 };
    gsap.to(o, { x: target, duration: 1.6, ease: 'power4.out', onUpdate: () => render(o.x) });
  }


  // ── 최근 컬럼 (data/columns.json)
  const colEl = document.getElementById('column-grid');
  if (colEl) fetch('/data/columns.json').then(r => r.json()).then(list => {
    if (!list.length) return;
    colEl.innerHTML = list.slice(0, 3).map(p => `<a class="col" href="/columns/${p.slug}.html" data-reveal><div class="col__meta"><span>${p.date.replace(/-/g, '.')}</span><span>${p.mins}분</span></div><h3 class="col__title">${fmt.esc(p.title)}</h3><p class="col__excerpt">${fmt.esc(p.excerpt)}</p><div class="col__tags">${(p.tags || []).map(t => `<span>${fmt.esc(t)}</span>`).join('')}</div></a>`).join('');
    colEl.closest('#column').hidden = false; reveal(colEl); if (hasGsap) requestAnimationFrame(() => ScrollTrigger.refresh());
  }).catch(() => {});

  // ── 원장 추천사 (data/testimonials.json)
  const voEl = document.getElementById('voices-grid');
  if (voEl) fetch('/data/testimonials.json').then(r => r.json()).then(({ items }) => {
    voEl.innerHTML = items.map(t => `<div class="voice" data-reveal><p>${fmt.esc(t.text)}</p><div class="voice__who">${fmt.esc(t.role)} · ${fmt.esc(t.since)}</div></div>`).join('');
    reveal(voEl); if (hasGsap) requestAnimationFrame(() => ScrollTrigger.refresh());
  }).catch(() => { voEl.closest('#voices').hidden = true; });

  // ── 후기 (data/reviews.json)
  const rvEl = document.getElementById('reviews');
  if (rvEl) fetch('/data/reviews.json').then(r => r.json()).then(({ items }) => {
    const hl = t => fmt.esc(t).replace(/((?:유튜브|유툽|YouTube)(?:에서|를|로|도|나|를 통해|로만|구독자)?[^,.!?]{0,16}?(?:보고|봤|보게|보면서|보다가|채널을|알게|통해|구독하다가|찾아|시청))/g, '<mark>$1</mark>');
    rvEl.innerHTML = items.map(r => r.type === 'image'
      ? `<figure class="rv rv--img" data-reveal><img src="${fmt.esc(r.src)}" alt="${fmt.esc(r.alt || '방문자 후기 캡처')}" loading="lazy">${r.sample ? '<span class="rv__sample">SAMPLE</span>' : ''}</figure>`
      : `<div class="rv" data-reveal>
          <div class="rv__top"><span class="rv__src" data-src="${fmt.esc(r.source)}">${fmt.esc(r.source)}</span><span class="rv__date">${fmt.esc(r.date || '')}</span></div>
          ${r.stars ? `<div class="rv__stars">${'★'.repeat(r.stars)}</div>` : ''}
          <p class="rv__text">${hl(r.text)}</p>
          <div class="rv__foot"><span class="rv__nick">${fmt.esc(r.nick)}</span>${r.channel ? `<span class="rv__tag">${fmt.esc(r.industry ? r.industry + ' · ' : '')}${fmt.esc(r.channel)}</span>` : ''}</div>
          ${r.sample ? '<span class="rv__sample">SAMPLE</span>' : ''}
        </div>`).join('');
    reveal(rvEl);
    if (hasGsap) requestAnimationFrame(() => ScrollTrigger.refresh());
  }).catch(() => { rvEl.closest('#proof').hidden = true; });

  // ── FAQ: 한 번에 하나만 열림
  const faqs = document.querySelectorAll('.faq__list details');
  faqs.forEach(d => d.addEventListener('toggle', () => { if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; }); }));

  // ── 토스트
  const toastEl = document.getElementById('toast');
  let toastT;
  function toast(msg) { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 4200); }

  // ── 리드 폼 (3단계 · FormSubmit 메일 + Supabase 저장 이중 발송)
  const SB_URL = 'https://kcudbxmatyzxblqcjoye.supabase.co';
  const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdWRieG1hdHl6eGJscWNqb3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDg1NTEsImV4cCI6MjA4NTM4NDU1MX0.CCIHrR6gibFkNYk-WSyIf6b8O3buep2d0cemDnpLsOE'; // 공개 가능한 anon 키 — RLS로 inquiries insert만 허용
  const COLS = { '이름': 'name', '회사명': 'company', '직함': 'role', '연락처': 'phone', '이메일': 'email', '업종': 'industry', '지역': 'region', '현재상태': 'yt_status', '유튜브채널': 'yt_url', '목표': 'goals', '월예산': 'budget', '시작시기': 'start_when', '촬영빈도': 'shoot_freq', '담당자': 'owner', '유입경로': 'referral', '문의내용': 'message' };

  const form = document.getElementById('lead-form');
  if (form) {
    const steps = Array.from(form.querySelectorAll('.form__step'));
    const LAST = steps.length;
    const titles = ['기본 정보', '채널 현황', '조건과 고민'];
    const backBtn = form.querySelector('.form__back');
    const nextBtn = form.querySelector('.form__next');
    const submitBtn = form.querySelector('.form__submit');
    const progressEl = form.querySelector('.form__progress');
    const progressText = form.querySelector('.form__progress-text');
    const progressBar = form.querySelector('.form__progress-bar b');
    const navEl = form.querySelector('.form__nav');
    const noteEl = form.querySelector('.form__note');
    const doneEl = form.querySelector('.form__done');
    let step = 1;

    const focusEl = el => { if (!el) return; try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); } };

    function show(n, withFocus) {
      step = Math.min(Math.max(n, 1), LAST);
      steps.forEach(s => { s.hidden = Number(s.dataset.step) !== step; });
      form.dataset.step = String(step);
      backBtn.hidden = step === 1;
      nextBtn.hidden = step === LAST;
      submitBtn.hidden = step !== LAST;
      progressText.textContent = `${step} / ${LAST} · ${titles[step - 1] || ''}`;
      progressBar.style.width = (step / LAST * 100).toFixed(2) + '%';
      if (withFocus !== false) focusEl(steps[step - 1].querySelector('input:not([type="checkbox"]), select, textarea'));
    }

    const inputsOf = n => Array.from(steps[n - 1].querySelectorAll('input, select, textarea')).filter(el => el.type !== 'checkbox');

    function validate(n) {
      let firstBad = null, badFormat = false;
      inputsOf(n).forEach(el => {
        const val = el.value.trim();
        let bad = false, fmt = false;
        if (el.required && !val) bad = true;
        else if (val && !el.checkValidity()) { bad = true; fmt = true; }
        else if (val && el.type === 'tel' && val.replace(/\D/g, '').length < 8) { bad = true; fmt = true; }
        const field = el.closest('.form__field');
        if (field) field.classList.toggle('is-error', bad);
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && !firstBad) { firstBad = el; badFormat = fmt; }
      });
      if (!firstBad) return true;
      focusEl(firstBad);
      toast(badFormat ? '입력 형식을 확인해주세요.' : '이름, 연락처, 분야를 확인해주세요.');
      return false;
    }

    nextBtn.addEventListener('click', () => { if (validate(step)) show(step + 1); });
    backBtn.addEventListener('click', () => show(step - 1));
    form.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA' || step >= LAST) return;
      e.preventDefault();
      if (validate(step)) show(step + 1);
    });

    function collect() {
      const fd = new FormData(form), d = {};
      for (const [k, v] of fd.entries()) {
        if (k === '_honey' || k === '목표') continue;
        const s = String(v).trim();
        if (s) d[k] = s;
      }
      const goals = fd.getAll('목표').map(v => String(v).trim()).filter(Boolean);
      if (goals.length) d['목표'] = goals;
      return d;
    }

    async function sendMail(d) {
      const fd = new FormData();
      Object.keys(d).forEach(k => fd.append(k, Array.isArray(d[k]) ? d[k].join(', ') : d[k]));
      fd.append('_subject', `[레코컬쳐] 채널 문의 — ${d['이름'] || ''} (${d['업종'] || ''})`);
      fd.append('_captcha', 'false');
      fd.append('_template', 'table');
      const r = await fetch('https://formsubmit.co/ajax/og@recoculture.com', { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !(j.success === 'true' || j.success === true)) throw new Error('mail failed');
    }

    function clientId() {
      try {
        let id = localStorage.getItem('rc_cid');
        if (!id) {
          id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
          localStorage.setItem('rc_cid', id);
        }
        return id;
      } catch (err) { return null; }
    }

    async function saveDb(d) {
      const row = {};
      Object.keys(d).forEach(k => { if (COLS[k]) row[COLS[k]] = d[k]; });
      row.source_page = location.pathname + location.hash;
      row.user_agent = (navigator.userAgent || '').slice(0, 300);
      row.client_id = clientId();
      row.form_version = form.dataset.version || 'v2';
      const r = await fetch(`${SB_URL}/rest/v1/inquiries`, {
        method: 'POST',
        headers: { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(row),
      });
      if (!r.ok) throw new Error(`db failed ${r.status}`);
    }

    function done() {
      steps.forEach(s => { s.hidden = true; });
      progressEl.hidden = true;
      navEl.hidden = true;
      noteEl.hidden = true;
      doneEl.hidden = false;
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      for (let n = 1; n <= LAST; n++) {
        if (step !== n) show(n, false);
        if (!validate(n)) return;
      }
      if (form.querySelector('[name="_honey"]').value) return done();
      let lastAt = 0;
      try { lastAt = Number(localStorage.getItem('rc_lead_at')) || 0; } catch (err) { lastAt = 0; }
      if (lastAt && Date.now() - lastAt < 60000) return toast('방금 접수됐습니다. 잠시 후 다시 시도해주세요.');

      const d = collect();
      const label = submitBtn.firstChild;
      submitBtn.disabled = true; label.textContent = '보내는 중… ';
      const results = await Promise.allSettled([sendMail(d), saveDb(d)]);
      if (results.some(r => r.status === 'fulfilled')) {
        try { localStorage.setItem('rc_lead_at', String(Date.now())); } catch (err) { /* 저장 실패는 무시 */ }
        done();
        toast('접수됐습니다. 영업일 기준 1일 내 회신드릴게요.');
      } else {
        toast('전송에 실패했습니다. 이메일이나 카카오톡으로 보내주세요.');
        submitBtn.disabled = false; label.textContent = '채널 문의 보내기 ';
      }
    });

    show(1, false);
  }

  // ── work.html: 영향력 마인드맵 + 영상 그리드
  const imap = document.getElementById('imap'), wFilters = document.getElementById('filters');
  if (imap && wFilters) Promise.all([fetch('/data/influence.json').then(r => r.json()), fetch('/data/channels.json').then(r => r.json())]).then(([inf, chJson]) => {
    const nodesEl = document.getElementById('imap-nodes'), linesEl = document.getElementById('imap-lines');
    const W = 1000, H = 600, cx = 500, cy = 300;
    const seeded = seed => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    let cur = 0, floatTweens = [];

    // 해바라기 나선으로 산발 배치. 가중치 큰 키워드는 안쪽·크게, 작은 것은 바깥·흐리게.
    function layout(c) {
      const rnd = seeded(c.channel.length * 13 + 5);
      const items = [];
      ['action', 'content', 'voice'].forEach(k => (c.branches[k] || []).forEach(x => items.push({ label: x.k, w: x.w || 2, hook: k === 'action', q: x.q })));
      items.sort((a, b) => b.w - a.w || rnd() - .5);
      const golden = 137.508, out = [];
      items.forEach((it, i) => {
        const t = i / Math.max(1, items.length - 1);
        const r = 215 + t * 225 + (rnd() - .5) * 36;
        const a = (i * golden + rnd() * 24) * Math.PI / 180;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * .7;
        let px = Math.min(W - 70, Math.max(70, x)), py = Math.min(H - 28, Math.max(28, y));
        if (px < 410 && py < 240) py = 240 + rnd() * 40;           // 좌상단 인용문 자리 비우기
        if (py > 505) py = 505 - rnd() * 30;                       // 하단 티커 자리 비우기
        out.push({ ...it, x: px, y: py, far: it.w === 1 && rnd() > .4 });
      });
      return out;
    }

    const tip = document.getElementById('imap-tip');
    let tickerTween = null;
    const chAvatar = {}, chData = {};
    chJson.channels.forEach(c => { chAvatar[c.name] = c.avatar; chData[c.name] = c; });
    function render(i) {
      cur = i; const c = inf[i];
      floatTweens.forEach(t => t.kill()); floatTweens = [];
      const nodes = layout(c).sort((a, b) => Math.hypot(a.x - cx, (a.y - cy) / .66) - Math.hypot(b.x - cx, (b.y - cy) / .66));
      document.getElementById('imap-quote').innerHTML = `<q>${fmt.esc(c.quote || '')}</q><small>${fmt.esc(c.industry)} 방문자 후기 중</small>`;
      // 하단 티커: 실제 "유튜브 보고" 문장
      const tk = document.getElementById('imap-ticker'), tt = document.getElementById('imap-ticker-track');
      if (tickerTween) { tickerTween.kill(); tickerTween = null; }
      const men = c.mentions || [];
      if (men.length >= 3) {
        tk.hidden = false;
        document.getElementById('imap-ticker-label').innerHTML = `<i class="dot"></i>"유튜브 보고 왔어요"`;
        const set = men.map(m => `<span>${fmt.esc(m)}</span>`).join('');
        tt.innerHTML = set + set;
        if (hasGsap && !reduced) { const w = tt.scrollWidth / 2; tickerTween = gsap.fromTo(tt, { x: 0 }, { x: -w, duration: Math.max(40, w / 40), ease: 'none', repeat: -1 }); }
      } else tk.hidden = true;
      linesEl.innerHTML = nodes.map(n => `<line x1="${cx}" y1="${cy}" x2="${n.x}" y2="${n.y}" class="${n.hook ? 'is-hook' : ''}"/>`).join('');
      const st = c.stats || {};
      nodesEl.innerHTML = `<div class="node node--center" style="left:50%;top:50%"><span class="node__in"><img class="node__avatar" src="${chAvatar[c.channel] || ''}" alt="" referrerpolicy="no-referrer"><b>${fmt.esc(c.client)}</b><small>${fmt.esc(c.industry)} · ${fmt.esc(c.channel)}</small><span class="node__stats">${st.subscribers ? `<span><b class="c-subs">${st.subscribers.toLocaleString()}</b>구독</span>` : ''}${st.views ? `<span><b class="c-views">${st.views.toLocaleString()}</b>조회</span>` : ''}${st.videos ? `<span><b>${st.videos}</b>편</span>` : ''}</span></span></div>`
        + nodes.map(n => `<div class="node node--w${n.w}${n.hook ? ' node--hook' : ''}${n.far ? ' node--far' : ''}" style="left:${n.x / W * 100}%;top:${n.y / H * 100}%"${n.q ? ` data-q="${fmt.esc(n.q)}"` : ''}><span class="node__in">${fmt.esc(n.label)}</span></div>`).join('');
      { const cv = nodesEl.querySelector('.c-views'), cs = nodesEl.querySelector('.c-subs'), chn0 = chData[c.channel] || {}, r0 = chn0.rate || {}, s0 = sinceUpdate(chJson.updatedAt); if (cv) liveNum(cv, (chn0.views || st.views || 0) + (r0.views || 0) * s0, r0.views || 0, ''); if (cs) liveNum(cs, (chn0.subscribers || st.subscribers || 0) + (r0.subscribers || 0) * s0, r0.subscribers || 0, ''); }
      nodesEl.querySelectorAll('.node[data-q]').forEach(n => {
        n.addEventListener('pointerenter', () => { tip.textContent = n.dataset.q; tip.style.left = n.style.left; tip.style.top = `calc(${n.style.top} + 26px)`; tip.classList.add('is-on'); });
        n.addEventListener('pointerleave', () => tip.classList.remove('is-on'));
      });
      if (hasGsap && !reduced) {
        const pulse = document.getElementById('imap-pulse');
        gsap.fromTo(pulse, { attr: { r: 40 }, opacity: .9 }, { attr: { r: 520 }, opacity: 0, duration: 1.6, ease: 'power2.out' });
        gsap.fromTo(linesEl.querySelectorAll('line'), { opacity: 0 }, { opacity: 1, duration: 1, stagger: .04, ease: 'power2.out', delay: .1 });
        gsap.from(nodesEl.querySelectorAll('.node:not(.node--center)'), { scale: .4, opacity: 0, duration: .8, stagger: .05, ease: 'back.out(1.8)', clearProps: 'opacity', delay: .15 });
        gsap.from(['#imap-quote', '#imap-proof'], { y: 16, opacity: 0, duration: .8, ease: 'power3.out', delay: .3, clearProps: 'opacity' });
        gsap.from(nodesEl.querySelector('.node--center'), { scale: .8, opacity: 0, duration: .8, ease: 'power3.out', clearProps: 'opacity' });
        nodesEl.querySelectorAll('.node:not(.node--center)').forEach((n, k) => floatTweens.push(gsap.to(n, { y: (k % 2 ? -1 : 1) * (5 + (k % 5) * 2), x: (k % 3 - 1) * 4, duration: 4 + (k % 4), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: -k * .37 })));
      }
      wFilters.querySelectorAll('button').forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
      // 성장 기록
      const chn = chData[c.channel] || {}, g = chn.growth || {};
      const ym = iso => iso ? iso.slice(0, 7).replace('-', '.') : '—';
      const months = iso => iso ? Math.max(1, Math.round((Date.now() - new Date(iso)) / 2629800000)) : null;
      document.getElementById('growth-title').textContent = `${c.channel}, 이렇게 왔습니다.`;
      const series = g.series || [];
      // 반응 총량
      const ic = { like: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 11v9H4v-9h3zm3 9h7.5a2 2 0 0 0 2-1.6l1.2-6A2 2 0 0 0 18.7 10H14l.8-4a1.8 1.8 0 0 0-3.3-1.2L8 11"/></svg>', cmt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16v11H8l-4 4V5z"/></svg>', rv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/></svg>' };
      const rt = chn.rate || {}, since2 = sinceUpdate(chJson.updatedAt);
      const ic2 = { view: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>' };
      const rx = [
        { k: '조회수', ic: ic2.view, n: (chn.views || 0) + (rt.views || 0) * since2, r: rt.views || 0, s: '채널 누적', size: 'l', hot: true, x: 50, y: 50 },
        { k: '좋아요', ic: ic.like, n: (g.likes || 0) + (rt.likes || 0) * since2, r: rt.likes || 0, s: '롱폼 전체', size: 'm', x: 21, y: 46 },
        { k: '댓글', ic: ic.cmt, n: (g.comments || 0) + (rt.comments || 0) * since2, r: rt.comments || 0, s: '롱폼 전체', size: 's', x: 79, y: 56 },
      ];
      const sky = document.getElementById('react');
      liveList.splice(0, liveList.length, ...liveList.filter(it => !it.el.closest('#react') && !it.el.closest('.node--center')));
      sky.innerHTML = rx.map(r => `<div class="bubble bubble--${r.size}${r.hot ? ' bubble--hot' : ''}" style="left:${r.x}%;top:${r.y}%"><div class="bubble__k">${r.ic}${r.k}<i class="live-dot"></i></div><div class="bubble__v odo" data-n="${Math.floor(r.n)}" data-r="${r.r}"></div><div class="bubble__s">${r.s}</div></div>`).join('');
      const rvEls = sky.querySelectorAll('.bubble__v');
      const runRx = () => rvEls.forEach(el => countLive(el, +el.dataset.n, +el.dataset.r, ''));
      if (hasGsap && !reduced) {
        ScrollTrigger.create({ trigger: sky, start: 'top 85%', once: true, onEnter: runRx });
        gsap.set(sky.querySelectorAll('.bubble'), { xPercent: -50, yPercent: -50 });
        sky.querySelectorAll('.bubble').forEach((b, i) => { gsap.to(b, { y: (i % 2 ? -1 : 1) * (10 + i * 4), x: (i - 1) * 6, duration: 5 + i * 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' }); gsap.from(b, { scale: .6, opacity: 0, duration: 1, delay: .15 * i, ease: 'back.out(1.6)', clearProps: 'opacity' }); });
      } else runRx();
      // 업로드 잔디 — 첫 업로드 주부터 이번 주까지
      const row = document.getElementById('grass-row'), yrs = document.getElementById('grass-years'), badge = document.getElementById('grass-badge'), gtip = document.getElementById('grass-tip');
      row.innerHTML = ''; yrs.innerHTML = ''; gtip.textContent = '';
      if (series.length) {
        const W1 = 6048e5, start = new Date(series[0].at); start.setDate(start.getDate() - start.getDay()); start.setHours(0, 0, 0, 0);
        const weeks = Math.floor((Date.now() - start) / W1) + 1;
        const byWeek = Array.from({ length: weeks }, () => []);
        series.forEach(x => { const k = Math.floor((new Date(x.at) - start) / W1); if (byWeek[k]) byWeek[k].push(x); });
        let best = 0, run = 0; byWeek.forEach(w => { run = w.length ? run + 1 : 0; best = Math.max(best, run); });
        const last12 = byWeek.slice(-12).filter(w => w.length).length;
        badge.innerHTML = `최근 12주 중 <b>${last12}주</b> · 최장 <b>${best}주 연속</b>`;
        let lastYear = '';
        row.style.gridTemplateColumns = `repeat(${weeks}, minmax(0, 1fr))`;
        row.innerHTML = byWeek.map((w, k) => `<div class="grass__cell${w.length ? (w.length >= 2 ? ' is-2' : ' is-1') : ''}" data-k="${k}"></div>`).join('');
        byWeek.forEach((w, k) => { const d = new Date(start.getTime() + k * W1), y = String(d.getFullYear()); if (y !== lastYear) { lastYear = y; const sp = document.createElement('span'); sp.textContent = y; sp.style.left = (k / weeks * 100) + '%'; yrs.appendChild(sp); } });
        row.querySelectorAll('.grass__cell').forEach(cell => cell.addEventListener('pointerenter', () => { const k = +cell.dataset.k, d = new Date(start.getTime() + k * W1), w = byWeek[k]; gtip.innerHTML = `<b>${d.toISOString().slice(0, 10)} 주</b>${w.length ? w.map(x => fmt.esc(x.t)).join(' · ') : '업로드 없음'}`; }));
        if (hasGsap && !reduced) gsap.fromTo(row.querySelectorAll('.grass__cell'), { opacity: 0, scaleY: .2 }, { opacity: 1, scaleY: 1, transformOrigin: 'bottom', duration: .4, stagger: .004, ease: 'power2.out', delay: .3, clearProps: 'all' });
      }
      const gl = document.getElementById('growth-link'); if (gl && chn.id) gl.href = 'https://www.youtube.com/channel/' + chn.id;
      reveal(document.getElementById('growth'));
      if (hasGsap) requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    wFilters.innerHTML = inf.map((c, i) => `<button type="button" role="tab" aria-pressed="false">${fmt.esc(c.channel)}</button>`).join('');
    wFilters.querySelectorAll('button').forEach((b, i) => b.onclick = () => render(i));
    render(0);
    // 마우스 시차 (약하게)
    if (isFine && hasGsap && !reduced) imap.addEventListener('pointermove', e => { const r = imap.getBoundingClientRect(); const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5; gsap.to(nodesEl, { x: -dx * 14, y: -dy * 10, duration: 1, ease: 'power2' }); gsap.to(linesEl, { x: -dx * 14, y: -dy * 10, duration: 1, ease: 'power2' }); });
  }).catch(e => { console.error(e); });

  // ── 라이브 숫자: base + 초당 증가율 × 경과시간, 전체 자릿수
  const liveList = [];
  function liveNum(el, base, perSec, suffix) {
    const t0 = performance.now();
    const item = { el, base, perSec, suffix: suffix || '', t0 };
    liveList.push(item); return item;
  }
  // 오도미터: 자릿수별 0-9 띠가 굴러가며 바뀜
  function odo(el, value, suffix) {
    const str = Math.floor(value).toLocaleString();
    if (el.dataset.len !== String(str.length)) {
      el.dataset.len = String(str.length);
      el.innerHTML = [...str].map(ch => /\d/.test(ch) ? `<span class="odo__d"><i>${'0123456789'.split('').map(d => `<span>${d}</span>`).join('')}</i></span>` : `<span class="odo__c">${ch}</span>`).join('') + (suffix ? `<small>${suffix}</small>` : '');
    }
    const ds = el.querySelectorAll('.odo__d i'); let k = 0;
    [...str].forEach(ch => { if (/\d/.test(ch)) { const i = ds[k++]; const y = -(+ch) + 'em'; if (i.style.transform !== `translateY(${y})`) i.style.transform = `translateY(${y})`; } });
  }
  function paint(el, v, suffix) { if (el.classList.contains('odo')) odo(el, v, suffix); else el.innerHTML = Math.floor(v).toLocaleString() + (suffix ? `<small>${suffix}</small>` : ''); }
  setInterval(() => { const now = performance.now(); liveList.forEach(it => { if (!it.el.isConnected) return; paint(it.el, it.base + it.perSec * (now - it.t0) / 1000, it.suffix); }); }, 200);
  // 전체 자릿수 카운트업 후 라이브로 전환
  function countLive(el, base, perSec, suffix) {
    const start = () => { el.classList.add('is-live'); liveNum(el, base, perSec, suffix); };
    if (reduced || !hasGsap) return start();
    const o = { x: 0 };
    gsap.to(o, { x: base, duration: 1.8, ease: 'power4.out', onUpdate: () => paint(el, o.x, suffix), onComplete: start });
  }
  const ageSec = iso => Math.max(86400, (Date.now() - new Date(iso)) / 1000);
  const sinceUpdate = iso => iso ? Math.max(0, (Date.now() - new Date(iso)) / 1000) : 0;

  // ── 데이터
  const grid = document.getElementById('channels-grid');
  const tLong = document.getElementById('track-long'), tShort = document.getElementById('track-short');
  if (!grid) return;

  fetch('/data/channels.json').then(r => r.json()).then(data => {
    const all = data.channels;
    const activeCount = all.filter(c => c.status === 'active').length;
    // 카드: 잘된 채널만 — 구독자 1만 이상 또는 대표 영상 10만 뷰 이상, 마퀴 제외 채널 제외, 구독자순 상위 7개
    const active = all
      .filter(c => c.latest && !c.excludeFeatured && (c.subscribers >= 10000 || c.latest.views >= 100000))
      .sort((a, b) => b.subscribers - a.subscribers)
      .slice(0, 7);

    // 라이브 문구
    const latest = all.filter(c => c.status === 'active').map(c => c.lastUploadAt || (c.latest && c.latest.publishedAt)).filter(Boolean).sort().pop();
    const live = document.getElementById('live-text');
    if (live) live.innerHTML = `<b>${activeCount}개 채널</b> 운영 중 · 최근 업로드 ${fmt.ago(latest)}`;

    // 마퀴 — 세트를 뷰포트 2배 이상 채울 만큼 복제하고 px 단위로 무한 루프
    const eye = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
    const tile = (v, kind) => `<a class="tile tile--${kind}" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer" tabindex="-1"><img src="https://i.ytimg.com/vi/${v.id}/${kind === 'short' ? 'oar2' : 'mqdefault'}.jpg" alt="" loading="lazy" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${v.id}/hqdefault.jpg'"><span class="tile__ch">${fmt.esc(v.channel)}</span><span class="tile__views">${eye}${fmt.views(v.views)}</span></a>`;
    function marquee(track, list, kind) {
      if (!track || !list.length) return;
      const set = list.map(v => tile(v, kind)).join('');
      track.innerHTML = set;
      const setW = track.scrollWidth + parseFloat(getComputedStyle(track).gap || 14);
      const copies = Math.max(2, Math.ceil((innerWidth * 2) / setW) + 1);
      track.innerHTML = set.repeat(copies);
      if (reduced || !hasGsap) return;
      const dir = +track.dataset.speed || 1;
      const dur = setW / 55; // px/s
      const tween = dir > 0
        ? gsap.fromTo(track, { x: 0 }, { x: -setW, duration: dur, ease: 'none', repeat: -1 })
        : gsap.fromTo(track, { x: -setW }, { x: 0, duration: dur, ease: 'none', repeat: -1 });
      ScrollTrigger.create({ onUpdate: st => {
        const v = gsap.utils.clamp(-3000, 3000, st.getVelocity());
        const ts = gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 600) * (v < 0 ? -1 : 1);
        gsap.to(tween, { timeScale: ts, duration: .4, overwrite: true, onComplete: () => gsap.to(tween, { timeScale: 1, duration: 1.2 }) });
        gsap.to(track, { skewX: gsap.utils.clamp(-6, 6, v / 300), duration: .3, overwrite: 'auto', onComplete: () => gsap.to(track, { skewX: 0, duration: .8, ease: 'power2.out' }) });
      } });
    }
    const mini = (id, v, kind) => { const el = document.getElementById(id); if (!el || !v) return; el.href = 'https://www.youtube.com/watch?v=' + v.id; el.querySelector('img').src = `https://i.ytimg.com/vi/${v.id}/${kind === 'short' ? 'oar2' : 'mqdefault'}.jpg`; el.querySelector('.mini__views').textContent = fmt.views(v.views); };
    mini('mini-1', data.featured.long[0], 'long');
    mini('mini-2', data.featured.shorts[0], 'short');
    // 채널 섹션 뒤 레인
    const stage = document.getElementById('rain-stage');
    if (stage) fetch('/data/portfolio-data.json').then(r => r.json()).then(list => {
      const pool = list.filter(x => x.v >= 30000).sort(() => Math.random() - .5);
      const cols = innerWidth < 720 ? 5 : 8, per = 7;
      for (let c = 0; c < cols; c++) {
        const col = document.createElement('div'); col.className = 'rain__col' + (c % 3 === 1 ? ' rain__col--hot' : '');
        col.style.left = (c / cols * 100 + 1) + '%';
        const pick = pool.slice(c * per, c * per + per);
        col.innerHTML = [...pick, ...pick].map(x => `<img src="https://i.ytimg.com/vi/${x.i}/mqdefault.jpg" alt="" loading="lazy">`).join('');
        stage.appendChild(col);
        if (!reduced && hasGsap) {
          const dir = c % 2 ? 1 : -1;
          gsap.fromTo(col, { yPercent: dir > 0 ? -50 : 0 }, { yPercent: dir > 0 ? 0 : -50, duration: 45 + c * 7, ease: 'none', repeat: -1 });
        }
      }
    }).catch(() => {});
    marquee(tLong, data.featured.long, 'long');
    marquee(tShort, data.featured.shorts, 'short');

    // 통계 (HTML data-n 고정값) — 조회수·구독자는 실제 증가율로 실시간 증가
    const rateViews = (data.rate && data.rate.views) || 0, rateSubs = (data.rate && data.rate.subscribers) || 0, since = sinceUpdate(data.updatedAt);
    const run = () => document.querySelectorAll('.stat__n[data-n]').forEach(el => {
      const n = +el.dataset.n, live = el.dataset.live;
      if (live === 'views') countLive(el, n + rateViews * since, rateViews, '회'); else if (live === 'subs') countLive(el, n + rateSubs * since, rateSubs, '명'); else countUp(el, n, el.dataset.suffix || '');
    });
    document.querySelectorAll('[data-chip-live]').forEach(el => { const k = el.dataset.chipLive, r = k === 'views' ? rateViews : rateSubs; liveNum(el, +el.dataset.n + r * since, r, k === 'views' ? ' 회' : ' 명'); });
    if (hasGsap && !reduced) ScrollTrigger.create({ trigger: '[data-stats]', start: 'top 85%', once: true, onEnter: run }); else run();

    // 채널 카드
    const subs = c => c.subscribers >= 5000 ? `구독자 <b>${fmt.ko(c.subscribers).v}${fmt.ko(c.subscribers).u}</b>` : '<b class="new">NEW</b> 새로 시작한 채널';
    const card = (c, feat) => `
      <a class="ch${feat ? ' ch--feat' : ''}" href="https://www.youtube.com/channel/${c.id}" target="_blank" rel="noopener noreferrer" data-reveal>
        <div class="ch__video"><img src="https://i.ytimg.com/vi/${c.latest.id}/${feat ? 'hqdefault' : 'mqdefault'}.jpg" alt="" loading="lazy"><span class="ch__ago">${eye}${fmt.views(c.latest.views)}</span></div>
        ${feat ? '<div class="ch__side"><span class="ch__badge">FEATURED</span>' : ''}
        <div class="ch__body"><img class="ch__avatar" src="${c.avatar}" alt="" loading="lazy" referrerpolicy="no-referrer"><div><div class="ch__name">${fmt.esc(c.name)}</div><div class="ch__meta">${fmt.esc(c.industry)} · ${subs(c)}</div></div></div>
        <div class="ch__title">${fmt.esc(c.latest.title)}</div>
        ${feat ? '</div>' : ''}
      </a>`;
    grid.innerHTML = active.map((c, i) => card(c, i === 0)).join('');
    reveal(grid);
    if (hasGsap) requestAnimationFrame(() => ScrollTrigger.refresh());
  }).catch(e => { grid.innerHTML = '<p style="color:#9a9a9a">채널 정보를 불러오지 못했습니다.</p>'; console.error(e); });
})();
