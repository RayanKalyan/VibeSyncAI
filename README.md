# VibeSync AI 🎵

> *Translate emotion into sound.*

**VibeSync AI** is a cinematic, AI-powered Spotify recommendation engine built to transform natural language emotions into hyper-personalized music experiences.  
Instead of searching by genre or artist, users describe a *feeling*, a *scene*, or a *moment* — and VibeSync generates a matching sonic atmosphere in real time.

Developed by **Andesite Studios**.

---

## ✨ What Makes It Different

VibeSync uses **Google Gemini** to interpret emotional prompts such as:

- *"midnight drifting through Tokyo"*
- *"melancholic synthwave with neon rain vibes"*
- *"songs that feel like the end credits of a sci-fi movie"*

The AI converts those prompts into structured audio characteristics which are then used to generate highly accurate Spotify recommendations.

Traditional music discovery is keyword-based.  
VibeSync is **emotion-based**.

---

# 🚀 Features

### 🎧 AI-Powered Vibe Detection
Uses **Google Gemini API** to understand abstract emotional prompts and convert them into playlist-ready music profiles.

### 🌌 Cinematic Interface
Built with:
- Glassmorphism UI
- Ambient lighting effects
- Smooth transitions & micro-interactions
- Fully responsive modern layout

### 🔐 Secure Spotify Authentication
Implements **Spotify OAuth 2.0 with PKCE**, ensuring secure client-side authentication without exposing secrets.

### 🌍 Global Market Override
Forces `market=US` to unlock broader Spotify catalog access and global trending tracks.

### 🥚 Hidden Easter Egg System
Contains hidden session-based vectors (`2057/31`) that dynamically evolve depending on user interaction patterns.

---

# 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| AI Engine | Google Gemini API |
| Authentication | Spotify OAuth 2.0 (PKCE) |
| Deployment | Vercel |

---

# ⚙️ Local Development Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/RayanKalyan/VibeSyncAI.git
cd VibeSyncAI
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_GEMINI_API_KEY=your_google_api_key
```

---

## 4️⃣ Run the Development Server

```bash
npm run dev
```

The application should now be running locally on:

```bash
http://localhost:5173
```

---

# 🔑 Spotify Developer Setup

To enable Spotify authentication:

1. Create an app on the Spotify Developer Dashboard.
2. Copy your **Client ID**.
3. Add the following Redirect URI:

```bash
http://localhost:5173
```

For production deployment, also add your Vercel domain redirect URI.

---

# 🚀 Deployment

VibeSync AI is optimized for deployment on **Vercel**.

## Deploy Steps

1. Import the repository into Vercel
2. Add your environment variables:
   - `VITE_SPOTIFY_CLIENT_ID`
   - `VITE_GEMINI_API_KEY`
3. Redeploy the project
4. Add your Vercel production URL to Spotify Redirect URIs

---

# 🔒 Security Notice

This project uses client-side environment variables.

Never commit:
- `.env`
- `.env.local`

Add them to your `.gitignore`:

```gitignore
.env
.env.local
```

---

# 📸 Preview

> Add screenshots or demo GIFs here

```md
![Preview](./preview.png)
```

---

# 🧠 Future Roadmap

- AI-generated playlist covers
- Multi-vibe blending
- Live listening analytics
- Social playlist sharing
- Mood memory system
- Cross-platform sync

---

# 🤝 Contributing

Contributions, feature ideas, and pull requests are welcome.

If you'd like to improve VibeSync AI, feel free to fork the repo and submit a PR.

---

# 📄 License

MIT License © 2026 Andesite Studios

---

# 👨‍💻 Developer

Built by **Rayan Kalyan**  
Andesite Studios
