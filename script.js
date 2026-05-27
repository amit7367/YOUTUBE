/* ============ Shared (header + index) ============ */
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];

/* ----- Loader ----- */
window.addEventListener("load",()=>{
  setTimeout(()=>$("#loader")?.classList.add("hidden"),300);
});

/* ----- Theme ----- */
(function initTheme(){
  const saved = localStorage.getItem("yt-theme");
  if(saved==="dark") document.body.classList.add("dark");
  updateThemeIcon();
})();
function updateThemeIcon(){
  const btn = $("#themeToggle");
  if(!btn) return;
  btn.querySelector(".material-symbols-outlined").textContent =
    document.body.classList.contains("dark") ? "light_mode" : "dark_mode";
}
document.addEventListener("click",e=>{
  if(e.target.closest("#themeToggle")){
    document.body.classList.toggle("dark");
    localStorage.setItem("yt-theme",document.body.classList.contains("dark")?"dark":"light");
    updateThemeIcon();
  }
});

/* ----- Toast ----- */
function toast(msg){
  const t = $("#toast"); if(!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._tid);
  t._tid = setTimeout(()=>t.classList.remove("show"),2200);
}
window.toast = toast;

/* ----- Profile dropdown ----- */
document.addEventListener("click",e=>{
  const menu = $("#profileMenu");
  if(!menu) return;
  if(e.target.closest("#avatarBtn")){menu.classList.toggle("open");return}
  if(!e.target.closest("#profileMenu")) menu.classList.remove("open");
});

/* ----- Sidebar toggle ----- */
const sidebar = $("#sidebar");
const overlay = $("#overlay");
$("#menuToggle")?.addEventListener("click",()=>{
  if(window.innerWidth>1024){
    document.body.classList.toggle("mini");
  }else{
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  }
});
overlay?.addEventListener("click",()=>{
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});

/* ----- Search ----- */
function doSearch(){
  const q = $("#searchInput").value.trim().toLowerCase();
  if(!window.VIDEOS){ // on watch page navigate home
    location.href = "index.html?q="+encodeURIComponent(q);
    return;
  }
  renderGrid(q ? VIDEOS.filter(v =>
    v.title.toLowerCase().includes(q) || v.channel.name.toLowerCase().includes(q)
  ) : VIDEOS, q ? `Results for "${q}"` : "Recommended");
  showView("grid");
}
$("#searchBtn")?.addEventListener("click",doSearch);
$("#searchInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")doSearch()});
$("#voiceBtn")?.addEventListener("click",()=>toast("Voice search activated…"));

/* ----- Index page only below ----- */
if(typeof VIDEOS !== "undefined" && $("#videoGrid")){

  function fmt(view){return view}
  function makeCard(v){
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <div class="thumb">
        <img loading="lazy" src="${v.thumbnail}" alt="${v.title}">
        <span class="duration">${v.duration}</span>
      </div>
      <div class="card-meta">
        <img class="card-avatar" src="${v.channel.avatar}" alt="">
        <div class="card-info">
          <div class="card-title">${v.title}</div>
          <div class="card-channel">${v.channel.name}${v.channel.verified?'<span class="verified material-symbols-outlined">verified</span>':''}</div>
          <div class="card-sub">${v.views} • ${v.uploaded}</div>
        </div>
      </div>`;
    card.addEventListener("click",()=>{
      // save to history
      const hist = JSON.parse(localStorage.getItem("yt-history")||"[]");
      const next = [v.id, ...hist.filter(x=>x!==v.id)].slice(0,40);
      localStorage.setItem("yt-history",JSON.stringify(next));
      location.href = `watch.html?id=${v.id}`;
    });
    return card;
  }
  function renderGrid(list,title){
    $("#viewTitle").textContent = title || "Recommended";
    const grid = $("#videoGrid"); grid.innerHTML = "";
    $("#noResults").hidden = list.length>0;
    list.forEach(v => grid.appendChild(makeCard(v)));
  }
  window.renderGrid = renderGrid;

  /* Chips */
  $$(".chip").forEach(c=>c.addEventListener("click",()=>{
    $$(".chip").forEach(x=>x.classList.remove("active"));
    c.classList.add("active");
    const cat = c.textContent;
    renderGrid(cat==="All"?VIDEOS:VIDEOS.filter(v=>v.category===cat), cat);
  }));

  /* Shorts */
  function renderShorts(){
    const feed = $("#shortsFeed"); feed.innerHTML = "";
    SHORTS.forEach(s=>{
      const el = document.createElement("div");
      el.className = "short-card";
      el.innerHTML = `
        <video src="${s.src}" loop muted playsinline></video>
        <div class="short-actions">
          <button data-act="like"><span class="material-symbols-outlined">thumb_up</span>${(s.likes/1000).toFixed(1)}K</button>
          <button data-act="dislike"><span class="material-symbols-outlined">thumb_down</span></button>
          <button data-act="comment"><span class="material-symbols-outlined">comment</span></button>
          <button data-act="share"><span class="material-symbols-outlined">share</span></button>
        </div>
        <div class="short-overlay">
          <div class="short-title">${s.title}</div>
          <div class="muted">@${s.channel.name.replace(/\s+/g,'').toLowerCase()}</div>
        </div>`;
      const vid = el.querySelector("video");
      el.addEventListener("click",e=>{
        if(e.target.closest("button")){
          const act = e.target.closest("button").dataset.act;
          toast(act==="like"?"Liked":act==="share"?"Link copied":act==="comment"?"Comments":"Disliked");
          return;
        }
        vid.paused ? vid.play() : vid.pause();
      });
      // autoplay when in view
      new IntersectionObserver(([entry])=>{
        if(entry.isIntersecting){vid.play().catch(()=>{})}else{vid.pause()}
      },{threshold:.6}).observe(el);
      feed.appendChild(el);
    });
  }

  /* Views (nav) */
  function showView(name){
    $$(".view").forEach(v=>v.classList.remove("active"));
    if(name==="shorts"){ $("#view-shorts").classList.add("active"); renderShorts(); }
    else $("#view-grid").classList.add("active");
  }
  window.showView = showView;

  function navTo(target){
    $$(".side-link").forEach(s=>s.classList.toggle("active",s.dataset.nav===target));
    $$(".bottom-nav a").forEach(s=>s.classList.toggle("active",s.dataset.nav===target));
    if(window.innerWidth<=1024){sidebar.classList.remove("open");overlay.classList.remove("show")}
    switch(target){
      case "home": renderGrid(VIDEOS,"Recommended"); showView("grid"); break;
      case "shorts": showView("shorts"); break;
      case "subs": renderGrid(VIDEOS.slice(0,8),"Subscriptions"); showView("grid"); break;
      case "history":{
        const ids = JSON.parse(localStorage.getItem("yt-history")||"[]");
        renderGrid(ids.map(id=>VIDEOS.find(v=>v.id===id)).filter(Boolean),"History");
        showView("grid"); break;
      }
      case "liked":{
        const ids = JSON.parse(localStorage.getItem("yt-liked")||"[]");
        renderGrid(ids.map(id=>VIDEOS.find(v=>v.id===id)).filter(Boolean),"Liked Videos");
        showView("grid"); break;
      }
      case "trending": renderGrid([...VIDEOS].sort((a,b)=>b.likes-a.likes).slice(0,12),"Trending"); showView("grid"); break;
      case "music": renderGrid(VIDEOS.filter(v=>v.category==="Music"),"Music"); showView("grid"); break;
      case "gaming": renderGrid(VIDEOS.filter(v=>v.category==="Gaming"),"Gaming"); showView("grid"); break;
      case "settings": toast("Settings — coming soon"); break;
    }
  }
  document.addEventListener("click",e=>{
    const a = e.target.closest("[data-nav]");
    if(a){e.preventDefault(); navTo(a.dataset.nav);}
  });

  /* Initial render — handle ?q= */
  const params = new URLSearchParams(location.search);
  if(params.get("q")){
    $("#searchInput").value = params.get("q");
    doSearch();
  }else{
    renderGrid(VIDEOS,"Recommended");
  }

  /* Keyboard shortcuts */
  document.addEventListener("keydown",e=>{
    if(e.target.matches("input,textarea")) return;
    if(e.key==="/"){e.preventDefault(); $("#searchInput").focus();}
    if(e.key.toLowerCase()==="t"){$("#themeToggle").click();}
    if(e.key.toLowerCase()==="h"){navTo("home");}
    if(e.key.toLowerCase()==="s"){navTo("shorts");}
  });
}

function shareVideo(){
  const url = location.href;
  if(navigator.clipboard) navigator.clipboard.writeText(url).then(()=>toast("Link copied to clipboard"));
  else toast("Share: "+url);
}
window.shareVideo = shareVideo;
