const express = require('express');
const { chromium } = require('playwright');

const app = express();

// 🔥 Render対応
const PORT = process.env.PORT || 3000;

// 🔥 トップ確認用
app.get('/', (req, res) => {
  res.send('OK');
});

// 🔥 フォーム解析API
app.get('/run', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'URLを指定しろ' });
  }

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // 🔥 入力フィールド全部取得
    const inputs = await page.$$eval('input, textarea, select', els =>
      els.map(el => ({
        tag: el.tagName,
        name: el.name,
        id: el.id,
        placeholder: el.placeholder,
        type: el.type
      }))
    );

    await browser.close();

    res.json({
      url: targetUrl,
      count: inputs.length,
      inputs
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 🔥 サーバー起動
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
