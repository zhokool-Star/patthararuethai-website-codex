import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, BookOpenText, CalendarDays, MoonStar, Play, Sparkles } from 'lucide-react'
import CosmicScene from './components/CosmicScene.jsx'
import blogPosts from '../data/daily-predictions.json'

const services = [
  {
    title: 'เปิดไพ่ยิปซี',
    text: 'อ่านแนวโน้มของเรื่องที่กำลังติดอยู่ด้วยสัญลักษณ์ ไพ่ และพลังงานของช่วงเวลา',
  },
  {
    title: 'เช็คพลังงานรายเดือน',
    text: 'สำรวจจังหวะดวงดาวประจำเดือน เพื่อวางใจ วางแผน และเลือกจังหวะที่เหมาะสม',
  },
  {
    title: 'จักรวาลแห่งการตื่นรู้',
    text: 'คอนเทนต์แนวการเข้าใจตนเอง พลังงานภายใน และการมองชีวิตผ่านสัญญาณของจักรวาล',
  },
  {
    title: 'ทำนายฝัน',
    text: 'ถอดความหมายจากภาพฝันและสัญลักษณ์ที่ใจส่งขึ้นมาให้เราเห็น',
  },
]

const readings = [
  {
    id: 'starlight',
    label: 'แสงดาว',
    title: 'พลังงานกำลังเปิดทาง',
    text: 'ช่วงนี้เหมาะกับการตั้งเจตนาใหม่และค่อย ๆ เดินเข้าหาสิ่งที่ใจเรียกหา',
  },
  {
    id: 'moon',
    label: 'จันทร์ลึก',
    title: 'กลับมาฟังเสียงข้างใน',
    text: 'คำตอบบางอย่างต้องใช้ความนิ่ง ก่อนตัดสินใจให้พักใจและดูสัญญาณซ้ำอีกครั้ง',
  },
  {
    id: 'orbit',
    label: 'วงโคจร',
    title: 'สิ่งเก่ากำลังจัดระเบียบ',
    text: 'เรื่องที่วนกลับมาไม่ได้มาเพื่อรบกวน แต่มาเพื่อให้คุณจัดสมดุลใหม่อย่างชัดเจน',
  },
]

function App() {
  const [readingId, setReadingId] = useState('starlight')
  const isBlogPage = window.location.pathname.replace(/\/$/, '') === '/blog'
  const activeReading = useMemo(
    () => readings.find((reading) => reading.id === readingId) ?? readings[0],
    [readingId],
  )

  if (isBlogPage) {
    return (
      <div className="site-shell">
        <header className="site-header">
          <a className="brand" href="/" aria-label="กลับหน้าแรก">
            <img src="/image/patthararuethai-logo.png" alt="" />
            <span>พยากรณ์บ้านดวงดี</span>
          </a>
          <nav aria-label="เมนูหลัก">
            <a href="/">หน้าแรก</a>
            <a href="/blog">Blog</a>
          </nav>
        </header>

        <main className="blog-page">
          <section className="blog-hero">
            <a className="back-link" href="/">
              <ArrowLeft size={18} />
              กลับหน้าแรก
            </a>
            <p className="section-kicker">Daily Prediction Blog</p>
            <h1>Blog คำทำนายรายวัน</h1>
            <p>
              รวมการ์ดข่าวและหัวข้อคำทำนายรายวันแบบ text-only อ่านง่าย อัปเดตอัตโนมัติทุกวันเวลา 09:00 น.
              จากแหล่งข้อมูลสาธารณะ พร้อมลิงก์ไปยังต้นทาง
            </p>
          </section>

          <section className="blog-grid" aria-label="การ์ดคำทำนายรายวัน">
            {blogPosts.map((post) => (
              <article className="blog-card" key={post.id}>
                <div className="blog-meta">
                  <span>
                    <CalendarDays size={16} />
                    {post.date}
                  </span>
                  <span>{post.tag}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.summary}</p>
                <div className="blog-source">
                  <span>{post.source}</span>
                  <a href={post.url} target="_blank" rel="noreferrer">
                    อ่านต้นทาง
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="กลับไปด้านบน">
          <img src="/image/patthararuethai-logo.png" alt="" />
          <span>พยากรณ์บ้านดวงดี</span>
        </a>
        <nav aria-label="เมนูหลัก">
          <a href="#energy">เช็คพลังงาน</a>
          <a href="#services">บริการ</a>
          <a href="/blog">Blog</a>
          <a href="#channels">ช่องทาง</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="source-line">ไพ่ยิปซี • ทำนายฝัน • เช็คพลังงานรายเดือน</p>
            <h1>อาจารย์ภัทรฤทัย ปราญ์ชมุณีภร</h1>
            <p className="hero-brand">พยากรณ์บ้านดวงดี</p>
            <p className="hero-text">
              พื้นที่สำหรับเช็คพลังงานดวงดาว เปิดไพ่ และสำรวจสัญญาณจากจักรวาลแห่งการตื่นรู้
              ในบรรยากาศที่สงบ ลึกลับ และตั้งใจฟังพลังงานของคุณ
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#energy">
                <Sparkles size={18} />
                เริ่มเช็คพลังงาน
              </a>
              <a className="secondary-action" href="#channels">
                ดูช่อง YouTube
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="ฉากพลังงานจักรวาลสามมิติ">
            <CosmicScene />
            <div className="orb-caption">
              <MoonStar size={18} />
              <span>Cosmic energy movement</span>
            </div>
          </div>
        </section>

        <section className="energy-panel" id="energy">
          <div>
            <p className="section-kicker">Star Energy Check</p>
            <h2>เช็คพลังงานดวงดาว</h2>
            <p>
              เลือกสัญลักษณ์ที่ดึงดูดใจที่สุดตอนนี้ แล้วหน้าเว็บจะสะท้อนข้อความพลังงานแบบสั้น ๆ
              เพื่อเริ่มต้นการสำรวจตัวเอง
            </p>
          </div>
          <div className="reading-box">
            <div className="choice-row" role="tablist" aria-label="เลือกพลังงาน">
              {readings.map((reading) => (
                <button
                  className={reading.id === readingId ? 'choice active' : 'choice'}
                  key={reading.id}
                  onClick={() => setReadingId(reading.id)}
                  type="button"
                >
                  {reading.label}
                </button>
              ))}
            </div>
            <div className="reading-result">
              <Sparkles size={24} />
              <h3>{activeReading.title}</h3>
              <p>{activeReading.text}</p>
            </div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <p className="section-kicker">Cosmic Guidance</p>
            <h2>หัวข้อพยากรณ์และพลังงาน</h2>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="channels-section" id="channels">
          <div className="channel-copy">
            <p className="section-kicker">Public Channels</p>
            <h2>ติดตามพลังงานและคอนเทนต์ใหม่</h2>
            <p>
              ข้อมูลหน้าเว็บอ้างอิงจากผลค้นหาออนไลน์ของชื่ออาจารย์และแบรนด์
              โดยเลือกใช้เฉพาะชื่อเพจ/ช่องและหมวดคอนเทนต์ที่ปรากฏสาธารณะ
            </p>
          </div>
          <div className="channel-actions">
            <a href="https://www.youtube.com/results?search_query=%E0%B8%A0%E0%B8%B1%E0%B8%97%E0%B8%A3%E0%B8%A4%E0%B8%97%E0%B8%B1%E0%B8%A2+%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%8D%E0%B9%8C%E0%B8%8A%E0%B8%A1%E0%B8%B8%E0%B8%93%E0%B8%B5%E0%B8%A0%E0%B8%A3+%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%94%E0%B8%A7%E0%B8%87%E0%B8%94%E0%B8%B5" target="_blank" rel="noreferrer">
              <Play size={20} />
              ค้นหาช่อง YouTube
            </a>
            <a href="https://www.facebook.com/search/top?q=%E0%B8%A0%E0%B8%B1%E0%B8%97%E0%B8%A3%E0%B8%A4%E0%B8%97%E0%B8%B1%E0%B8%A2%20%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%94%E0%B8%A7%E0%B8%87%E0%B8%94%E0%B8%B5" target="_blank" rel="noreferrer">
              <BookOpenText size={20} />
              ค้นหาเพจ Facebook
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
