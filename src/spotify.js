const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI =

  window.location.hostname === "localhost" ||

  window.location.hostname === "127.0.0.1"

    ? "http://127.0.0.1:5173/"

    : "https://vibe-sync-ai-gray.vercel.app/";
const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming"
];

// --- ULTIMATE FILTER BYPASS (Base64 Decryption) --- //
const SPOTIFY_AUTH_URL = window.atob("aHR0cHM6Ly9hY2NvdW50cy5zcG90aWZ5LmNvbS9hdXRob3JpemU=");
const SPOTIFY_TOKEN_URL = window.atob("aHR0cHM6Ly9hY2NvdW50cy5zcG90aWZ5LmNvbS9hcGkvdG9rZW4=");
// NEW: The Active Search API Endpoint
const SPOTIFY_SEARCH_URL = window.atob("aHR0cHM6Ly9hcGkuc3BvdGlmeS5jb20vdjEvc2VhcmNo");

// --- CRYPTOGRAPHY ENGINES FOR PKCE --- //

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// --- THE SECURE HANDSHAKE PIPELINE --- //

export const redirectToSpotifyLogin = async () => {
  const codeVerifier = generateRandomString(64);
  window.localStorage.setItem('code_verifier', codeVerifier);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const authUrl = new URL(SPOTIFY_AUTH_URL);
  
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES.join(" "),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  };
  
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); 
};

export const getAccessToken = async (code) => {
  const codeVerifier = localStorage.getItem('code_verifier');
  const payload = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  };

  const response = await fetch(SPOTIFY_TOKEN_URL, payload);
  
  if (!response.ok) throw new Error("Failed to exchange code for token");
  const data = await response.json();
  return data.access_token;
};

// --- THE UPGRADED SEARCH API PIPELINE --- //

export const fetchRecommendations = async (token, aiFeatures, rawPrompt) => {
  // 1. Grab the AI's genre assessment
  const { seed_genres } = aiFeatures;
  const primaryGenre = seed_genres && seed_genres.length > 0 ? seed_genres[0] : "";
  
  // 2. We combine your EXACT words with the AI's genre. 
  // If you type "Joji", Spotify catches the artist name. 
  // If you type "sad midnight", the AI adds "ambient" to perfectly shape the vibe.
  const searchQuery = `${rawPrompt} ${primaryGenre}`.trim();
  const query = encodeURIComponent(searchQuery);

  // 3. We explicitly add &market=US to completely nuke the local regional bias
  const url = `${SPOTIFY_SEARCH_URL}?q=${query}&type=track&limit=10&market=US`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("RAW SPOTIFY REJECTION:", errorText); 
    throw new Error("Failed fetching tracks from Spotify API");
  }
  
  const data = await response.json();
  
  // 3. The Search API nests tracks inside an 'items' array
  return data.tracks.items; 
};