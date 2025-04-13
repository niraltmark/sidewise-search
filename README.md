# 🔍 Sidewise Search

**Sidewise Search** is a Chrome extension that runs a search query in parallel on both **Brave Search** and **OpenAI ChatGPT**, rendering the results side by side in a clean, Google-style interface — right on your new tab.

---

## ✨ Features

- 🔎 Search once — get both real-time search results and AI summaries
- ⚡ Uses Brave Search API for up-to-date information
- 🤖 ChatGPT grounded with Brave snippet (RAG-style)
- 🖥️ Google-style result styling
- 🎛 Configurable API keys (OpenAI & Brave) via settings panel

---

## 📸 Demo

<img src="screenshot.png" width="700" alt="Sidewise Search Screenshot" />

---

## 🧪 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/sidewise-search.git
cd sidewise-search
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development build

```bash
npm run dev
```

This will start a Vite dev server and rebuild the extension on file changes.

---

## 🧩 Load in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/` folder (after running `npm run build`)

---

## 🔐 API Key Configuration

1. Click the extension’s settings (or open `chrome-extension://<id>/src/pages/options/index.html`)
2. Paste your:
   - OpenAI API Key
   - Brave Search API Key
3. Save — and you're ready to search!

---

## 🛠 Tech Stack

- React + Vite (via [`create-chrome-ext`](https://github.com/guocaoyi/create-chrome-ext))
- Manifest V3
- Brave Search API
- OpenAI Chat API (GPT-3.5-turbo)
- Chrome Extension APIs (sync storage)

---

## 📄 License

MIT — use freely, but attribution is appreciated!

---

## 🙌 Credits

Built by [Your Name] with curiosity and a little AI magic ✨
