/* ============ Watch page ============ */
(function(){
  const id = new URLSearchParams(location.search).get("id") || VIDEOS[0].id;
  const v = VIDEOS.find(x=>x.id===id) || VIDEOS[0];

  // Save to history
  const hist = JSON.parse(localStorage.getItem("yt-history")||"[]");
  localStorage.setItem("yt-history",JSON.stringify([v.id, ...hist.filter(x=>x!==v.id)].slice(0,40)));

  document.title = v.title + " — YouTube Clone";
  const player = document.getElementById("player");
  player.src = v.src;
  player.poster = v.thumbnail;

  document.getElementById("watchTitle").textContent = v.title;
  document.getElementById("chAvatar").src = v.channel.avatar;
  document.getElementById("chName").textContent = v.channel.name;
  document.getElementById("chSubs").textContent = v.channel.subs + " subscribers";

  // Like state
  let liked = JSON.parse(localStorage.getItem("yt-liked")||"[]").includes(v.id);
  let likes = v.likes + (liked?1:0);
  const likeBtn = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");
  function refreshLike(){
    likeBtn.classList.toggle("active",liked);
    likeCount.textContent = likes>=1000 ? (likes/1000).toFixed(1)+"K" : likes;
  }
  refreshLike();
  likeBtn.addEventListener("click",()=>{
    liked = !liked; likes += liked?1:-1;
    const arr = JSON.parse(localStorage.getItem("yt-liked")||"[]");
    const next = liked ? [v.id,...arr.filter(x=>x!==v.id)] : arr.filter(x=>x!==v.id);
    localStorage.setItem("yt-liked",JSON.stringify(next));
    refreshLike();
    toast(liked?"Added to Liked videos":"Removed from Liked videos");
  });
  document.getElementById("dislikeBtn").addEventListener("click",()=>toast("Disliked"));
  document.getElementById("saveBtn").addEventListener("click",()=>toast("Saved to Watch Later"));

  // Subscribe
  const subBtn = document.getElementById("subBtn");
  let subs = JSON.parse(localStorage.getItem("yt-subs")||"[]");
  function refreshSub(){
    const on = subs.includes(v.channel.name);
    subBtn.textContent = on ? "Subscribed" : "Subscribe";
    subBtn.classList.toggle("subbed",on);
  }
  refreshSub();
  subBtn.addEventListener("click",()=>{
    if(subs.includes(v.channel.name)) subs = subs.filter(s=>s!==v.channel.name);
    else subs.push(v.channel.name);
    localStorage.setItem("yt-subs",JSON.stringify(subs));
    refreshSub();
    toast(subs.includes(v.channel.name)?`Subscribed to ${v.channel.name}`:`Unsubscribed`);
  });

  // Description
  document.getElementById("descMeta").textContent = `${v.views} • ${v.uploaded}`;
  document.getElementById("descText").textContent = v.description;
  const showMore = document.getElementById("showMore");
  showMore.addEventListener("click",()=>{
    const t = document.getElementById("descText");
    t.classList.toggle("expanded");
    showMore.textContent = t.classList.contains("expanded") ? "Show less" : "Show more";
  });

  // Comments
  const COMMENT_KEY = "yt-comments-"+v.id;
  const sampleComments = [
    {user:"Sara M.",avatar:"https://i.pravatar.cc/40?img=5",text:"This was so helpful, thanks!",likes:24,time:"2 days ago"},
    {user:"Devon",avatar:"https://i.pravatar.cc/40?img=7",text:"Great explanation around 4:32 🙌",likes:11,time:"5 hours ago"},
    {user:"Priya",avatar:"https://i.pravatar.cc/40?img=9",text:"Subscribed!",likes:3,time:"1 day ago"},
  ];
  let comments = JSON.parse(localStorage.getItem(COMMENT_KEY) || "null") || sampleComments;
  function saveComments(){localStorage.setItem(COMMENT_KEY,JSON.stringify(comments))}
  function renderComments(){
    document.getElementById("commentCount").textContent = comments.length+" Comments";
    const list = document.getElementById("commentsList");
    list.innerHTML = "";
    comments.forEach((c,i)=>{
      const el = document.createElement("div");
      el.className = "comment";
      el.innerHTML = `
        <img src="${c.avatar}" alt="">
        <div class="c-body">
          <div class="c-head">${c.user}<span class="muted">${c.time}</span></div>
          <div class="c-text">${c.text}</div>
          <div class="c-actions">
            <button data-act="like"><span class="material-symbols-outlined" style="font-size:18px">thumb_up</span>${c.likes}</button>
            <button data-act="dislike"><span class="material-symbols-outlined" style="font-size:18px">thumb_down</span></button>
            <button data-act="reply">Reply</button>
          </div>
        </div>`;
      el.querySelector('[data-act="like"]').addEventListener("click",()=>{c.likes++;saveComments();renderComments()});
      el.querySelector('[data-act="reply"]').addEventListener("click",()=>toast("Reply form opened"));
      list.appendChild(el);
    });
  }
  renderComments();
  document.getElementById("commentBtn").addEventListener("click",()=>{
    const inp = document.getElementById("commentText");
    const text = inp.value.trim(); if(!text) return;
    comments.unshift({user:"You",avatar:"https://i.pravatar.cc/40?img=12",text,likes:0,time:"just now"});
    saveComments(); renderComments(); inp.value = "";
  });
  document.getElementById("commentText").addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("commentBtn").click()});

  // Up next
  const upNext = document.getElementById("upNext");
  VIDEOS.filter(x=>x.id!==v.id).slice(0,10).forEach(x=>{
    const el = document.createElement("div");
    el.className = "up-card";
    el.innerHTML = `
      <div class="up-thumb"><img loading="lazy" src="${x.thumbnail}" alt=""><span class="duration">${x.duration}</span></div>
      <div class="up-info">
        <div class="up-title">${x.title}</div>
        <div class="up-sub">${x.channel.name}${x.channel.verified?' ✓':''}</div>
        <div class="up-sub">${x.views} • ${x.uploaded}</div>
      </div>`;
    el.addEventListener("click",()=>location.href=`watch.html?id=${x.id}`);
    upNext.appendChild(el);
  });

  // Auto-play next
  player.addEventListener("ended",()=>{
    const list = VIDEOS.filter(x=>x.id!==v.id);
    const next = list[Math.floor(Math.random()*list.length)];
    toast("Playing next…");
    setTimeout(()=>location.href=`watch.html?id=${next.id}`,1200);
  });

  // Keyboard
  document.addEventListener("keydown",e=>{
    if(e.target.matches("input,textarea")) return;
    if(e.key===" "){e.preventDefault(); player.paused?player.play():player.pause();}
    if(e.key.toLowerCase()==="f"){if(player.requestFullscreen)player.requestFullscreen()}
    if(e.key.toLowerCase()==="m"){player.muted=!player.muted}
    if(e.key==="ArrowRight"){player.currentTime+=5}
    if(e.key==="ArrowLeft"){player.currentTime-=5}
  });
})();
