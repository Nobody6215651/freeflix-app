import json
import urllib.request
import urllib.parse

TMDB_API_KEY = "82e880c89dbf119b940e034ed32a3498"

def fetch_live_tmdb(url):
    """Core Core Native Fetcher Optimized for High Speed Performance"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 PremiumFlix/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"TMDB Fetch Error: {e}")
        return {"results": []}

def get_homepage_content():
    """Fetches high-quality home rows safely with strict 1080p branding and official text posters"""
    b_url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_original_language=hi&sort_by=popularity.desc&page=1"
    b_data = fetch_live_tmdb(b_url).get('results', [])[:12]
    
    h_url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_original_language=en&sort_by=popularity.desc&page=1"
    h_data = fetch_live_tmdb(h_url).get('results', [])[:12]
    
    a_url = f"https://api.themoviedb.org/3/discover/tv?api_key={TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc&page=1"
    a_data = fetch_live_tmdb(a_url).get('results', [])[:12]

    bollywood = []
    for m in b_data:
        # UPGRADED: Using official text poster instead of blank backdrop
        poster = m.get('poster_path')
        img = f"https://image.tmdb.org/t/p/w780{poster}" if poster else "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=780"
        bollywood.append({
            "id": m.get('id'),
            "title": m.get('title', 'Live Title'),
            "type": "Movie",
            "year": m.get('release_date', '2026')[:4],
            "embed_url": f"https://vidsrc.me/embed/movie/{m.get('id')}",
            "poster": img,
            "quality": "Available in 1080p HD"
        })

    hollywood = []
    for m in h_data:
        # UPGRADED: Using official text poster instead of blank backdrop
        poster = m.get('poster_path')
        img = f"https://image.tmdb.org/t/p/w780{poster}" if poster else "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=780"
        hollywood.append({
            "id": m.get('id'),
            "title": m.get('title', 'Live Title'),
            "type": "Movie",
            "year": m.get('release_date', '2026')[:4],
            "embed_url": f"https://vidsrc.me/embed/movie/{m.get('id')}",
            "poster": img,
            "quality": "Available in 1080p HD"
        })

    anime = []
    for m in a_data:
        # UPGRADED: Using official text poster instead of blank backdrop
        poster = m.get('poster_path')
        img = f"https://image.tmdb.org/t/p/w780{poster}" if poster else "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=780"
        anime.append({
            "id": m.get('id'),
            "title": m.get('name', 'Live Show'),
            "type": "Series",
            "year": m.get('first_air_date', '2026')[:4],
            "embed_url": f"https://vidsrc.me/embed/tv/{m.get('id')}/1-1",
            "poster": img,
            "quality": "Available in 1080p HD"
        })

    return bollywood, hollywood, anime

def get_tv_metadata(tv_id):
    """Processes clean season metadata without modifying structure"""
    url = f"https://api.themoviedb.org/3/tv/{tv_id}?api_key={TMDB_API_KEY}"
    raw_data = fetch_live_tmdb(url)
    seasons_payload = []
    for s in raw_data.get('seasons', []):
        if s.get('season_number', 0) == 0 and s.get('episode_count', 0) == 0:
            continue
        seasons_payload.append({
            "season_number": s.get('season_number'),
            "episode_count": s.get('episode_count'),
            "name": s.get('name', f"Season {s.get('season_number')}")
        })
    return seasons_payload

def search_titles(query):
    """Fast response stream router for official search engine"""
    if not query:
        return []
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
        
        # UPGRADED: Using official text poster instead of blank backdrop for search items
        poster = m.get('poster_path')
        img = f"https://image.tmdb.org/t/p/w780{poster}" if poster else "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=780"
        embed = f"https://vidsrc.me/embed/movie/{m.get('id')}" if m_type == 'movie' else f"https://vidsrc.me/embed/tv/{m.get('id')}/1-1"
        
        parsed_results.append({
            "id": m.get('id'),
            "title": title if title else "Live Selection",
            "type": "Movie" if m_type == 'movie' else "Series",
            "year": year if year else "2026",
            "embed_url": embed,
            "poster": img,
            "quality": "Available in 1080p HD"
        })
    return parsed_results
