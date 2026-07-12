import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DATA_PATH = path.resolve('data/daily-predictions.json')
const MAX_POSTS = 24
const RSS_URL =
  'https://news.google.com/rss/search?q=%E0%B8%94%E0%B8%B9%E0%B8%94%E0%B8%A7%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A7%E0%B8%B1%E0%B8%99%20%E0%B8%94%E0%B8%A7%E0%B8%87%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89%20-%E0%B8%84%E0%B8%B2%E0%B8%AA%E0%B8%B4%E0%B9%82%E0%B8%99%20-%E0%B9%80%E0%B8%94%E0%B8%B4%E0%B8%A1%E0%B8%9E%E0%B8%B1%E0%B8%99%20-%E0%B8%9A%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B9%88%E0%B8%B2%20-%E0%B8%AA%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%95&hl=th&gl=TH&ceid=TH:th'

const BLOCKED_TERMS = [
  'casino',
  'คาสิโน',
  'เดิมพัน',
  'บาคาร่า',
  'สล็อต',
  'หวย',
  'โบนัส',
  'เครดิตฟรี',
  'เงินรางวัล',
  'กีฬาออนไลน์',
]

const TRUSTED_SOURCES = [
  'Sanook',
  'Thairath',
  'Kapook',
  'Horoworld',
  'Dailynews',
  'Khaosod',
  'MThai',
  'The Bangkok Insight',
]

const decodeEntities = (value = '') =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim()

const stripTags = (value = '') => decodeEntities(value.replace(/<[^>]*>/g, ' '))

const getTag = (title) => {
  if (/ไพ่|tarot/i.test(title)) return 'เปิดไพ่'
  if (/ราศี|ดวงดาว|ดาว/i.test(title)) return 'ดวงดาว'
  if (/ความรัก/i.test(title)) return 'ความรัก'
  if (/รายวัน|วันนี้/i.test(title)) return 'พลังงานรายวัน'
  return 'คำทำนาย'
}

const makeSummary = (title, source) =>
  `หัวข้อคำทำนายจาก ${source} สำหรับอ่านต่อแบบย่อ: ${title} เหมาะสำหรับเช็คแนวโน้มประจำวันและใช้เป็นไอเดียตั้งเจตนาก่อนเริ่มวัน`

const parseItems = (xml) => {
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 8)

  return itemMatches.map((match) => {
    const item = match[1]
    const title = stripTags(item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/)?.[1] ?? item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
    const url = decodeEntities(item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? '')
    const source = stripTags(item.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? 'Google News')
    const publishedRaw = stripTags(item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? '')
    const publishedAt = publishedRaw ? new Date(publishedRaw) : new Date()
    const date = Number.isNaN(publishedAt.getTime())
      ? new Date().toISOString().slice(0, 10)
      : publishedAt.toISOString().slice(0, 10)

    const fingerprint = Buffer.from(`${title}-${source}-${url}`).toString('base64url').slice(0, 28)

    return {
      id: `${date}-${fingerprint}`,
      date,
      title,
      source,
      url,
      summary: makeSummary(title, source),
      tag: getTag(title),
      createdAt: new Date().toISOString(),
    }
  }).filter((post) => {
    const searchable = `${post.title} ${post.source}`.toLowerCase()
    const hasBlockedTerm = BLOCKED_TERMS.some((term) => searchable.includes(term.toLowerCase()))
    const isTrustedSource = TRUSTED_SOURCES.some((source) =>
      post.source.toLowerCase().includes(source.toLowerCase()),
    )
    return !hasBlockedTerm && isTrustedSource
  })
}

const fallbackPost = () => {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: `${today}-daily-energy-fallback`,
    date: today,
    title: 'เช็คพลังงานรายวัน: ตั้งใจให้ชัดและเดินอย่างมีสมดุล',
    source: 'พยากรณ์บ้านดวงดี',
    url: 'https://www.youtube.com/results?search_query=%E0%B8%94%E0%B8%B9%E0%B8%94%E0%B8%A7%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A7%E0%B8%B1%E0%B8%99',
    summary: 'วันนี้เหมาะกับการจัดลำดับเรื่องสำคัญ ฟังสัญญาณจากใจ และเลือกคำตอบที่ทำให้พลังงานนิ่งขึ้น',
    tag: 'พลังงานรายวัน',
    createdAt: new Date().toISOString(),
  }
}

const readExisting = async () => {
  try {
    return JSON.parse(await readFile(DATA_PATH, 'utf8'))
  } catch {
    return []
  }
}

const update = async () => {
  const existing = await readExisting()
  let freshPosts = []

  try {
    const response = await fetch(RSS_URL, {
      headers: {
        'user-agent': 'patthararuethai-website-daily-blog/1.0',
      },
    })
    if (!response.ok) throw new Error(`RSS request failed: ${response.status}`)
    freshPosts = parseItems(await response.text()).filter((post) => post.title && post.url)
  } catch (error) {
    console.warn(`Daily RSS update failed, using fallback: ${error.message}`)
    freshPosts = [fallbackPost()]
  }

  const unique = new Map()
  for (const post of [...freshPosts, ...existing]) {
    const key = post.url || post.id
    if (!unique.has(key)) unique.set(key, post)
  }

  const nextPosts = [...unique.values()]
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, MAX_POSTS)

  await writeFile(DATA_PATH, `${JSON.stringify(nextPosts, null, 2)}\n`, 'utf8')
  console.log(`Updated ${DATA_PATH} with ${freshPosts.length} fresh item(s).`)
}

await update()
