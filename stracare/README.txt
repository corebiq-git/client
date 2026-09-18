COREBIQ — Split CSS PWA package

Place these files in:
client/corebiq.com/goinspires/

Files:
- index.html       Dashboard
- style.css        Main/global/dashboard CSS
- header.css       Header container CSS
- bottomnav.css    Bottom navigation container CSS
- manifest.json    PWA manifest
- sw.js            Service worker

The dashboard JavaScript still loads:
- header.html
- sidebar.html
- bottomnav.html
and the module HTML files referenced by the existing module map.

For the exact header and bottom-nav visual CSS, keep their component-specific
selectors in header.css and bottomnav.css (or include those files from the
respective component HTML). This package moves the header/bottom-nav container
rules out of the main dashboard CSS without changing the dashboard JS.
