(() => {
  const entryRoot = new URL('./src/', location.href).href;
  const cache = new Map();
  const external = {
    'react': 'https://esm.sh/react@19.0.1',
    'react-dom/client': 'https://esm.sh/react-dom@19.0.1/client',
    'lucide-react': 'https://esm.sh/lucide-react@0.546.0?bundle&external=react',
    'qrcode': 'https://esm.sh/qrcode@1.5.4?bundle'
  };
  const cssCache = new Map();

  function normalizePath(path) {
    const parts=[];
    for (const p of path.split('/')) { if (!p || p==='.') continue; if (p==='..') parts.pop(); else parts.push(p); }
    return '/' + parts.join('/');
  }
  function resolve(spec, parent) {
    if (external[spec]) return external[spec];
    if (spec.startsWith('http://') || spec.startsWith('https://')) return spec;
    if (spec.startsWith('/')) return new URL(spec, location.origin).href;

    const u = new URL(spec, parent);
    if (!/\.[a-z0-9]+$/i.test(u.pathname)) {
      return u.href;
    }

    return u.href;
  }
  function cssModule(css) {
    const key='css:'+css.length+':'+css.slice(0,30);
    if (cssCache.has(key)) return cssCache.get(key);
    const js=`const css=${JSON.stringify(css)};const s=document.createElement('style');s.setAttribute('data-corebiq-style','true');s.textContent=css;document.head.appendChild(s);export default css;`;
    const url=URL.createObjectURL(new Blob([js],{type:'text/javascript'}));
    cssCache.set(key,url); return url;
  }
  function findImports(code) {
    const out=[];
    const re=/\b(?:import\s+(?:[^'";]*?\s+from\s+)?|export\s+[^'";]*?\s+from\s+)(['"])([^'"]+)\1/g;
    let m; while ((m=re.exec(code))) out.push({start:m.index, end:re.lastIndex, spec:m[2], quote:m[1]});
    return out;
  }
  async function transformModule(source, url) {
    const transformed=Babel.transform(source,{filename:url,sourceType:'module',presets:[['typescript',{allExtensions:true,isTSX:true}],['react',{runtime:'classic'}]]}).code;
    const imports=findImports(transformed);
    const replacements=await Promise.all(imports.map(async i=>({i, target:await loadModule(resolve(i.spec,url))})));
    let result=transformed;
    for(let i=replacements.length-1;i>=0;i--){const {i:imp,target}=replacements[i];const before=result.slice(0,imp.start);const after=result.slice(imp.end);const original=result.slice(imp.start,imp.end);const replaced=original.replace(imp.spec,target);result=before+replaced+after;}
    return result;
  }
  async function loadModule(url) {
    if (cache.has(url)) return cache.get(url);
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (!url.startsWith(location.origin)) return url;
    }

    const fallbackExtensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs'];
    const match = url.match(/\.(ts|tsx|js|jsx|mjs|css)$/i);
    const baseUrl = match ? url.replace(/\.[a-z0-9]+$/i, '') : url;
    const candidateUrls = new Set([url]);

    if (match) {
      fallbackExtensions
        .filter((ext) => ext.toLowerCase() !== '.' + match[1].toLowerCase())
        .forEach((ext) => candidateUrls.add(baseUrl + ext));
    } else {
      fallbackExtensions.forEach((ext) => candidateUrls.add(baseUrl + ext));
    }

    const promise = (async () => {
      let lastError = null;

      for (const candidate of Array.from(candidateUrls)) {
        try {
          if (candidate.endsWith('.css')) {
            const css = await fetch(candidate).then((r) => {
              if (!r.ok) throw new Error('CSS ' + r.status + ' ' + candidate);
              return r.text();
            });
            return cssModule(css);
          }

          const response = await fetch(candidate);
          if (!response.ok) {
            lastError = new Error('Module ' + response.status + ' ' + candidate);
            continue;
          }

          const source = await response.text();
          const js = await transformModule(source, candidate);
          return URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
        } catch (error) {
          lastError = error;
        }
      }

      throw lastError || new Error('Unable to load module: ' + url);
    })();

    cache.set(url, promise);
    return promise;
  }
  async function boot(){
    try { const entry=await loadModule(entryRoot+'main.tsx'); await import(entry); }
    catch(error){ console.error('[COREBIQ] Application startup failed:',error); document.getElementById('root').innerHTML='<div style="font-family:Inter,Arial,sans-serif;padding:24px;color:#202124"><h2>COREBIQ could not start</h2><p>Please open the browser console for the exact error.</p></div>'; }
  }
  const babel=document.createElement('script');
  babel.src='https://cdn.jsdelivr.net/npm/@babel/standalone@7.28.4/babel.min.js';
  babel.onload=boot;
  babel.onerror=()=>{document.getElementById('root').innerHTML='<div style="font-family:Inter,Arial,sans-serif;padding:24px">Unable to load the application compiler.</div>';};
  document.head.appendChild(babel);
})();
