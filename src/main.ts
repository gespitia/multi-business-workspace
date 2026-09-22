import './style.css';
import { createWorkspace, type Role } from './application/workspace';

const ws=createWorkspace();
const root=document.querySelector('#app')!;
let section='overview';
let query='';
let assistant='';

const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const money=(n:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);

function render(){
  const b=ws.business;
  const customers=ws.customers().filter(c=>(c.name+' '+c.email).toLowerCase().includes(query.toLowerCase()));
  const items=ws.items().filter(i=>(i.name+' '+i.category).toLowerCase().includes(query.toLowerCase()));
  const nav=[['overview','Overview'],['customers','Customers'],['catalog',b.type==='Services'?'Services':'Inventory'],['operations',b.type==='Services'?'Projects':'Orders'],['reports','Reports']];

  let page='';
  if(section==='customers'){
    page=`<div class="panel"><div class="toolbar"><div><label>CUSTOMER DIRECTORY</label><h2>Customers</h2></div><input id="search" placeholder="Search name or email" value="${esc(query)}"><button id="addCustomer" ${ws.can('create')?'':'disabled'}>+ Customer</button></div>
    <table><thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Value</th></tr></thead><tbody>${customers.map(c=>`<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.email)}</td><td><span class="status ${c.status.toLowerCase()}">${c.status}</span></td><td>${money(c.value)}</td></tr>`).join('')}</tbody></table></div>`;
  }else if(section==='catalog'){
    page=`<div class="panel"><div class="toolbar"><div><label>${b.type.toUpperCase()} CATALOG</label><h2>${b.type==='Services'?'Services & capacity':'Inventory'}</h2></div><input id="search" placeholder="Search catalog" value="${esc(query)}"><button id="addItem" ${ws.can('create')?'':'disabled'}>+ ${b.type==='Services'?'Service':'Item'}</button></div>
    <table><thead><tr><th>Name</th><th>Category</th><th>Stock</th><th>Price</th><th>Status</th></tr></thead><tbody>${items.map(i=>`<tr><td><b>${esc(i.name)}</b></td><td>${esc(i.category)}</td><td>${i.stock}</td><td>${money(i.price)}</td><td><span class="status ${i.status.toLowerCase().replaceAll(' ','-')}">${i.status}</span></td></tr>`).join('')}</tbody></table></div>`;
  }else if(section==='operations'){
    page=`<div class="panel"><label>OPERATIONS</label><h2>${b.type==='Services'?'Active projects':'Recent orders'}</h2><div class="operation-grid"><article><span>In progress</span><b>${Math.round(b.orders*.32)}</b><small>current tenant</small></article><article><span>Completed</span><b>${Math.round(b.orders*.61)}</b><small>current period</small></article><article><span>Attention</span><b>${b.items.filter(i=>i.status!=='In stock').length}</b><small>requires action</small></article></div><div class="activity">${b.activities.map(a=>`<p><b>${esc(a.message)}</b><span>${a.date}</span></p>`).join('')}</div></div>`;
  }else if(section==='reports'){
    page=`<div class="panel"><label>REPORTING</label><h2>Tenant performance</h2><div class="report-grid"><article><span>Revenue</span><b>${money(b.revenue)} ${b.currency}</b><small>reference period</small></article><article><span>Growth</span><b>+${b.growth}%</b><small>vs previous period</small></article><article><span>Orders / projects</span><b>${b.orders}</b><small>current tenant</small></article><article><span>Customers</span><b>${b.customers.length}</b><small>active dataset</small></article></div><div class="boundary"><b>Isolation check</b><p>Every read resolves through tenantId = <code>${b.id}</code>. The browser models the boundary; production authorization and PostgreSQL RLS must enforce it server-side.</p></div></div>`;
  }else{
    page=`<div class="metrics"><article><span>Revenue</span><b>${money(b.revenue)}</b><small>${b.currency} · current period</small></article><article><span>Orders / projects</span><b>${b.orders}</b><small>processed</small></article><article><span>Customers</span><b>${b.customers.length}</b><small>${b.customers.filter(c=>c.status==='Active').length} active</small></article><article><span>Growth</span><b>+${b.growth}%</b><small>reference period</small></article></div>
    <div class="split"><div class="panel"><label>ACTIVITY</label><h2>What changed</h2><div class="activity">${b.activities.map(a=>`<p><b>${esc(a.message)}</b><span>${a.date}</span></p>`).join('')}</div></div>
    <div class="panel"><label>ASSISTANT</label><h2>Ask this workspace</h2><textarea id="assistantQ" placeholder="How many customers? What needs attention?">${esc(assistant)}</textarea><button id="askAssistant">Ask tenant data</button>${assistant?`<div class="assistant-answer">${esc(ws.assistant(assistant))}</div>`:''}</div></div>`;
  }

  root.innerHTML=`<main><header><div><strong>MULTI-BUSINESS WORKSPACE</strong><span> / tenant-aware product reference</span></div><a href="https://github.com/gespitia/multi-business-workspace">Repository ↗</a></header>
  <section class="hero"><div><label>MULTI-TENANT FRONTEND ARCHITECTURE</label><h1>One owner.<br><em>Multiple businesses.</em></h1><p>Switch context without losing the domain. Each module reads and mutates through the active tenant boundary.</p></div><div class="context"><span>ACTIVE TENANT</span><b>${esc(b.name)}</b><small>${esc(b.type)} · ${ws.context.role}</small></div></section>
  <section class="workspace"><aside><label>WORKSPACE</label>${nav.map(n=>`<button class="${section===n[0]?'active':''}" data-section="${n[0]}">${n[1]}</button>`).join('')}<hr><label>BUSINESSES</label>${ws.all().map(x=>`<button class="${x.id===b.id?'active':''}" data-tenant="${x.id}"><b>${esc(x.name)}</b><small>${esc(x.type)}</small></button>`).join('')}<label class="role-label">ROLE</label><select id="role"><option value="owner" ${ws.context.role==='owner'?'selected':''}>Owner</option><option value="manager" ${ws.context.role==='manager'?'selected':''}>Manager</option><option value="viewer" ${ws.context.role==='viewer'?'selected':''}>Viewer</option></select></aside>
  <section class="content">${page}</section></section>
  <section class="architecture panel"><label>ARCHITECTURE TRACE</label><div><span>01 UI / App Shell</span><i>→</i><span>02 Tenant Context</span><i>→</i><span>03 Business Module</span><i>→</i><span>04 Backend Core</span><i>→</i><span>05 Tenant Repository</span><i>→</i><span>06 PostgreSQL / RLS</span></div></section>
  <footer>Browser-first reference implementation. Data is local demo state; PostgreSQL RLS and server-side authorization are modeled, not connected.</footer></main>`;

  root.querySelectorAll('[data-section]').forEach(x=>x.addEventListener('click',()=>{section=(x as HTMLElement).dataset.section!;query='';render()}));
  root.querySelectorAll('[data-tenant]').forEach(x=>x.addEventListener('click',()=>{ws.switchTo((x as HTMLElement).dataset.tenant!);section='overview';query='';render()}));
  root.querySelector('#role')?.addEventListener('change',e=>{ws.setRole((e.target as HTMLSelectElement).value as Role);render()});
  root.querySelector('#search')?.addEventListener('input',e=>{query=(e.target as HTMLInputElement).value;render();const el=root.querySelector('#search') as HTMLInputElement;el.focus();el.setSelectionRange(el.value.length,el.value.length)});
  root.querySelector('#addCustomer')?.addEventListener('click',()=>{const n=prompt('Customer name');const e=prompt('Email');if(n&&e){ws.addCustomer(n,e);render()}});
  root.querySelector('#addItem')?.addEventListener('click',()=>{const n=prompt('Name');const c=prompt('Category');const p=Number(prompt('Price')||0);if(n&&c){ws.addItem(n,c,p);render()}});
  root.querySelector('#askAssistant')?.addEventListener('click',()=>{assistant=(root.querySelector('#assistantQ') as HTMLTextAreaElement).value;render()});
}
render();