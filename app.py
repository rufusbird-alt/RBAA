"""
RBAA Image Search — Web UI with Museum Verification
Run:  python app.py
Then open http://localhost:5000
"""

import tempfile
import urllib.parse
import urllib.request
import json as json_module
from pathlib import Path

from flask import Flask, jsonify, render_template_string, request

from search_engine import index_stats, list_locations, search_by_image, search_by_text

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024

def _fetch_json(url: str, timeout: int = 6) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "RBAA-Search/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json_module.loads(r.read())

def search_met(query: str, n: int = 4) -> list:
    try:
        q = urllib.parse.quote(query)
        data = _fetch_json(f"https://collectionapi.metmuseum.org/public/collection/v1/search?q={q}&hasImages=true")
        ids = (data.get("objectIDs") or [])[:20]
        results = []
        for oid in ids:
            try:
                obj = _fetch_json(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{oid}")
                if obj.get("primaryImageSmall"):
                    results.append({"museum":"Met Museum","title":obj.get("title",""),"artist":obj.get("artistDisplayName",""),"date":obj.get("objectDate",""),"medium":obj.get("medium",""),"image":obj["primaryImageSmall"],"url":obj.get("objectURL","")})
                    if len(results) >= n: break
            except Exception:
                continue
        return results
    except Exception:
        return []

def search_vam(query: str, n: int = 4) -> list:
    try:
        q = urllib.parse.quote(query)
        data = _fetch_json(f"https://api.vam.ac.uk/v2/objects/search?q={q}&images_exist=1&page_size={n}")
        results = []
        for rec in data.get("records", []):
            img_id = rec.get("_primaryImageId","")
            if not img_id: continue
            results.append({"museum":"V&A","title":rec.get("_primaryTitle",""),"artist":rec.get("_primaryMaker",{}).get("name","") if rec.get("_primaryMaker") else "","date":rec.get("_primaryDate",""),"medium":"","image":f"https://framemark.vam.ac.uk/collections/{img_id}/full/300,/0/default.jpg","url":f"https://collections.vam.ac.uk/item/{rec.get('systemNumber','')}"})
        return results
    except Exception:
        return []

def search_nga(query: str, n: int = 4) -> list:
    try:
        q = urllib.parse.quote(query)
        data = _fetch_json(f"https://api.nga.gov/art/artobjects?q={q}&hasimage=1&limit={n}&offset=0")
        results = []
        for rec in (data.get("artObjects") or data.get("data") or []):
            oid = rec.get("objectId") or rec.get("id","")
            img = rec.get("imageUrl") or (f"https://api.nga.gov/iiif/{oid}/full/!300,300/0/default.jpg" if oid else "")
            if not img: continue
            results.append({"museum":"NGA Washington","title":rec.get("title",""),"artist":rec.get("attribution",""),"date":rec.get("displayDate",""),"medium":rec.get("medium",""),"image":img,"url":f"https://www.nga.gov/artworks/{oid}" if oid else ""})
        return results
    except Exception:
        return []

def search_cleveland(query: str, n: int = 4) -> list:
    try:
        q = urllib.parse.quote(query)
        data = _fetch_json(f"https://openaccess-api.clevelandart.org/api/artworks/?q={q}&has_image=1&limit={n}")
        results = []
        for rec in (data.get("data") or []):
            img = (rec.get("images") or {}).get("web",{}).get("url","")
            if not img: img = (rec.get("images") or {}).get("print",{}).get("url","")
            if not img: continue
            results.append({"museum":"Cleveland Museum","title":rec.get("title",""),"artist":", ".join(c.get("description","") for c in (rec.get("creators") or [])),"date":rec.get("creation_date",""),"medium":rec.get("technique",""),"image":img,"url":rec.get("url","")})
        return results
    except Exception:
        return []

def search_louvre(query: str, n: int = 4) -> list:
    try:
        q = urllib.parse.quote(query)
        data = _fetch_json(f"https://collections.louvre.fr/api/search?q={q}&page=1")
        results = []
        for rec in (data.get("results") or [])[:n]:
            images = rec.get("images") or []
            img = images[0].get("url","") if images else ""
            if not img: continue
            results.append({"museum":"Louvre","title":rec.get("title",{}).get("en","") or rec.get("title",{}).get("fr",""),"artist":rec.get("attribution",""),"date":rec.get("dated",""),"medium":rec.get("materials",""),"image":img,"url":f"https://collections.louvre.fr/en/ark:/53355/{rec.get('objectNumber','')}"})
        return results
    except Exception:
        return []

def search_all_museums(query: str, n: int = 4) -> list:
    combined = []
    for fn in [search_met, search_vam, search_nga, search_cleveland, search_louvre]:
        combined.extend(fn(query, n))
    return combined

HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>RBAA Image Search</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Georgia, serif; background: #f7f5f0; color: #2c2c2c; }
header { background: #1a1a1a; color: #d4c5a0; padding: 1.2rem 2rem; display: flex; align-items: baseline; gap: 1.5rem; }
header h1 { font-size: 1.1rem; font-weight: normal; letter-spacing: .08em; }
header span { font-size: .8rem; opacity: .6; font-family: monospace; }
.container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
.search-panel { background: white; border: 1px solid #ddd8ce; padding: 1.5rem; margin-bottom: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.drop-zone { border: 2px dashed #b5a98a; padding: 2rem; text-align: center; cursor: pointer; min-height: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .5rem; font-size: .9rem; color: #888; }
.drop-zone.dragover { background: #f0ece2; }
.drop-zone img { max-height: 100px; max-width: 100%; object-fit: contain; }
.text-panel { display: flex; flex-direction: column; gap: .8rem; }
label { font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; color: #777; }
textarea { width: 100%; height: 80px; padding: .6rem; border: 1px solid #ccc; font-family: Georgia, serif; font-size: .9rem; resize: vertical; }
.controls { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
select, input[type=number] { padding: .4rem .6rem; border: 1px solid #ccc; font-family: Georgia, serif; font-size: .85rem; background: white; }
button { background: #1a1a1a; color: #d4c5a0; border: none; padding: .5rem 1.4rem; font-family: Georgia, serif; font-size: .9rem; cursor: pointer; }
button:hover { background: #333; }
button.secondary { background: transparent; color: #555; border: 1px solid #ccc; }
.status { font-size: .8rem; color: #888; font-family: monospace; }
.section-title { font-size: .8rem; text-transform: uppercase; letter-spacing: .1em; color: #888; margin-bottom: .8rem; padding-bottom: .4rem; border-bottom: 1px solid #ddd8ce; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.card { background: white; border: 1px solid #ddd8ce; overflow: hidden; cursor: pointer; transition: box-shadow .2s; }
.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.12); }
.card img { width: 100%; height: 160px; object-fit: cover; display: block; background: #eee; }
.card .info { padding: .5rem .6rem; font-size: .75rem; line-height: 1.4; }
.card .score { font-family: monospace; color: #8a7a5a; font-weight: bold; }
.card .location { color: #555; margin-top: .2rem; }
.card .filename { color: #999; font-size: .7rem; margin-top: .2rem; word-break: break-all; }
.verify-bar { display: flex; align-items: center; gap: .8rem; margin-bottom: 1rem; padding: .6rem .8rem; background: #f0ece2; border: 1px solid #ddd8ce; font-size: .8rem; color: #666; }
.verify-bar input { cursor: pointer; }
.museum-panel { background: white; border: 1px solid #ddd8ce; padding: 1.5rem; margin-bottom: 2rem; }
.museum-group { margin-bottom: 1.5rem; }
.museum-name { font-size: .75rem; text-transform: uppercase; letter-spacing: .08em; color: #8a7a5a; margin-bottom: .6rem; font-weight: bold; }
.museum-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: .8rem; }
.museum-card { border: 1px solid #e8e3da; overflow: hidden; cursor: pointer; transition: box-shadow .2s; background: #fafaf8; }
.museum-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,.1); }
.museum-card img { width: 100%; height: 140px; object-fit: contain; display: block; background: #f0ede6; padding: 4px; }
.museum-card .minfo { padding: .4rem .5rem; font-size: .7rem; line-height: 1.4; }
.museum-card .mtitle { color: #333; font-style: italic; }
.museum-card .martist { color: #777; margin-top: .15rem; }
.museum-card .mdate { color: #999; font-size: .65rem; margin-top: .1rem; }
.museum-loading { color: #aaa; font-style: italic; font-size: .85rem; padding: .5rem 0; }
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.75); z-index: 100; align-items: center; justify-content: center; }
.modal-overlay.open { display: flex; }
.modal { background: white; max-width: 90vw; max-height: 90vh; overflow: auto; padding: 1.5rem; }
.modal img { max-width: 100%; max-height: 70vh; object-fit: contain; display: block; }
.modal .meta { margin-top: 1rem; font-size: .85rem; line-height: 1.8; }
.modal .path { font-family: monospace; font-size: .75rem; color: #888; word-break: break-all; }
.modal-close { float: right; cursor: pointer; font-size: 1.2rem; color: #888; }
.loading { text-align: center; padding: 3rem; color: #888; font-style: italic; }
</style>
</head>
<body>
<header>
  <h1>RBAA · Image Search</h1>
  <span id="stats-label">loading index…</span>
</header>
<div class="container">
  <div class="search-panel">
    <div>
      <div class="drop-zone" id="dropZone">
        <div id="dropPrompt">Drop a query image here<br><small>or click to browse</small></div>
        <img id="preview" style="display:none">
        <input type="file" id="fileInput" accept="image/*" style="display:none">
      </div>
    </div>
    <div class="text-panel">
      <label>Or describe what you are looking for</label>
      <textarea id="textQuery" placeholder="e.g. French commode ormolu mounts 1770"></textarea>
      <div class="controls">
        <div>
          <label style="display:block;margin-bottom:.3rem">Filter location</label>
          <select id="locationFilter"><option value="">All locations</option></select>
        </div>
        <div>
          <label style="display:block;margin-bottom:.3rem">Results</label>
          <input type="number" id="topK" value="20" min="5" max="100" style="width:60px">
        </div>
        <div style="margin-top:1.4rem;display:flex;gap:.5rem;">
          <button onclick="runSearch()">Search</button>
          <button class="secondary" onclick="clearSearch()">Clear</button>
        </div>
      </div>
      <div class="status" id="status"></div>
    </div>
  </div>
  <div id="resultsSection" style="display:none">
    <div class="section-title" id="archiveTitle"></div>
    <div class="grid" id="grid"></div>
    <div id="museumSection" style="display:none">
      <div class="verify-bar">
        <input type="checkbox" id="verifyToggle" checked onchange="toggleMuseums()">
        <label for="verifyToggle">Museum comparisons — Met · V&amp;A · NGA · Cleveland · Louvre</label>
      </div>
      <div class="museum-panel" id="museumPanel">
        <div class="museum-loading" id="museumLoading">Querying museum collections…</div>
        <div id="museumResults"></div>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" id="modal" onclick="closeModal(event)">
  <div class="modal">
    <span class="modal-close" onclick="document.getElementById('modal').classList.remove('open')">x</span>
    <img id="modalImg" src="">
    <div class="meta" id="modalMeta"></div>
  </div>
</div>
"""

HTML2 = """
<script>
let queryFile = null;
fetch('/api/stats').then(r=>r.json()).then(s=>{
  document.getElementById('stats-label').textContent=`${s.total_images.toLocaleString()} images · ${s.locations} locations`;
});
fetch('/api/locations').then(r=>r.json()).then(locs=>{
  const sel=document.getElementById('locationFilter');
  locs.forEach(l=>{const o=document.createElement('option');o.value=o.textContent=l;sel.appendChild(o);});
});
const dz=document.getElementById('dropZone');
const fi=document.getElementById('fileInput');
const preview=document.getElementById('preview');
dz.addEventListener('click',()=>fi.click());
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dragover');});
dz.addEventListener('dragleave',()=>dz.classList.remove('dragover'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dragover');handleFile(e.dataTransfer.files[0]);});
fi.addEventListener('change',()=>handleFile(fi.files[0]));
function handleFile(file){
  if(!file)return;
  queryFile=file;
  const reader=new FileReader();
  reader.onload=e=>{preview.src=e.target.result;preview.style.display='block';document.getElementById('dropPrompt').style.display='none';document.getElementById('textQuery').value='';};
  reader.readAsDataURL(file);
}
async function runSearch(){
  const text=document.getElementById('textQuery').value.trim();
  const location=document.getElementById('locationFilter').value;
  const k=parseInt(document.getElementById('topK').value)||20;
  const status=document.getElementById('status');
  const isText=!queryFile&&!!text;
  if(!queryFile&&!text){status.textContent='Drop an image or enter a description first.';return;}
  status.textContent='Searching...';
  document.getElementById('grid').innerHTML='<div class="loading">Searching archive...</div>';
  document.getElementById('resultsSection').style.display='block';
  document.getElementById('museumSection').style.display='none';
  let results;
  try{
    if(queryFile){
      const fd=new FormData();fd.append('image',queryFile);fd.append('k',k);if(location)fd.append('location',location);
      const r=await fetch('/api/search/image',{method:'POST',body:fd});results=await r.json();
    }else{
      const r=await fetch('/api/search/text',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,k,location})});results=await r.json();
    }
  }catch(e){status.textContent='Error: '+e.message;return;}
  if(results.error){status.textContent='Error: '+results.error;return;}
  status.textContent=`${results.length} archive results`;
  document.getElementById('archiveTitle').textContent=queryFile?`Archive matches for "${queryFile.name}"`:(`Archive matches for "${text}"`);
  renderGrid(results);
  if(isText){
    document.getElementById('museumSection').style.display='block';
    document.getElementById('museumResults').innerHTML='';
    document.getElementById('museumLoading').style.display='block';
    fetchMuseums(text);
  }
}
async function fetchMuseums(query){
  try{
    const r=await fetch('/api/museums',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});
    const data=await r.json();
    document.getElementById('museumLoading').style.display='none';
    renderMuseums(data);
  }catch(e){document.getElementById('museumLoading').textContent='Museum search unavailable.';}
}
function renderMuseums(results){
  const container=document.getElementById('museumResults');
  container.innerHTML='';
  const groups={};
  results.forEach(r=>{if(!groups[r.museum])groups[r.museum]=[];groups[r.museum].push(r);});
  if(Object.keys(groups).length===0){container.innerHTML='<div style="color:#bbb;font-size:.8rem">No museum results found.</div>';return;}
  Object.entries(groups).forEach(([museum,items])=>{
    const group=document.createElement('div');group.className='museum-group';
    group.innerHTML=`<div class="museum-name">${museum}</div>`;
    const grid=document.createElement('div');grid.className='museum-grid';
    items.forEach(item=>{
      const card=document.createElement('div');card.className='museum-card';
      card.innerHTML=`<img src="${item.image}" loading="lazy" onerror="this.style.display='none'" alt="${item.title}"><div class="minfo"><div class="mtitle">${item.title||'Untitled'}</div><div class="martist">${item.artist||''}</div><div class="mdate">${item.date||''}${item.medium?' · '+item.medium:''}</div></div>`;
      if(item.url)card.addEventListener('click',()=>window.open(item.url,'_blank'));
      grid.appendChild(card);
    });
    group.appendChild(grid);container.appendChild(group);
  });
}
function toggleMuseums(){
  document.getElementById('museumPanel').style.display=document.getElementById('verifyToggle').checked?'block':'none';
}
function renderGrid(results){
  const grid=document.getElementById('grid');grid.innerHTML='';
  results.forEach((r,i)=>{
    const card=document.createElement('div');card.className='card';
    card.innerHTML=`<img src="/api/thumb?path=${encodeURIComponent(r.path)}" loading="lazy" onerror="this.style.display='none'"><div class="info"><div class="score">#${i+1} · ${r.pct}</div><div class="location">${r.location}${r.subfolder?' / '+r.subfolder:''}</div><div class="filename">${r.filename}</div></div>`;
    card.addEventListener('click',()=>openModal(r));grid.appendChild(card);
  });
}
function openModal(r){
  document.getElementById('modalImg').src=`/api/thumb?path=${encodeURIComponent(r.path)}`;
  const locLabel=(r.location_raw&&r.location_raw!==r.location)?`${r.location} <span style="color:#aaa;font-size:.8em">(${r.location_raw})</span>`:r.location;
  document.getElementById('modalMeta').innerHTML=`<strong>Location:</strong> ${locLabel}<br>${r.subfolder?`<strong>Subfolder:</strong> ${r.subfolder}<br>`:''}<strong>Similarity:</strong> ${r.pct}<br><div class="path">${r.path}</div>`;
  document.getElementById('modal').classList.add('open');
}
function closeModal(e){if(e.target.id==='modal')document.getElementById('modal').classList.remove('open');}
function clearSearch(){
  queryFile=null;preview.style.display='none';document.getElementById('dropPrompt').style.display='block';
  document.getElementById('textQuery').value='';document.getElementById('status').textContent='';
  document.getElementById('resultsSection').style.display='none';fi.value='';
}
</script>
</body>
</html>
"""

FULL_HTML = HTML + HTML2

@app.route("/")
def index():
    return render_template_string(FULL_HTML)

@app.route("/api/stats")
def api_stats():
    try: return jsonify(index_stats())
    except FileNotFoundError as e: return jsonify({"error": str(e)}), 503

@app.route("/api/locations")
def api_locations():
    try: return jsonify(list_locations())
    except FileNotFoundError as e: return jsonify({"error": str(e)}), 503

@app.route("/api/search/image", methods=["POST"])
def api_search_image():
    if "image" not in request.files: return jsonify({"error": "No image uploaded"}), 400
    f=request.files["image"]; k=int(request.form.get("k",20)); loc=request.form.get("location") or None
    with tempfile.NamedTemporaryFile(suffix=Path(f.filename).suffix, delete=False) as tmp:
        f.save(tmp.name); results=search_by_image(Path(tmp.name),k=k,filter_location=loc)
    return jsonify(results)

@app.route("/api/search/text", methods=["POST"])
def api_search_text():
    data=request.get_json(); text=data.get("text","").strip()
    if not text: return jsonify({"error": "No text provided"}), 400
    k=int(data.get("k",20)); loc=data.get("location") or None
    results=search_by_text(text,k=k,filter_location=loc)
    return jsonify(results)

@app.route("/api/museums", methods=["POST"])
def api_museums():
    data=request.get_json(); query=data.get("query","").strip()
    if not query: return jsonify([])
    return jsonify(search_all_museums(query, n=4))

@app.route("/api/thumb")
def api_thumb():
    path=request.args.get("path")
    if not path: return "No path",400
    p=Path(path)
    if not p.exists(): return "Not found",404
    try:
        with open(p,"rb") as f: data=f.read()
        suffix=p.suffix.lower()
        mime="image/jpeg" if suffix in {".jpg",".jpeg"} else "image/png" if suffix==".png" else "image/tiff" if suffix in {".tif",".tiff"} else "image/jpeg"
        return app.response_class(data,mimetype=mime)
    except OSError: return "Read error",500

if __name__ == "__main__":
    print("RBAA Image Search — http://localhost:5000")
    app.run(debug=False, port=5000)
