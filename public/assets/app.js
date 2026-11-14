(()=>{
const LS='mb_state',PLAN_KEYS=[LS],$=(s,r=document)=>r.querySelector(s);
const get=()=>{try{return JSON.parse(localStorage.getItem(LS))||{}}catch(e){return{}}};
const put=o=>{try{localStorage.setItem(LS,JSON.stringify({...get(),...o}))}catch(e){}};
const n=v=>{v=parseFloat(v);return isFinite(v)&&v>0?v:0};
const f=v=>(Math.round(v*100)/100).toLocaleString('en-US');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num=(id,l,v,x='')=>`<label for="${id}">${l}<input id="${id}" type="number" inputmode="decimal" min="0" step="any" value="${v}" ${x}></label>`;
const chk=(id,l,v)=>`<label class="chk"><input id="${id}" type="checkbox" ${v?'checked':''}> ${l}</label>`;
const stat=(b,s,c='')=>`<div class="stat ${c}"><b>${b}</b><span>${s}</span></div>`;

/* TOOL A - boxes. Each row: name, [people, bedrooms, per-50m2, flat] boxes, mix [small,medium,large,wardrobe] */
const CATS=[['Clothes',[3,2,0,0],[0,.45,.3,.25]],['Books',[2,1,0,0],[.7,.3,0,0]],['Kitchen items',[2,0,0,4],[.3,.5,.2,0]],['Electronics',[1,1,0,0],[.4,.6,0,0]],['Decorations',[0,1,1,0],[.4,.5,.1,0]],['Bathroom items',[1,.5,0,0],[.7,.3,0,0]],['Bedding',[1,1,0,0],[0,.3,.7,0]],['Toys',[0,0,0,2],[.4,.4,.2,0]],['Miscellaneous',[1,1,1,2],[.3,.4,.3,0]]];
function box(el){
 const s={beds:2,people:2,size:70,lvl:1,kit:1,gar:0,sto:0,gdn:0,ov:{},...(get().box||{})};
 el.innerHTML=`<div class="panel"><h2>Your home</h2><div class="grid">${num('beds','Bedrooms',s.beds)}${num('people','People',s.people)}${num('size','Property size (m²)',s.size)}<label for="lvl">Amount of belongings<select id="lvl">${[['0.75','Minimalist'],['1','Average'],['1.3','A lot']].map(([v,t])=>`<option value="${v}" ${+v===+s.lvl?'selected':''}>${t}</option>`).join('')}</select></label></div><div>${chk('kit','Kitchen',s.kit)}${chk('gar','Garage',s.gar)}${chk('sto','Storage room',s.sto)}${chk('gdn','Garden',s.gdn)}</div></div><div class="panel"><h2>Belongings</h2><p class="note">Pre-filled from your answers. Edit any number to match what you really own.</p><div class="grid">${CATS.map((c,i)=>num('q'+i,c[0],0)).join('')}</div><button class="btn ghost sm" id="rst" type="button">Reset to estimate</button></div><div class="panel" id="res" aria-live="polite"></div>`;
 const calc=()=>{
  const v=id=>n($('#'+id,el).value),c=id=>$('#'+id,el).checked;
  Object.assign(s,{beds:v('beds'),people:v('people'),size:v('size'),lvl:+$('#lvl',el).value,kit:+c('kit'),gar:+c('gar'),sto:+c('sto'),gdn:+c('gdn')});
  const m=[0,0,0,0];
  CATS.forEach((ct,i)=>{
   const [a,b,c2,d]=ct[1];let x=a*s.people+b*s.beds+c2*s.size/50+d;
   if(i===2&&!s.kit)x*=.3;if(i===8)x+=s.gar*10+s.sto*6+s.gdn*4;
   const inp=$('#q'+i,el);if(s.ov[i]===undefined)inp.value=Math.round(x*s.lvl);
   const q=n(inp.value);ct[2].forEach((k,j)=>m[j]+=q*k);
  });
  const [sm,md,lg,wd]=m.map(Math.ceil),t=sm+md+lg+wd;
  put({box:s,boxes:t});
  $('#res',el).innerHTML=t?`<h2>Your estimate</h2><div class="stats">${stat(sm,'Small boxes')}${stat(md,'Medium boxes')}${stat(lg,'Large boxes')}${stat(wd,'Wardrobe boxes')}${stat(t,'Total boxes','hi')}</div><h3 style="margin-top:1rem">Packing materials</h3><ul><li>${Math.ceil(t/12)} rolls of packing tape</li><li>${Math.ceil(t*.3)} kg of packing paper</li><li>${Math.ceil(t*1.5)} m of bubble wrap</li><li>${s.beds} mattress covers</li><li>${t} labels and 2 marker pens</li></ul><p class="note">This is an estimate. Heavy items such as books go in small boxes, and real numbers vary with how you pack.</p>`:`<p class="err">Enter at least one person or bedroom to see your estimate.</p>`;
 };
 el.addEventListener('input',e=>{if(/^q\d$/.test(e.target.id))s.ov[+e.target.id.slice(1)]=e.target.value;calc()});
 $('#rst',el).onclick=()=>{s.ov={};calc()};calc();
}

/* TOOL B - volume (m3 per item, packed and loaded; editable assumptions) */
const V=[['Living room',[['Sofa',2],['Armchair',.8],['Coffee table',.4],['TV stand',.5],['Television',.2],['Bookshelf',.9]]],['Bedroom',[['Single bed',1],['Double bed',2],['Wardrobe',1.8],['Chest of drawers',.6],['Bedside table',.15]]],['Kitchen',[['Refrigerator',.8],['Washing machine',.4],['Dishwasher',.4],['Microwave',.08],['Dining table',1],['Chairs',.25]]],['Office',[['Desk',.8],['Office chair',.4],['Filing cabinet',.5]]],['Other',[['Bicycle',.5],['Boxes',.07],['Garden furniture',1.5]]]];
function vol(el){
 const st=get(),q=st.vq||{},cu=st.custom||[];let al=st.allow??15;
 el.innerHTML=`<div class="panel"><h2>Select your items</h2>${st.boxes?`<p class="strip">You estimated ${st.boxes} boxes. <button class="btn ghost sm" id="ub" type="button">Use as Boxes quantity</button></p>`:''}${V.map(([c,it])=>`<h3>${c}</h3>${it.map(([nm,m])=>`<div class="irow"><label for="i_${esc(nm)}">${nm} <span class="note">${m} m³ each</span></label><input id="i_${esc(nm)}" data-k="${nm}" type="number" min="0" step="1" value="${n(q[nm])||''}" placeholder="0"></div>`).join('')}`).join('')}</div><div class="panel"><h2>Add a custom item</h2><div class="grid"><label for="cn">Name<input id="cn" type="text" placeholder="e.g. Piano"></label>${num('cl','Length (cm)','')}${num('cw','Width (cm)','')}${num('ch','Height (cm)','')}${num('cq','Quantity',1)}</div><button class="btn ghost sm" id="ca" type="button">Add item</button> <span id="cerr" class="err"></span><div id="cl2"></div></div><div class="panel"><h2>Packing allowance</h2>${num('al','Extra space for gaps and awkward shapes (%)',al)}</div><div class="panel" id="res" aria-live="polite"></div>`;
 const list=()=>{$('#cl2',el).innerHTML=cu.map((c,i)=>`<div class="irow"><span>${esc(c.name)} × ${c.q} — ${f(c.l*c.w*c.h/1e6*c.q)} m³</span><button class="btn ghost sm" data-r="${i}" type="button">Remove</button></div>`).join('')};
 const calc=()=>{
  al=n($('#al',el).value);let tot=0,cnt=0;const by={};
  V.forEach(([c,it])=>it.forEach(([nm,m])=>{const k=n(q[nm]);if(k){by[c]=(by[c]||0)+k*m;tot+=k*m;cnt+=k}}));
  cu.forEach(c=>{const v=c.l*c.w*c.h/1e6*c.q;by.Custom=(by.Custom||0)+v;tot+=v;cnt+=c.q});
  const all=tot*(1+al/100);put({vq:q,custom:cu,allow:al,vol:all,vraw:tot,items:cnt});
  const mx=Math.max(...Object.values(by),0);
  $('#res',el).innerHTML=tot?`<h2>Your volume</h2><div class="stats">${stat(f(tot)+' m³','Items only')}${stat(cnt,'Items')}${stat(f(all)+' m³','With '+al+'% allowance','hi')}</div><h3 style="margin-top:1rem">By category</h3>${Object.entries(by).map(([k,v])=>`<div class="bar"><span>${k}</span><i style="width:${v/mx*100}%"></i><span>${f(v)} m³</span></div>`).join('')}<p><a class="btn" href="truck-size-calculator.html">Find the right truck for ${f(all)} m³</a></p>`:`<p>Nothing selected yet. Enter a quantity next to any item to see your total volume.</p>`;
 };
 el.addEventListener('input',e=>{const k=e.target.dataset.k;if(k)q[k]=n(e.target.value);calc()});
 el.addEventListener('click',e=>{const r=e.target.dataset.r;if(r!==undefined){cu.splice(+r,1);list();calc()}});
 $('#ca',el).onclick=()=>{const c={name:$('#cn',el).value.trim()||'Custom item',l:n($('#cl',el).value),w:n($('#cw',el).value),h:n($('#ch',el).value),q:n($('#cq',el).value)};
  if(!c.l||!c.w||!c.h||!c.q){$('#cerr',el).textContent='Enter length, width, height and quantity above zero.';return}
  $('#cerr',el).textContent='';cu.push(c);list();calc()};
 const ub=$('#ub',el);if(ub)ub.onclick=()=>{q.Boxes=st.boxes;$('[data-k=Boxes]',el).value=st.boxes;calc()};
 list();calc();
}

/* TOOL C - truck (reference capacities are editable estimates) */
const VEH=[['Small van',3.5],['Medium van',7],['Large van',11],['Luton van',20],['Moving truck',35]];
function truck(el){
 const st=get(),tk=st.tk||{eff:85,cap:VEH.map(v=>v[1])};
 el.innerHTML=`<div class="panel"><h2>Your load</h2>${st.vol?`<p class="strip">Using ${f(st.vol)} m³ from the Volume Calculator. You can change it below.</p>`:`<p class="note">No saved volume yet. <a href="moving-volume-calculator.html">Calculate it</a> or type a number.</p>`}<div class="grid">${num('v','Volume to move (m³)',st.vol?f(st.vol):'')}${num('eff','Usable loading efficiency (%)',tk.eff)}</div></div><div class="panel"><h2>Vehicle reference values</h2><p class="note">Typical cargo volumes, shown as estimates. Edit them to match the vehicle you are renting.</p><div class="grid">${VEH.map((v,i)=>num('c'+i,v[0]+' (m³)',tk.cap[i])).join('')}</div></div><div class="panel" id="res" aria-live="polite"></div>`;
 const calc=()=>{
  const vl=n($('#v',el).value),ef=Math.min(n($('#eff',el).value),100)/100;
  const cap=VEH.map((_,i)=>n($('#c'+i,el).value));put({tk:{eff:ef*100,cap}});
  if(!vl||!ef){$('#res',el).innerHTML='<p class="err">Enter the volume to move and a loading efficiency above 0.</p>';return}
  const rows=VEH.map((v,i)=>({n:v[0],cap:cap[i],use:cap[i]*ef,trips:cap[i]?Math.ceil(vl/(cap[i]*ef)):Infinity}));
  const ok=rows.filter(r=>r.trips<Infinity);if(!ok.length){$('#res',el).innerHTML='<p class="err">Enter at least one vehicle capacity.</p>';return}
  const best=ok.find(r=>r.trips===1)||ok.reduce((a,b)=>b.trips<a.trips?b:a);
  put({trips:best.trips,veh:best.n});
  $('#res',el).innerHTML=`<h2>Recommended: ${best.n}</h2><div class="stats">${stat(best.n,'Vehicle','hi')}${stat(f(best.use)+' m³','Usable volume')}${stat(best.trips,best.trips>1?'Trips':'Trip')}</div><table><caption class="note">All options for ${f(vl)} m³</caption><tr><th>Vehicle</th><th>Usable m³</th><th>Trips</th></tr>${rows.map(r=>`<tr><td>${r.n}</td><td>${f(r.use)}</td><td>${r.trips===Infinity?'—':r.trips}</td></tr>`).join('')}</table><ul><li>Check the vehicle's load limit and your licence category.</li><li>Tall or long items, such as wardrobes and sofas, may not fit even when volume does.</li><li>Add a trip if access is tight or loading is untidy.</li></ul><p><a class="btn" href="moving-cost-calculator.html">Estimate your costs</a></p>`;
 };
 el.addEventListener('input',calc);calc();
}

/* TOOL D - checklist. Offsets are days before moving day. */
const G=[['8 weeks before',56,['Set your budget and moving date','Research and book a moving company or rental vehicle','Sort belongings: keep, sell, donate, recycle','Check notice periods in your rental or sale contract']],['4 weeks before',28,['Collect packing boxes and materials','Get quotes for storage if needed','Tell your landlord or agent your leaving date','Reserve parking permits or building lifts']],['2 weeks before',14,['Notify utility providers: electricity, gas, water, internet','Change your address with bank, insurer, employer and post','Start packing rooms you rarely use','Arrange childcare or pet care for moving day']],['1 week before',7,['Confirm transport and arrival times','Pack an essentials box for the first night','Empty and defrost the fridge and freezer','Take final meter readings and photos']],['Moving day',0,['Walk through the old property one last time','Clean the old property and hand over keys','Check the new property and note any damage','Unpack essentials: bedding, toiletries, chargers']],['After moving',-7,['Unpack the remaining rooms','Update your address on any remaining accounts','Return the rental vehicle and keep receipts','Explore local services and register where needed']]];
function list(el){
 const st=get(),chk2=st.chk||{},cu=st.ctasks||[];let md=st.mdate||'';
 const fmt=(d,o)=>{if(!md)return'';const x=new Date(md+'T12:00');x.setDate(x.getDate()-o);return x.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})};
 const draw=()=>{
  const all=[];
  const html=G.map(([t,o,ts],g)=>{const items=ts.map((x,i)=>({id:g+'_'+i,t:x})).concat(cu.filter(c=>c.g===g));all.push(...items);
   return `<div class="panel"><h2>${t}${md?` <span class="note">— by ${fmt(0,o)}</span>`:''}</h2>${items.map(it=>`<label class="task ${chk2[it.id]?'done':''}"><input type="checkbox" data-id="${it.id}" ${chk2[it.id]?'checked':''}><span>${esc(it.t)}</span></label>`).join('')}</div>`}).join('');
  const d=all.filter(a=>chk2[a.id]).length,p=all.length?Math.round(d/all.length*100):0;
  $('#cl',el).innerHTML=`<div class="panel"><b>${p}% complete</b> (${d} of ${all.length} tasks)<div class="prog" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div></div>${html}`;
 };
 el.innerHTML=`<div class="panel noprint"><div class="grid"><label for="md">Moving date<input id="md" type="date" value="${md}"></label><label for="ct">Add your own task<input id="ct" type="text" placeholder="e.g. Cancel gym membership"></label><label for="cg">Section<select id="cg">${G.map((g,i)=>`<option value="${i}">${g[0]}</option>`).join('')}</select></label></div><button class="btn ghost sm" id="add" type="button">Add task</button><button class="btn sm" id="pr" type="button">Print checklist</button> <span class="note" id="hint">${md?'':'Pick a moving date to see a due date for each section.'}</span></div><div id="cl"></div>`;
 el.addEventListener('change',e=>{if(e.target.id==='md'){md=e.target.value;put({mdate:md});$('#hint',el).textContent=md?'':'Pick a moving date to see a due date for each section.';draw()}else if(e.target.dataset.id){chk2[e.target.dataset.id]=e.target.checked;put({chk:chk2});draw()}});
 $('#add',el).onclick=()=>{const t=$('#ct',el).value.trim();if(!t){$('#hint',el).textContent='Type a task name first.';return}cu.push({id:'c'+Date.now(),t,g:+$('#cg',el).value});put({ctasks:cu});$('#ct',el).value='';draw()};
 $('#pr',el).onclick=()=>window.print();draw();
}

/* TOOL E - cost */
function cost(el){
 const st=get(),s={cur:'€',co:0,veh:0,mat:0,dist:0,cons:12,fp:1.6,sto:0,svc:0,oth:0,...(st.cost||{})};
 el.innerHTML=`<div class="panel"><h2>Your prices</h2><p class="note">Enter quotes or your own estimates. Leave anything you don't need at zero.</p><div class="grid"><label for="cur">Currency<select id="cur">${['€','$','£'].map(c=>`<option ${c===s.cur?'selected':''}>${c}</option>`).join('')}</select></label>${num('co','Moving company',s.co)}${num('veh','Rental vehicle',s.veh)}${num('mat','Packing materials',s.mat)}${num('sto','Storage',s.sto)}${num('svc','Additional services (cleaning, assembly…)',s.svc)}${num('oth','Other expenses',s.oth)}</div></div><div class="panel"><h2>Fuel and distance</h2><div class="grid">${num('dist','One-way distance (km)',s.dist)}${num('cons','Vehicle consumption (L/100 km)',s.cons)}${num('fp','Fuel price per litre',s.fp)}</div><p class="note">Fuel = distance × 2 (return trip) × number of trips × consumption × price.${st.trips?` Using ${st.trips} trip(s) from the Truck Size Calculator.`:' Assumes 1 trip.'}</p></div><div class="panel" id="res" aria-live="polite"></div>`;
 const calc=()=>{
  Object.keys(s).forEach(k=>{const e=$('#'+k,el);if(e)s[k]=k==='cur'?e.value:n(e.value)});put({cost:s});
  const fuel=s.dist*2*(st.trips||1)*s.cons/100*s.fp;
  const rows=[['Moving company',s.co],['Rental vehicle',s.veh],['Packing materials',s.mat],['Fuel',fuel],['Storage',s.sto],['Additional services',s.svc],['Other',s.oth]];
  const t=rows.reduce((a,r)=>a+r[1],0),mx=Math.max(...rows.map(r=>r[1]));
  $('#res',el).innerHTML=t?`<h2>Estimated total</h2><div class="stats">${stat(s.cur+f(t),'Total estimate','hi')}</div><h3 style="margin-top:1rem">Cost per category</h3>${rows.filter(r=>r[1]).map(r=>`<div class="bar"><span>${r[0]}</span><i style="width:${r[1]/mx*100}%"></i><span>${s.cur}${f(r[1])} · ${Math.round(r[1]/t*100)}%</span></div>`).join('')}<p class="note">An estimate from the numbers you entered, not a supplier quotation. Get written quotes before booking.</p>`:`<p>Enter at least one price to see your estimate.</p>`;
 };
 el.addEventListener('input',calc);el.addEventListener('change',calc);calc();
}

const T={box,vol,truck,list,cost};
const renderSaved=()=>{const st=get(),bits=[st.boxes&&st.boxes+' boxes',st.vol&&f(st.vol)+' m³',st.trips&&st.trips+' trip(s)'].filter(Boolean);
const sl=$('#saved');if(sl)sl.innerHTML=bits.length?`<p class="strip">Saved on this device: ${bits.join(' · ')}</p>`:''};
/* Start Over: removes only MovingBuddy plan data (PLAN_KEYS), never localStorage.clear(). mb_notice is kept on purpose. */
const mountTools=()=>document.querySelectorAll('[data-tool]').forEach(el=>{
 const fresh=el.cloneNode(false);el.replaceWith(fresh);/* a clean node drops the old event listeners */
 try{T[fresh.dataset.tool](fresh)}catch(e){console.error(e)}});
const wipePlan=()=>{PLAN_KEYS.forEach(k=>{try{localStorage.removeItem(k)}catch(e){}})};
const startOver=()=>{wipePlan();mountTools();renderSaved();const m=$('#so-msg');if(m)m.textContent='Done. Your saved move data has been cleared.'};
const askStartOver=btn=>{
 const msg='Start over? This will delete everything saved on this device for your move: your box, volume, truck and cost numbers, your checklist progress and any tasks you added. This cannot be undone.';
 if(typeof HTMLDialogElement!=='function'||!document.createElement('dialog').showModal){if(confirm(msg))startOver();return}
 const d=document.createElement('dialog');d.className='sodlg';d.setAttribute('aria-labelledby','so-t');d.setAttribute('aria-describedby','so-d');
 d.innerHTML='<div class="sobody"><h2 id="so-t">Start over?</h2><p id="so-d">This will delete everything saved on this device for your move: your box, volume, truck and cost numbers, your checklist progress and any tasks you added. This cannot be undone.</p><div class="soact"><button class="btn ghost" type="button" data-a="cancel" autofocus>Cancel</button><button class="btn danger fill" type="button" data-a="ok">Yes, delete and start over</button></div></div>';
 const done=()=>{if(d.isConnected){d.close();d.remove()}if(btn&&btn.isConnected)btn.focus()};
 d.addEventListener('click',e=>{const a=e.target.dataset&&e.target.dataset.a;if(a==='ok'){done();startOver()}else if(a||e.target===d)done()});
 d.addEventListener('close',done);/* Esc key */
 document.body.append(d);d.showModal();
};
mountTools();
const firstTool=$('[data-tool]');
if(firstTool){const bar=document.createElement('div');bar.className='startover noprint';bar.innerHTML='<span class="note" id="so-msg" role="status"></span><button class="btn danger sm" id="so" type="button" aria-haspopup="dialog">Start Over</button>';
 firstTool.before(bar);$('#so',bar).onclick=e=>askStartOver(e.currentTarget)}
renderSaved();
const cur=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')===cur)a.setAttribute('aria-current','page')});
try{if(!localStorage.getItem('mb_notice')){const b=document.createElement('div');b.id='cc';b.setAttribute('role','region');b.setAttribute('aria-label','Storage notice');b.innerHTML='<span>MovingBuddy saves your plan only in this browser (localStorage). No tracking or advertising cookies are set. <a href="cookies.html">Details</a></span><button class="btn sm" type="button">Got it</button>';b.querySelector('button').onclick=()=>{localStorage.setItem('mb_notice','1');b.remove()};document.body.append(b)}}catch(e){}
})();
