# Outfit Helper 👕📱

AI-powered fashion assistant that suggests clothing items based on images, descriptions, or situations. Pulls real products from multiple marketplaces with prices, images, and direct links.

## 🧠 What It Does

- 📸 Accepts a photo → detects clothing items in the image
- 🗣️ Accepts a text prompt (e.g. "outfit for a wedding in summer")
- 🛍️ Returns outfit suggestions from live marketplaces with:
  - Images
  - Prices
  - Buy links

## 🔍 Example Use Cases

- Upload a mirror selfie → get similar outfits
- Type “stylish but comfy look for first day at uni” → get smart suggestions
- Browse clickable results with real product data

## 🤖 How It Works

- Sends both **images and text** to OpenAI (GPT-4 Vision)
- GPT identifies clothing in images or interprets user intent from text
- GPT returns structured outfit suggestions
- The app parses GPT response and maps items to real products on marketplaces

No local CV or rule-based logic — it’s fully powered by OpenAI’s multimodal capabilities.

## ⚙️ Tech Stack

- **Node.js + Express** — API backend
- **React** — frontend
- **OpenAI / custom model** — for outfit logic
- **Marketplace APIs / scraping** — product sourcing
- **Image processing** — for fashion item detection

Made to explore the intersection of GenAI, fashion, and e-commerce.
Built for fun — but with real product thinking.
