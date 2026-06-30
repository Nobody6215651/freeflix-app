import json
import urllib.request
import urllib.parse
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Official Live TMDB Keys Provided By You
TMDB_API_KEY = "82e880c89dbf119b940e034ed32a3498"

def fetch_live_tmdb(url):
    """Safe Native Fetcher to guarantee 0% crash rate on Render deployment"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 PremiumFlix/1.0'})
        with urllib.request.urlopen(req, timeout=6) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"TMDB Pipe Error: {e}")
        return {"results": []}

@app.route('/')
def home():
    # 1. Fetch Trending Bollywood (Hindi Language - Newest & Popular)
    b_url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_original_language=hi&sort_by=popularity.desc&page=1"
    b_data = fetch_live_tmdb(b_url).get('results', [])[:8] # Mobile balanced layout limit
    
    # 2. Fetch Blockbuster Hollywood (English Language)
    h_url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_original_language=en&sort_by=popularity.desc&page=1"
    h_data = fetch_live_tmdb(h_url).get('results', [])[:8]
    
    # 3. Fetch Top Trending Anime (TV Shows, Animation Genre: 16, Japanese Language)
    a_url = f"https://api.themoviedb.org/3/discover/tv?api_key={TMDB_API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=1"
    a_data = fetch_live_tmdb(a_url).get('results', [])[:8]

    # Uniform Model Parser for structural stability
    bollywood = []
    for m in b_data:
        path = m.get('poster_path')
        poster = f"https://image.tmdb.org/t/p/w500{path}" if path else "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500"
        bollywood.append({
            "id": m.get('id'),
            "title": m.get('title', 'Untitled Bollywood'),
            "type": "Movie",
            "quality": "1080p WebDL",
            "language": "Hindi (Original)",
            "year": m.get('release_date', '2026')[:4],
            "embed_url": f"https://vidsrc.me/embed/movie/{m.get('id')}",
            "download_url": f"https://vidsrc.me/embed/movie/{m.get('id')}",
            "meta_extra": f"⭐ {m.get('vote_average', '7.5')}/10 • Action Romance",
            "poster": poster
        })

    hollywood = []
    for m in h_data:
        path = m.get('poster_path')
        poster = f"https://image.tmdb.org/t/p/w500{path}" if path else "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500"
        hollywood.append({
            "id": m.get('id'),
            "title": m.get('title', 'Untitled Hollywood'),
            "type": "Movie",
            "quality": "4K UltraHD",
            "language": "English / Dual",
            "year": m.get('release_date', '2026')[:4],
            "embed_url": f"https://vidsrc.me/embed/movie/{m.get('id')}",
            "download_url": f"https://vidsrc.me/embed/movie/{m.get('id')}",
            "meta_extra": f"⭐ {m.get('vote_average', '8.0')}/10 • Premium Cinematic",
            "poster": poster
        })

    anime = []
    for m in a_data:
        path = m.get('poster_path')
        poster = f"https://image.tmdb.org/t/p/w500{path}" if path else "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500"
        anime.append({
            "id": m.get('id'),
            "title": m.get('name', 'Anime Series'),
            "type": "Series",
            "season": "S01",
            "episode": "Ep 01",
            "quality": "1080p Bluray",
            "language": "Japanese / Sub",
            "year": m.get('first_air_date', '2026')[:4],
            "embed_url": f"https://vidsrc.me/embed/tv/{m.get('id')}/1-1",
            "download_url": f"https://vidsrc.me/embed/tv/{m.get('id')}/1-1",
            "meta_extra": f"⭐ {m.get('vote_average', '8.4')}/10 • Global Stream",
            "poster": poster
        })

    # Combined master deck for player injection
    all_content = hollywood + bollywood + anime
    
    return render_template('index.html', 
                           bollywood=bollywood, 
                           hollywood=hollywood, 
                           anime=anime, 
                           all_content=all_content)

# Live Global Search Engine Endpoint (Connects Searchbar directly to TMDB database)
@app.route('/api/search')
def search_api():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([])
    
    encoded_query = urllib.parse.quote(query)
    search_url = f"https://api.themoviedb.org/3/search/multi?api_key={TMDB_API_KEY}&query={encoded_query}&page=1"
    raw_results = fetch_live_tmdb(search_url).get('results', [])[:6]
    
    parsed_results = []
    for m in raw_results:
        m_type = m.get('media_type')
        if m_type not in ['movie', 'tv']:
            continue
            
        title = m.get('title') if m_type == 'movie' else m.get('name')
        year = m.get('release_date', '')[:4] if m_type == 'movie' else m.get('first_air_date', '')[:4]
        path = m.get('poster_path')
        poster = f"https://image.tmdb.org/t/p/w500{path}" if path else "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500"
        
        embed = f"https://vidsrc.me/embed/movie/{m.get('id')}" if m_type == 'movie' else f"https://vidsrc.me/embed/tv/{m.get('id')}/1-1"
        
        parsed_results.append({
            "id": m.get('id'),
            "title": title if title else "Search Result",
            "type": "Movie" if m_type == 'movie' else "Series",
            "quality": "TrueHD" if m_type == 'movie' else "Multi-Ep",
            "language": "Live Stream",
            "year": year if year else "2026",
            "embed_url": embed,
            "download_url": embed,
            "meta_extra": f"Rating: {m.get('vote_average', '7.0')}/10",
            "poster": poster
        })
        
    return jsonify(parsed_results)

if __name__ == '__main__':
    app.run(debug=True)
