const destination='https://www.ifood.com.br/delivery/niteroi-rj/compressa-burguer-centro/c81e42dd-127f-44d1-973c-cd18def7191b';
let items=[],category='Artesanal Compressa',limit=6;
const grid=document.querySelector('.products'),filters=document.querySelector('.filters'),more=document.querySelector('#more');
function render(){const chosen=items.filter(x=>x.category===category);grid.replaceChildren();chosen.slice(0,limit).forEach(p=>{const a=document.createElement('article');a.className='product';const img=document.createElement('img');img.src=p.image;img.alt=p.name;img.loading='lazy';img.width=400;img.height=300;const body=document.createElement('div');body.className='product-body';const title=document.createElement('h3');title.textContent=p.name;const description=document.createElement('p');description.textContent=p.description||'Confira as opções disponíveis no delivery.';const bottom=document.createElement('div');bottom.className='product-bottom';const price=document.createElement('span');price.className='price';price.textContent=p.price.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});const link=document.createElement('a');link.href=destination;link.target='_blank';link.rel='noopener';link.textContent='↗';link.setAttribute('aria-label',`Pedir ${p.name} no iFood`);bottom.append(price,link);body.append(title,description,bottom);a.append(img,body);grid.append(a)});more.hidden=limit>=chosen.length;filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)))}
function select(c){category=c;limit=6;render()}
fetch('products.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{items=data;[...new Set(items.map(x=>x.category))].forEach(c=>{const b=document.createElement('button');b.textContent=c;b.dataset.category=c;b.onclick=()=>select(c);filters.append(b)});render()}).catch(()=>{grid.textContent='O cardápio está disponível no nosso delivery.';const a=document.createElement('a');a.href=destination;a.className='button red';a.textContent='Abrir cardápio no iFood';grid.append(a);more.hidden=true});
more.onclick=()=>{limit+=6;render()};document.querySelectorAll('[data-category]').forEach(a=>{if(a.tagName==='A')a.addEventListener('click',()=>select(a.dataset.category))});

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets=document.querySelectorAll('.promos .promo,.essence>div,.section-heading,.environment-grid>div,.visit>div,.closing .wrap');
let revealObserver;
if('IntersectionObserver' in window&&!reducedMotion.matches){
 revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');revealObserver.unobserve(entry.target)}})},{threshold:.08});
 revealTargets.forEach((el,i)=>{el.classList.add('reveal-item','reveal-pending');el.style.setProperty('--reveal-delay',`${i%2*90}ms`);revealObserver.observe(el)});
}
const ambientVideo=document.querySelector('#environment-video');
ambientVideo.muted=true;
let videoVisible=false;
function syncVideo(){if(videoVisible&&!document.hidden&&!reducedMotion.matches){ambientVideo.play().catch(()=>{});}else{ambientVideo.pause();}}
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{videoVisible=entries[0].isIntersecting;syncVideo()},{threshold:.1}).observe(ambientVideo);}else{videoVisible=true;syncVideo();}
document.addEventListener('visibilitychange',syncVideo);
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){revealObserver?.disconnect();revealTargets.forEach(el=>el.classList.remove('reveal-pending'));}syncVideo();});
if(reducedMotion.matches)ambientVideo.pause();
