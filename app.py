from flask import Flask, render_template, jsonify, request
import tmdb_engine

app = Flask(__name__)

@app.route('/')
def home():
    # Direct routing via split structural logic
    bollywood, hollywood, anime = tmdb_engine.get_homepage_content()
    return render_template('index.html', 
                           bollywood=bollywood, 
                           hollywood=hollywood, 
                           anime=anime)

@app.route('/api/tv-meta/<int:tv_id>')
def tv_meta(tv_id):
    seasons = tmdb_engine.get_tv_metadata(tv_id)
    return jsonify({"seasons": seasons})

@app.route('/api/search')
def search_api():
    query = request.args.get('q', '').strip()
    results = tmdb_engine.search_titles(query)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
