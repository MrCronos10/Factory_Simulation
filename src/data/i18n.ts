/**
 * Minimal translation table for user-visible UI strings.
 * Only strings the player sees regularly are translated; deeper educational
 * content stays in `processData.ts` in English. Add more as needed.
 */

export type Lang = 'en' | 'zh'

export const LANGS: Array<{ code: Lang; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
]

type Dict = Record<string, string>

const en: Dict = {
  'nav.farm': 'Farm',
  'nav.factory': 'Factory',
  'nav.process': 'Process',
  'nav.playTour': 'Play Tour',
  'nav.stopTour': 'Stop Tour',
  'nav.dayNight': 'Day / Night',
  'nav.sound': 'Sound',
  'nav.language': 'Language',
  'nav.save': 'Save',
  'nav.load': 'Load',
  'nav.reset': 'Reset',
  'hud.money': 'Money',
  'hud.day': 'Day',
  'hud.time': 'Time',
  'hud.factoryStatus': 'Factory',
  'hud.factoryRunning': 'Running',
  'hud.factoryOffline': 'Offline',
  'hud.manure': 'Manure',
  'hud.fertilizer': 'Fertilizer',
  'hud.energy': 'Energy',
  'hud.speed': 'Speed',
  'hint.farm.collect': 'Click the manure pile to load the tractor.',
  'hint.farm.refuel': 'Fuel is low — refuel the tractor.',
  'hint.factory.start': 'Press Start Factory to begin production.',
  'hint.factory.sell': 'Fertilizer ready — sell it for cash.',
  'hint.process.learn': 'Toggle Learn Mode, then click any card.',
  'tour.playing': 'Tour playing',
  'tour.cancel': 'Cancel Tour',
  'panel.upgrades': 'Upgrades',
  'panel.station': 'Station',
  'panel.next': 'Next',
  'panel.close': 'Close',
  'panel.sell': 'Sell Fertilizer',
  'panel.refuel': 'Refuel',
  'process.learnMode': 'Learn Mode',
  'process.learnOn': 'On',
  'process.learnOff': 'Off',
  'view.overview': 'Overview',
  'view.receiving': 'Receiving',
  'view.fermentation': 'Fermentation',
  'view.production': 'Production Line',
  'view.bagging': 'Bagging',
  'view.warehouse': 'Warehouse',
}

const zh: Dict = {
  'nav.farm': '农场',
  'nav.factory': '工厂',
  'nav.process': '流程',
  'nav.playTour': '播放导览',
  'nav.stopTour': '停止导览',
  'nav.dayNight': '昼 / 夜',
  'nav.sound': '声音',
  'nav.language': '语言',
  'nav.save': '保存',
  'nav.load': '读取',
  'nav.reset': '重置',
  'hud.money': '资金',
  'hud.day': '天',
  'hud.time': '时间',
  'hud.factoryStatus': '工厂',
  'hud.factoryRunning': '运行中',
  'hud.factoryOffline': '离线',
  'hud.manure': '粪肥',
  'hud.fertilizer': '肥料',
  'hud.energy': '能耗',
  'hud.speed': '速度',
  'hint.farm.collect': '点击粪堆装载拖拉机。',
  'hint.farm.refuel': '燃料不足——请加油。',
  'hint.factory.start': '按“启动工厂”开始生产。',
  'hint.factory.sell': '肥料已准备好——出售换取现金。',
  'hint.process.learn': '打开学习模式,然后点击卡片。',
  'tour.playing': '导览播放中',
  'tour.cancel': '取消导览',
  'panel.upgrades': '升级',
  'panel.station': '工位',
  'panel.next': '下一步',
  'panel.close': '关闭',
  'panel.sell': '出售肥料',
  'panel.refuel': '加油',
  'process.learnMode': '学习模式',
  'process.learnOn': '开',
  'process.learnOff': '关',
  'view.overview': '总览',
  'view.receiving': '接料',
  'view.fermentation': '发酵',
  'view.production': '生产线',
  'view.bagging': '包装',
  'view.warehouse': '仓库',
}

const TABLES: Record<Lang, Dict> = { en, zh }

/** Translate a key. Falls back to English, then the key itself. */
export function translate(lang: Lang, key: string): string {
  return TABLES[lang]?.[key] ?? en[key] ?? key
}
