/* Advanced templates curated for LiveCode preview environment.
   These templates avoid ESM-only module injection and prefer global/UMD/CDN
   builds because the preview injects <script src="..."></script> tags.
 */

export const templates = [
  {
    id: 'dark-mode-toggle',
    name: 'Dark Mode Toggle (CSS variables)',
    description: 'A practical theme toggle using CSS variables and persisted preference in localStorage. Demonstrates how to implement site-wide dark mode in real apps.',
    tags: ['theme','dark-mode','css-variables'],
    languages: ['html','css','javascript'],
    libraries: [],
    html: `<!doctype html>
<html>
  <body>
    <div class="app">
      <header>
        <h1>Dark Mode Toggle</h1>
        <button id="toggle">Toggle Theme</button>
      </header>
      <main>
        <p>This template shows a theme using CSS variables and a persisted user choice.</p>
      </main>
    </div>
  </body>
</html>` ,
    css: `:root{--bg:#ffffff;--text:#111111;--card:#f8fafc} .dark{--bg:#0b1220;--text:#e6eef8;--card:#0f1724} body{background:var(--bg);color:var(--text);font-family:Inter,system-ui,Arial;padding:20px} .app header{display:flex;justify-content:space-between;align-items:center} button{padding:8px 12px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)} main{margin-top:16px;padding:12px;background:var(--card);border-radius:8px}`,
    js: `const root=document.documentElement;const btn=document.getElementById('toggle');const apply=(dark)=>{if(dark){root.classList.add('dark');localStorage.setItem('lc-theme','dark')}else{root.classList.remove('dark');localStorage.setItem('lc-theme','light')}};btn.addEventListener('click',()=>apply(!root.classList.contains('dark')));const saved=localStorage.getItem('lc-theme');apply(saved?saved==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches);`
  },

  {
    id: 'responsive-dashboard',
    name: 'Responsive Dashboard Grid',
    description: 'A small responsive dashboard layout using CSS Grid and a simple card component — useful for admin/UIs.',
    tags: ['responsive','dashboard','css-grid'],
    languages: ['html','css','javascript'],
    libraries: [],
    html: `<!doctype html>
<html>
  <body>
    <div class="grid">
      <div class="card">Users<br><strong>1,234</strong></div>
      <div class="card">Sales<br><strong>$12,345</strong></div>
      <div class="card">Errors<br><strong>3</strong></div>
      <div class="card wide">Activity log</div>
    </div>
  </body>
</html>`,
    css: `.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:12px;padding:16px} .card{grid-column:span 3;background:#fff;padding:16px;border-radius:8px;box-shadow:0 4px 10px rgba(2,6,23,0.06)} .card.wide{grid-column:span 6} @media(max-width:800px){.card{grid-column:span 6}.card.wide{grid-column:span 12}} body{font-family:Inter,system-ui,Arial;background:#f3f4f6;padding:12px}`,
    js: `// Example: update numbers (simulated)
setInterval(()=>{document.querySelectorAll('.card strong').forEach((el,i)=>el.textContent = Math.floor(Math.random()*5000))},3000)`
  },

  {
    id: 'pwa-service-worker-stub',
    name: 'PWA Service Worker Stub',
    description: 'Demonstrates a minimal Service Worker registration and simple offline caching strategy (client-only demo; service worker file is registered in the preview).',
    tags: ['pwa','service-worker','offline'],
    languages: ['html','css','javascript'],
    libraries: [],
    html: `<!doctype html>
<html>
  <body>
    <h1>PWA / SW Demo</h1>
    <p>This registers a tiny service worker and caches the page shell.</p>
  </body>
</html>`,
    css: `body{font-family:Inter,system-ui,Arial;padding:16px}`,
    js: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').then(()=>console.log('SW registered')).catch(e=>console.error('SW reg failed',e));}else console.log('SW not supported');` 
  },

  {
    id: 'auth-popup-mock',
    name: 'OAuth Popup Mock',
    description: 'A client-side mock of an OAuth popup flow (opens a popup and receives a message). Useful to prototype sign-in flows.',
    tags: ['auth','oauth','popup'],
    languages: ['html','css','javascript'],
    libraries: [],
    html: `<!doctype html>
<html>
  <body>
    <h1>Auth Popup Mock</h1>
    <button id="signin">Sign in (Popup)</button>
    <pre id="out"></pre>
  </body>
</html>`,
    css: `body{font-family:Inter,system-ui,Arial;padding:16px}button{padding:8px 12px}`,
    js: `const btn = document.getElementById('signin');
const out = document.getElementById('out');

btn.addEventListener('click', () => {
  const popup = window.open('', 'auth', 'width=500,height=600');
  if (!popup) {
    out.textContent = 'Popup blocked by browser';
    return;
  }

  // Write a simple popup HTML and attach the click handler via the popup's document
  const doc = popup.document;
  doc.open();
  doc.write('<!doctype html><html><body><p>Simulated provider. Click to return token.</p><button id="send">Return Token</button></body></html>');
  doc.close();

  // Wait for the popup DOM to be ready and then attach the listener
  const attach = () => {
    try {
      const send = doc.getElementById('send');
      if (send) {
        send.addEventListener('click', () => {
          window.opener.postMessage({ type: 'auth', token: 'tok_abc123' }, '*');
          popup.close();
        });
        return;
      }
    } catch (e) {
      // ignore cross-origin or timing issues
    }
    setTimeout(attach, 50);
  };
  attach();
});

window.addEventListener('message', (ev) => {
  if (ev.data && ev.data.type === 'auth') {
    out.textContent = 'Received token: ' + ev.data.token;
  }
});`
  },

  {
    id: 'file-upload-preview',
    name: 'File Upload & Preview',
    description: 'Client-side file input that previews images and reads text files — common in many apps. Includes a visible upload button and drag-and-drop support.',
    tags: ['file','upload','preview','drag-drop'],
    languages: ['html','css','javascript'],
    libraries: [],
    html: `<!doctype html>
<html>
  <body>
    <h1>File Upload Preview</h1>
    <div class="controls">
      <button id="uploadBtn">Choose file</button>
      <input id="file" type="file" style="display:none" />
      <span id="filename" style="margin-left:12px;color:#555"></span>
    </div>
    <div id="preview" class="preview" style="margin-top:12px">Drop a file here or click "Choose file"</div>
  </body>
</html>`,
    css: `body{font-family:Inter,system-ui,Arial;padding:16px}img{max-width:100%;height:auto;border-radius:8px}.controls{display:flex;align-items:center;gap:8px}button#uploadBtn{padding:8px 12px;border-radius:6px;border:1px solid rgba(0,0,0,0.08);background:#fff;cursor:pointer}.preview{min-height:120px;border:2px dashed #e2e8f0;border-radius:8px;padding:12px;display:flex;align-items:center;justify-content:center;color:#64748b}`,
    js: `const fileInput = document.getElementById('file');
const uploadBtn = document.getElementById('uploadBtn');
const preview = document.getElementById('preview');
const filename = document.getElementById('filename');
let currentUrl = null;

function clearPreview(){ if(currentUrl){ URL.revokeObjectURL(currentUrl); currentUrl = null; } preview.innerHTML = 'Drop a file here or click "Choose file"'; filename.textContent = ''; }

function renderFile(f){ preview.innerHTML = ''; filename.textContent = f.name; if(f.type && f.type.startsWith('image/')){ currentUrl = URL.createObjectURL(f); const img = document.createElement('img'); img.src = currentUrl; img.alt = f.name; img.style.maxWidth = '100%'; img.style.borderRadius = '8px'; preview.appendChild(img); } else if(f.type && f.type.startsWith('text')){ f.text().then(t=>{ const pre = document.createElement('pre'); pre.textContent = t.slice(0,200); preview.appendChild(pre); }).catch(()=>{ preview.textContent = 'Unable to read file.' }); } else { preview.textContent = 'Preview not available for this file type.\nFile name: ' + f.name; } }

uploadBtn.addEventListener('click', ()=> fileInput.click());
fileInput.addEventListener('change', (e)=>{ const f = e.target.files[0]; if(!f) return; clearPreview(); renderFile(f); });

// Drag & drop support
preview.addEventListener('dragover', (e)=>{ e.preventDefault(); preview.style.outline = '3px dashed #9ca3af'; });
preview.addEventListener('dragleave', ()=>{ preview.style.outline = 'none'; });
preview.addEventListener('drop', (e)=>{ e.preventDefault(); preview.style.outline = 'none'; const f = e.dataTransfer.files && e.dataTransfer.files[0]; if(!f) return; clearPreview(); renderFile(f); });
` 
  },

  {
    id: 'csv-import-export',
    name: 'CSV Import & Export',
    description: 'Import CSV into a small table and export data back to CSV — useful for admin or reporting tools.',
    tags: ['csv','import','export'],
    languages: ['html','css','javascript'],
    libraries: [],
    html: `<!doctype html>
<html>
  <body>
    <h1>CSV Import / Export</h1>
    <input id="csvfile" type="file" accept=".csv" />
    <button id="export">Export CSV</button>
    <pre id="out" style="margin-top:12px"></pre>
  </body>
</html>`,
    css: `body{font-family:Inter,system-ui,Arial;padding:16px}`,
    js: `let data=[];document.getElementById('csvfile').addEventListener('change',async(e)=>{const f=e.target.files[0];if(!f) return;const txt=await f.text();const rows=txt.trim().split('\n').map(r=>r.split(','));data=rows;document.getElementById('out').textContent = JSON.stringify(rows,null,2);});document.getElementById('export').addEventListener('click',()=>{if(!data.length) return;const csv = data.map(r=>r.join(',')).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url;a.download='export.csv'; a.click(); URL.revokeObjectURL(url);});`
  },

  {
    id: 'chartjs-dashboard',
    name: 'Chart.js Mini Dashboard',
    description: 'Basic Chart.js line + bar charts using CDN — practical for dashboards and reports.',
    tags: ['chart','chartjs','dashboard'],
    languages: ['html','css','javascript'],
    libraries: [
      { name: 'Chart.js', cdn: 'https://cdn.jsdelivr.net/npm/chart.js', type: 'script' }
    ],
    html: `<!doctype html>
<html>
  <body>
    <canvas id="line" width="400" height="120"></canvas>
    <canvas id="bar" width="400" height="120" style="margin-top:12px"></canvas>
  </body>
</html>`,
    css: `body{font-family:Inter,system-ui,Arial;padding:16px}`,
    js: `const l=document.getElementById('line').getContext('2d');const b=document.getElementById('bar').getContext('2d');new Chart(l,{type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri'],datasets:[{label:'Visitors',data:[12,19,7,14,18],borderColor:'#3b82f6',fill:false}]}});new Chart(b,{type:'bar',data:{labels:['A','B','C'],datasets:[{label:'Sales',data:[5,9,3],backgroundColor:['#ef4444','#f59e0b','#10b981']}]}});`
  },

  {
    id: 'indexeddb-notes',
    name: 'IndexedDB Notes (real-life)',
    description: 'A small notes app using IndexedDB for persistent client-side storage — practical for offline-capable UIs.',
    tags: ['indexeddb','offline','storage'],
    languages: ['html','css','javascript'],
    libraries: [],
    html: `<!doctype html>
<html>
  <body>
    <h1>IndexedDB Notes</h1>
    <input id="title" placeholder="Note title" />
    <button id="save">Save</button>
    <ul id="list"></ul>
  </body>
</html>`,
    css: `body{font-family:Inter,system-ui,Arial;padding:16px}li{padding:8px;border-bottom:1px solid #e6edf3}`,
    js: `function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open('livecode-db',1);r.onupgradeneeded=()=>{r.result.createObjectStore('notes',{keyPath:'id',autoIncrement:true})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});}async function addNote(t){const db=await openDB();const tx=db.transaction('notes','readwrite');tx.objectStore('notes').add({title:t});return tx.complete}async function listNotes(){const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction('notes','readonly');const req=tx.objectStore('notes').getAll();req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)})}function render(){listNotes().then(items=>{const ul=document.getElementById('list');ul.innerHTML='';items.forEach(it=>{const li=document.createElement('li');li.textContent=it.title;ul.appendChild(li)})})}document.getElementById('save').addEventListener('click',async()=>{const t=document.getElementById('title').value;if(!t) return;await addNote(t);document.getElementById('title').value='';render()});render();`
  }
];

export default templates;