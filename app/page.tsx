'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpenText,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileQuestion,
  Flag,
  HelpCircle,
  Eye,
  Lightbulb,
  LockKeyhole,
  Map,
  Medal,
  Music2,
  Printer,
  Puzzle,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

type Screen =
  | 'home'
  | 'map'
  | 'mission'
  | 'final'
  | 'review'
  | 'game'
  | 'result'
  | 'certificate';
type Kind = 'fact' | 'inference' | 'unknown';
type ReviewQuestion = { id: string; q: string; opts: string[]; a: number; explain: string };
type Mission = {
  id: number;
  kicker: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  image: string;
  scene: string;
  prompt: string;
  clues: { icon: string; label: string; quote: string; detail: string }[];
  question: string;
  options: string[];
  answer: number;
  hint: string;
  explain: string;
  structureQuestion: string;
  structureOptions: string[];
  structureAnswer: number;
  structureExplain: string;
};

const missions: Mission[] = [
  {
    id: 0,
    kicker: '第一幕｜危城中的選擇',
    title: '二千五百對十五萬',
    subtitle: '先看清楚孔明面對的限制',
    icon: '危',
    color: 'amber',
    image: './images/mission-crisis.png',
    scene:
      '街亭失守後，孔明分批調度兵馬。城中沒有大將，五千名士兵又有一半外出搬運糧草。就在此時，司馬懿率領十五萬大軍朝西城蜂擁而來。',
    prompt: '逐一查閱四份軍情，判斷孔明為何不能依照一般方式迎戰。',
    clues: [
      {
        icon: '亭',
        label: '街亭失守',
        quote: '孔明因街亭失守，分兵調遣，只帶領五千兵馬來到西城。',
        detail: '前線失利後，孔明必須立即重新分配人力與兵馬。',
      },
      {
        icon: '兵',
        label: '兵力懸殊',
        quote: '忽然飛馬來報：「司馬懿帶領十五萬大軍，往西城蜂擁而來。」',
        detail: '西城只有二千五百名士兵，魏軍卻有十五萬人。',
      },
      {
        icon: '將',
        label: '城中無大將',
        quote: '孔明身邊沒有大將，只有一些文官。',
        detail: '孔明身邊只有一些文官，難以正面組織守城。',
      },
      {
        icon: '退',
        label: '無法逃遠',
        quote: '眾官聽到消息，個個嚇得臉色發白。',
        detail: '棄城也很可能在途中被魏軍追上。',
      },
    ],
    question: '孔明為什麼說使用空城計是「迫不得已」？',
    options: [
      '他想向眾人展示琴藝',
      '正面迎戰沒有勝算，棄城也難以逃脫',
      '他早知道魏軍一定不會進城',
      '他不願讓搬糧士兵回城',
    ],
    answer: 1,
    hint: '把「迎戰」和「逃跑」兩條路放回當時的兵力差距中思考。',
    explain:
      '城內兵力遠少於魏軍，身邊又沒有大將；若棄城也很難逃遠。空城計是限制下的求生策略。',
    structureQuestion: '這一幕在故事架構中主要負責什麼？',
    structureOptions: [
      '交代危機的起因與人物面臨的限制',
      '說明魏軍撤退後的結果',
      '描寫孔明獲得眾人稱讚',
      '解釋司馬懿如何識破計謀',
    ],
    structureAnswer: 0,
    structureExplain:
      '第一幕交代街亭失守、兵力不足與魏軍逼近，是整個故事發生的起因。',
  },
  {
    id: 1,
    kicker: '第二幕｜城門前的疑陣',
    title: '平靜表象下的布局',
    subtitle: '每個細節都在傳遞訊號',
    icon: '計',
    color: 'teal',
    image: './images/mission-ruse.png',
    scene:
      '孔明登上城門確認敵情後，下令藏起旗幟、禁止喧鬧，接著大開四座城門，讓士兵扮成百姓掃街，自己則在城樓上薰香彈琴。',
    prompt: '翻開四項布置，找出它們共同想讓魏軍相信的事情。',
    clues: [
      {
        icon: '旗',
        label: '藏起旗幟',
        quote: '孔明傳令，把所有旗幟都藏起來，城裡的人不許隨便出入，也不許高聲說話。',
        detail: '避免魏軍從旗幟與調動看出守軍不足。',
      },
      {
        icon: '門',
        label: '四門大開',
        quote: '大開四面城門，每個城門口派二十名士兵，扮成百姓模樣。',
        detail: '用違反常理的舉動引起敵人懷疑。',
      },
      {
        icon: '掃',
        label: '從容掃街',
        quote: '士兵低頭灑水掃街，即使魏兵到了，也不許驚慌。',
        detail: '營造敵軍到來也毫不緊張的假象。',
      },
      {
        icon: '琴',
        label: '城樓彈琴',
        quote: '孔明披上鶴毛大衣，戴上絲織頭巾，帶著兩名書僮，在城樓上彈琴。',
        detail: '以氣定神閒強化「早有準備」的印象。',
      },
    ],
    question: '「開城門、掃街、彈琴」的共同目的為何？',
    options: [
      '讓魏軍看見西城生活熱鬧',
      '等待百姓全部逃走',
      '讓司馬懿懷疑城內設有埋伏',
      '向魏軍表示願意投降',
    ],
    answer: 2,
    hint: '大軍逼近時，「太平靜」本身可能代表什麼？',
    explain: '孔明把不合常理的平靜組合成疑陣，讓司馬懿無法確定城內真實兵力。',
    structureQuestion: '這一幕最適合放在故事架構的哪個位置？',
    structureOptions: [
      '起因：街亭失守',
      '經過：孔明布置疑陣',
      '結果：眾人折服',
      '主旨：不可只看表面',
    ],
    structureAnswer: 1,
    structureExplain:
      '藏旗、開門、掃街與彈琴，是孔明面對危機後採取的主要行動，屬於故事經過。',
  },
  {
    id: 2,
    kicker: '第三幕｜司馬懿的判斷',
    title: '同一景象兩種解讀',
    subtitle: '觀察是真的，解釋未必正確',
    icon: '疑',
    color: 'violet',
    image: './images/mission-judgment.png',
    scene:
      '司馬懿親眼看見城門大開、百姓掃街、孔明從容彈琴。司馬昭認為城中可能無兵，司馬懿卻根據孔明一向謹慎的印象，判定城內必有埋伏。',
    prompt: '比較兩人的解釋，分清楚「看見的事實」與「對事實的推論」。',
    clues: [
      {
        icon: '見',
        label: '共同觀察',
        quote: '司馬懿來到城下，看見孔明坐在城樓上，笑容滿面，正在燒香彈琴。',
        detail: '兩人都看見城門大開、孔明彈琴與百姓掃街。',
      },
      {
        icon: '昭',
        label: '司馬昭推論',
        quote: '司馬昭說：「莫非孔明沒有兵，故意做出這個樣子來？」',
        detail: '城中可能無軍，所以故布疑陣。',
      },
      {
        icon: '懿',
        label: '司馬懿推論',
        quote: '司馬懿說：「孔明一生謹慎，從來不冒險。城裡一定埋伏了軍隊。」',
        detail: '孔明一向謹慎，因此城內必有埋伏。',
      },
      {
        icon: '真',
        label: '真相',
        quote: '司馬懿的軍隊退去後，孔明拍手大笑，眾官才鬆了一口氣。',
        detail: '城中確實兵力不足，平靜是刻意安排的。',
      },
    ],
    question: '司馬懿中了空城計，最主要是因為什麼？',
    options: [
      '他沒有親自查看西城',
      '他過度依賴孔明一向謹慎的印象',
      '他不知道孔明是蜀漢丞相',
      '他只想帶軍隊到北方休息',
    ],
    answer: 1,
    hint: '司馬懿看見的景象沒有錯；關鍵在他如何解釋。',
    explain:
      '他把孔明過去謹慎的形象當成最重要前提，因此將異常解釋成「城中有伏兵」。',
    structureQuestion: '哪一項最能摘要這一幕的轉折與結果？',
    structureOptions: [
      '孔明決定搬運糧草',
      '司馬昭接替父親領軍',
      '司馬懿把疑陣當成伏兵，因而撤軍',
      '西城關閉城門抵抗魏軍',
    ],
    structureAnswer: 2,
    structureExplain:
      '司馬懿對景象的解釋促使他撤軍，使故事從危機轉向空城計成功。',
  },
  {
    id: 3,
    kicker: '第四幕｜退兵後的真相',
    title: '神機妙算的背後',
    subtitle: '從結果回看孔明的完整思考',
    icon: '解',
    color: 'teal',
    image: './images/mission-aftermath.png',
    scene: '魏軍撤離後，孔明說明司馬懿因熟悉自己一向謹慎，才會把空城疑陣判成伏兵；同時，他早已命關興、張苞在北方山路埋伏。',
    prompt: '閱讀第五、六段的四份情報，分析空城計成功不是只靠運氣的原因。',
    clues: [
      { icon: '退', label: '魏軍撤退', quote: '司馬懿讓後軍改作前軍，前軍作後軍，朝著北方山路撤退。', detail: '司馬懿把眼前的異常平靜解釋成危險訊號，立即改變軍隊行進方向。' },
      { icon: '識', label: '知己知彼', quote: '司馬懿推測我平生謹慎，必不輕易冒險，見如此模樣，疑有伏兵，所以退去。', detail: '孔明掌握司馬懿對自己的認識，反過來利用這份既有印象。' },
      { icon: '迫', label: '迫不得已', quote: '我絕非想要冒險，實在是迫不得已呀！', detail: '空城計不是任性冒險，而是在兵力不足、難以迎戰或逃跑時的選擇。' },
      { icon: '伏', label: '北方伏兵', quote: '我已經命令關興、張苞二位將軍在那邊埋伏。', detail: '孔明不只布疑陣，也預判撤退路線並安排後手，顯示完整部署。' },
    ],
    question: '第五、六段最能證明空城計並非只靠運氣的線索是什麼？',
    options: ['孔明在城樓上拍手大笑', '眾官仍然驚魂未定', '孔明預判魏軍會走北方山路，並先派將軍埋伏', '司馬昭向父親提出問題'],
    answer: 2,
    hint: '找一找孔明除了布置空城，還提前做了什麼安排。',
    explain: '孔明掌握司馬懿的性格，也預測撤退方向並安排伏兵，顯示計策包含判斷與後備部署。',
    structureQuestion: '第四幕在完整架構圖中應該歸入哪一部分？',
    structureOptions: ['起因：街亭失守', '諸葛亮布疑陣', '司馬懿的判斷', '結果分析：退兵原因與孔明後手'],
    structureAnswer: 3,
    structureExplain: '第四幕從撤軍結果回頭分析成功原因，也揭示孔明迫不得已與預先布置伏兵。',
  },
];

const finalQuestions = [
  {
    level: '提取訊息',
    q: '魏軍逼近時，西城還剩多少名士兵？',
    opts: ['二千五百名', '五千名', '一萬五千名', '十五萬名'],
    a: 0,
  },
  {
    level: '事件排序',
    q: '哪一組最符合孔明行動的先後順序？',
    opts: [
      '彈琴→確認敵情→開門→藏旗',
      '確認敵情→藏旗禁聲→開門→彈琴',
      '開門→棄城→埋伏→彈琴',
      '藏旗→關門→迎戰→撤退',
    ],
    a: 1,
  },
  {
    level: '證據判讀',
    q: '哪一項最能證明空城計不是孔明隨意冒險？',
    opts: [
      '孔明帶了兩名書僮',
      '魏軍揚起沖天塵土',
      '孔明先確認敵情，並預先在北方安排伏兵',
      '城門內外有人掃街',
    ],
    a: 2,
  },
  {
    level: '詮釋整合',
    q: '孔明平時「謹慎」的形象，為何反而幫助他冒險？',
    opts: [
      '讓司馬懿相信反常行動背後另有安排',
      '讓士兵以為孔明從不失敗',
      '讓魏軍不知道孔明會彈琴',
      '讓百姓自動加入蜀軍',
    ],
    a: 0,
  },
  {
    level: '比較評估',
    q: '若司馬懿先派少量士兵入城試探，空城計最可能面臨什麼風險？',
    opts: [
      '琴聲會變得更好聽',
      '城內兵力不足的真相可能被發現',
      '十五萬魏軍會消失',
      '司馬昭會改為守城',
    ],
    a: 1,
  },
];

const cards: { text: string; kind: Kind; reason: string }[] = [
  {
    text: '城內只剩二千五百名士兵。',
    kind: 'fact',
    reason: '這是課文直接交代的兵力數字。',
  },
  {
    text: '禁止喧鬧也能避免疑陣被識破。',
    kind: 'inference',
    reason: '課文有禁令；「避免露餡」是依情境作出的合理解釋。',
  },
  {
    text: '孔明彈琴時完全不害怕。',
    kind: 'unknown',
    reason: '課文只寫外在從容，沒有直接說明他的內心。',
  },
  {
    text: '司馬懿親自到城下查看。',
    kind: 'fact',
    reason: '這是故事中明確發生的行動。',
  },
  {
    text: '司馬懿只因膽小才撤兵。',
    kind: 'unknown',
    reason: '課文呈現的是謹慎判斷，不能只用「膽小」概括。',
  },
  {
    text: '若掃街者驚慌逃跑，計策更容易失敗。',
    kind: 'inference',
    reason: '這會破壞平靜假象，是有根據的合理推論。',
  },
  {
    text: '司馬昭提出城中可能無兵。',
    kind: 'fact',
    reason: '司馬昭在對話中直接提出這個可能。',
  },
  {
    text: '孔明的嚴令也有穩定軍心的作用。',
    kind: 'inference',
    reason: '從危急局勢與禁令可以合理推知這層作用。',
  },
  {
    text: '司馬懿若攻城一定會戰敗。',
    kind: 'unknown',
    reason: '故事沒有實際發生這條路線，無法確定結果。',
  },
];
const labels: Record<Kind, [string, string]> = {
  fact: ['課文明示', '文字直接告訴我們'],
  inference: ['合理推論', '根據證據可以推得'],
  unknown: ['無法確定', '證據不足，不能斷言'],
};

const shuffleIndexes = (length: number) => {
  const values = Array.from({ length }, (_, i) => i);
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
};

const reviewBank: ReviewQuestion[] = [
  ...missions.flatMap((m, i) => [
    { id: `mission-${i}`, q: m.question, opts: m.options, a: m.answer, explain: m.explain },
    { id: `structure-${i}`, q: m.structureQuestion, opts: m.structureOptions, a: m.structureAnswer, explain: m.structureExplain },
  ]),
  ...finalQuestions.map((q, i) => ({ id: `final-${i}`, q: q.q, opts: q.opts, a: q.a, explain: '重新比對課文線索後，這就是最符合文意的答案。' })),
];

const solvedPuzzle = Array.from({ length: 9 }, (_, i) => i);
const puzzleHintQuestions = [
  {
    q: '《三國演義》的作者一般認為是誰？',
    opts: ['羅貫中', '施耐庵', '吳承恩', '曹雪芹'],
    a: 0,
    explain: '《三國演義》是元末明初的章回小說，一般認為作者是羅貫中。',
  },
  {
    q: '諸葛亮最常使用的別稱是哪一個？',
    opts: ['臥龍', '鳳雛', '美髯公', '小霸王'],
    a: 0,
    explain: '諸葛亮號孔明，也被稱為「臥龍」。',
  },
  {
    q: '劉備為了請諸葛亮出山，留下哪個著名典故？',
    opts: ['三顧茅廬', '望梅止渴', '刮骨療傷', '煮酒論英雄'],
    a: 0,
    explain: '劉備三次拜訪諸葛亮居住的草廬，後來成為「三顧茅廬」的典故。',
  },
  {
    q: '諸葛亮在「隆中對」中，向劉備提出什麼重要構想？',
    opts: ['三分天下', '挾天子以令諸侯', '火燒連營', '遷都洛陽'],
    a: 0,
    explain: '諸葛亮在隆中分析天下局勢，提出聯吳抗曹、形成三分天下的構想。',
  },
  {
    q: '「草船借箭」中，諸葛亮利用哪種天候掩護船隊？',
    opts: ['大霧', '暴雪', '烈日', '沙塵暴'],
    a: 0,
    explain: '諸葛亮利用江面大霧遮蔽視線，使曹軍不敢貿然出擊，只能放箭。',
  },
  {
    q: '諸葛亮協助劉備建立的是哪一個政權？',
    opts: ['蜀漢', '曹魏', '東吳', '西晉'],
    a: 0,
    explain: '劉備在成都建立蜀漢，諸葛亮是蜀漢的重要丞相。',
  },
  {
    q: '諸葛亮在〈出師表〉中勸勉的君主是誰？',
    opts: ['劉禪', '劉備', '孫權', '曹丕'],
    a: 0,
    explain: '諸葛亮北伐前寫〈出師表〉給後主劉禪，勸他親賢臣、遠小人。',
  },
  {
    q: '赤壁之戰中，聯合對抗曹操的是哪兩方勢力？',
    opts: ['孫權與劉備', '劉備與曹操', '孫權與司馬懿', '袁紹與董卓'],
    a: 0,
    explain: '孫權與劉備組成孫劉聯軍，在赤壁共同對抗曹操。',
  },
  {
    q: '諸葛亮多次北伐，主要想討伐哪一個政權？',
    opts: ['曹魏', '東吳', '西晉', '蜀漢'],
    a: 0,
    explain: '諸葛亮北伐的主要目標是曹魏，希望完成興復漢室的志業。',
  },
  {
    q: '相傳「木牛流馬」主要用來解決什麼問題？',
    opts: ['運送軍糧', '傳遞軍令', '攻破城門', '測量天象'],
    a: 0,
    explain: '木牛流馬相傳是諸葛亮設計的運輸工具，用來協助運送北伐軍糧。',
  },
  {
    q: '諸葛亮最後病逝於哪一個地方？',
    opts: ['五丈原', '長坂坡', '華容道', '白帝城'],
    a: 0,
    explain: '諸葛亮在北伐期間積勞成疾，最後病逝於五丈原。',
  },
];
const puzzleNeighbors = (position: number) => {
  const row = Math.floor(position / 3);
  const col = position % 3;
  return [
    row > 0 ? position - 3 : -1,
    row < 2 ? position + 3 : -1,
    col > 0 ? position - 1 : -1,
    col < 2 ? position + 1 : -1,
  ].filter((n) => n >= 0);
};
const puzzleAssistPath = (start: number[], limit = 2) => {
  const goalKey = solvedPuzzle.join('');
  const startKey = start.join('');
  if (startKey === goalKey) return [];
  const queue: number[][] = [[...start]];
  const parents = new globalThis.Map<string, string | null>([[startKey, null]]);
  let head = 0;
  while (head < queue.length) {
    const board = queue[head++];
    const boardKey = board.join('');
    const blank = board.indexOf(8);
    for (const position of puzzleNeighbors(blank)) {
      const next = [...board];
      [next[blank], next[position]] = [next[position], next[blank]];
      const nextKey = next.join('');
      if (parents.has(nextKey)) continue;
      parents.set(nextKey, boardKey);
      if (nextKey === goalKey) {
        const path: string[] = [];
        let cursor: string | null = nextKey;
        while (cursor && cursor !== startKey) {
          path.unshift(cursor);
          cursor = parents.get(cursor) ?? null;
        }
        return path.slice(0, limit).map((key) => key.split('').map(Number));
      }
      queue.push(next);
    }
  }
  return [];
};
const shuffledPuzzle = () => {
  const board = [...solvedPuzzle];
  let blank = 8;
  let previous = -1;
  for (let i = 0; i < 70; i += 1) {
    const choices = puzzleNeighbors(blank).filter((n) => n !== previous);
    const next = choices[Math.floor(Math.random() * choices.length)];
    [board[blank], board[next]] = [board[next], board[blank]];
    previous = blank;
    blank = next;
  }
  return board;
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home'),
    [name, setName] = useState(''),
    [completed, setCompleted] = useState<number[]>([]),
    [active, setActive] = useState(0),
    [clues, setClues] = useState<number[]>([]),
    [viewClue, setViewClue] = useState<number | null>(null),
    [selected, setSelected] = useState<number | null>(null),
    [optionOrder, setOptionOrder] = useState<number[]>([0, 1, 2, 3]),
    [checked, setChecked] = useState(false),
    [wrong, setWrong] = useState(false),
    [structureSelected, setStructureSelected] = useState<number | null>(null),
    [structureOrder, setStructureOrder] = useState<number[]>([0, 1, 2, 3]),
    [structureChecked, setStructureChecked] = useState(false),
    [fi, setFi] = useState(0),
    [answers, setAnswers] = useState<number[]>([]),
    [finalOrders, setFinalOrders] = useState<number[][]>([]),
    [wrongIds, setWrongIds] = useState<string[]>([]),
    [reviewIds, setReviewIds] = useState<string[]>([]),
    [reviewIndex, setReviewIndex] = useState(0),
    [reviewSelected, setReviewSelected] = useState<number | null>(null),
    [reviewOrder, setReviewOrder] = useState<number[]>([0, 1, 2, 3]),
    [reviewWrong, setReviewWrong] = useState(false),
    [puzzleTiles, setPuzzleTiles] = useState<number[]>(solvedPuzzle),
    [puzzleSeconds, setPuzzleSeconds] = useState(0),
    [puzzleDone, setPuzzleDone] = useState(false),
    [puzzleStarted, setPuzzleStarted] = useState(false),
    [showPuzzlePreview, setShowPuzzlePreview] = useState(true),
    [hintCount, setHintCount] = useState(0),
    [hintQuizOpen, setHintQuizOpen] = useState(false),
    [hintSelected, setHintSelected] = useState<number | null>(null),
    [hintWrong, setHintWrong] = useState(false),
    [hintOrder, setHintOrder] = useState<number[]>([0, 1, 2, 3]),
    [hintAnimating, setHintAnimating] = useState(false),
    [reviewPoint, setReviewPoint] = useState(0),
    [sound, setSound] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playSfx = (file: string, volume = 0.42) => {
    if (!sound) return;
    const effect = new Audio(`./sound/${file}`);
    effect.volume = volume;
    void effect.play().catch(() => {});
  };
  useEffect(() => {
    const s = localStorage.getItem('empty-fort-progress');
    if (s)
      try {
        const d = JSON.parse(s);
        setName(d.name ?? '');
        setCompleted(d.completed ?? []);
      } catch {}
    const preview = new URLSearchParams(window.location.search).get('preview');
    if (preview === 'certificate') {
      setName('西城小軍師');
      setCompleted([0, 1, 2, 3]);
      setAnswers(finalQuestions.map((q) => q.a));
      setPuzzleSeconds(55);
      setPuzzleDone(true);
      setScreen('certificate');
    } else if (preview === 'mission') {
      setName('情報版面測試員');
      setCompleted([]);
      setActive(0);
      setClues([0, 1, 2, 3]);
      setViewClue(3);
      setSelected(null);
      setChecked(false);
      setWrong(false);
      setOptionOrder(shuffleIndexes(4));
      setScreen('mission');
    } else if (preview === 'puzzle') {
      setName('拼圖測試員');
      setCompleted([0, 1, 2, 3]);
      setPuzzleTiles(shuffledPuzzle());
      setPuzzleSeconds(0);
      setPuzzleDone(false);
      setPuzzleStarted(true);
      setShowPuzzlePreview(false);
      setHintCount(0);
      setHintQuizOpen(false);
      setHintSelected(null);
      setHintWrong(false);
      setHintOrder(shuffleIndexes(4));
      setHintAnimating(false);
      setScreen('game');
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      'empty-fort-progress',
      JSON.stringify({ name, completed }),
    );
  }, [name, completed]);
  useEffect(() => {
    const tracks: Record<Screen, string> = {
      home: 'The_Open_Scroll.mp3',
      map: 'The_Unfolding_Map.mp3',
      mission: [
        'The_Weight_of_the_Scroll.mp3',
        'The_Weight_of_One_String.mp3',
        'The_Measured_Page.mp3',
        'Returning_Home_in_Gold.mp3',
      ][active],
      final: 'Steps_Toward_the_Mountain.mp3',
      review: 'The_Weight_of_One_String.mp3',
      game: 'Sorting_the_Jade_Tiles.mp3',
      result: 'Returning_Home_in_Gold.mp3',
      certificate: 'Golden_Ink_on_Silk.mp3',
    };
    audioRef.current?.pause();
    const audio = new Audio(`./sound/${tracks[screen]}`);
    audio.loop = true;
    audio.volume = 0.28;
    audioRef.current = audio;
    if (sound) void audio.play().catch(() => {});
    return () => audio.pause();
  }, [screen, active, sound]);
  useEffect(() => {
    if (screen !== 'game' || !puzzleStarted || puzzleDone) return;
    const timer = window.setInterval(
      () => setPuzzleSeconds((value) => value + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [screen, puzzleStarted, puzzleDone]);
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: unknown,
            options?: { signal?: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: 'start_empty_fort_quest',
          title: '開始空城計闖關',
          description: '輸入學生姓名並開啟西城任務地圖。',
          inputSchema: {
            type: 'object',
            properties: {
              studentName: { type: 'string', minLength: 1, maxLength: 30 },
            },
            required: ['studentName'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute(input: unknown) {
            const value = input as { studentName?: unknown };
            if (
              typeof value.studentName !== 'string' ||
              !value.studentName.trim()
            )
              throw new Error('studentName 必須是非空白文字');
            const clean = value.studentName.trim().slice(0, 30);
            setName(clean);
            setScreen('map');
            return { studentName: clean, screen: 'map' };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
    return () => lifecycle.abort();
  }, []);
  const mission = missions[active],
    allClues = clues.length === 4,
    finalScore = useMemo(
      () =>
        answers.reduce(
          (s, a, i) => s + (a === finalQuestions[i].a ? 20 : 0),
          0,
        ),
      [answers],
    ),
    title =
      finalScore >= 90
        ? '神機妙算小軍師'
        : finalScore >= 70
          ? '明察秋毫情報官'
          : '沉著思考見習生',
    today = new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date()),
    gameScore = Math.max(60, 100 - Math.max(0, puzzleSeconds - 60) - hintCount * 5),
    totalScore = finalScore + gameScore,
    rank = totalScore >= 180
      ? { name: '羽扇天策大都督', className: 'rank-4', motto: '洞察全局，運籌帷幄，堪當西城最高軍略統帥。' }
      : totalScore >= 150
        ? { name: '虎符驍勇將軍', className: 'rank-3', motto: '明辨軍情，決斷果敢，足以統領守城精銳。' }
        : totalScore >= 120
          ? { name: '銀卷情報校尉', className: 'rank-2', motto: '善察線索，能解疑陣，已具情報統御之才。' }
          : { name: '銅盾西城都尉', className: 'rank-1', motto: '沉著守城，勤學善思，正式踏上軍師之路。' },
    reviewQuestion = reviewBank.find((q) => q.id === reviewIds[reviewIndex]);
  const goMission = (i: number) => {
    if (i > completed.length) return;
    setActive(i);
    setClues([]);
    setViewClue(null);
    setSelected(null);
    setOptionOrder(shuffleIndexes(missions[i].options.length));
    setChecked(false);
    setWrong(false);
    setStructureSelected(null);
    setStructureOrder(shuffleIndexes(missions[i].structureOptions.length));
    setStructureChecked(false);
    setScreen('mission');
  };
  const finish = () => {
    if (!completed.includes(active))
      setCompleted([...completed, active].sort());
    playSfx('sfx-complete.mp3', 0.34);
    setScreen('map');
  };
  const reset = () => {
    if (!confirm('確定清除姓名與所有進度嗎？')) return;
    localStorage.removeItem('empty-fort-progress');
    setName('');
    setCompleted([]);
    setWrongIds([]);
    setScreen('home');
  };
  const startGame = () => {
    setPuzzleTiles(solvedPuzzle);
    setPuzzleSeconds(0);
    setPuzzleDone(false);
    setPuzzleStarted(false);
    setShowPuzzlePreview(true);
    setHintCount(0);
    setHintQuizOpen(false);
    setHintSelected(null);
    setHintWrong(false);
    setHintOrder(shuffleIndexes(4));
    setHintAnimating(false);
    setReviewPoint(0);
    setScreen('game');
    window.setTimeout(() => {
      setPuzzleTiles(shuffledPuzzle());
      setShowPuzzlePreview(false);
      setPuzzleStarted(true);
    }, 5000);
  };
  const finishFinal = () => {
    const finalMistakes = finalQuestions
      .map((q, i) => (answers[i] === q.a ? '' : `final-${i}`))
      .filter(Boolean);
    const combined = Array.from(new Set([...wrongIds, ...finalMistakes]));
    setWrongIds(combined);
    if (!combined.length) {
      startGame();
      return;
    }
    setReviewIds(combined);
    setReviewIndex(0);
    setReviewSelected(null);
    setReviewWrong(false);
    const first = reviewBank.find((q) => q.id === combined[0]);
    setReviewOrder(shuffleIndexes(first?.opts.length ?? 4));
    setScreen('review');
  };
  const answerReview = (answerIndex: number) => {
    const question = reviewBank.find((q) => q.id === reviewIds[reviewIndex]);
    if (!question) return;
    setReviewSelected(answerIndex);
    if (answerIndex !== question.a) {
      playSfx('sfx-incorrect.mp3', 0.32);
      setReviewWrong(true);
      window.setTimeout(() => {
        setReviewSelected(null);
        setReviewWrong(false);
        setReviewOrder(shuffleIndexes(question.opts.length));
      }, 900);
      return;
    }
    playSfx('sfx-correct.mp3', 0.4);
    window.setTimeout(() => {
      if (reviewIndex === reviewIds.length - 1) {
        startGame();
      } else {
        const nextIndex = reviewIndex + 1;
        const next = reviewBank.find((q) => q.id === reviewIds[nextIndex]);
        setReviewIndex(nextIndex);
        setReviewSelected(null);
        setReviewWrong(false);
        setReviewOrder(shuffleIndexes(next?.opts.length ?? 4));
      }
    }, 700);
  };
  const movePuzzleTile = (position: number) => {
    if (!puzzleStarted || puzzleDone || showPuzzlePreview || hintQuizOpen || hintAnimating) return;
    setPuzzleTiles((current) => {
      const blank = current.indexOf(8);
      if (!puzzleNeighbors(blank).includes(position)) return current;
      playSfx('sfx-puzzle-move.mp3', 0.48);
      const next = [...current];
      [next[blank], next[position]] = [next[position], next[blank]];
      if (next.every((tile, i) => tile === i)) {
        setPuzzleDone(true);
        window.setTimeout(() => playSfx('sfx-complete.mp3', 0.36), 160);
      }
      return next;
    });
  };
  const openHintQuiz = () => {
    if (showPuzzlePreview || puzzleDone || hintAnimating || hintCount >= puzzleHintQuestions.length) return;
    setHintSelected(null);
    setHintWrong(false);
    setHintOrder(shuffleIndexes(4));
    playSfx('sfx-button.mp3', 0.3);
    setHintQuizOpen(true);
  };
  const answerHintQuiz = (answer: number) => {
    const question = puzzleHintQuestions[hintCount];
    if (!question || hintSelected !== null) return;
    setHintSelected(answer);
    if (answer !== question.a) {
      playSfx('sfx-incorrect.mp3', 0.32);
      setHintWrong(true);
      window.setTimeout(() => {
        setHintSelected(null);
        setHintWrong(false);
        setHintOrder(shuffleIndexes(question.opts.length));
      }, 900);
      return;
    }
    playSfx('sfx-correct.mp3', 0.4);
    const assistedBoards = puzzleAssistPath(puzzleTiles, 2);
    window.setTimeout(() => {
      setHintCount((value) => value + 1);
      setHintQuizOpen(false);
      setHintSelected(null);
      setHintAnimating(true);
      assistedBoards.forEach((board, index) => {
        window.setTimeout(() => {
          setPuzzleTiles(board);
          playSfx('sfx-puzzle-move.mp3', 0.42);
          if (board.every((tile, position) => tile === position)) {
            setPuzzleDone(true);
            window.setTimeout(() => playSfx('sfx-complete.mp3', 0.36), 160);
          }
          if (index === assistedBoards.length - 1) setHintAnimating(false);
        }, index * 450);
      });
      if (!assistedBoards.length) setHintAnimating(false);
    }, 750);
  };
  return (
    <main className="min-h-screen text-[#26352d]">
      <header className="sticky top-0 z-40 border-b border-[#d8e0cf] bg-[#fffdf7]/92 backdrop-blur-xl no-print">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <button
            onClick={() => setScreen(screen === 'home' ? 'home' : 'map')}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#244e4c] text-[#f1d080] font-serif font-black">
              城
            </span>
            <span>
              <b className="block font-serif text-lg text-[#204542]">
                空城計・西城情報局
              </b>
              <small className="hidden text-[#758276] sm:block">
                康軒六年級｜閱讀理解軍師挑戰
              </small>
            </span>
          </button>
          <div className="flex gap-2">
            <button
              className="sound-wait"
              onClick={() => setSound(!sound)}
              aria-label={sound ? '關閉背景音樂' : '開啟背景音樂'}
            >
              <Music2 size={16} />
              <span>{sound ? '背景音樂' : '音樂已靜音'}</span>
              {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <button className="icon-btn" onClick={reset} aria-label="清除進度">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </header>
      {screen === 'home' && (
        <section className="relative mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1.08fr_.92fr] md:px-8">
          <div>
            <div className="eyebrow">
              <Sparkles size={15} /> 六年級閱讀理解 × 軍師推理闖關
            </div>
            <h1 className="home-title">
              <span>西城無兵，</span>
              <span>你能看穿疑陣嗎？</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#56675f]">
              十五萬魏軍正逼近西城，城中卻只剩二千五百名士兵。蒐集軍情、辨認證據，走進孔明與司馬懿的心理交鋒。
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-4 gap-3">
              {[
                ['4', '故事任務'],
                ['12', '關鍵情報'],
                ['5', '總考驗'],
                ['1', '情報遊戲'],
              ].map(([n, t]) => (
                <div className="stat" key={t}>
                  <b>{n}</b>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-card">
            <div className="xicheng-hero image-hero">
              <img src="./images/login-siege.png" alt="西城外魏軍壓境，軍情告急" />
              <b>西城圍城・軍情告急</b>
            </div>
            <div className="troops">
              <div>
                <small>守城兵力</small>
                <b>2,500</b>
              </div>
              <Swords />
              <div>
                <small>魏軍兵力</small>
                <b>150,000</b>
              </div>
            </div>
            <label htmlFor="name" className="mb-2 block font-semibold">
              小軍師姓名
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && name.trim() && setScreen('map')
              }
              placeholder="請輸入姓名或暱稱"
              className="name-input"
            />
            <button
              disabled={!name.trim()}
              onClick={() => setScreen('map')}
              className="primary-btn mt-3 w-full"
            >
              進入西城情報局 <ArrowRight size={19} />
            </button>
            <p className="mt-3 text-center text-xs text-[#7c897e]">
              姓名與進度只會儲存在這台裝置。
            </p>
          </div>
        </section>
      )}
      {screen === 'map' && (
        <section className="mx-auto max-w-6xl px-5 py-9 md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="eyebrow">
                <Map size={15} /> 西城任務圖
              </div>
              <h1 className="mt-3 font-serif text-4xl font-black text-[#183e3c]">
                歡迎，{name || '小軍師'}
              </h1>
              <p className="mt-2 text-[#68766c]">
                依序通過四幕故事，再接受軍師總考驗。
              </p>
            </div>
            <div className="progress-card">
              <div className="flex justify-between text-sm">
                <b>任務進度</b>
                <span>{completed.length}/4</span>
              </div>
              <div className="progress-track">
                <span style={{ width: `${(completed.length / 4) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {missions.map((m, i) => {
              const unlocked = i <= completed.length,
                done = completed.includes(i);
              return (
                <button
                  key={i}
                  disabled={!unlocked}
                  onClick={() => goMission(i)}
                  className={`mission-card ${!unlocked ? 'locked' : ''}`}
                >
                  <div
                    className={`mission-visual ${m.color}`}
                    style={{ backgroundImage: `url(${m.image})` }}
                  >
                    <span className="seal-char">{m.icon}</span>
                    {done && (
                      <i>
                        <Check size={17} />
                      </i>
                    )}
                  </div>
                  <div className="p-5 text-left">
                    <small>{m.kicker}</small>
                    <h2>{m.title}</h2>
                    <p>{m.subtitle}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="status">
                        {done ? '已完成' : unlocked ? '開始調查' : '尚未解鎖'}
                      </span>
                      {unlocked ? <ChevronRight /> : <LockKeyhole />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="story-growth">
            <div className="story-growth-head"><BookOpenText /><div><small>逐步完成</small><h2>空城計四幕故事架構圖</h2></div></div>
            <div className="story-path">
              <svg className="mindmap-branches" viewBox="0 0 1000 620" aria-hidden="true">
                <path className="mind-branch branch-a" d="M440 270 C360 225 330 150 205 130" />
                <path className="mind-branch branch-b" d="M560 270 C650 220 690 150 805 130" />
                <path className="mind-branch branch-c" d="M560 350 C655 400 690 475 805 495" />
                <path className="mind-branch branch-d" d="M440 350 C350 405 315 475 195 500" />
              </svg>
              <div className="story-center">
                <img src="./images/mission-map.png" alt="空城計主題圖" />
                <b>空城計</b><small>四幕故事架構</small>
                <i className="branch branch-1" /><i className="branch branch-2" /><i className="branch branch-3" /><i className="branch branch-4" />
              </div>
              {[
                ['起因', missions[0].clues.map((c) => c.label).join('・')],
                ['諸葛亮布疑陣', missions[1].clues.map((c) => c.label).join('・')],
                ['司馬懿的判斷', missions[2].clues.map((c) => c.label).join('・')],
                ['結果分析', missions[3].clues.map((c) => c.label).join('・')],
              ].map((item, i) => (
                <div key={item[0]} className={`story-node ${completed.includes(i) ? 'revealed' : ''}`}>
                  <span>{completed.includes(i) ? <Check /> : i + 1}</span><small>{item[0]}</small>
                  {completed.includes(i) ? <ul>{item[1].split('・').map((label) => <li key={label}>{label}</li>)}</ul> : <p>完成這一幕後揭曉</p>}
                  <div className="node-keywords">
                    {[
                      [{ q: 0, word: '二千五百對十五萬' }],
                      [{ q: 1, word: '察敵→藏旗→開門→彈琴' }, { q: 2, word: '預留伏兵' }],
                      [{ q: 3, word: '謹慎形象影響判斷' }],
                      [{ q: 4, word: '試探可能識破疑陣' }],
                    ][i].filter((x) => answers[x.q] === finalQuestions[x.q].a).map((x) => <b key={x.word}>＋{x.word}</b>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            disabled={completed.length < 4}
            onClick={() => {
              setFi(0);
              setAnswers([]);
              setFinalOrders(finalQuestions.map((q) => shuffleIndexes(q.opts.length)));
              setScreen('final');
            }}
            className={`final-banner ${completed.length < 4 ? 'locked' : ''}`}
          >
            <span className="final-icon">
              <Trophy />
            </span>
            <span className="text-left">
              <small>軍師總考驗</small>
              <b>明察秋毫・五道閱讀挑戰</b>
              <em>
                {completed.length < 4
                  ? `再完成 ${4 - completed.length} 個任務即可解鎖`
                  : '故事情報已備齊，進入最後考驗'}
              </em>
            </span>
            <ChevronRight className="ml-auto" />
          </button>
        </section>
      )}
      {screen === 'mission' && (
        <section className="mx-auto max-w-6xl px-5 py-7 md:px-8">
          <button onClick={() => setScreen('map')} className="back-btn">
            <ArrowLeft /> 返回任務圖
          </button>
          <div className="mission-flow mt-5">
            <div>
              <div className="mission-explore">
                <img src={mission.image} alt={`${mission.title}水墨情境圖`} />
                <div className="mission-image-title">
                  <small>{mission.kicker}</small>
                  <b>{mission.title}</b>
                </div>
                <div className="hotspot-layer">
                  {mission.clues.map((c, i) => {
                    const open = clues.includes(i);
                    const available = i <= clues.length;
                    return open ? (
                      <button
                        type="button"
                        key={c.label}
                        aria-label={`已展開情報：${c.label}`}
                        onClick={() => {
                          playSfx('sfx-button.mp3', 0.24);
                          setViewClue(i);
                        }}
                        className={`intel-scroll-open-card scroll-card-${i + 1} ${viewClue === i ? 'active' : ''}`}
                      >
                        <span className="intel-scroll-heading"><small>關鍵軍情 {i + 1}</small><b>{c.label}</b></span>
                        <span className="intel-scroll-section intel-quote"><small>原文</small><em>{c.quote}</em></span>
                        <span className="intel-scroll-section intel-detail"><small>說明</small><em>{c.detail}</em></span>
                        <i><Check size={13} /></i>
                      </button>
                    ) : (
                      <button
                        key={c.label}
                        disabled={!available}
                        aria-label={`翻開情報：${c.label}`}
                        onClick={() => {
                          if (!available) return;
                          playSfx('sfx-scroll-open.mp3', 0.52);
                          setClues([...clues, i]);
                          setViewClue(i);
                          window.setTimeout(() => playSfx('sfx-clue-unlock.mp3', 0.34), 420);
                        }}
                        className={`image-hotspot spot-${i + 1}`}
                      >
                        <img src="./images/intel-scroll-closed.png" alt="" aria-hidden="true" />
                        <span>{i + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="scene-brief">
                <Target />
                <span><b>{mission.scene}</b>{mission.prompt}</span>
              </div>
            </div>
            <div>
              <div className="question-card">
                {!allClues ? (
                  <div className="waiting">
                    <LockKeyhole />
                    <b>蒐集四份情報後，推理題就會出現</b>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-[#a44c2c]">
                      <HelpCircle />
                      <b>推理檢核</b>
                    </div>
                    <h3>{mission.question}</h3>
                    <div className="mt-4 grid gap-2">
                      {optionOrder.map((i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (!checked || wrong) {
                              setSelected(i);
                              setChecked(false);
                              setWrong(false);
                            }
                          }}
                          className={`option ${selected === i ? 'selected' : ''} ${checked && i === mission.answer ? 'correct' : ''} ${checked && selected === i && i !== mission.answer ? 'incorrect' : ''}`}
                        >
                          <span>{String.fromCharCode(65 + i)}</span>
                          {mission.options[i]}
                        </button>
                      ))}
                    </div>
                    {wrong && (
                      <div className="feedback hint">
                        <FileQuestion />
                        <span>
                          <b>再想一下</b>
                          {mission.hint}
                        </span>
                      </div>
                    )}
                    {checked && selected === mission.answer && (
                      <>
                        <div className="feedback success">
                          <ShieldCheck />
                          <span>
                            <b>情報判讀正確</b>
                            {mission.explain}
                          </span>
                        </div>
                        <div className="structure-block">
                          <div className="structure-label">
                            <BookOpenText size={18} /> 故事架構整理
                          </div>
                          <h4>{mission.structureQuestion}</h4>
                          <div className="mt-3 grid gap-2">
                            {structureOrder.map((i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  playSfx('sfx-button.mp3', 0.25);
                                  setStructureSelected(i);
                                  setStructureChecked(true);
                                  if (i !== mission.structureAnswer) {
                                    playSfx('sfx-incorrect.mp3', 0.3);
                                    setWrongIds((v) => Array.from(new Set([...v, `structure-${active}`])));
                                  } else {
                                    playSfx('sfx-correct.mp3', 0.38);
                                  }
                                }}
                                className={`option ${structureSelected === i ? 'selected' : ''} ${structureChecked && i === mission.structureAnswer ? 'correct' : ''} ${structureChecked && structureSelected === i && i !== mission.structureAnswer ? 'incorrect' : ''}`}
                              >
                                <span>{String.fromCharCode(65 + i)}</span>
                                {mission.structureOptions[i]}
                              </button>
                            ))}
                          </div>
                          {structureChecked &&
                            structureSelected === mission.structureAnswer && (
                              <div className="feedback success">
                                <Check />
                                <span>
                                  <b>已收進故事架構</b>
                                  {mission.structureExplain}
                                </span>
                              </div>
                            )}
                          {structureChecked &&
                            structureSelected !== mission.structureAnswer && (
                              <div className="feedback hint">
                                <FileQuestion />
                                <span>
                                  <b>再整理一次</b>
                                  想想這一幕在故事中推動了哪一段發展。
                                </span>
                              </div>
                            )}
                        </div>
                        {structureChecked &&
                          structureSelected === mission.structureAnswer && (
                            <button
                              onClick={finish}
                              className="primary-btn mt-4 w-full"
                            >
                              完成任務 <ArrowRight />
                            </button>
                          )}
                      </>
                    )}
                    {!(checked && selected === mission.answer) && (
                      <button
                        disabled={selected === null}
                        onClick={() => {
                          if (selected === null) return;
                          setChecked(true);
                          setWrong(selected !== mission.answer);
                          if (selected !== mission.answer) {
                            playSfx('sfx-incorrect.mp3', 0.32);
                            setWrongIds((v) => Array.from(new Set([...v, `mission-${active}`])));
                          } else {
                            playSfx('sfx-correct.mp3', 0.4);
                          }
                        }}
                        className="primary-btn mt-4 w-full"
                      >
                        提交判斷
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      {screen === 'final' && (
        <section className="mx-auto max-w-3xl px-5 py-10">
          <div className="text-center">
            <div className="eyebrow mx-auto">
              <Trophy /> 軍師總考驗
            </div>
            <h1 className="mt-4 font-serif text-4xl font-black text-[#183e3c]">
              明察秋毫
            </h1>
            <p>從找出明示訊息，一路走到比較與評估。</p>
          </div>
          <div className="mt-7 flex gap-2">
            {finalQuestions.map((_, i) => (
              <span key={i} className={`step-dot ${i <= fi ? 'active' : ''}`} />
            ))}
          </div>
          <div className="evidence-map">
            <b><BookOpenText /> 故事架構正在補強</b>
            <div>
              {[
                '兵力證據：二千五百對十五萬',
                '行動順序：察敵→藏旗→開門→彈琴',
                '策略證據：先察敵，也預留伏兵',
                '人物推論：謹慎形象反成疑陣助力',
                '反思：若先試探，空城計可能被識破',
              ].map((text, i) => <span key={text} className={answers[i] === finalQuestions[i].a ? 'added' : ''}>{answers[i] === finalQuestions[i].a ? <Check /> : '+'}{text}</span>)}
            </div>
          </div>
          <div className="final-question mt-5">
            <span className="level-tag">
              第 {fi + 1} 題・{finalQuestions[fi].level}
            </span>
            <h2>{finalQuestions[fi].q}</h2>
            <div className="mt-6 grid gap-3">
              {(finalOrders[fi] ?? shuffleIndexes(finalQuestions[fi].opts.length)).map((i) => (
                <button
                  key={i}
                  onClick={() => {
                    const n = [...answers];
                    n[fi] = i;
                    setAnswers(n);
                  }}
                  className={`option big ${answers[fi] === i ? 'selected' : ''}`}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {finalQuestions[fi].opts[i]}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                disabled={fi === 0}
                onClick={() => setFi(fi - 1)}
                className="secondary-btn"
              >
                <ArrowLeft /> 上一題
              </button>
              {fi < 4 ? (
                <button
                  disabled={answers[fi] === undefined}
                  onClick={() => setFi(fi + 1)}
                  className="primary-btn"
                >
                  下一題 <ArrowRight />
                </button>
              ) : (
                <button
                  disabled={answers[fi] === undefined}
                  onClick={finishFinal}
                  className="primary-btn"
                >
                  挑戰空城拼圖 <Puzzle />
                </button>
              )}
            </div>
          </div>
        </section>
      )}
      {screen === 'review' && reviewQuestion && (
        <section className="mx-auto max-w-3xl px-5 py-10">
          <div className="review-hero">
            <span><ShieldCheck /></span>
            <small>錯題精選集</small>
            <h1>軍師逆轉・破綻殲滅戰</h1>
            <p>把曾經失守的知識破綻全部補上，才能進入下一關。</p>
          </div>
          <div className="review-progress"><b>破綻 {reviewIndex + 1} / {reviewIds.length}</b><span><i style={{width:`${reviewIndex / reviewIds.length * 100}%`}} /></span></div>
          <div className="final-question mt-5">
            <span className="level-tag">必須答對才能前進</span>
            <h2>{reviewQuestion.q}</h2>
            <div className="mt-6 grid gap-3">
              {reviewOrder.map((i) => (
                <button key={i} disabled={reviewSelected !== null} onClick={() => answerReview(i)} className={`option big ${reviewSelected === i ? (i === reviewQuestion.a ? 'correct' : 'incorrect') : ''}`}>
                  <span>{String.fromCharCode(65 + reviewOrder.indexOf(i))}</span>{reviewQuestion.opts[i]}
                </button>
              ))}
            </div>
            {reviewSelected === reviewQuestion.a && <div className="feedback success"><Check /><span><b>破綻已修補</b>{reviewQuestion.explain}</span></div>}
            {reviewWrong && <div className="feedback hint"><RotateCcw /><span><b>重新迎戰</b>選項即將重新排列，直到答對為止。</span></div>}
          </div>
        </section>
      )}
      {screen === 'game' && (
        <section className="mx-auto max-w-5xl px-5 py-9">
          <div className="puzzle-heading">
            <div>
              <div className="eyebrow">
                <Puzzle /> 過關小遊戲
              </div>
              <h1>空城疑陣・滑軌拼圖</h1>
              <p>移動相鄰圖塊，完成 3×3 空城圖，再找出孔明布下的四個策略。</p>
            </div>
            <div className={`puzzle-clock ${puzzleSeconds >= 120 ? 'overtime' : ''}`}>
              <Timer />
              <span>
                <small>{puzzleSeconds < 120 ? '兩分鐘挑戰' : '時間到，仍可繼續'}</small>
                <b>{String(Math.floor(puzzleSeconds / 60)).padStart(2, '0')}:{String(puzzleSeconds % 60).padStart(2, '0')}</b>
              </span>
            </div>
          </div>
          <div className="puzzle-layout">
            <div className="puzzle-stage">
              <div className={`slide-puzzle ${showPuzzlePreview ? 'previewing' : ''}`}>
                {(showPuzzlePreview ? solvedPuzzle : puzzleTiles).map((tile, position) =>
                  tile === 8 && !showPuzzlePreview ? (
                    <span key={tile} className="puzzle-blank" />
                  ) : (
                    <button
                      type="button"
                      key={tile}
                      aria-label={`移動第 ${tile + 1} 塊拼圖`}
                      onClick={() => movePuzzleTile(position)}
                      className="puzzle-tile"
                      style={{
                        backgroundPosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%`,
                      }}
                    >
                      <span>{tile + 1}</span>
                    </button>
                  ),
                )}
              </div>
              {showPuzzlePreview && !puzzleStarted && (
                <div className="puzzle-preview-note"><Eye /> 先觀察完整圖，5 秒後開始</div>
              )}
            </div>
            <aside className="puzzle-panel">
              {!puzzleDone ? (
                <>
                  <h2>破陣提示</h2>
                  <p>點擊空格上下左右相鄰的圖塊。先完成一排，再逐步向下整理。</p>
                  <button disabled={!puzzleStarted || showPuzzlePreview || hintQuizOpen || hintAnimating || hintCount >= puzzleHintQuestions.length} onClick={openHintQuiz} className="secondary-btn w-full">
                    <HelpCircle /> {hintAnimating ? '軍師正在移動拼圖…' : hintCount >= puzzleHintQuestions.length ? '十次提示已用完' : `答題取得提示（剩 ${puzzleHintQuestions.length - hintCount} 次）`}
                  </button>
                  {hintQuizOpen && puzzleHintQuestions[hintCount] && (
                    <div className="hint-quiz">
                      <small>軍師知識問答・第 {hintCount + 1} 題</small>
                      <h3>{puzzleHintQuestions[hintCount].q}</h3>
                      <div>
                        {hintOrder.map((optionIndex) => (
                          <button
                            type="button"
                            key={optionIndex}
                            disabled={hintSelected !== null}
                            onClick={() => answerHintQuiz(optionIndex)}
                            className={`${hintSelected === optionIndex ? (optionIndex === puzzleHintQuestions[hintCount].a ? 'correct' : 'incorrect') : ''}`}
                          >
                            <span>{String.fromCharCode(65 + hintOrder.indexOf(optionIndex))}</span>
                            {puzzleHintQuestions[hintCount].opts[optionIndex]}
                          </button>
                        ))}
                      </div>
                      {hintSelected === puzzleHintQuestions[hintCount].a && (
                        <p className="hint-quiz-result success"><Check />答對了！{puzzleHintQuestions[hintCount].explain}<br />軍師即將沿正確路徑移動兩個圖塊。</p>
                      )}
                      {hintWrong && (
                        <p className="hint-quiz-result mistake"><RotateCcw />再想一想，選項即將重新排列。</p>
                      )}
                    </div>
                  )}
                  <div className="hint-count"><Lightbulb /> 已使用自動解題：{hintCount} / {puzzleHintQuestions.length} 次</div>
                  <small>超過兩分鐘不會失敗，可以沉著完成。</small>
                </>
              ) : (
                <>
                  <div className="puzzle-success"><Check /> 空城疑陣，重現成功！</div>
                  <h2>圖中策略複習</h2>
                  <div className="review-tabs">
                    {['城門大開', '百姓掃街', '隱藏旗幟', '孔明彈琴'].map((label, i) => (
                      <button key={label} onClick={() => setReviewPoint(i)} className={reviewPoint === i ? 'active' : ''}>{i + 1}. {label}</button>
                    ))}
                  </div>
                  <div className="review-copy">
                    {[
                      '刻意呈現毫無防備的異常景象，引起司馬懿懷疑。',
                      '百姓若無其事地掃街，讓西城顯得過度平靜。',
                      '城樓看不見軍旗與守軍，使敵人難以判斷真實兵力。',
                      '孔明從容彈琴，以鎮定表現強化城內有埋伏的假象。',
                    ][reviewPoint]}
                  </div>
                  <button onClick={() => setScreen('result')} className="primary-btn w-full">查看闖關成果 <ArrowRight /></button>
                </>
              )}
            </aside>
          </div>
        </section>
      )}
      {screen === 'result' && (
        <section className="mx-auto max-w-5xl px-5 py-10">
          <div className="result-hero">
            <img className="result-ink-image" src="./images/result-retreat.png" alt="魏軍撤退，西城解圍" />
            <div className="award">
              <Medal />
            </div>
            <span>西城情報局任務完成</span>
            <h1>
              {name || '小軍師'}，獲得「{title}」稱號
            </h1>
            <p>
              軍師總考驗 <b>{finalScore}</b> 分・空城拼圖 <b>{gameScore}</b> 分
            </p>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <div className="mindmap">
              <div className="flex items-center gap-2">
                <BookOpenText />
                <h2>空城計完整故事架構圖</h2>
              </div>
              <div className="story-path complete-mindmap">
                <svg className="mindmap-branches" viewBox="0 0 1000 620" aria-hidden="true">
                  <path className="mind-branch branch-a" d="M440 270 C360 225 330 150 205 130" />
                  <path className="mind-branch branch-b" d="M560 270 C650 220 690 150 805 130" />
                  <path className="mind-branch branch-c" d="M560 350 C655 400 690 475 805 495" />
                  <path className="mind-branch branch-d" d="M440 350 C350 405 315 475 195 500" />
                </svg>
                <div className="story-center">
                  <img src="./images/mission-map.png" alt="空城計主題圖" />
                  <b>空城計</b><small>完整故事架構</small>
                  <i className="branch branch-1" /><i className="branch branch-2" /><i className="branch branch-3" /><i className="branch branch-4" />
                </div>
                {[
                  ['起因', '街亭失守・兵力懸殊・城中無大將・無法逃遠', '孔明身邊只有二千五百名士兵，十五萬魏軍卻已逼近。'],
                  ['諸葛亮布疑陣', '藏起旗幟・四門大開・從容掃街・城樓彈琴', '孔明用違反常理的平靜，讓敵軍猜疑城中另有安排。'],
                  ['司馬懿的判斷', '共同觀察・司馬昭推論・司馬懿推論・真相', '司馬懿受孔明平生謹慎的形象影響，判定城內必有伏兵。'],
                  ['結果分析', '魏軍撤退・知己知彼・迫不得已・北方伏兵', '孔明利用對手的認識，也預判撤退路線並安排後手。'],
                ].map((x) => (
                  <div key={x[0]} className="story-node revealed">
                    <small>{x[0]}</small>
                    <ul>{x[1].split('・').map((label) => <li key={label}>{label}</li>)}</ul>
                    <p>{x[2]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="summary-card">
              <h2>能力勳章</h2>
              <div className="badge-list">
                <span>
                  <Flag />
                  線索整理
                </span>
                <span>
                  <ShieldCheck />
                  證據判讀
                </span>
                <span>
                  <Target />
                  策略思考
                </span>
              </div>
              <button
                onClick={() => setScreen('certificate')}
                className="primary-btn mt-5 w-full"
              >
                領取闖關證書 <ScrollText />
              </button>
              <button
                onClick={() => setScreen('map')}
                className="secondary-btn mt-2 w-full"
              >
                回到任務圖
              </button>
            </div>
          </div>
        </section>
      )}
      {screen === 'certificate' && (
        <section className="certificate-page">
          <div className="certificate-actions no-print">
            <button onClick={() => setScreen('result')} className="back-btn">
              <ArrowLeft /> 返回成果頁
            </button>
            <button onClick={() => window.print()} className="primary-btn">
              <Printer /> 列印或另存 PDF
            </button>
          </div>
          <article className="certificate">
            <div className="cert-inner">
              <div className="cert-content">
                <div className="cert-kicker"><Award /> 西城情報局・軍階冊封</div>
                <h1>空城計閱讀軍功狀</h1>
                <p>茲授予</p>
                <h2>{name || '小軍師'}</h2>
                <div className="rank-award">
                  <div className={`rank-emblem ${rank.className}`} role="img" aria-label={`${rank.name}兵階徽章`} />
                  <div><small>榮獲西城兵階</small><h3>{rank.name}</h3><p>{rank.motto}</p></div>
                </div>
                <div className="cert-copy">
                  <span>完成《空城計》四幕閱讀任務，能整理故事架構、辨析人物推論，並以課文證據破解疑陣，</span>
                  <strong>特頒此狀，以誌軍功。</strong>
                </div>
                <div className="cert-scores">
                  <span>軍師總考驗 <b>{finalScore}</b></span>
                  <span>空城拼圖 <b>{gameScore}</b></span>
                  <span>軍功總分 <b>{totalScore}</b></span>
                </div>
                <div className="cert-badges"><span>線索整理</span><span>證據判讀</span><span>策略思考</span></div>
                <footer>
                  <div><b>空城計・西城情報局</b><time>{today}</time></div>
                </footer>
              </div>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
