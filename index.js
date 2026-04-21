process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/render/.cache/ms-playwright';

const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('OK');
});

app.get('/run', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'URLを指定しろ' });
  }

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,

      // 👇 ここが最重要（これ入れないと絶対動かない）
      executablePath: '/opt/render/.cache/ms-playwright/chromium-1217/chrome-linux/chrome',

      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    const inputs = await page.$$eval('input, textarea, select', els =>
      els.map(el => ({
        tag: el.tagName,
        name: el.name || null,
        id: el.id || null,
        placeholder: el.placeholder || null,
        type: el.type || null,
        value: el.value || null,
        required: el.required || false
      }))
    );

    res.json({
      success: true,
      url: targetUrl,
      count: inputs.length,
      inputs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
