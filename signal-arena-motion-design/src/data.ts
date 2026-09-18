export const REPO_RAW = 'https://raw.githubusercontent.com/hudyakovictor/assets/main';
export const repoAsset = (path: string) => `${REPO_RAW}/${path}`;

/* =========================================================================
   ASSET PROVENANCE  —  github.com/hudyakovictor/assets @ main
   Verified present:
     brand.md · style-tone.txt · game.html · game2.pdf · logo_concept.png
     рототипы_экранов__casual_2D_(раскадровка__все_страницы).pdf
     topbar/topbar.html · topbar/topbar.png · topbar/icons/{lightning,star,coin,bell,gear}.svg
     skill-card-icons/c01…c40 + preview{,-24,-32,-48,-mobile}.svg
     assets/signal-arena-ui-library/** (React source, 24 UI blocks)
   ========================================================================= */
export const MISSING_ASSETS = [
  { file: 'assets.zip', status: 'ASSET_ARCHIVE_NOT_EXTRACTED', note: 'Файл с таким именем отсутствует в текущем tree main; проверен доступный каталог assets/.' },
  { file: 'skill-card-icons.zip', status: 'ASSET_ARCHIVE_NOT_EXTRACTED', note: 'Файл .zip отсутствует в tree main; проверен распакованный каталог skill-card-icons/ с c01–c40 и preview-файлами.' },
  { file: 'topbar.zip', status: 'ASSET_ARCHIVE_NOT_EXTRACTED', note: 'Файл .zip отсутствует в tree main; проверен распакованный каталог topbar/ с topbar.html, topbar.png и icons/.' },
];
export const RESOLVED_ASSETS = [
  { file: 'topbar/topbar.html', use: 'SHARED_TOP_BAR_LOCKED — геометрия, порядок, слоты LVL/XP/attempts/stars/coins/bell/gear' },
  { file: 'topbar/icons/lightning.svg', use: 'attempts slot' },
  { file: 'topbar/icons/star.svg', use: 'stars slot' },
  { file: 'topbar/icons/coin.svg', use: 'coins slot' },
  { file: 'topbar/icons/bell.svg', use: 'notifications slot' },
  { file: 'topbar/icons/gear.svg', use: 'settings slot' },
  { file: 'skill-card-icons/c01…c40', use: 'skill card artwork, 40 слотов' },
  { file: 'brand.md', use: 'эмблема: скрещенные свечи + щит арены; запрет буквального фитиля' },
  { file: 'style-tone.txt', use: 'тон текстов' },
];

/* ========================= PAGE INVENTORY P01–P34 ========================= */
export type Section = 'ONBOARDING' | 'ACADEMY' | 'ARENA' | 'PROFILE' | 'SYSTEM';
export interface PageDef {
  id: string; title: string; section: Section; state: string;
  variants: string[]; source: string; kind: Kind; goal: string; cta: string;
}
export type Kind =
  | 'welcome' | 'tutorial' | 'hub' | 'chart' | 'decision' | 'seal' | 'reveal'
  | 'score' | 'insight' | 'leaderboard' | 'cinematic' | 'evidence' | 'skills'
  | 'session' | 'postloss' | 'missions' | 'energy' | 'store' | 'referral'
  | 'empty' | 'error' | 'toast' | 'sheet' | 'rationale' | 'invalidation'
  | 'unfamiliar' | 'debrief' | 'profile' | 'noattempts' | 'academy' | 'feedback'
  | 'completed';

const V4 = ['A', 'B', 'C', 'D'];
const V3 = ['A', 'B', 'C'];

export const PAGES: PageDef[] = [
  { id:'P01', title:'Загрузка / Splash', section:'ONBOARDING', state:'loading', variants:V4, source:'game.html · первое открытие', kind:'welcome', goal:'Загрузить данные и обозначить продукт', cta:'Продолжить' },
  { id:'P02', title:'Intro: первый заход', section:'ONBOARDING', state:'intro', variants:V4, source:'game.html · первые 8 минут', kind:'cinematic', goal:'Объяснить: обучение проходит на Арене', cta:'Начать первый заход' },
  { id:'P03', title:'Заход 1: найди движение', section:'ARENA', state:'tutorial run 1 · action', variants:V4, source:'game.html · заход 1', kind:'tutorial', goal:'Научить указывать значимый участок графика', cta:'Проверить' },
  { id:'P04', title:'Заход 1: feedback', section:'ARENA', state:'tutorial run 1 · feedback', variants:V3, source:'game.html · заход 1', kind:'feedback', goal:'Объяснить правильное и неправильное нажатие', cta:'Показать продолжение' },
  { id:'P05', title:'Заход 1: Reveal', section:'ARENA', state:'tutorial run 1 · reveal', variants:V4, source:'game.html · заход 1', kind:'reveal', goal:'Показать историческое продолжение', cta:'К оценке' },
  { id:'P06', title:'Заход 1: Score', section:'ARENA', state:'tutorial run 1 · score', variants:V4, source:'game.html · заход 1', kind:'score', goal:'Оценить процесс первого действия', cta:'Второй заход' },
  { id:'P07', title:'Заход 2: новые факты', section:'ARENA', state:'tutorial run 2 · intro', variants:V3, source:'game.html · заход 2', kind:'cinematic', goal:'Добавить факты до решения', cta:'Открыть факты' },
  { id:'P08', title:'Заход 2: факты', section:'ARENA', state:'tutorial run 2 · facts', variants:V4, source:'game.html · заход 2', kind:'evidence', goal:'Изучить факты и отделить шум', cta:'К графику' },
  { id:'P09', title:'Заход 2: график', section:'ARENA', state:'tutorial run 2 · chart', variants:V4, source:'game.html · заход 2', kind:'chart', goal:'Связать факты с графиком до t0', cta:'Выбрать решение' },
  { id:'P10', title:'Заход 2: решение', section:'ARENA', state:'tutorial run 2 · decision', variants:V4, source:'game.html · заход 2', kind:'decision', goal:'Выбрать ENTER, WAIT или NO_TRADE', cta:'Обосновать' },
  { id:'P11', title:'Обоснование решения', section:'ARENA', state:'rationale required', variants:V4, source:'MVP rule · обязательное обоснование', kind:'rationale', goal:'Выбрать доказательства решения', cta:'Подтвердить обоснование' },
  { id:'P12', title:'Инвалидация', section:'ARENA', state:'invalidation required', variants:V4, source:'MVP rule · инвалидация', kind:'invalidation', goal:'Задать условие отмены идеи', cta:'Зафиксировать условие' },
  { id:'P13', title:'Seal', section:'ARENA', state:'sealing / sealed', variants:V3, source:'MVP flow · Seal', kind:'seal', goal:'Необратимо зафиксировать решение', cta:'Запечатать' },
  { id:'P14', title:'Заход 2: Reveal', section:'ARENA', state:'revealing / event / explained', variants:V4, source:'MVP flow · Reveal', kind:'reveal', goal:'Дорисовать историю после Seal', cta:'К оценке' },
  { id:'P15', title:'Заход 2: Score', section:'ARENA', state:'process score', variants:V4, source:'MVP rule · оценка процесса', kind:'score', goal:'Оценить факты, риск и дисциплину', cta:'Третий заход' },
  { id:'P16', title:'Заход 3: полный сценарий', section:'ARENA', state:'tutorial run 3 · intro', variants:V3, source:'game.html · заход 3', kind:'cinematic', goal:'Открыть полный цикл без подсказок', cta:'Начать полный заход' },
  { id:'P17', title:'Заход 3: досье', section:'ARENA', state:'full facts', variants:V4, source:'game.html · заход 3', kind:'evidence', goal:'Изучить все факты', cta:'К графику' },
  { id:'P18', title:'Незнакомая тема', section:'ARENA', state:'unknown topic · no penalty', variants:V3, source:'MVP rule · незнакомая тема', kind:'unfamiliar', goal:'Разрешить пропуск без штрафа', cta:'Изучить / Пропустить без штрафа' },
  { id:'P19', title:'Заход 3: график', section:'ARENA', state:'full chart pre-decision', variants:V4, source:'game.html · полный заход', kind:'chart', goal:'Проанализировать прошлое до t0', cta:'К решению' },
  { id:'P20', title:'Заход 3: решение', section:'ARENA', state:'ENTER / WAIT / NO_TRADE', variants:V4, source:'MVP rule · решения', kind:'decision', goal:'Принять полноценное решение', cta:'Обосновать' },
  { id:'P21', title:'Заход 3: обоснование', section:'ARENA', state:'rationale required', variants:V4, source:'MVP rule · обоснование', kind:'rationale', goal:'Привязать решение к фактам', cta:'Подтвердить' },
  { id:'P22', title:'Заход 3: инвалидация', section:'ARENA', state:'invalidation required', variants:V4, source:'MVP rule · инвалидация', kind:'invalidation', goal:'Определить отмену идеи', cta:'Зафиксировать' },
  { id:'P23', title:'Заход 3: Seal', section:'ARENA', state:'sealing / sealed', variants:V3, source:'MVP flow · Seal', kind:'seal', goal:'Зафиксировать полный план', cta:'Запечатать' },
  { id:'P24', title:'Заход 3: Reveal', section:'ARENA', state:'revealing / event / explained', variants:V4, source:'MVP flow · Reveal', kind:'reveal', goal:'Показать исторический исход', cta:'К оценке' },
  { id:'P25', title:'Заход 3: Score', section:'ARENA', state:'process score', variants:V4, source:'MVP rule · оценка процесса', kind:'score', goal:'Оценить качество процесса', cta:'Разбор' },
  { id:'P26', title:'Debrief', section:'ARENA', state:'debrief', variants:V4, source:'game.html · разбор', kind:'debrief', goal:'Сопоставить решение, факты и исход', cta:'Открыть Академию' },
  { id:'P27', title:'Заход завершён', section:'ARENA', state:'completed', variants:V3, source:'game.html · завершение захода', kind:'completed', goal:'Закрыть цикл и назвать следующий шаг', cta:'Открыть Академию' },
  { id:'P28', title:'Академия', section:'ACADEMY', state:'locked / unlocked / progress', variants:V4, source:'game.html · Академия открывается после нехватки приёма', kind:'academy', goal:'Устранить конкретный пробел после разбора', cta:'Открыть тему' },
  { id:'P29', title:'Skill Card', section:'ACADEMY', state:'locked / unlocked / upgraded', variants:V4, source:'game.html · колода карт навыков', kind:'skills', goal:'Изучить и применить навык', cta:'Добавить в колоду' },
  { id:'P30', title:'Arena Hub', section:'ARENA', state:'ready / locked mode', variants:V4, source:'game.html · полный заход на Арену', kind:'hub', goal:'Выбрать режим и начать следующий сценарий', cta:'Начать сценарий дня' },
  { id:'P31', title:'Профиль', section:'PROFILE', state:'progress / history', variants:V4, source:'game.html · профиль', kind:'profile', goal:'Показать прогресс без финансовых обещаний', cta:'Открыть историю' },
  { id:'P32', title:'Нет попыток', section:'SYSTEM', state:'no attempts / locked', variants:V3, source:'game.html · обслуживающие состояния', kind:'noattempts', goal:'Остановить вход и объяснить восстановление', cta:'Вернуться / дождаться' },
  { id:'P33', title:'Пустое состояние', section:'SYSTEM', state:'empty', variants:V3, source:'game.html · обслуживающие состояния', kind:'empty', goal:'Показать отсутствие истории без fake data', cta:'Начать сценарий' },
  { id:'P34', title:'Ошибка загрузки', section:'SYSTEM', state:'error / retry', variants:V3, source:'game.html · обслуживающие состояния', kind:'error', goal:'Объяснить ошибку и повторную попытку', cta:'Повторить' },
];

/* Variant layout names — layout/interaction differs, style does not */
export const VARIANT_LABEL: Record<string, string> = {
  A: 'Stack', B: 'Split', C: 'Focus', D: 'Dense',
};
export const VARIANT_NOTE: Record<string, string> = {
  A: 'вертикальный поток, крупный главный блок, CTA внизу',
  B: 'два столбца, вторичная панель справа, CTA в линию',
  C: 'максимум главного визуала, плавающий CTA, минимум хрома',
  D: 'плотная сетка, больше данных, компактные строки',
};

/* ========================= SKILL CARDS c01–c40 ========================= */
export type Group = 'green' | 'yellow' | 'blue' | 'red';
export const GROUP_HEX: Record<Group, string> = {
  green: '#2E7F5C', yellow: '#D0B24A', blue: '#4C6180', red: '#C56861',
};
export interface Skill { id: string; file: string; src: string; name: string; group: Group; tier: number; owned: boolean; }

const RAW: [string, string, number, boolean][] = [
  ['c01_market_structure','Структура рынка',2,true],
  ['c02_higher_timeframe','Старший таймфрейм',3,true],
  ['c03_volume_confirmation','Подтверждение объёмом',4,true],
  ['c04_liquidity_map','Карта ликвидности',3,true],
  ['c05_volatility_context','Контекст волатильности',2,true],
  ['c06_correlation_check','Проверка корреляции',4,false],
  ['c07_derivatives_pulse','Пульс деривативов',5,false],
  ['c08_news_context','Контекст новостей',2,true],
  ['c09_social_sentiment','Соц. сентимент',3,true],
  ['c10_macro_context','Макро-контекст',4,false],
  ['c11_onchain_flow','Ончейн-потоки',5,false],
  ['c12_tokenomics_review','Разбор токеномики',4,false],
  ['c13_unlock_calendar','Календарь анлоков',3,true],
  ['c14_infrastructure_risk','Риск инфраструктуры',2,true],
  ['c15_source_quality','Качество источника',3,true],
  ['c16_enter_now','Войти сразу',1,true],
  ['c17_wait_for_retest','Ждать ретест',3,true],
  ['c18_define_entry_zone','Зона входа',4,true],
  ['c19_define_invalidation','Инвалидация',4,true],
  ['c20_set_structural_stop','Структурный стоп',5,false],
  ['c21_target_liquidity','Цель — ликвидность',3,true],
  ['c22_minimum_r_multiple','Минимальный R',4,false],
  ['c23_scale_out','Частичный выход',5,false],
  ['c24_no_trade_is_a_decision','Отказ — тоже решение',2,true],
  ['c25_evidence_only','Только доказательства',5,false],
  ['c26_noise_quarantine','Карантин шума',4,true],
  ['c27_risk_first_mode','Риск прежде всего',5,false],
  ['c28_no_confirmation_no_trade','Нет подтверждения — нет входа',4,true],
  ['c29_higher_timeframe_check','Сверка со старшим ТФ',3,true],
  ['c30_after_a_loss','После убытка',2,true],
  ['c31_discipline_over_profit','Дисциплина выше прибыли',5,false],
  ['c32_out_of_market_is_normal','Вне рынка — норма',3,true],
  ['c33_news_is_not_a_signal','Новость — не сигнал',4,true],
  ['c34_wait_for_stabilization','Ждать стабилизации',2,true],
  ['c35_do_not_chase','Не догонять',3,true],
  ['c36_avoid_revenge_trading','Без отыгрыша',4,true],
  ['c37_no_averaging_without_a_plan','Без усреднения вслепую',5,false],
  ['c38_risk_cap','Потолок риска',4,true],
  ['c39_confidence_check','Проверка уверенности',3,true],
  ['c40_preserve_the_system','Сохранить систему',5,false],
];

export const SKILLS: Skill[] = RAW.map(([file, name, tier, owned], i) => {
  const n = i + 1;
  const group: Group = n <= 15 ? 'green' : n <= 24 ? 'yellow' : n <= 33 ? 'blue' : 'red';
  const filename = `${file}.svg`;
  return { id: file.slice(0, 3), file: filename, src: repoAsset(`skill-card-icons/${filename}`), name, group, tier, owned };
});

/* ========================= SCENARIO / CHART DATA ========================= */
export interface Candle { o: number; h: number; l: number; c: number; v: number }

/* Historical-style series. Index 0..27 = past (visible), 28..43 = future (sealed) */
function series(): Candle[] {
  const out: Candle[] = [];
  let price = 66980;
  const drift = [
    6, 14, -4, 18, 9, -12, 22, 7, -6, 16, 28, -9, 12, 5,
    -18, -26, 9, -14, 7, 21, 33, 12, -7, 18, 26, 41, 15, -6,
    -34, -58, -41, -72, -26, 18, -44, -66, -31, 12, 24, 38, 19, 46, 27, 33,
  ];
  for (let i = 0; i < drift.length; i++) {
    const o = price;
    const c = price + drift[i] * 1.9;
    const pad = 22 + (i % 5) * 9;
    out.push({ o, c, h: Math.max(o, c) + pad, l: Math.min(o, c) - pad, v: 40 + ((i * 37) % 60) });
    price = c;
  }
  return out;
}
export const CANDLES = series();
export const T0 = 28;                      // decision index — future starts here
export const DROP_START = 28, DROP_END = 35; // the visible fall zone after reveal
export const TUTORIAL_TARGET = 21;         // candle player must tap in first lesson

export interface Choice { id: string; label: string; sub: string; tone: Group; correct?: boolean }
export const CHOICES: Choice[] = [
  { id: 'enter',    label: 'ENTER',     sub: 'войти по заданному плану', tone: 'yellow' },
  { id: 'wait',     label: 'WAIT',      sub: 'ждать подтверждение или ретест', tone: 'green', correct: true },
  { id: 'no_trade', label: 'NO_TRADE',  sub: 'условий для сделки нет', tone: 'blue' },
  { id: 'study',    label: 'ИЗУЧИТЬ',   sub: 'тема незнакома — без штрафа', tone: 'red' },
];

export const EVIDENCE = [
  { tag: 'ОБЪЁМ',     title: 'Пробой без объёма',        body: 'Объём на пробое ниже средних 20 баров на 38%.', weight: 'сильная', tone: 'green' as Group },
  { tag: 'ДЕРИВАТИВЫ',title: 'Funding перегрет',         body: 'Funding 0.09% — толпа в лонгах, платит за удержание.', weight: 'средняя', tone: 'yellow' as Group },
  { tag: 'ОНЧЕЙН',    title: 'Кит перевёл 800 BTC',      body: 'Перевод на биржу за 40 минут до пробоя.', weight: 'сильная', tone: 'blue' as Group },
  { tag: 'ШУМ',       title: 'Регулятор: новые правила', body: 'Заголовок без конкретики. Цена не отреагировала.', weight: 'ложная', tone: 'red' as Group },
];

/* Four skill slots the player can apply inside a run. Each maps to a real
   repository SVG and returns a checkable fact, never a recommendation. */
export const HAND_SLOTS: { id: string; label: string; skill: string; reading: string; locked?: boolean }[] = [
  { id: 'trend',  label: 'ТРЕНД',  skill: 'c01', reading: 'Последний слом структуры вниз. Серия максимумов не обновляется 6 баров.' },
  { id: 'volume', label: 'ОБЪЁМ',  skill: 'c03', reading: 'Объём на пробое ниже средних 20 баров на 38%. Движение без денег.' },
  { id: 'risk',   label: 'РИСК',   skill: 'c27', reading: 'Ближайшая инвалидация в 0.4% от цены. Риск на сделку укладывается в 1R.' },
  { id: 'wait',   label: 'ЖДАТЬ',  skill: 'c17', reading: 'Уровень не ретестирован. Подтверждения входа сейчас нет.' },
];

export const SCORE_ROWS = [
  { k: 'Тайминг',     v: 74, hint: 'вход после подтверждения' },
  { k: 'R:R',         v: 88, hint: 'риск 1 : прибыль 3.2' },
  { k: 'Дисциплина',  v: 95, hint: 'инвалидация задана до входа' },
  { k: 'Чтение улик', v: 61, hint: 'ложная новость учтена частично' },
];

export const LEADERS = [
  { rank: 1, name: '@trader_pro',   pts: 2450, you: false, delta: 2 },
  { rank: 2, name: '@crypto_knight',pts: 2310, you: false, delta: -1 },
  { rank: 3, name: '@you',          pts: 2180, you: true,  delta: 4 },
  { rank: 4, name: '@whale_hunter', pts: 1350, you: false, delta: 0 },
  { rank: 5, name: '@fomo_queen',   pts: 1160, you: false, delta: -2 },
];

export const MISSIONS = [
  { t: 'Запечатать 3 решения',       cur: 2, max: 3, reward: 40 },
  { t: 'Пройти урок академии',       cur: 1, max: 1, reward: 25 },
  { t: 'Отказаться от входа 1 раз',  cur: 0, max: 1, reward: 30 },
];

export const LESSONS = [
  { n: 1, title: 'Структура рынка', idea: 'Цена движется уровнями, а не линиями. Найди последний слом структуры — он задаёт контекст.', action: 'Найди свечу, которая сломала структуру', skill: 'c01' },
  { n: 2, title: 'Объём подтверждает', idea: 'Пробой без объёма — заявка без денег. Объём молчит — уровень не взят.', action: 'Сравни объём на пробое и до него', skill: 'c03' },
  { n: 3, title: 'Инвалидация', idea: 'Сначала определи, что убьёт идею. Не смог сформулировать — идеи нет.', action: 'Отметь уровень отмены гипотезы', skill: 'c19' },
  { n: 4, title: 'Печать решения', idea: 'Решение необратимо. Это не жёсткость — это единственный способ измерить себя.', action: 'Запечатай решение и прими результат', skill: 'c31' },
];

export const TOASTS = [
  { kind: 'success', title: 'Решение запечатано', body: 'Гипотеза записана в журнал' },
  { kind: 'info',    title: 'Новый сценарий',     body: 'Дневная арена обновилась' },
  { kind: 'error',   title: 'Нет сети',           body: 'Данные из кэша, 4 мин назад' },
];
