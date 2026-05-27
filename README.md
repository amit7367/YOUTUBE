# YouTube Clone — HTML / CSS / Vanilla JS

A fully responsive, modern YouTube-style frontend built with only HTML, CSS, and vanilla JavaScript. No frameworks, no build step.

## Folder structure

```
yt-clone/
├── index.html        # Home / Shorts / Search / Sidebar navigation
├── watch.html        # Video watch page (player + comments + up next)
├── style.css         # All styling (light + dark theme, fully responsive)
├── script.js         # Shared logic (header, theme, search, grid, sidebar, shorts)
├── watch.js          # Watch page logic (player, like, subscribe, comments)
├── data.js           # Sample videos, channels, shorts
└── README.md
```

## Run locally

Because the browser blocks some features on `file://`, serve the folder with any static server:

```bash
# Option 1 — Python
cd yt-clone
python3 -m http.server 8000
# open http://localhost:8000

# Option 2 — Node
npx serve .

# Option 3 — VS Code "Live Server" extension → Right-click index.html → "Open with Live Server"
```

## Features

- Modern YouTube-style header (logo, search, voice, upload, notifications, profile dropdown)
- Collapsible sidebar (mini-rail on desktop, drawer on mobile) with Home / Shorts / Subscriptions / History / Liked / Trending / Music / Gaming / Settings
- Mobile bottom navigation bar
- Responsive video grid with hover thumbnail zoom, duration overlay, verified badges
- Category chip filter row
- Dynamic search (filters titles + channel names live, shows "No Results Found")
- Watch page with native HTML5 video player (play/pause, volume, fullscreen, seek), like/dislike, share, save, subscribe, expandable description, dynamic comments with reply & like, auto-play next, up-next sidebar
- Vertical Shorts feed with autoplay on scroll-into-view
- Dark / light theme toggle (saved in `localStorage`)
- Watch history, liked videos, subscriptions persisted in `localStorage`
- Loader animation, toast notifications, profile dropdown
- Keyboard shortcuts: `/` focus search · `t` toggle theme · `h` home · `s` shorts · `space` play/pause · `f` fullscreen · `m` mute · `← →` seek

## Notes

- Thumbnails use `picsum.photos` (free placeholder images).
- Sample videos use Google's public Big Buck Bunny / Sintel test streams.
- Avatars use `pravatar.cc`.
- Replace `data.js` with your own video catalogue to customize.
