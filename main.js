 const challenges = [
      { day:1, title:'База HTML/CSS', desc:'Соберите страницу «Портфолио»: header, section, footer, списки, ссылки.', link:'#' },
      { day:2, title:'CSS-селекторы и стиль', desc:'Оформите портфолио: цвета, шрифты, hover, отступы.', link:'#' },
      { day:3, title:'Позиционирование', desc:'«Цитату дня» с absolute/relative, центровкой, z-index.', link:'#' },
      { day:4, title:'Display', desc:'Меню: horizontal/vertical, inline-block.', link:'#' },
      { day:5, title:'Flexbox', desc:'Карточки: flex-контейнер, выравнивание, gap.', link:'#' },
      { day:6, title:'Grid', desc:'Галерея: CSS Grid, gap, auto-fill.', link:'#' },
      { day:7, title:'Таблицы', desc:'<table>: стили ячеек, чередующиеся строки.', link:'#' },
      { day:8, title:'Figma → HTML/CSS', desc:'Секция hero/banner из Figma pixel-perfect.', link:'#' },
      { day:9, title:'Git → GitHub Pages', desc:'Git init, push в Pages.', link:'#' },
      { day:10,title:'Итоговый проект', desc:'Полная страница портфолио с галереей.', link:'#' }
    ];
    const gridEl = document.getElementById('grid');
    const detailEl = document.getElementById('detail');
    const titleEl = document.getElementById('detail-title');
    const descEl = document.getElementById('detail-desc');
    const linkEl = document.getElementById('detail-link');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const completeBtn = document.getElementById('complete-btn');
    const backBtn = document.getElementById('back-btn');
    const progressBar = document.getElementById('progress-bar');
    const themeToggle = document.getElementById('theme-toggle');
    const daySelect = document.getElementById('day-select');
    const toast = document.getElementById('toast');
    const onboard = document.getElementById('onboard');
    const onboardClose = document.getElementById('onboarding-close');
    let currentDay = null;
    let completed = JSON.parse(localStorage.getItem('completedDays') || '[]');
    function init() {
      // Onboarding
      if (!localStorage.getItem('seenOnboard')) onboard.style.display = 'flex';
      onboardClose.onclick = () => { localStorage.setItem('seenOnboard', '1'); onboard.style.display = 'none'; };
      // Populate select
      challenges.forEach(c => { const opt = document.createElement('option'); opt.value = c.day; opt.textContent = `Day ${c.day}`; daySelect.appendChild(opt); });
      daySelect.onchange = e => showDetail(+e.target.value);
      // Theme
      if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
      themeToggle.onclick = () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
      };
      // Buttons
      prevBtn.onclick = () => showDetail(currentDay - 1);
      nextBtn.onclick = () => showDetail(currentDay + 1);
      backBtn.onclick = backToGrid;
      completeBtn.onclick = toggleComplete;
      document.addEventListener('keydown', onKey);
      // Load last state
      const lastDay = parseInt(localStorage.getItem('lastDay'), 10);
      const wasDetail = localStorage.getItem('wasDetail') === 'true';
      renderGrid();
      if (wasDetail && lastDay) showDetail(lastDay); else document.getElementById('grid').style.display = 'grid';
    }
    function renderGrid() {
      gridEl.innerHTML = '';
      challenges.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.setAttribute('aria-pressed', completed.includes(ch.day));
        card.innerHTML = `<h2>Day ${ch.day}: ${ch.title}</h2><p>${ch.desc}</p>`;
        card.onclick = () => showDetail(ch.day);
        card.onkeydown = e => { if (e.key === 'Enter') showDetail(ch.day); };
        gridEl.appendChild(card);
      });
      updateProgress();
    }
    function updateProgress() {
      const done = JSON.parse(localStorage.getItem('completedDays') || '[]').length;
      progressBar.style.width = `${(done / challenges.length) * 100}%`;
    }
    function showDetail(day) {
      currentDay = day;
      const ch = challenges.find(c => c.day === day);
      titleEl.textContent = `Day ${day}: ${ch.title}`;
      descEl.textContent = ch.desc;
      linkEl.href = ch.link;
      completeBtn.textContent = completed.includes(day) ? 'Снять' : 'Сделано';
      prevBtn.disabled = day === 1;
      nextBtn.disabled = day === challenges.length;
      daySelect.value = day;
      gridEl.style.display = 'none';
      detailEl.classList.add('active');
      localStorage.setItem('lastDay', day);
      localStorage.setItem('wasDetail', 'true');
    }
    function backToGrid() {
      detailEl.classList.remove('active');
      gridEl.style.display = 'grid';
      localStorage.setItem('wasDetail', 'false');
    }
    function toggleComplete() {
      let arr = JSON.parse(localStorage.getItem('completedDays') || '[]');
      const idx = arr.indexOf(currentDay);
      const msg = idx > -1 ? 'Снято' : 'Отмечено';
      if (idx > -1) arr.splice(idx, 1); else arr.push(currentDay);
      localStorage.setItem('completedDays', JSON.stringify(arr));
      completed = arr;
      renderGrid(); showDetail(currentDay);
      showToast(msg);
    }
    function showToast(text) {
      toast.textContent = text;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
    function onKey(e) {
      if (detailEl.classList.contains('active')) {
        if (e.key === 'ArrowRight' && !nextBtn.disabled) nextBtn.click();
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) prevBtn.click();
        if (e.key === ' ' && document.activeElement !== daySelect) { e.preventDefault(); completeBtn.click(); }
        if (e.key === 'Escape') backBtn.click();
      }
    }
    init();