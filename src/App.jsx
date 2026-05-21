import React, { useState, useEffect } from 'react';
import { translateVibeToAudioFeatures } from './gemini';
import { redirectToSpotifyLogin, getAccessToken, fetchRecommendations } from './spotify';

function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const fetchToken = async () => {
        try {
          const token = await getAccessToken(code);
          setSpotifyToken(token);
          window.history.replaceState({}, document.title, "/");
        } catch (err) {
          console.error("Token exchange failed:", err);
        }
      };
      fetchToken();
    }
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setLoading(true);
    setTracks([]);

    try {
      const structuredFeatures = await translateVibeToAudioFeatures(userPrompt);

      if (spotifyToken) {
        // Notice we are now passing 'userPrompt' directly into the Spotify engine!
        const recommendedTracks = await fetchRecommendations(spotifyToken, structuredFeatures, userPrompt);
        setTracks(recommendedTracks);
      }
    } catch (err) {
      console.error(err);
      alert(`System Notice: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030305] text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden selection:bg-cyan-500/40">
      
      {/* THE DANCING LIGHTS ENGINE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-[spin_15s_linear_infinite] transition-colors duration-700 ${spotifyToken ? 'bg-cyan-500/60' : 'bg-zinc-800/50'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-[spin_20s_linear_infinite_reverse] transition-colors duration-700 ${spotifyToken ? 'bg-purple-600/50' : 'bg-transparent'}`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[140px] animate-[pulse_6s_ease-in-out_infinite] transition-all duration-700 ${spotifyToken ? 'bg-blue-600/40 opacity-50 scale-100' : 'bg-transparent opacity-0 scale-90'}`}></div>
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"></div>

      <div className="w-full max-w-3xl relative z-10 group mt-8 mb-8">
        
        <div className={`absolute -inset-[1px] rounded-[2.5rem] blur-md transition-all duration-700 ${spotifyToken ? 'bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 opacity-100' : 'bg-white/10 opacity-50'}`}></div>
        
        <div className="relative bg-[#050508]/70 backdrop-blur-3xl border border-white/[0.08] p-8 sm:p-14 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 relative z-20">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[1px] w-8 bg-cyan-500/50"></div>
                <h1 className="text-[9px] font-black tracking-[0.5em] text-cyan-400/80 uppercase">Andesite Studios</h1>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 drop-shadow-lg">
                VibeSync <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">AI</span>
              </h2>
            </div>
            
            <div className="relative group/badge cursor-default">
              <div className={`absolute -inset-1 rounded-full blur-sm transition-all duration-500 ${spotifyToken ? 'bg-emerald-500/20 group-hover/badge:bg-emerald-500/40' : 'bg-amber-500/10'}`}></div>
              <div className="relative text-[10px] font-black tracking-[0.2em] px-5 py-2.5 rounded-full border border-white/10 bg-black/50 shadow-inner flex items-center gap-3 backdrop-blur-xl">
                {spotifyToken ? (
                  <>
                    <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]"></span>
                    </div>
                    <span className="text-emerald-400 uppercase drop-shadow-md">Sys. Online</span>
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                    <span className="text-amber-500 uppercase">Auth Locked</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-20">
            {!spotifyToken ? (
              <div className="relative text-center py-16 px-6 border border-white/5 rounded-[2rem] bg-gradient-to-b from-white/[0.02] to-black/40 overflow-hidden group/auth">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent opacity-0 group-hover/auth:opacity-100 transition-opacity duration-500"></div>
                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-black/60 flex items-center justify-center border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] relative">
                  <div className="absolute inset-0 rounded-full border border-zinc-700/50 animate-[spin_4s_linear_infinite]"></div>
                  <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zM21 16c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z"></path></svg>
                </div>
                <p className="text-sm text-zinc-400 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
                  Initialize the central audio pipeline by establishing a secure link with your Spotify credentials.
                </p>
                <button 
                  onClick={redirectToSpotifyLogin}
                  className="relative inline-flex items-center justify-center gap-2 bg-white text-black font-black text-xs tracking-[0.15em] uppercase px-10 py-5 rounded-full hover:scale-[1.03] active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] cursor-pointer overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite]"></div>
                  Establish Link
                </button>
              </div>
            ) : (
              <form onSubmit={handleSearchSubmit} className="space-y-6">
                <label className="flex items-center gap-3 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em]">Target Sonic Parameters</span>
                </label>
                <div className="relative flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 group/input">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[1.5rem] blur opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                    <input 
                      type="text"
                      value={userPrompt}
                      disabled={loading}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="e.g., Best Joji songs, midnight drifting..."
                      className="relative w-full bg-black/50 backdrop-blur-md border border-white/10 rounded-[1.5rem] px-6 py-5 text-sm text-white focus:outline-none focus:border-cyan-400/50 focus:bg-black/80 transition-all placeholder:text-zinc-600 disabled:opacity-50 shadow-inner"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="relative sm:w-auto w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-black tracking-wider text-xs uppercase px-10 py-5 rounded-[1.5rem] hover:scale-[1.03] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer overflow-hidden group/gen"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/gen:animate-[shimmer_1s_infinite]"></div>
                    {loading ? "Compiling..." : "Generate"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {tracks.length > 0 && (
            <div className="mt-14 relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-gradient-to-r from-zinc-500 to-transparent"></div>
                  <h3 className="text-[10px] font-black text-zinc-400 tracking-[0.3em] uppercase">Rendered Frequencies</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {tracks.map((track, index) => (
                  <a 
                    key={track.id} 
                    href={track.external_urls?.spotify} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-5 p-3 pr-6 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-cyan-500/40 rounded-2xl transition-colors duration-200 cursor-pointer overflow-hidden active:scale-[0.98]"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></div>
                    
                    <div className="relative overflow-hidden rounded-[0.8rem] shadow-lg shrink-0">
                      <img 
                        src={track.album.images[2]?.url || track.album.images[0]?.url} 
                        alt={track.name} 
                        className="w-14 h-14 object-cover transform group-hover:scale-110 transition-transform duration-300 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                        <svg className="w-6 h-6 text-white ml-1 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 py-1 relative z-10">
                      <p className="text-sm font-bold text-zinc-100 truncate group-hover:text-cyan-400 transition-colors duration-200">
                        {track.name}
                      </p>
                      <p className="text-xs text-zinc-500 font-medium truncate mt-1">
                        {track.artists.map(artist => artist.name).join(", ")}
                      </p>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 relative z-10">
                      <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;