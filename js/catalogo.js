const abs=u=>new URL(u,document.baseURI).href;
(function(){
'use strict';
const D=window.MLG,$=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const CATS=D.categorias,ALL=D.produtos;
const cat=id=>CATS.find(c=>c.id===id)||{nome:'',img:''};
const img=p=>p.img||cat(p.cat).img;
const brl=v=>'R$ '+v.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const unit=u=>u?(u.length<=8?' / '+u:' '+u):'';
const priceTxt=p=>p.preco!=null?brl(p.preco)+unit(p.unid):'Sob consulta';
const plural=(n,s,p)=>n+' '+(n===1?s:p);
const PROMOS=D.promos||[];const CART=D.carrinho!==false;const CK='mlg-carrinho-'+D.pasta;let cart={};try{cart=JSON.parse(localStorage.getItem(CK)||'{}')||{}}catch(e){}
let V='';if(D.vend)try{V=(new URLSearchParams(location.search).get('v')||'').toLowerCase().replace(/[^a-z0-9-]/g,'');const VK='mlg-vend-'+D.pasta;if(V)localStorage.setItem(VK,V);else V=localStorage.getItem(VK)||''}catch(e){}
let sellerName='';
function setHash(h){try{history.replaceState(null,'',h?'#'+h:location.pathname+location.search)}catch(e){}}

/* imagens fixas */
$('logo').src=D.imgs.logo;$('heroBg').style.backgroundImage=`url("${D.imgs.hero}")`;$('storyPic').style.backgroundImage=`url("${D.imgs.historia}")`;

/* ---------- categorias (cards) ---------- */
$('rail').innerHTML=CATS.map(c=>`<article class="card" data-cat="${esc(c.id)}"><div class="photo" style="background-image:url('${c.img}')"></div><div class="card-foot"><h3>${esc(c.nome)}</h3><p>${esc(c.chamada)}</p><button class="mini">VER PRODUTOS →</button></div></article>`).join('');
const rail=$('rail');
$('next').onclick=()=>rail.scrollBy({left:350,behavior:'smooth'});$('prev').onclick=()=>rail.scrollBy({left:-350,behavior:'smooth'});
let down=null,moved=false;
rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down={x:e.clientX,l:rail.scrollLeft};moved=false});
addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x;if(Math.abs(dx)>5){moved=true;rail.classList.add('drag')}rail.scrollLeft=down.l-dx*1.15});
addEventListener('pointerup',()=>{down=null;rail.classList.remove('drag')});
rail.addEventListener('click',e=>{if(moved){moved=false;return}const c=e.target.closest('[data-cat]');if(c)pick(c.dataset.cat,true)});

/* ---------- produtos ---------- */
let cur='',q='';
$('chips').innerHTML=`<button class="chip on" data-cat="">TODOS (${ALL.length})</button>`+CATS.map(c=>`<button class="chip" data-cat="${esc(c.id)}">${esc(c.nome)} (${ALL.filter(p=>p.cat===c.id).length})</button>`).join('');
$('chips').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(b){$('topSearch').value='';q='';pick(b.dataset.cat,false)}});
const hay=p=>norm([p.nome,p.desc,p.emb,p.kw,p.cod,cat(p.cat).nome].join(' '));
function card(p){return `<article class="prod${p.falta?' falta':''}" data-open="${esc(p.id)}" tabindex="0"><div class="prod-photo" style="--img:url('${esc(abs(img(p)))}')"><img src="${esc(img(p))}" alt="${esc(p.nome)}" loading="lazy" decoding="async"><span class="ptags">${p.falta?'<span class="ptag out">EM FALTA</span>':''}${!p.falta&&temPromo(p)?'<span class="ptag promo">🎁 PROMO</span>':''}${p.novo?'<span class="ptag new">NOVIDADE</span>':''}${p.ex?'<span class="ptag ex">EXEMPLO</span>':''}</span></div><div class="prod-copy"><small>${esc(cat(p.cat).nome)}</small><h4>${esc(p.nome)}</h4>${p.emb?`<div class="pk">${esc(p.emb)}</div>`:''}<div class="price ${p.preco!=null?'':'ask'}"><b>${p.preco!=null?brl(p.preco):'Preço sob consulta'}</b><span>${p.preco!=null?esc(unit(p.unid)):''}</span></div>${CART?`<div class="addrow">${addCtl(p.id)}</div>`:''}</div></article>`}
function table(list,grouped){
  const row=p=>`<tr class="row" data-open="${esc(p.id)}" tabindex="0"><td class="cod">${esc(p.cod||'')}</td><td>${esc(p.nome)}${p.emb?`<small class="em">${esc(p.emb)}</small>`:""}${p.falta?'<span class="tg ex" style="background:#5a1f1f;color:#ffd0d0">EM FALTA</span>':''}${!p.falta&&temPromo(p)?'<span class="tg" style="background:#ff6b2c;color:#fff">🎁 PROMO</span>':''}${p.novo?'<span class="tg">NOVO</span>':''}${p.ex?'<span class="tg ex">EXEMPLO</span>':''}</td><td>${esc(p.emb||'')}</td><td class="num">${p.preco!=null?brl(p.preco)+esc(unit(p.unid)):'Sob consulta'}</td>${CART?`<td class="addc">${p.falta?'<button class="mini-add off" disabled>Em falta</button>':`<button class="mini-add ${cart[p.id]?'in':''}" data-add="${esc(p.id)}">${cart[p.id]?'✓ '+cart[p.id]:'+ Pedir'}</button>`}</td>`:''}</tr>`;
  let body='';
  if(grouped)CATS.forEach(c=>{const l=list.filter(p=>p.cat===c.id);if(l.length)body+=`<tr class="cat-row"><td colspan="${CART?5:4}">${esc(c.nome)}</td></tr>`+l.map(row).join('')});
  else body=list.map(row).join('');
  return `<div class="p-table-wrap"><table class="p-table"><thead><tr><th>CÓDIGO</th><th>PRODUTO</th><th>EMBALAGEM</th><th style="text-align:right">PREÇO</th>${CART?'<th></th>':''}</tr></thead><tbody>${body}</tbody></table></div>`;
}
let view='cards',shown=ALL;
function setView(v){view=v;$('vCards').classList.toggle('on',v==='cards');$('vList').classList.toggle('on',v==='list');$('vCards').setAttribute('aria-pressed',v==='cards');$('vList').setAttribute('aria-pressed',v==='list');try{localStorage.setItem('mlg-vista',v)}catch(e){}render()}
function inicio(list){
  const dest=list.filter(p=>p.novo).slice(0,16);
  const atalhos=CATS.filter(c=>ALL.some(p=>p.cat===c.id)).map(c=>`<button class="p-go" data-goto="${esc(c.id)}"><b>${esc(c.nome)}</b><span>${plural(ALL.filter(p=>p.cat===c.id).length,'produto','produtos')} →</span></button>`).join('');
  return (dest.length?dest:list.slice(0,12)).map(card).join('')+`<div class="p-gos"><h3>Veja tudo por categoria</h3><div>${atalhos}</div></div>`;
}
function render(){
  const nq=norm(q).trim(),c=cur?cat(cur):null;
  let list=ALL.filter(p=>!cur||p.cat===cur);
  if(nq)list=list.filter(p=>nq.split(/\s+/).every(w=>hay(p).includes(w)));
  const so=$('sort').value;
  if(so==='az')list=[...list].sort((a,b)=>a.nome.localeCompare(b.nome,'pt'));
  if(so==='menor'||so==='maior')list=[...list].sort((a,b)=>(a.preco==null)-(b.preco==null)||(so==='menor'?a.preco-b.preco:b.preco-a.preco));
  shown=list;
  const destaque=!cur&&!nq&&view!=='list';
  $('pTitle').textContent=nq?`Resultados para “${q.trim()}”`:(c?c.nome:(destaque?'Destaques':'Todos os produtos'));
  $('pCount').textContent=destaque?'Escolha uma categoria para ver todos os produtos':(list.length?plural(list.length,'produto','produtos'):'');
  $('pGrid').style.display=view==='list'&&list.length?'block':'';
  $('pGrid').innerHTML=list.length?(view==='list'?table(list,!cur&&!nq&&!so):(!cur&&!nq?inicio(list):list.map(card).join(''))):`<div class="p-empty"><h4>${nq?'Nada encontrado':esc(c?c.nome:'Catálogo')+' em preparação'}</h4><p>${nq?'Tente outra palavra ou escolha uma categoria.':'Estamos preparando esta seleção. Em breve os produtos aparecem aqui.'}</p></div>`;
  document.querySelectorAll('#chips .chip').forEach(b=>b.classList.toggle('on',b.dataset.cat===cur&&!nq));
}
function pick(id,scroll){cur=id||'';render();setHash(cur);if(scroll)$('produtos').scrollIntoView({behavior:'smooth'});const ch=document.querySelector(`#chips [data-cat="${cur}"]`);if(ch)ch.scrollIntoView({block:'nearest',inline:'center'})}
$('pGrid').addEventListener('click',e=>{if(cartClick(e))return;const g=e.target.closest('[data-goto]');if(g){pick(g.dataset.goto,true);return}const o=e.target.closest('[data-open]');if(o)openP(o.dataset.open)});
$('pGrid').addEventListener('keydown',e=>{if(e.key==='Enter'){const o=e.target.closest('[data-open]');if(o)openP(o.dataset.open)}});
let st;$('topSearch').addEventListener('input',e=>{q=e.target.value;clearTimeout(st);st=setTimeout(()=>{cur='';render();if(q.trim())$('produtos').scrollIntoView({behavior:'smooth'})},280)});
$('vCards').onclick=()=>setView('cards');$('vList').onclick=()=>setView('list');$('sort').onchange=render;
try{const v=localStorage.getItem('mlg-vista');if(v==='list')view='list'}catch(e){}
if(view==='list'){$('vList').classList.add('on');$('vCards').classList.remove('on')}
if(D.pdf){$('pdfBtn').href=D.pdf;$('pdfBtn').hidden=false}
if(PROMOS.length){$('promos').hidden=false;$('promos').innerHTML=PROMOS.map(pr=>`<div class="promo"><span class="ic">🎁</span><div><b>${esc(pr.titulo)}</b><small>${esc(pr.descricao||('Ganhe: '+pr.brinde))}</small></div></div>`).join('')}
// itens em falta não ficam no carrinho
Object.keys(cart).forEach(id=>{const pp=ALL.find(x=>x.id===id);if(!pp||pp.falta)delete cart[id]});
if(D.aviso){$('notice').textContent=D.aviso;$('notice').hidden=false}
$('pDate').textContent='Tabela atualizada em '+D.gerado_em+'.';

/* ---------- novidades (cards andando) ---------- */
let novs=ALL.filter(p=>p.novo);
if(novs.length){
  const one=novs.map(p=>`<article class="nov-card" data-open="${esc(p.id)}"><div class="nov-photo" style="--img:url('${abs(img(p))}')"></div><div class="nov-copy"><div class="tag">NOVIDADE • ${esc(cat(p.cat).nome)}</div><h3>${esc(p.nome)}</h3><p>${esc(p.desc||p.emb||'')}</p><span class="nov-btn">VER NOVIDADE →</span></div></article>`).join('');
  let set=one;while((set.match(/nov-card/g)||[]).length<6)set+=one;
  $('novRail').innerHTML=set+set;$('novRail').style.animationDuration=Math.max(40,(set.match(/nov-card/g)||[]).length*7)+'s';
  $('novRail').addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o)openP(o.dataset.open)});
}else{$('novidades').hidden=true;$('navNov').hidden=true}

/* ---------- detalhe ---------- */
let open=null;
function openP(id,keep){const p=ALL.find(x=>x.id===id);if(!p)return;open=p;navList=keep?navList:(shown.some(x=>x.id===id)?shown:ALL);$('pPrev').hidden=$('pNext').hidden=navList.length<2;setHash('produto-'+p.id);$('mPh').style.setProperty('--img',`url('${abs(img(p))}')`);$('mCat').textContent=cat(p.cat).nome+(p.novo?' • NOVIDADE':'')+(p.ex?' • EXEMPLO':'');$('mName').textContent=p.nome;$('mDesc').textContent=p.desc||'';$('mPack').textContent=p.emb||'—';$('mPrice').innerHTML=p.preco!=null?`<span class="big">${brl(p.preco)}</span> ${esc(unit(p.unid))}`:'Sob consulta';$('mCode').textContent=p.cod||'—';$('mQty').value=cart[p.id]||1;$('mAdd').textContent=cart[p.id]?'✓ ATUALIZAR PEDIDO':'+ ADICIONAR AO PEDIDO';$('mCartRow').style.display=CART&&!p.falta?'flex':'none';if(p.falta)$('mDesc').textContent=(p.desc?p.desc+' ':'')+'⚠ Produto em falta no momento.';$('pmodal').classList.add('on');document.body.style.overflow='hidden'}
function closeP(){$('pmodal').classList.remove('on');setHash(cur);if(!$('chat').classList.contains('on')||innerWidth>600)document.body.style.overflow='';open=null}
$('pmodal').addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeP()});
let navList=ALL;
function step(d){if(!open)return;const i=navList.findIndex(x=>x.id===open.id);const n=navList[(i+d+navList.length)%navList.length];openP(n.id,true)}
$('pPrev').onclick=()=>step(-1);$('pNext').onclick=()=>step(1);
let tx=0;$('pmodal').addEventListener('touchstart',e=>tx=e.changedTouches[0].screenX,{passive:true});$('pmodal').addEventListener('touchend',e=>{const d=e.changedTouches[0].screenX-tx;if(Math.abs(d)>60)step(d<0?1:-1)},{passive:true});
function flash(m){const c=$('copied');c.textContent=m;c.classList.add('on');setTimeout(()=>c.classList.remove('on'),2200)}
$('mLink').onclick=()=>{if(!open)return;const u=location.href.split('#')[0]+'#produto-'+open.id;const ok=()=>flash('✓ Link copiado! Cole na conversa com o cliente.');try{navigator.clipboard.writeText(u).then(ok,()=>prompt('Copie o link:',u))}catch(e){prompt('Copie o link:',u)}};
$('mAsk').onclick=()=>{const p=open;closeP();openChat();if(p)ask('Me fale sobre '+p.nome)};

/* ---------- rodapé ---------- */
const C=D.contato,foot=['<div>🚚 <b>ATENDEMOS REVENDEDORES</b></div>','<div>🛡️ <b>QUALIDADE GARANTIDA</b></div>','<div>🤝 <b>PARCERIA DE LONGA DATA</b></div>'];
if(C.cidade)foot.push(`<div>📍 <b>${esc(C.cidade.toUpperCase())}</b></div>`);
if(C.telefone)foot.push(`<div>📞 <b>${esc(C.telefone)}</b></div>`);
if(C.email)foot.push(`<div>✉️ <b style="user-select:all">${esc(C.email)}</b></div>`);
if(C.instagram)foot.push(`<div>📷 <b><a href="https://instagram.com/${esc(C.instagram)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">@${esc(C.instagram)}</a></b></div>`);
if(C.horario)foot.push(`<div>🕒 <b>${esc(C.horario)}</b></div>`);
foot.push(`<div><b>${esc((D.empresa||'COMÉRCIO MLG').toUpperCase())} • DESDE 1999</b></div>`);
$('contato').innerHTML=foot.join('');
const topbar=$('top');addEventListener('scroll',()=>topbar.classList.toggle('scrolled',scrollY>40),{passive:true});

/* ============ ASSISTENTE MLG ============ */
const SYN={queijos:['queijo','queijos','minas','canastra','provolone','mussarela','muçarela','parmesao','ricota','requeijao','frescal','meia cura','curado'],paes:['pao de queijo','paes de queijo','pao','paes','biscoito de queijo','chipa'],embutidos:['embutido','embutidos','salame','calabresa','linguica','presunto','mortadela','copa','lombo','bacon','defumado','frios','frio'],doces:['doce','doces','doce de leite','goiabada','geleia','compota','sobremesa','cocada'],biscoitos:['biscoito','biscoitos','bolacha','bolachas','rosquinha','amanteigado','sequilho'],bebidas:['bebida','bebidas','vinho','vinhos','cachaca','pinga','licor','licores','cerveja','suco'],diversos:['diversos','mel','pacoca','azeite','tempero','castanha']};
const OCC=[{k:['tabua','petisco','aperitivo','happy hour','festa','churrasco','recepcao'],cats:['queijos','embutidos','bebidas'],t:'Para uma tábua caprichada, combine queijos, embutidos e uma boa bebida. Algumas opções do catálogo:'},
{k:['cafe da manha','cafe','lanche','padaria','manha'],cats:['paes','queijos','biscoitos','doces'],t:'Para o café da manhã e lanches, estes produtos fazem sucesso:'},
{k:['presente','presentear','cesta','natal','kit'],cats:['bebidas','doces','diversos'],t:'Para presentear ou montar cestas, estas são boas escolhas:'},
{k:['sobremesa','doce','docinho'],cats:['doces','biscoitos'],t:'Para quem gosta de um doce:'}];
const GEN=new Set('queijo queijos doce doces biscoito biscoitos bolacha bolachas bebida bebidas pao paes embutido embutidos frio frios diversos linha'.split(' '));
const STOP=new Set('o a os as um uma de do da dos das e em no na nos nas para pra por com sem que qual quais tem tem? voce voces vcs me mim eu quero queria gostaria ver mostrar mostra saber sobre preco precos valor valores quanto custa custam ai la produto produtos catalogo favor por favor ola oi bom dia boa tarde noite fale fala'.split(' '));
const tok=s=>norm(s).replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>1&&!STOP.has(w));
function score(p,words){const n=norm(p.nome),h=hay(p);let s=0;for(const w of words){if(n.includes(w))s+=3;else if(h.includes(w))s+=1;else if(w.length>4&&h.includes(w.slice(0,-1)))s+=1}return s}
function catsIn(t){const n=' '+norm(t)+' ';return Object.keys(SYN).filter(id=>CATS.some(c=>c.id===id)&&SYN[id].some(s=>n.includes(' '+s+' ')||n.includes(' '+s+'s ')))}
function localAnswer(text){
  const n=norm(text).trim(),words=tok(text);
  if(/^(oi|ola|bom dia|boa tarde|boa noite|e ai|opa)\b/.test(n)&&words.length<=1)return{t:`Olá! Sou o Assistente MLG. Posso encontrar produtos, mostrar preços e novidades. O que você procura hoje?`};
  if(/(como (faco|fazer|comprar|pedir)|pedido|comprar|entrega|pagamento|prazo|vendedor|contato|telefone|falar com)/.test(n)){let t=D.como_comprar||'Para fazer seu pedido, fale com o seu vendedor MLG.';const cc=[C.telefone&&('Telefone: '+C.telefone),C.email&&('E-mail: '+C.email),C.horario&&('Horário: '+C.horario)].filter(Boolean);if(cc.length)t+='\n\n'+cc.join('\n');return{t}}
  if(/(novidade|lancamento|chegou|novo|nova)/.test(n)){const l=ALL.filter(p=>p.novo);return l.length?{t:`Temos ${plural(l.length,'novidade','novidades')} no catálogo:`,hits:l}:{t:'No momento não há novidades marcadas no catálogo, mas vale conferir as categorias!'}}
  if(/(categoria|o que voces? (vendem|tem)|quais produtos|linha)/.test(n)&&!words.some(w=>ALL.some(p=>norm(p.nome).includes(w))))return{t:'Trabalhamos com estas linhas: '+CATS.map(c=>c.nome.toLowerCase()).join(', ')+'. Qual delas você quer ver?',cats:CATS.map(c=>c.id)};
  const cheap=/(barat|em conta|economic|menor preco)/.test(n),exp=/(car[oa]|premium|especial|mais fino)/.test(n);
  let cs=catsIn(text);if(cs.includes('paes')&&/pao de queijo|paes de queijo/.test(n))cs=cs.filter(c=>c!=='queijos');
  const o=OCC.find(o=>o.k.some(k=>n.includes(k)));
  if(o&&!cheap&&!exp){const l=o.cats.flatMap(id=>ALL.filter(p=>p.cat===id).slice(0,2));if(l.length)return{t:o.t,hits:l.slice(0,6)}}
  const sw=words.filter(w=>!GEN.has(w));
  const hits=ALL.map(p=>({p,s:score(p,sw)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
  const specific=hits.filter(x=>x.s>=3);
  if(specific.length){
    const top=specific.filter(x=>x.s>=specific[0].s-1).map(x=>x.p).slice(0,6);
    if(top.length===1){const p=top[0];return{t:`Temos sim! ${p.nome}${p.emb?' ('+p.emb+')':''}: ${priceTxt(p)}.${p.desc?'\n'+p.desc:''}`,hits:top}}
    return{t:`Encontrei ${plural(top.length,'opção','opções')} para você:`,hits:top};
  }
  if(cs.length){let l=ALL.filter(p=>cs.includes(p.cat));
    if(cheap)l=l.filter(p=>p.preco!=null).sort((a,b)=>a.preco-b.preco);if(exp)l=l.filter(p=>p.preco!=null).sort((a,b)=>b.preco-a.preco);
    const nm=cs.map(id=>cat(id).nome.toLowerCase()).join(' e ');
    if(!l.length)return{t:`A linha de ${nm} está sendo atualizada. Em breve os produtos aparecem no catálogo.`,cats:cs};
    return{t:cheap?`Do menor para o maior preço em ${nm}:`:exp?`Os mais especiais em ${nm}:`:`Em ${nm} temos ${plural(l.length,'produto','produtos')}:`,hits:l.slice(0,8),cats:cs.length===1?cs:null}}
  if(cheap||exp){const l=ALL.filter(p=>p.preco!=null).sort((a,b)=>cheap?a.preco-b.preco:b.preco-a.preco).slice(0,5);if(l.length)return{t:cheap?'Os produtos de menor preço no catálogo:':'Os produtos mais especiais do catálogo:',hits:l}}
  if(hits.length)return{t:'Não achei exatamente isso, mas estes podem interessar:',hits:hits.slice(0,5).map(x=>x.p)};
  if(/(obrigad|valeu|show|otimo|perfeito)/.test(n))return{t:'Por nada! Se precisar de mais alguma coisa, é só perguntar.'};
  return{t:'Não encontrei esse item no catálogo. Tente pelo nome do produto ou por uma categoria (queijos, embutidos, doces...). '+(D.como_comprar?'\n\n'+D.como_comprar:'')};
}
/* IA externa (opcional): só recebe o catálogo DESTA página */
function catalogText(){return ALL.map(p=>`${p.cod||p.id} | ${cat(p.cat).nome} | ${p.nome} | ${p.emb||''} | ${priceTxt(p)}${p.novo?' | NOVIDADE':''} | ${p.desc||''}`).join('\n')}
const hist=[];
/* IA automática: se a página estiver no servidor MLG (ou ia_endpoint apontar para ele), usa a IA de verdade */
const IA_URL=D.ia_endpoint||(/^https?:$/.test(location.protocol)?new URL('../api/assistente',location.href).href:'');
let iaOn=null;
async function iaReady(){if(iaOn!==null)return iaOn;if(!IA_URL)return iaOn=false;try{const c=new AbortController();setTimeout(()=>c.abort(),4000);const r=await fetch(IA_URL.replace(/assistente\/?$/,'status'),{signal:c.signal});const j=await r.json();iaOn=!!j.ia}catch(e){iaOn=false}if(iaOn)$('aiMode').textContent='IA online • responde qualquer pergunta';return iaOn}
async function remoteAnswer(text){
  const c=new AbortController();const t=setTimeout(()=>c.abort(),25000);
  const r=await fetch(IA_URL,{method:'POST',signal:c.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({pasta:D.pasta,mensagens:hist.slice(-10),catalogo:catalogText(),empresa:D.empresa,como_comprar:D.como_comprar,contato:C})});clearTimeout(t);
  if(!r.ok)throw new Error('http '+r.status);const j=await r.json();if(!j.resposta)throw new Error('vazio');
  const an=norm(j.resposta);const hits=ALL.filter(p=>an.includes(norm(p.nome))).slice(0,6);return{t:j.resposta,hits};
}
function bubble(cls,html){const d=document.createElement('div');d.className='msg '+cls;d.innerHTML=html;$('cBody').appendChild(d);$('cBody').scrollTop=$('cBody').scrollHeight;return d}
function showHits(hits){if(!hits||!hits.length)return;const w=document.createElement('div');w.className='hits';w.innerHTML=hits.map(p=>`<button class="hit" data-open="${esc(p.id)}"><i style="background-image:url('${img(p)}')"></i><span><b>${esc(p.nome)}</b><small>${esc(p.emb||cat(p.cat).nome)}</small></span><em>${p.preco!=null?brl(p.preco):'Consulte'}</em></button>`).join('');$('cBody').appendChild(w);$('cBody').scrollTop=$('cBody').scrollHeight}
function showCats(ids){if(!ids||!ids.length)return;const w=document.createElement('div');w.className='sugs';w.style.padding='0';w.innerHTML=ids.map(id=>`<button class="sug" data-goto="${esc(id)}">Ver ${esc(cat(id).nome.toLowerCase())} no catálogo →</button>`).join('');$('cBody').appendChild(w)}
let busy=false;
async function ask(text){
  text=String(text||'').trim();if(!text||busy)return;busy=true;
  bubble('me',esc(text));hist.push({role:'user',content:text});
  const typing=bubble('bot typing','Procurando no catálogo…');
  let a;
  if(await iaReady()){typing.textContent='Pensando…';try{a=await remoteAnswer(text)}catch(e){a=null}}
  if(!a){await new Promise(r=>setTimeout(r,350));a=localAnswer(text)}
  typing.remove();
  bubble('bot',esc(a.t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>'));hist.push({role:'assistant',content:a.t});
  showHits(a.hits);showCats(a.cats);busy=false;
}
$('cBody').addEventListener('click',e=>{const h=e.target.closest('[data-open]');if(h){openP(h.dataset.open);return}const g=e.target.closest('[data-goto]');if(g){closeChat();pick(g.dataset.goto,true)}});
const SUG=['Quais são as novidades?','Quero ver os queijos','Monte uma tábua de frios','Como faço meu pedido?'];
$('sugs').innerHTML=SUG.map(s=>`<button class="sug">${esc(s)}</button>`).join('');
$('sugs').addEventListener('click',e=>{const b=e.target.closest('.sug');if(b){ask(b.textContent);$('sugs').hidden=true}});
$('cForm').addEventListener('submit',e=>{e.preventDefault();const v=$('cIn').value;$('cIn').value='';$('sugs').hidden=true;ask(v)});
let greeted=false;
function openChat(){iaReady();$('chat').classList.add('on');$('aiFab').hidden=true;if(innerWidth<=600)document.body.style.overflow='hidden';if(!greeted){greeted=true;bubble('bot',`Olá! Sou o <b>Assistente MLG</b>. Pergunte por um produto, sabor ou ocasião que eu encontro no catálogo para você.`)}setTimeout(()=>$('cIn').focus(),200)}
function closeChat(){$('chat').classList.remove('on');$('aiFab').hidden=false;document.body.style.overflow=''}
$('aiFab').onclick=openChat;$('aiOpen').onclick=openChat;$('topAi').onclick=openChat;$('chatClose').onclick=closeChat;
addEventListener('keydown',e=>{if(e.key==='Escape'){if($('pmodal').classList.contains('on'))closeP();else if($('cart').classList.contains('on'))closeCart();else closeChat()}if($('pmodal').classList.contains('on')){if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)}});
function fromHash(){const h=decodeURIComponent(location.hash.slice(1));if(h.startsWith('produto-')){const id=h.slice(8);if(ALL.some(p=>p.id===id)){if(!open||open.id!==id){$('produtos').scrollIntoView();openP(id)}}}else if(CATS.some(c=>c.id===h)&&h!==cur){pick(h,true)}}
addEventListener('hashchange',fromHash);

/* ============ CARRINHO / PEDIDO ============ */
function addCtl(id){const pp=ALL.find(x=>x.id===id);if(pp&&pp.falta)return '<button class="add off" disabled>EM FALTA NO MOMENTO</button>';const q=cart[id];return q?`<div class="stp" data-stp="${esc(id)}"><button type="button" data-d="-1">−</button><input type="number" min="0" value="${q}" inputmode="numeric" aria-label="Quantidade"><button type="button" data-d="1">+</button></div>`:`<button class="add" data-add="${esc(id)}">+ ADICIONAR</button>`}
function cartClick(e){
  const a=e.target.closest('[data-add]');if(a){e.stopPropagation();setQ(a.dataset.add,(cart[a.dataset.add]||0)+1);return true}
  const st=e.target.closest('[data-stp]');if(st){e.stopPropagation();const b=e.target.closest('button[data-d]');if(b)setQ(st.dataset.stp,(cart[st.dataset.stp]||0)+(+b.dataset.d));return true}
  return false}
document.addEventListener('change',e=>{const st=e.target.closest('[data-stp]');if(st&&e.target.tagName==='INPUT')setQ(st.dataset.stp,parseInt(e.target.value,10)||0)});
function setQ(id,q){const pf=ALL.find(x=>x.id===id);if(pf&&pf.falta&&q>0){flash('Este produto está em falta no momento.');return}q=Math.max(0,Math.min(9999,q|0));if(q)cart[id]=q;else delete cart[id];saveCart();paintCart();
  document.querySelectorAll(`.addrow`).forEach(el=>{const art=el.closest('[data-open]');if(art&&art.dataset.open===id)el.innerHTML=addCtl(id)});
  document.querySelectorAll(`.mini-add[data-add="${CSS.escape(id)}"]`).forEach(b=>{b.classList.toggle('in',!!cart[id]);b.textContent=cart[id]?'✓ '+cart[id]:'+ Pedir'})}
function saveCart(){try{localStorage.setItem(CK,JSON.stringify(cart))}catch(e){}}
function contaPromo(pr,p){return pr.produtos&&pr.produtos.length?pr.produtos.includes(p.id):pr.categoria?p.cat===pr.categoria:true}
function temPromo(p){return PROMOS.some(pr=>(pr.produtos&&pr.produtos.length)||pr.categoria?contaPromo(pr,p):false)}
function brindes(){return PROMOS.map(pr=>{let n=0;for(const[id,q]of Object.entries(cart)){const p=ALL.find(x=>x.id===id);if(p&&!p.falta&&contaPromo(pr,p))n+=q}
  return{pr,n,ganhou:n>=pr.minimo?(pr.repetir?Math.floor(n/pr.minimo):1):0}})}
function totals(){let t=0,n=0,ask=0,kg=false;for(const[id,q]of Object.entries(cart)){const p=ALL.find(x=>x.id===id);if(!p)continue;n+=q;if(p.preco==null)ask++;else t+=p.preco*q;if(p.unid==='kg')kg=true}return{t,n,ask,kg}}
function paintCart(){
  const ids=Object.keys(cart).filter(id=>ALL.some(p=>p.id===id)),T=totals();
  $('cartFab').hidden=!CART||!ids.length||$('cart').classList.contains('on');$('cartN').textContent=T.n;$('cartT').textContent=T.t?'• '+brl(T.t):'';
  if(!$('ctItems'))return;
  $('ctSub').textContent=ids.length?plural(ids.length,'produto','produtos')+' • '+plural(T.n,'item','itens'):'';
  $('ctItems').innerHTML=ids.map(id=>{const p=ALL.find(x=>x.id===id),q=cart[id];return `<div class="ci"><img src="${esc(img(p))}" alt=""><div><b>${esc(p.nome)}</b><small>${esc(p.emb||'')}${p.preco!=null?' • '+brl(p.preco)+esc(unit(p.unid)):''}</small><div class="sub">${p.preco!=null?brl(p.preco*q):'Sob consulta'}</div></div><div class="stp" data-stp="${esc(id)}"><button type="button" data-d="-1" aria-label="Menos">−</button><input type="number" min="0" value="${q}" inputmode="numeric" aria-label="Quantidade"><button type="button" data-d="1" aria-label="Mais">+</button></div></div>`}).join('');
  $('ctEmpty').hidden=!!ids.length;$('ctForm').hidden=!ids.length;$('ctFoot').hidden=!ids.length;
  $('ctTot').textContent=brl(T.t);$('ctTotLbl').textContent=T.ask?'Total estimado (+ itens sob consulta)':'Total estimado';
  const B=brindes();let gh=B.filter(b=>b.ganhou).map(b=>`<div class="gift">🎁 <b>Você ganhou: ${b.ganhou>1?b.ganhou+"x ":""}${esc(b.pr.brinde)}</b><br>${esc(b.pr.titulo)}</div>`).join('');
  gh+=B.filter(b=>!b.ganhou&&b.n>0).map(b=>`<div class="gift prog">Faltam <b style="color:#fff">${b.pr.minimo-b.n}</b> para ganhar: ${esc(b.pr.brinde)} <small>(${esc(b.pr.titulo)})</small></div>`).join('');
  let gEl=$('ctGifts');if(!gEl){gEl=document.createElement('div');gEl.id='ctGifts';$('ctItems').after(gEl)}gEl.innerHTML=gh;
  $('ctNote').textContent=(T.kg?'Itens vendidos por kg: o valor final segue o peso da peça. ':'')+'Valores e disponibilidade confirmados no atendimento.';
}
$('ctItems').addEventListener('click',cartClick);
function openCart(){$('cart').classList.add('on');$('cscrim').classList.add('on');document.body.style.overflow='hidden';paintCart();$('cartFab').hidden=true}
function closeCart(){$('cart').classList.remove('on');$('cscrim').classList.remove('on');document.body.style.overflow='';if(sent){sent=false;restoreCartUI()}paintCart()}
$('cartFab').onclick=openCart;$('ctClose').onclick=closeCart;$('cscrim').onclick=closeCart;$('ctShop').onclick=()=>{closeCart();$('produtos').scrollIntoView({behavior:'smooth'})};
let sure=false;$('ctClear').onclick=()=>{if(!sure){sure=true;$('ctClear').textContent='Toque de novo para esvaziar';setTimeout(()=>{sure=false;$('ctClear').textContent='Esvaziar pedido'},3000);return}cart={};saveCart();render();paintCart();sure=false;$('ctClear').textContent='Esvaziar pedido'};
$('mMinus').onclick=()=>$('mQty').value=Math.max(1,(+$('mQty').value||1)-1);$('mPlus').onclick=()=>$('mQty').value=(+$('mQty').value||0)+1;
$('mAdd').onclick=()=>{if(!open)return;setQ(open.id,Math.max(1,+$('mQty').value||1));flash('✓ '+open.nome+' no pedido');$('mAdd').textContent='✓ ATUALIZAR PEDIDO'};
// dados do cliente lembrados neste aparelho
const FK='mlg-cliente';try{const c=JSON.parse(localStorage.getItem(FK)||'{}');['cNome','cEnd','cTel','cCid'].forEach(k=>{if(c[k])$(k).value=c[k]})}catch(e){}
function saveClient(){try{const c={};['cNome','cEnd','cTel','cCid'].forEach(k=>c[k]=$(k).value.trim());localStorage.setItem(FK,JSON.stringify(c))}catch(e){}}
// vendedor do link (?v=fernando) — fica lembrado
if(V){fetch(new URL('../api/vendedor/'+encodeURIComponent(V),location.href)).then(r=>r.ok?r.json():null).then(j=>{
 if(j&&j.expirado){if(j.bloquear){linkExpirado()}else{V='';try{localStorage.removeItem('mlg-vend-'+D.pasta)}catch(e){}}return}
 if(j&&j.nome){sellerName=j.nome;$('ctSeller').innerHTML='Seu pedido vai para <b>'+esc(j.nome)+'</b>, seu vendedor MLG.';$('ctSeller').hidden=false}}).catch(()=>{})}
function localText(){const c=client();const T=totals();const L=[`*NOVO PEDIDO* — ${D.empresa}`,''];for(const[id,q]of Object.entries(cart)){const p=ALL.find(x=>x.id===id);if(!p)continue;L.push(`• ${q}x ${p.nome}${p.emb?' ('+p.emb+')':''} — ${p.preco!=null?brl(p.preco)+(p.unid?'/'+p.unid:'')+' = '+brl(p.preco*q):'sob consulta'}`)}
  brindes().filter(b=>b.ganhou).forEach(b=>L.push(`🎁 Brinde: ${b.ganhou>1?b.ganhou+'x ':''}${b.pr.brinde} (${b.pr.titulo})`));
  L.push('',`*Total estimado: ${brl(T.t)}*`+(T.ask?' + itens sob consulta':''));if(T.kg)L.push('_Itens por kg: valor final conforme o peso._');L.push('',`*Cliente:* ${c.nome}`);[['Endereço',c.endereco],['Bairro/cidade',c.cidade],['Telefone',c.telefone],['Observação',c.obs]].forEach(([k,v])=>{if(v)L.push(`*${k}:* ${v}`)});if(sellerName)L.push('',`Vendedor: ${sellerName}`);return L.join('\n')}
function linkExpirado(){const d=document.createElement('div');d.id='expirado';d.style.cssText='position:fixed;inset:0;z-index:500;background:#080808f2;display:grid;place-items:center;padding:24px;text-align:center';
 d.innerHTML=`<div style="max-width:420px;border:1px solid #ffd21a;border-radius:24px;padding:30px 24px;background:#111"><img src="${esc(D.imgs.logo)}" alt="" style="width:90px;margin:0 auto 12px;display:block"><h2 style="font:30px Georgia,serif;color:#fff;margin:0 0 10px">Link indisponível</h2><p style="color:#ccc;line-height:1.5;margin:0 0 18px">Este link de pedidos não está mais ativo. Fale com a ${esc(D.empresa)} para receber o catálogo atualizado.</p>${D.whatsapp?`<a class="btn" style="display:inline-block;text-decoration:none" href="https://wa.me/${esc(D.whatsapp)}?text=${encodeURIComponent('Olá! Quero receber o catálogo da '+D.empresa+'.')}" target="_blank" rel="noopener">💬 Falar com a ${esc(D.empresa)}</a>`:''}</div>`;
 document.body.appendChild(d);document.body.style.overflow='hidden';cart={};saveCart()}
function client(){return{nome:$('cNome').value.trim(),endereco:$('cEnd').value.trim(),telefone:$('cTel').value.trim(),cidade:$('cCid').value.trim(),obs:$('cObs').value.trim()}}
let sent=false,bodyBackup=null;
function restoreCartUI(){if(bodyBackup){$('ctBody').replaceChildren(...bodyBackup);bodyBackup=null;$('ctFoot').hidden=false}}
function showDone(numero,url,dest){bodyBackup=[...$('ctBody').childNodes];sent=true;$('ctFoot').hidden=true;
  $('ctBody').innerHTML=`<div class="done"><div class="ok">✓</div><h3>${numero?'Pedido nº '+numero:'Pedido pronto'}</h3><p>${url?`Abrimos o WhatsApp${dest?' de <b>'+esc(dest)+'</b>':''} com o seu pedido.<br>É só tocar em <b>enviar</b> na conversa.`:'Copiamos o pedido. Cole na conversa com a Comércio MLG.'}</p>${url?`<a class="send" href="${esc(url)}" target="_blank" rel="noopener">💬 ABRIR O WHATSAPP DE NOVO</a>`:''}<p style="margin-top:18px"><button class="btn ghost" id="doneBack">VOLTAR AO CATÁLOGO</button></p></div>`;
  $('doneBack').onclick=closeCart}
$('ctSend').onclick=async()=>{
  const c=client();$('cErr').hidden=true;
  const falta=!c.nome?['cNome','seu nome']:!c.endereco?['cEnd','o endereço de entrega']:!c.cidade?['cCid','o bairro e a cidade']:null;if(falta){$('cErr').textContent='Informe '+falta[1]+' para enviar o pedido.';$('cErr').hidden=false;$(falta[0]).focus();return}
  saveClient();$('ctSend').disabled=true;$('ctSend').textContent='Enviando…';
  const win=window.open('','_blank');   // abre já no clique (evita bloqueio de pop-up)
  let numero=null,num=D.whatsapp||'',texto=null,dest='';
  try{const r=await fetch(new URL('../api/pedido',location.href),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pasta:D.pasta,vendedor:V||'',itens:Object.entries(cart).map(([id,qtd])=>({id,qtd})),cliente:c})});
    const j=await r.json().catch(()=>null);
    if(j&&j.texto){numero=j.numero;texto=j.texto;num=j.whatsapp||num;dest=j.destino||''}
    else if(j&&j.expirado){if(win)win.close();closeCart();linkExpirado();return}
    else if(j&&j.em_falta){if(win)win.close();j.em_falta.forEach(id=>{const pp=ALL.find(x=>x.id===id);if(pp)pp.falta=true;delete cart[id]});saveCart();render();paintCart();$('cErr').textContent=j.erro+'. Tiramos do seu pedido; confira e envie de novo.';$('cErr').hidden=false;$('ctSend').disabled=false;$('ctSend').textContent='💬 ENVIAR PEDIDO PELO WHATSAPP';return}
    else if(j&&j.erro&&r.status===400){if(win)win.close();$('cErr').textContent=j.erro;$('cErr').hidden=false;$('ctSend').disabled=false;$('ctSend').textContent='💬 ENVIAR PEDIDO PELO WHATSAPP';return}
  }catch(e){}
  if(!texto)texto=localText();
  const url=num?'https://wa.me/'+num+'?text='+encodeURIComponent(texto):'';
  if(url){if(win){win.location.href=url}}else{if(win)win.close();try{await navigator.clipboard.writeText(texto)}catch(e){}}
  cart={};saveCart();render();
  $('ctSend').disabled=false;$('ctSend').textContent='💬 ENVIAR PEDIDO PELO WHATSAPP';
  showDone(numero,url,dest);paintCart();$('cartFab').hidden=true;
};
render();fromHash();paintCart();
})();
