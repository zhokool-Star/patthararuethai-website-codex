import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const outDir = path.resolve('screenshots')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 })

await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const desktopPath = path.join(outDir, 'cosmic-site-desktop.png')
await page.screenshot({ path: desktopPath, fullPage: true })

const canvasPixels = await page.locator('canvas').evaluate((canvas) => ({
  width: canvas.width,
  height: canvas.height,
  nonzero: canvas.width > 0 && canvas.height > 0,
}))

await page.setViewportSize({ width: 390, height: 920 })
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)
const mobilePath = path.join(outDir, 'cosmic-site-mobile.png')
await page.screenshot({ path: mobilePath, fullPage: true })

const metrics = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  title: document.title,
  h1: document.querySelector('h1')?.textContent,
  activeReading: document.querySelector('.reading-result h3')?.textContent,
}))

await page.click('.choice:nth-child(2)')
await page.waitForTimeout(200)
const updatedReading = await page.locator('.reading-result h3').textContent()

await browser.close()

console.log(JSON.stringify({ desktopPath, mobilePath, canvasPixels, metrics, updatedReading }, null, 2))
