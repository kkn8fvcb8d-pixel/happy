
(function(){
'use strict';
const KEY='oshimichi-saved-route-v1';
const LIBRARY_KEY='oshimichi-confirmed-routes-v2';
let currentId=null;let libraryMode=false;
const step=document.getElementById('oshiStep06');
const result=document.getElementById('courseResult');
const course=document.getElementById('course');
if(!step||!result||!course)return;
let saving=false;
const ja=()=>typeof language!=='undefined'&&language==='ja';
const t=(jp,ko)=>ja()?jp:ko;
function safeRead(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function defaultName(v){
 const date=v.date||((v.savedAt||'').slice(0,10));
 const names=(v.stops||[]).slice(0,2).map(p=>p.ko||p.ja||'').filter(Boolean);
 return [date,names.join(' · ')].filter(Boolean).join(' | ')||'나의 성지순례 코스';
}
function library(){
 const data=safeRead(LIBRARY_KEY);
 if(Array.isArray(data))return data.filter(x=>x&&Array.isArray(x.stops)&&x.stops.length);
 const legacy=safeRead(KEY);
 if(legacy&&Array.isArray(legacy.stops)&&legacy.stops.length){
  const migrated=[{...legacy,id:'legacy-'+(legacy.savedAt||'first').replace(/[^a-zA-Z0-9]/g,''),name:legacy.name||defaultName(legacy)}];
  try{localStorage.setItem(LIBRARY_KEY,JSON.stringify(migrated))}catch(e){}
  return migrated;
 }
 return [];
}
function read(){const all=library();return all.find(x=>x.id===currentId)||all[0]||null}
function write(v){
 const all=library();const stamp=new Date().toISOString();
 const id=v.id||('route-'+Date.now()+'-'+Math.random().toString(36).slice(2,8));
 const record={...v,id,name:v.name||defaultName(v),savedAt:v.savedAt||stamp};
 const index=all.findIndex(x=>x.id===id);
 if(index>=0)all[index]=record;else all.unshift(record);
 try{localStorage.setItem(LIBRARY_KEY,JSON.stringify(all));localStorage.setItem(KEY,JSON.stringify(record));currentId=id;return true}catch(e){return false}
}
function updateRecord(id,update){
 const all=library(),index=all.findIndex(x=>x.id===id);if(index<0)return false;
 all[index]={...all[index],...update};
 try{localStorage.setItem(LIBRARY_KEY,JSON.stringify(all));if(safeRead(KEY)?.id===id||currentId===id)localStorage.setItem(KEY,JSON.stringify(all[index]));return true}catch(e){return false}
}
function removeRecord(id){
 const all=library().filter(x=>x.id!==id);
 try{localStorage.setItem(LIBRARY_KEY,JSON.stringify(all));localStorage.removeItem(KEY);if(all.length)localStorage.setItem(KEY,JSON.stringify(all[0]));currentId=all[0]?.id||null;return true}catch(e){return false}
}
function hideStep(){step.classList.remove('active');step.setAttribute('aria-hidden','true')}
function selectedEntries(){return window.OSHI_STEP05_BRIDGE?.getRoute?.()||[]}
function snapshot(){
 // STEP 05 owns the actual route state inside a private closure. Use its bridge,
 // not a free variable named routeEntries (which is not visible here).
 const rows=selectedEntries();if(!rows.length)return null;
 return {savedAt:new Date().toISOString(),date:document.getElementById('travelDate')?.value||'',
 time:document.getElementById('travelTime')?.value||'',mode:document.getElementById('travelMode')?.value||'',
 origin:document.getElementById('originSelect')?.selectedOptions?.[0]?.textContent||'',
 stops:rows};
}
function showSaved(view='detail'){
 const data=read();if(!data?.stops?.length){hideStep();window.OSHI_STEP05_BRIDGE?.openCourse?.();return;}
 libraryMode=view==='library';
 // Existing showPage() hides the welcome screen and other pages. It also clears the old
 // recommendation, which is restored on pressing Edit.
 window.OSHI_STEP05_BRIDGE?.openCourse?.();
 course.classList.remove('active');course.setAttribute('aria-hidden','true');
 step.classList.add('active');step.setAttribute('aria-hidden','false');
 document.querySelectorAll('.oshi-quick-link').forEach(b=>{if(b.id==='navCourse')b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 renderSaved();window.scrollTo(0,0);
}
function editCourse(){
 const fromPremium=read()?.type==='premium';
 hideStep();
 try{
  window.OSHI_STEP05_BRIDGE?.edit?.();
  if(fromPremium)document.getElementById('oshiPremiumTab')?.click();
 }catch(e){console.error('STEP 05 redraw',e)}
}
function mapLink(a,b,mode){return 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin:a.lat+','+a.lng,destination:b.lat+','+b.lng,travelmode:mode==='walk'?'walking':'transit'}).toString()}
function withCoordinates(p){return Number.isFinite(p?.lat)&&Number.isFinite(p?.lng)}
function renderSaved(){
 const data=read(),out=document.getElementById('step06Contents');out.replaceChildren();
 const editButton=document.getElementById('step06Edit');
 const deleteButton=document.getElementById('step06Delete');
 editButton.hidden=libraryMode;deleteButton.hidden=libraryMode;
 document.getElementById('step06Back').innerHTML=libraryMode?t('← 戻る','← 돌아가기'):t('← 保存コース一覧','← 저장한 코스 목록');
 if(libraryMode){renderLibrary(out);return;}

 document.getElementById('step06Title').innerHTML=t('私の<em>聖地巡礼コース</em> ✧','나의 <em>성지순례 코스</em> ✧');
 document.getElementById('step06Intro').textContent=t('確定した訪問順と区間別の経路をいつでも確認できます。','확정한 방문 순서와 구간별 이동 경로를 언제든 다시 확인할 수 있어요.');
 document.getElementById('step06Edit').textContent=t('訪問順を編集','방문 순서 다시 편집');
 document.getElementById('step06Delete').textContent=t('保存したコースを削除','저장된 코스 삭제');
 if(!data?.stops?.length){out.textContent=t('保存されたコースがありません。','저장된 코스가 없어요.');return;}
 const rename=document.createElement('div');rename.className='oshi-library-detail-header';
 const name=document.createElement('strong');name.textContent=data.name||defaultName(data);
 const renameBtn=document.createElement('button');renameBtn.type='button';renameBtn.className='oshi-library-small-button';renameBtn.textContent=t('名前を変更','이름 변경');
 renameBtn.addEventListener('click',()=>renameRecord(data.id));rename.append(name,renameBtn);out.append(rename);
 const panel=document.createElement('div');panel.className='step06-panel';
 const heading=document.createElement('h3');heading.textContent=t('✦ 確定した訪問ルート','✦ 확정된 방문 코스');panel.append(heading);
 const meta=document.createElement('p');meta.className='step06-note';meta.textContent=[data.date,data.time,data.origin,data.mode==='walk'?t('徒歩','도보'):t('公共交通','대중교통')].filter(Boolean).join(' · ');panel.append(meta);
 data.stops.forEach((p,i)=>{
  if(i>0){const prev=data.stops[i-1];const leg=document.createElement('div');leg.className='step06-leg';
   const mode=data.mode==='walk'?'🚶':'🚇';
   const desc=document.createElement('span');desc.textContent=mode+' '+t(`${i} → ${i+1} スポットの移動`,`${i} → ${i+1}번째 장소 이동`);leg.append(desc);
   if(withCoordinates(prev)&&withCoordinates(p)){const a=document.createElement('a');a.href=mapLink(prev,p,data.mode);a.target='_blank';a.rel='noopener noreferrer';a.textContent=t('実際の経路・乗換を見る ↗','실제 길찾기·환승 확인 ↗');leg.append(a)}panel.append(leg);
  }
  const item=document.createElement('div');item.className='step06-stop';
  const n=document.createElement('span');n.className='step06-number';n.textContent=String(i+1).padStart(2,'0');
  const content=document.createElement('div');const name=document.createElement('b');name.textContent=ja()?p.ja||p.ko:p.ko||p.ja;
  const detail=document.createElement('small');detail.textContent=[p.arrival,p.stay?t(`滞在 ${p.stay}分`,`체류 ${p.stay}분`):'',p.address].filter(Boolean).join(' · ');content.append(name,detail);
  if(withCoordinates(p)){const a=document.createElement('a');a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.lat+','+p.lng);a.target='_blank';a.rel='noopener noreferrer';a.textContent=t('📍 地図で場所を見る','📍 지도에서 장소 보기');content.append(a)}
  item.append(n,content);panel.append(item);
 });out.append(panel);
 const note=document.createElement('p');note.className='step06-note';note.textContent=t('※ 到着時刻は計画用の推定値です。実際の交通ルートと所要時間はリンク先でご確認ください。','※ 도착 시각은 계획용 예상치입니다. 실제 이동 경로와 소요 시간은 길찾기 링크에서 확인해 주세요.');out.append(note);
}
function renameRecord(id){
 const item=library().find(x=>x.id===id);if(!item)return;
 const next=prompt(t('コース名を入力してください','코스 이름을 입력해 주세요'),item.name||defaultName(item));
 if(next===null)return;const name=next.trim().slice(0,80);if(!name)return;
 if(!updateRecord(id,{name})){alert(t('名前を保存できませんでした。','이름을 저장하지 못했어요.'));return}
 renderSaved();
}
function renderLibrary(out){
 const items=library().slice().sort((a,b)=>String(b.savedAt||'').localeCompare(String(a.savedAt||'')));
 document.getElementById('step06Title').innerHTML=t('保存した<em>マイコース</em> ✧','저장한 <em>나의 코스</em> ✧');
 document.getElementById('step06Intro').textContent=t('確定したコースを選んで、旅の予定をすぐ確認しましょう。','저장한 확정 코스를 선택하면 여행 일정을 바로 확인할 수 있어요.');
 const head=document.createElement('div');head.className='oshi-library-heading';head.textContent=t(`保存したコース ${items.length}件`,`저장한 코스 ${items.length}개`);out.append(head);
 items.forEach((item,i)=>{
  const card=document.createElement('article');card.className='oshi-library-card';
  const info=document.createElement('div');info.className='oshi-library-info';
  const badge=document.createElement('span');badge.className='oshi-library-badge';badge.textContent=(i===0?t('最新 · ','최근 저장 · '):'')+(item.type==='premium'?'PREMIUM':'FREE');
  const title=document.createElement('strong');title.textContent=item.name||defaultName(item);
  const meta=document.createElement('small');meta.textContent=[item.date,item.time,t(`${item.stops.length}か所`,`${item.stops.length}곳`),item.mode==='walk'?t('徒歩','도보'):t('公共交通','대중교통')].filter(Boolean).join(' · ');
  info.append(badge,title,meta);
  const actions=document.createElement('div');actions.className='oshi-library-card-actions';
  const open=document.createElement('button');open.type='button';open.className='oshi-library-open';open.textContent=t('コースを見る','코스 보기');open.addEventListener('click',()=>{currentId=item.id;showSaved('detail')});
  const rename=document.createElement('button');rename.type='button';rename.className='oshi-library-small-button';rename.textContent=t('名前変更','이름 변경');rename.addEventListener('click',()=>renameRecord(item.id));
  const del=document.createElement('button');del.type='button';del.className='oshi-library-small-button oshi-library-danger';del.textContent=t('削除','삭제');del.addEventListener('click',()=>{
   if(!confirm(t('このコースを削除しますか？','이 코스를 삭제할까요?')))return;
   if(!removeRecord(item.id)){alert(t('削除できませんでした。','삭제하지 못했어요.'));return}
   if(!library().length){hideStep();window.OSHI_STEP05_BRIDGE?.openCourse?.();return}showSaved('library');
  });
  actions.append(open,rename,del);card.append(info,actions);out.append(card);
 });
}
function ensureSave(){
 let box=document.getElementById('oshiSaveArea');
 const list=result.querySelector('.oshi-improved-course, .course-list');
 const valid=!!list && !!list.querySelector('.oshi-course-spot, .course-item');
 if(!valid){if(box)box.remove();return;}
 if(!box){box=document.createElement('div');box.id='oshiSaveArea';box.className='oshi-save-area';
  box.innerHTML='<h3 id="oshiSaveTitle"></h3><p id="oshiSaveDesc"></p><div class="oshi-progress-track" role="progressbar" aria-label="코스 저장 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="oshi-progress-fill" id="oshiProgressFill"></div></div><div class="oshi-progress-number" id="oshiProgressNumber">0%</div><div class="oshi-save-actions"><button type="button" class="step06-primary" id="oshiSaveButton"></button></div>';
  box.querySelector('button').addEventListener('click',saveAnimated);
 }
 // Keep the confirm panel in the reading flow, immediately AFTER the visit cards
 // and BEFORE the external map links / tall interactive map.
 if(list.nextSibling!==box)list.insertAdjacentElement('afterend',box);
 document.getElementById('oshiSaveTitle').textContent=t('✦ 訪問順を確定','✦ 방문 순서 확정하기');
 document.getElementById('oshiSaveDesc').textContent=t('おすすめの訪問順を確定するとSTEP 06に保存され、いつでも見返せます。','추천된 방문 순서를 확정하면 STEP 06에 저장되어 언제든 다시 볼 수 있어요.');
 document.getElementById('oshiSaveButton').textContent=t('訪問順を確定して STEP 06へ →','방문 순서 확정하고 STEP 06으로 →');
}
function saveAnimated(){
 if(saving)return;const data=snapshot();if(!data?.stops?.length){alert(t('訪問場所を選んでください。','방문 장소를 먼저 선택해 주세요.'));return}
 saving=true;
 const button=document.getElementById('oshiSaveButton'),fill=document.getElementById('oshiProgressFill'),number=document.getElementById('oshiProgressNumber'),track=document.querySelector('#oshiSaveArea [role="progressbar"]');
 button.disabled=true;document.getElementById('oshiSaveArea')?.classList.add('oshi-confirm-running');button.textContent=t('保存中…','저장 중…');
 fill.style.width='0%';number.textContent='0%';track.setAttribute('aria-valuenow','0');
 let start=null;const duration=1700;
 function frame(now){if(start===null)start=now;const ratio=Math.min(1,(now-start)/duration),pct=Math.min(100,Math.round((1-Math.pow(1-ratio,3))*100));
  fill.style.width=pct+'%';number.textContent=pct+'%';track.setAttribute('aria-valuenow',String(pct));
  if(ratio<1){requestAnimationFrame(frame);return;}
  if(!write(data)){alert(t('保存できませんでした。ブラウザの保存設定をご確認ください。','저장할 수 없어요. 브라우저 저장 설정을 확인해 주세요.'));button.disabled=false;saving=false;document.getElementById('oshiSaveArea')?.classList.remove('oshi-confirm-running');return}
  saving=false;updateHomeShortcut();showSaved('detail');
 }
 requestAnimationFrame(frame);
}
// Shared final confirmation storage: PREMIUM and FREE use the SAME STEP 06 screen.
// PREMIUM sends its own recommended ordered stops; no dependency on manual route state.
window.OSHI_STEP06_CONFIRM_PREMIUM=function(payload){
 if(!payload||!Array.isArray(payload.stops)||!payload.stops.length)return false;
 const record={...payload,type:'premium',savedAt:new Date().toISOString()};
 if(!write(record))return false;
 updateHomeShortcut();showSaved('detail');
 return true;
};
 // One consistent entry point: top navigation "My course".
 function updateHomeShortcut(){
  const legacy=document.getElementById('oshiOpenConfirmed');
  if(legacy)legacy.remove();
 }
updateHomeShortcut();
// Attach directly to the actual STEP 05 painting operation. A MutationObserver-only
// solution may fail if its callback runs before the route data is ready.
try{if(typeof paintCourse==='function'){const originalPaint=paintCourse;paintCourse=function(){const r=originalPaint.apply(this,arguments);ensureSave();return r}}}catch(e){console.error(e)}
// STEP 06 must disappear when any ordinary page navigation happens.
try{if(typeof showPage==='function'){const originalShowPage=showPage;showPage=function(){hideStep();return originalShowPage.apply(this,arguments)}}}catch(e){console.error(e)}
const nav=document.getElementById('navCourse');
if(nav)nav.addEventListener('click',function(e){if(library().length){e.preventDefault();e.stopImmediatePropagation();showSaved('library')}},true);
document.getElementById('step06Back').addEventListener('click',()=>{if(libraryMode)editCourse();else showSaved('library')});
document.getElementById('step06Edit').addEventListener('click',editCourse);
document.getElementById('step06Delete').addEventListener('click',()=>{if(!confirm(t('保存したコースを削除しますか？','저장된 코스를 삭제할까요?')))return;if(!removeRecord(read()?.id))return;if(library().length)showSaved('library');else editCourse()});
const observer=new MutationObserver(()=>{if(!saving){const list=result.querySelector('.oshi-improved-course, .course-list');const save=document.getElementById('oshiSaveArea');if((list&&!save)||(!list&&save)||(list&&save&&list.nextSibling!==save))ensureSave()}});observer.observe(result,{childList:true});
try{if(typeof translate==='function'){const originalTranslate=translate;translate=function(){const r=originalTranslate.apply(this,arguments);if(step.classList.contains('active'))renderSaved();else ensureSave();updateHomeShortcut();return r}}}catch(e){console.error(e)}
ensureSave();
})();
