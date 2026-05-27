// Sample data for the YouTube clone. Uses free placeholder thumbnails and
// public-domain Big Buck Bunny / Sintel mp4 streams for the player.
const SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLES = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
];

const CHANNELS = [
  {name:"Tech Insider",avatar:"https://i.pravatar.cc/80?img=15",subs:"4.2M",verified:true},
  {name:"Code With Mia",avatar:"https://i.pravatar.cc/80?img=47",subs:"890K",verified:true},
  {name:"Travel Diaries",avatar:"https://i.pravatar.cc/80?img=33",subs:"2.1M",verified:true},
  {name:"GameZone",avatar:"https://i.pravatar.cc/80?img=68",subs:"5.6M",verified:true},
  {name:"Lo-fi Beats",avatar:"https://i.pravatar.cc/80?img=23",subs:"12M",verified:true},
  {name:"Daily Chef",avatar:"https://i.pravatar.cc/80?img=55",subs:"760K",verified:false},
  {name:"Stadium Live",avatar:"https://i.pravatar.cc/80?img=11",subs:"3.4M",verified:true},
  {name:"Funny Bones",avatar:"https://i.pravatar.cc/80?img=44",subs:"1.1M",verified:false},
];

const TITLES = [
  "Building a Modern Web App from Scratch",
  "10 JavaScript Tricks You Didn't Know",
  "Hidden Gems of the Swiss Alps",
  "Epic Open World Boss Fight Compilation",
  "Lo-fi Beats to Relax and Study To",
  "Easy 15-Minute Dinner Recipes",
  "Last Minute Goal Wins the Match!",
  "Stand-Up Comedy Night Highlights",
  "Mastering CSS Grid in 12 Minutes",
  "Sunrise Over Mount Fuji — 4K Timelapse",
  "Speedrun World Record Attempt",
  "The Future of AI in Everyday Life",
  "Coffee Shop Vibes — Jazz Playlist",
  "Homemade Pasta — Step by Step",
  "Underrated Indie Games of the Year",
  "How I Built a $1M Startup in 12 Months",
  "Drone Footage of the Pacific Coast",
  "React 19 — Everything You Need to Know",
  "Pro Tips for Better Photography",
  "Beat the Heat — Iced Drink Recipes",
];

const TIMES = ["2 hours ago","5 hours ago","1 day ago","3 days ago","1 week ago","2 weeks ago","1 month ago","6 months ago"];
const VIEWS_POOL = ["12K","48K","124K","356K","1.2M","2.4M","5.6M","12M","24M"];
const DURS = ["3:24","7:18","10:45","12:01","15:32","21:09","4:55","8:20","18:44","2:11"];

const CATEGORIES = ["All","Music","Gaming","Live","News","Coding","Sports","Comedy","Cooking","Travel"];

function rand(arr){return arr[Math.floor(Math.random()*arr.length)]}

function thumbUrl(seed){
  // Picsum gives consistent random images per seed
  return `https://picsum.photos/seed/yt${seed}/640/360`;
}

const VIDEOS = TITLES.map((title,i)=>({
  id:"v"+(i+1),
  title,
  thumbnail:thumbUrl(i+1),
  channel:CHANNELS[i % CHANNELS.length],
  views:rand(VIEWS_POOL)+" views",
  uploaded:rand(TIMES),
  duration:rand(DURS),
  src:SAMPLES[i % SAMPLES.length],
  category:rand(CATEGORIES),
  description:`${title}\n\nThanks for watching! In this video we explore the topic in depth with clear visuals, practical examples, and a friendly walkthrough. Drop a comment with your thoughts, hit like if it helped, and subscribe for weekly uploads.\n\n00:00 Intro\n01:24 Setup\n04:32 Walkthrough\n09:10 Tips & Tricks\n12:45 Wrap up\n\n#tutorial #youtube #clone`,
  likes:Math.floor(Math.random()*50000)+1000,
}));

// Shorts: a few vertical clips
const SHORTS = Array.from({length:8}).map((_,i)=>({
  id:"s"+(i+1),
  title:["Quick CSS Tip!","Did You Know?","Try This Recipe","Coding in 30s","Travel Hack","Goal of the Day","Funny Moment","Game Combo"][i],
  channel:CHANNELS[i % CHANNELS.length],
  src:SAMPLES[i % SAMPLES.length],
  thumbnail:thumbUrl(100+i),
  likes:Math.floor(Math.random()*20000)+500,
}));
