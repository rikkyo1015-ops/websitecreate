const icons = {
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2M8 18h2"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  stethoscope: '<path d="M5 3v6a5 5 0 0 0 10 0V3M3 3h4M13 3h4M10 14v2a5 5 0 0 0 10 0v-3"/><circle cx="20" cy="10" r="3"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/><path d="M4 12h4l2-4 3 8 2-4h5"/>',
  leaf: '<path d="M20 3C10 2 3 7 5 15c2 7 13 5 15-12Z"/><path d="M3 21 15 9"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h6M9 18h3"/>',
  syringe: '<path d="m14 3 7 7M16 5 5 16l3 3L19 8M5 16l-2 5 5-2M10 10l4 4M13 7l4 4"/>',
  chat: '<path d="M21 12a9 9 0 0 1-9 9c-2 0-4-.6-5.5-1.6L3 21l1.5-4A9 9 0 1 1 21 12Z"/><path d="M8 10h8M8 14h5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
  accessibility: '<circle cx="12" cy="4" r="2"/><path d="m5 9 7 1 7-1M12 10v5m0 0-4 7m4-7 4 7"/>',
  shield: '<path d="M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6l-9-4Z"/><path d="m8 12 3 3 5-6"/>',
};
document.querySelectorAll('[data-icon]').forEach(el => {
  el.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[el.dataset.icon] || ''}</svg>`;
});

const imageBase = `${import.meta.env.BASE_URL}images/`;
const heroSlides = [
  [imageBase + 'clinic-doctor-hero.png', '明るいクリニックで迎える架空の医師のイメージ'],
  [imageBase + 'clinic-hero.png', '木のぬくもりを感じる受付と待合室のイメージ'],
  [imageBase + 'clinic-hero.png', '自然光が差し込む開放的な待合室のイメージ'],
];
document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.slide);
  const image = document.querySelector('.hero-image');
  image.hidden = index === 2;
  document.querySelector('.hero-room').hidden = index !== 2;
  [image.src, image.alt] = heroSlides[index];
  image.style.objectPosition = '';
  document.querySelectorAll('[data-slide]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
}));

const searchTabs = [...document.querySelectorAll('.symptom-tabs [role="tab"]')];
function selectSearchTab(tab) {
  searchTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
searchTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectSearchTab(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? searchTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + searchTabs.length) % searchTabs.length;
    selectSearchTab(searchTabs[next]);
    searchTabs[next].focus();
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'メニューを開く');
  nav.classList.remove('open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });

const infoDialog = document.getElementById('info-dialog');
const infoContent = document.getElementById('info-content');
const bookingDialog = document.getElementById('booking-dialog');
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    const rect = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) dialog.close();
  });
});
function openInfo(label, title, content) {
  infoContent.innerHTML = `<p class="eyebrow">${label}</p><h2>${title}</h2>${content}`;
  infoDialog.showModal();
}
const medical = {
  internal: ['一般内科', '発熱、咳、のどの痛み、頭痛、腹痛など、日常でよくある体調の変化をご相談いただく診療です。', '症状や経過を伺い、必要に応じて検査・治療や専門医へのご紹介を検討します。'],
  lifestyle: ['生活習慣病', '高血圧、糖尿病、脂質異常症などのご相談。定期的な確認と、暮らしに合わせた健康管理を大切にします。', '健診で気になる結果があった方もご相談ください。過去の検査結果やお薬手帳をお持ちいただくと参考になります。'],
  allergy: ['アレルギー', '花粉症やアレルギー性鼻炎など、季節や日常生活に関わる症状のご相談を想定しています。', '症状の出る時期やきっかけ、これまでの治療についてお聞かせください。'],
  checkup: ['健康診断', '毎日の健やかな暮らしのために。健康診断や検査についてご相談いただける案内ページです。', '実施する健診の種類、検査項目、費用は、実際の診療内容に合わせて掲載します。'],
  vaccine: ['予防接種', '予防接種の種類や接種時期についてのご相談。', '取り扱うワクチン、対象年齢、費用、予約方法は開院時の運用に合わせて掲載します。'],
  consultation: ['健康相談', 'なんとなく体調がすぐれない、健診の結果が気になるなど、健康についてのお悩みをご相談いただく案内です。', '診療科がわからない場合の窓口として、必要に応じた専門医へのご紹介も含めてご案内します。'],
};
document.querySelectorAll('[data-medical]').forEach(button => button.addEventListener('click', () => {
  const [title, first, second] = medical[button.dataset.medical];
  openInfo('MEDICAL CARE', title, `<p>${first}</p><p>${second}</p><p class="demo-alert">診療内容は仮設定です。実際の医院の対応範囲に合わせて差し替えてください。</p><button class="button" id="medical-book">予約のご案内へ →</button>`);
  document.getElementById('medical-book').addEventListener('click', () => { infoDialog.close(); openBooking(); });
}));
const news = {
  opening: ['開院のご挨拶と、当院について', '<p>地域の皆さまの健やかな毎日を支える、身近なかかりつけ医を目指して。椿参道クリニックのサイト制作サンプルです。</p><p>開院日・住所・連絡先は、実際の情報に合わせて掲載します。</p>'],
  first: ['初めて受診される方へ', '<p>マイナ保険証または資格確認書、お薬手帳をお持ちください。紹介状や過去の検査結果がある場合は、あわせてご持参ください。</p><p>予約方法や受付時間は、開院時にご案内します。</p>'],
  holiday: ['休診日・診療時間のご案内', '<p>サンプルの診療時間は、午前 9:00–12:30、午後 14:30–18:00 です。水曜・日曜・祝日は休診、土曜は午前のみとしています。</p><p>ページ内のカレンダーは水曜・日曜・土曜午後のみ反映しています。祝日と臨時休診は実際の運用に合わせた設定が必要です。</p>'],
};
document.querySelectorAll('[data-news]').forEach(button => button.addEventListener('click', () => {
  const [title, content] = news[button.dataset.news];
  openInfo('NEWS · 2026.10.01', title, `${content}<p class="sample-note">この記事はサイト制作サンプルです。</p>`);
}));
const galleries = {
  reception: ['受付・待合室', `<div class="gallery-enlarged"><img src="${imageBase}clinic-hero.png" alt="受付と待合室のイメージ"></div>`],
  room: ['診察室', '<div class="gallery-enlarged atlas-photo top-right" role="img" aria-label="診察室のイメージ"></div>'],
  equipment: ['検査設備', '<div class="gallery-enlarged atlas-photo bottom-left" role="img" aria-label="超音波検査装置のイメージ"></div>'],
};
document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
  const [title, content] = galleries[button.dataset.gallery];
  openInfo('OUR CLINIC', title, `${content}<p class="sample-note">生成したイメージ画像です。実際の院内・導入設備の写真に差し替えられます。</p>`);
}));
document.getElementById('privacy-button').addEventListener('click', () => openInfo('PRIVACY', 'プライバシーについて', '<p>このサイトは制作サンプルです。予約フォームの入力内容は外部に送信されず、保存もされません。アクセス解析や外部の予約サービスは使用していません。</p><p>運用開始時には、実際の情報の取り扱い・予約サービスに合わせてプライバシーポリシーを掲載してください。</p>'));

// Clinic time is Japan time regardless of the viewer\'s local timezone.
const japanDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const [todayYear, todayMonth, todayDay] = japanDate.split('-').map(Number);
let calendarDate = new Date(todayYear, todayMonth - 1, 1);
function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  document.getElementById('calendar-month').textContent = `${year}年 ${month + 1}月`;
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Math.ceil((firstDay + days) / 7) * 7;
  let html = '<thead><tr>' + ['日', '月', '火', '水', '木', '金', '土'].map(day => `<th scope="col">${day}</th>`).join('') + '</tr></thead><tbody>';
  for (let cell = 0; cell < cells; cell++) {
    if (cell % 7 === 0) html += '<tr>';
    const date = cell - firstDay + 1;
    if (date < 1 || date > days) html += '<td></td>';
    else {
      const weekday = cell % 7;
      const closed = weekday === 0 || weekday === 3;
      const half = weekday === 6;
      const today = year === todayYear && month + 1 === todayMonth && date === todayDay;
      const label = `${month + 1}月${date}日${closed ? ' 休診' : half ? ' 午前のみ診療' : ' 診療日'}${today ? ' 今日' : ''}`;
      html += `<td class="${closed ? 'closed' : half ? 'half' : ''} ${today ? 'today' : ''}"><span aria-label="${label}">${date}</span></td>`;
    }
    if (cell % 7 === 6) html += '</tr>';
  }
  document.getElementById('calendar').innerHTML = html + '</tbody>';
}
document.getElementById('prev-month').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(); });
document.getElementById('next-month').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(); });
renderCalendar();

const bookingForm = document.getElementById('booking-form');
const bookingDate = document.getElementById('booking-date');
const bookingTime = document.getElementById('booking-time');
const bookingError = document.getElementById('booking-error');
const bookingResult = document.getElementById('booking-result');
bookingDate.min = japanDate;
function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}
function updateTimeOptions() {
  bookingError.textContent = '';
  const saturday = bookingDate.value && parseDate(bookingDate.value).getDay() === 6;
  bookingTime.querySelector('[value="afternoon"]').disabled = Boolean(saturday);
  if (saturday && bookingTime.value === 'afternoon') bookingTime.value = '';
}
function openBooking() {
  closeMenu();
  bookingForm.reset();
  bookingForm.hidden = false;
  bookingResult.hidden = true;
  bookingResult.replaceChildren();
  updateTimeOptions();
  bookingDialog.showModal();
}
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', openBooking));
bookingDate.addEventListener('change', updateTimeOptions);
bookingDate.addEventListener('input', updateTimeOptions);
bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  const weekday = parseDate(bookingDate.value).getDay();
  if (weekday === 0 || weekday === 3) {
    bookingError.textContent = '水曜・日曜は休診日です。別の日をお選びください。';
    bookingDate.focus();
    return;
  }
  if (bookingDate.value < japanDate || (weekday === 6 && bookingTime.value === 'afternoon')) {
    bookingError.textContent = '受付可能な日付・時間帯をお選びください。';
    return;
  }
  const data = new FormData(bookingForm);
  bookingForm.hidden = true;
  bookingResult.hidden = false;
  const description = document.createElement('p');
  description.textContent = '選択内容のプレビュー';
  const summary = document.createElement('div');
  summary.className = 'booking-summary';
  const lines = [data.get('department'), data.get('visit'), `${data.get('date')} / ${bookingTime.selectedOptions[0].text}`];
  lines.forEach((line, index) => { if (index) summary.append(document.createElement('br')); summary.append(document.createTextNode(line)); });
  const notice = document.createElement('p');
  notice.className = 'demo-alert';
  notice.textContent = '予約は確定していません。この画面は操作サンプルです。実際の予約には、医院の予約システムへの接続が必要です。';
  const back = document.createElement('button');
  back.className = 'button';
  back.textContent = '選び直す';
  back.addEventListener('click', () => { bookingForm.hidden = false; bookingResult.hidden = true; });
  bookingResult.append(description, summary, notice, back);
  back.focus();
});
