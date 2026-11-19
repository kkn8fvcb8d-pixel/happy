
(()=>{'use strict';
// Added after all existing scripts: never replace core data arrays, photos, videos or original render functions.
const el=id=>document.getElementById(id), ko=()=>document.documentElement.lang==='ko';
const dict={
 ko:{freeTag:'내가 직접 계획하는 여행',premiumTag:'오시미치가 대신 계획하는 여행',freeTitle:'내가 직접 만드는 성지순례',freeDesc:'장소 선택부터 방문 순서까지 내 손으로! 직접 만드는 기본 코스는 횟수 제한 없이 무료예요.',premiumTitle:'번거로운 여행 계획, 오시미치가 대신',premiumDesc:'그룹·시간·출발지를 고르면 방문 순서와 예상 일정을 한 번에 추천해요.',trial:n=>`직접 코스 만들기 무제한 · PREMIUM 자동 추천 무료 체험 ${n}/2회 남음`,noTrials:'프리미엄 자동 추천 무료 체험 2회를 모두 사용했어요. 시연용 PREMIUM을 활성화하면 계속 이용할 수 있어요. 직접 만드는 코스는 계속 무료예요.',plans:'이용권 · 기능 비교',autoTitle:'맞춤 성지순례 자동 추천',autoIntro:'장소 고르기·순서 정하기·일정 계산을 한 번에 줄여 보세요. 실시간 교통 정보는 제공하지 않습니다.',artistLegend:'여행할 아이돌 그룹 (복수 선택 가능)',origin:'출발 위치',timeBudget:'여행 가능 시간',startTime:'시작 시간',travelDate:'여행 날짜',travelMode:'이동 방식',savedOnly:'즐겨찾기한 장소만 추천',autoButton:'✦ 알아서 코스 추천받기',nearbyButton:'내 주변 성지 찾기',rebuildButton:'변경 조건으로 재구성',savePremium:'✧ 프리미엄 코스 저장',savedCourses:'저장한 코스 열기',saveFree:'♡ 기본 코스 저장',planTitle:'오시미치 프리미엄 이용권',planIntro:'실제 결제 없이 기능을 확인하는 시연 화면입니다. 금액은 미정이며 이용권은 판매되지 않습니다.',plan3:'3일 이용권',plan7:'7일 이용권',pricePending:'가격 미정 · 결제 불가',planDisclaimer:'※ 실제 결제·계정·서버 권한 확인 없음. 이 브라우저에서만 작동하는 시연용 프리미엄 체험입니다.',demoActivate:'시연용 프리미엄 체험 시작',planDetail:(days)=>`이용권: ${days}일권 (시연)<br>기간: ${days}일 (시연용 로컬 기록)<br>금액: <b>미정 · 결제 불가</b><br>이용 기능: 위치 기반 추천·맞춤 코스·자동 재구성·그룹 통합·코스 저장<br>자동 갱신: <b>없음</b>`,needActivation:'프리미엄 체험을 먼저 시작해 주세요. 실제 결제는 진행되지 않습니다.',activeDemo:'시연용 프리미엄이 활성화되었습니다. 실제 유료 이용권이 아닙니다.',needOrigin:'출발 지역을 선택하거나 GPS 위치를 확인해 주세요.',gpsDenied:'현재 위치를 가져오지 못했어요. HTTPS 환경에서 권한을 확인하거나 지역을 직접 선택해 주세요.',gpsOk:'GPS 현재 위치가 확인됐어요.',nearbyPrefix:'현재 위치 기준 가까운 성지 (직선거리 기준)',needGroup:'아이돌 그룹을 1개 이상 선택해 주세요.',needSaved:'선택한 그룹에 즐겨찾기한 장소가 없어요. 「즐겨찾기한 장소만 추천」을 해제하거나 장소를 저장해 주세요.',noCandidates:'현재 조건에서 방문 가능한 장소가 없어요. 시간이나 출발지를 바꿔 주세요.',building:'조건을 반영하여 코스를 구성하고 있어요…',resultTitle:'맞춤 추천 코스',savings:'일일이 방문 순서를 비교하지 않고 자동으로 구성했어요.',estimate:'※ 장소 좌표의 직선거리와 임시 이동 여유를 이용한 계획용 예상 시간입니다. 실제 도로·지하철 경로, 환승과 실시간 이동시간이 아닙니다.',leg:'이동 여유(추정)',stay:'예상 체류',fromStart:'출발지에서',directions:'실제 길찾기 열기',exclude:'이 장소 제외',saved:'이 브라우저에 코스를 저장했어요.',saveFailed:'코스를 먼저 생성해 주세요.',emptySaved:'저장된 코스가 없습니다.',load:'불러오기',remove:'삭제',savedName:'저장한 코스',freeDone:'FREE 기본 코스',removed:'장소를 제외했어요. 변경된 조건으로 재구성해 주세요.',allPlaces:'선택 그룹의 전체 장소를 추천 후보로 사용합니다.',demoBadge:'✦ 시연용 PREMIUM',freeLimitNotice:'기본 코스는 무제한 무료이며, 자동 추천은 2회 무료 체험할 수 있습니다.'},
 ja:{freeTag:'自分で旅を計画',premiumTag:'推し道が旅をプランニング',freeTitle:'自分で作る聖地巡礼',freeDesc:'場所選びから訪問順まで自分で決める。手動の基本コース作成は何度でも無料です。',premiumTitle:'面倒な旅のプランニングは推し道に',premiumDesc:'グループ・時間・出発地を入力するだけで順番と予定をまとめてご提案。',trial:n=>`手動コース作成は無制限 · PREMIUM自動提案の無料体験 残り${n}/2回`,noTrials:'自動コース提案の無料体験2回を使い切りました。PREMIUMデモを有効にすると続けられます。手動コース作成は引き続き無料です。',plans:'パス・機能比較',autoTitle:'聖地巡礼プランを自動提案',autoIntro:'場所選び・順番決め・予定計算の手間を減らせます。リアルタイム交通情報ではありません。',artistLegend:'訪問したいグループ（複数選択可）',origin:'出発地点',timeBudget:'旅行可能時間',startTime:'開始時間',travelDate:'旅行日',travelMode:'移動方法',savedOnly:'お気に入りの場所だけを候補にする',autoButton:'✦ おまかせコースを作る',nearbyButton:'現在地の近くを探す',rebuildButton:'条件を変えて再構成',savePremium:'✧ プレミアムコースを保存',savedCourses:'保存したコースを見る',saveFree:'♡ 基本コースを保存',planTitle:'推し道 プレミアムパス',planIntro:'決済を行わず機能を体験できるデモ画面です。価格は未定で販売していません。',plan3:'3日間パス',plan7:'7日間パス',pricePending:'価格未定・決済不可',planDisclaimer:'※ 実際の決済・会員認証・サーバーによる利用権管理はありません。このブラウザーのみの体験版です。',demoActivate:'デモ用PREMIUMを体験する',planDetail:(days)=>`パス: ${days}日間（デモ）<br>期間: ${days}日（端末内のデモ記録）<br>金額: <b>未定・決済不可</b><br>機能: 現在地検索・自動旅程・組み替え・複数グループ・保存<br>自動更新: <b>なし</b>`,needActivation:'まずプレミアムデモを開始してください。決済は発生しません。',activeDemo:'デモ版プレミアムを有効にしました。有料パスではありません。',needOrigin:'出発地域を選択するかGPS位置を取得してください。',gpsDenied:'位置を取得できませんでした。HTTPSで位置許可を確認するかエリアを選択してください。',gpsOk:'GPS位置を取得しました。',nearbyPrefix:'現在地に近い聖地（直線距離順）',needGroup:'グループを1つ以上選択してください。',needSaved:'選んだグループのお気に入りがありません。制限を解除するか保存してください。',noCandidates:'この条件では訪問可能な場所がありません。時間や出発地を変更してください。',building:'条件に合わせてコースを作成しています…',resultTitle:'おすすめコース',savings:'訪問順を一つずつ比較せずに自動作成しました。',estimate:'※ 座標の直線距離と仮の移動余裕に基づく計画用の概算です。実際の道路・地下鉄・乗換・リアルタイム所要時間ではありません。',leg:'移動余裕（概算）',stay:'滞在目安',fromStart:'出発地から',directions:'実際の経路を開く',exclude:'この場所を除外',saved:'このブラウザーにコースを保存しました。',saveFailed:'先にコースを作成してください。',emptySaved:'保存したコースはありません。',load:'開く',remove:'削除',savedName:'保存したコース',freeDone:'FREE基本コース',removed:'場所を除外しました。新しい条件で再構成できます。',allPlaces:'選択したグループのすべてのスポットを候補にします。',demoBadge:'✦ PREMIUMデモ',freeLimitNotice:'手動コース作成は何度でも無料で、自動提案は2回まで無料体験できます。'}};
const T=()=>dict[ko()?'ko':'ja'];
const AREA={hongdae:[37.557,126.923],myeongdong:[37.5636,126.9837],gangnam:[37.4979,127.0276],seongsu:[37.5445,127.0557],jamsil:[37.5133,127.1002]};
const store=(k,val)=>{try{localStorage.setItem(k,JSON.stringify(val))}catch(e){}};
const get=(k,fallback)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??fallback}catch(e){return fallback}};
// New counter applies ONLY to automated PREMIUM recommendations; legacy manual counts are ignored.
let left=Math.max(0,2-Number(get('oshi-premium-auto-trials-v1',0)||0));
let mode='free',plan=3,premiumResult=null,excluded=new Set(),savedOpen=false,savedFreeOpen=false,processing=false;
const demoRecord=()=>get('oshi-premium-demo-v1',null);
const activeDemo=()=>{const d=demoRecord();return !!d && Number.isFinite(d.expiry)&&d.expiry>Date.now()};
const areaLabel=(value)=>({hongdae:ko()?'홍대':'弘大',myeongdong:ko()?'명동':'明洞',gangnam:ko()?'강남':'江南',seongsu:ko()?'성수':'聖水',jamsil:ko()?'잠실':'蚕室',current:ko()?'현재 위치 (GPS)':'現在地 (GPS)'})[value]||value;
function localized(){document.querySelectorAll('[data-o]').forEach(node=>{const key=node.dataset.o;if(typeof T()[key]==='string')node.textContent=T()[key]});
 el('oshiPlansTitle').textContent=T().planTitle;document.querySelectorAll('[data-plan]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.plan)===plan)));
 el('oshiPlanDetail').innerHTML=T().planDetail(plan);const s=el('oshiPremiumOrigin'),old=s.value;
 Array.from(s.options).forEach(o=>o.textContent=areaLabel(o.value));s.value=old;
 const dur=el('oshiPremiumDuration');for(const o of dur.options){o.textContent=ko()?`${Number(o.value)/60}시간`:`${Number(o.value)/60}時間`};
 el('oshiPremiumTransport').options[0].textContent=ko()?'도보':'徒歩';el('oshiPremiumTransport').options[1].textContent=ko()?'대중교통':'公共交通';
 el('oshiPremiumTime').lang=ko()?'ko':'ja';el('oshiPremiumDate').lang=ko()?'ko':'ja';
 el('oshiTrialCount').textContent=activeDemo()?T().demoBadge:T().trial(left);
 el('oshiTierTitle').textContent=mode==='free'?T().freeTitle:T().premiumTitle;el('oshiTierDescription').textContent=mode==='free'?T().freeDesc:T().premiumDesc;
 el('oshiFreeTab').setAttribute('aria-pressed',String(mode==='free'));el('oshiPremiumTab').setAttribute('aria-pressed',String(mode==='premium'));
 el('course').classList.toggle('oshi-premium-mode',mode==='premium');
 buildGroupChips();if(premiumResult)paintPremium();if(savedOpen)paintSaved('premium');if(savedFreeOpen)paintSaved('free');}
const groups=['TWICE','Stray Kids','IVE','SEVENTEEN'];
let chosenGroups=new Set((typeof selectedGroup!=='undefined'&&groups.includes(selectedGroup))?[selectedGroup]:['TWICE']);
function buildGroupChips(){const wrap=el('oshiPremiumArtists');wrap.replaceChildren();for(const name of groups){const label=document.createElement('label'),cb=document.createElement('input');cb.type='checkbox';cb.value=name;cb.checked=chosenGroups.has(name);cb.addEventListener('change',()=>cb.checked?chosenGroups.add(name):chosenGroups.delete(name));label.append(cb,document.createTextNode(name));wrap.append(label)}}
function switchMode(m){mode=m;localized();}
function openModal(){el('oshiPlansModal').setAttribute('aria-hidden','false');el('oshiPlansClose').focus()}
function closeModal(){el('oshiPlansModal').setAttribute('aria-hidden','true');el('oshiViewPlans').focus()}
function geo(){const sel=el('oshiPremiumOrigin').value;if(sel==='current'){
 if(typeof userPosition!=='undefined'&&userPosition&&Number.isFinite(userPosition.lat)&&Number.isFinite(userPosition.lng))return {...userPosition};
 return null;}const a=AREA[sel];return a?{lat:a[0],lng:a[1]}:null}
function dist(a,b){const r=x=>x*Math.PI/180,dLat=r(b.lat-a.lat),dLng=r(b.lng-a.lng);const h=Math.sin(dLat/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLng/2)**2;return 12742*Math.asin(Math.min(1,Math.sqrt(h)))}
const placeName=p=>ko()?(p.ko||p.nameKo||p.ja||p.nameJa||p.id):(p.ja||p.nameJa||p.ko||p.nameKo||p.id);
const placeGroup=p=>p.group||p.groups?.[0]||'';
const valid=p=>Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lng))&&Number(p.lat)>32&&Number(p.lat)<40;
const travelMinutes=(km,mode)=>Math.max(2,Math.ceil(km/(mode==='walk'?3.5:9)*60));
const clock=minutes=>String(Math.floor(minutes/60)%24).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
const directions=(a,b,mode)=>'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin:`${a.lat},${a.lng}`,destination:`${b.lat},${b.lng}`,travelmode:mode==='walk'?'walking':'transit'}).toString();
function hint(msg){el('oshiPremiumHint').textContent=msg}
function canPremium(){if(activeDemo())return true;hint(T().needActivation);openModal();return false}
function calculate(){const origin=geo();if(!origin){hint(T().needOrigin);return null}if(!chosenGroups.size){hint(T().needGroup);return null}
 const only=el('oshiSavedOnly').checked,groupsSet=chosenGroups;
 let pool=demoPlaces.filter(p=>groupsSet.has(placeGroup(p))&&valid(p)&&!excluded.has(p.id)&&(!only||favorites.includes(p.id)));
 if(!pool.length){hint(only?T().needSaved:T().noCandidates);return null}
 const budget=Number(el('oshiPremiumDuration').value)||480,mode=el('oshiPremiumTransport').value,hhmm=el('oshiPremiumTime').value||'10:00';let [h,m]=hhmm.split(':').map(Number),time=h*60+m,used=0,pos=origin;
 const rows=[];while(pool.length&&rows.length<12){
  // Greedy closest feasible next venue. An estimate, NOT a network route.
  const sorted=pool.map(p=>({p,km:dist(pos,p),stay:Number(p.visitMinutes)>0?Number(p.visitMinutes):35})).sort((a,b)=>a.km-b.km);
  let pick=sorted.find(x=>{const buffer=travelMinutes(x.km,mode);return used+buffer+x.stay<=budget});
  if(!pick)break;
  const leg=travelMinutes(pick.km,mode),arrival=time+leg;
  rows.push({id:pick.p.id,arrival:clock(arrival),stay:pick.stay,leg,km:pick.km,from:{...pos}});
  used+=leg+pick.stay;time=arrival+pick.stay;pos={lat:Number(pick.p.lat),lng:Number(pick.p.lng)};pool=pool.filter(p=>p.id!==pick.p.id);
 }
 if(!rows.length){hint(T().noCandidates);return null}
 return {rows,used,budget,mode,origin,groups:[...chosenGroups],time:hhmm,duration:el('oshiPremiumDuration').value,originChoice:el('oshiPremiumOrigin').value,savedOnly:only,excluded:[...excluded],date:el('oshiPremiumDate').value};}
function paintPremium(){const wrap=el('oshiAutoResult');wrap.replaceChildren();if(!premiumResult)return;
 const title=document.createElement('h3');title.style.cssText='font-size:17px;margin:19px 0 8px;color:#694457';title.textContent=`${T().resultTitle} · ${premiumResult.rows.length}`;wrap.append(title);
 const tip=document.createElement('div');tip.className='oshi-premium-status';tip.textContent=`${T().savings} · ${T().leg}: ${premiumResult.rows.reduce((n,r)=>n+r.leg,0)}${ko()?'분':'分'} · ${T().stay}: ${premiumResult.rows.reduce((n,r)=>n+r.stay,0)}${ko()?'분':'分'}`;wrap.append(tip);
 const note=document.createElement('p');note.className='oshi-premium-hint';note.textContent=T().estimate;wrap.append(note);
 const list=document.createElement('div');list.className='oshi-itinerary';premiumResult.rows.forEach((r,i)=>{const p=demoPlaces.find(p=>p.id===r.id);if(!p)return;
 const leg=document.createElement('div');leg.className='oshi-itinerary-leg';let txt=document.createElement('span');txt.textContent=`${i?placeName(demoPlaces.find(x=>x.id===premiumResult.rows[i-1].id)||p):T().fromStart} → ${placeName(p)} · ${r.km.toFixed(1)}km · ${T().leg} ${r.leg}${ko()?'분':'分'}`;
 const link=document.createElement('a');link.href=directions(r.from,p,premiumResult.mode);link.target='_blank';link.rel='noopener noreferrer';link.textContent=T().directions;leg.append(txt,link);list.append(leg);
 const card=document.createElement('div');card.className='oshi-itinerary-item';card.style.animationDelay=`${Math.min(i*35,250)}ms`;
 const row=document.createElement('div');row.className='oshi-itinerary-row';const no=document.createElement('span');no.className='oshi-itinerary-num';no.textContent=String(i+1).padStart(2,'0');const body=document.createElement('div');body.className='oshi-itinerary-title';const name=document.createElement('b');name.textContent=placeName(p);const detail=document.createElement('small');detail.textContent=`${p.group||''} · ${r.arrival} · ${T().stay} ${r.stay}${ko()?'분':'分'}`;body.append(name,detail);
 const rm=document.createElement('button');rm.type='button';rm.className='oshi-mini-btn';rm.textContent=T().exclude;rm.addEventListener('click',()=>{excluded.add(p.id);hint(T().removed);const x=calculate();premiumResult=x;if(x)paintPremium();else wrap.replaceChildren()});row.append(no,body,rm);card.append(row);list.append(card);
 });wrap.append(list);
 const confirm=document.createElement('div');confirm.className='oshi-premium-confirm';
 const heading=document.createElement('h4');heading.textContent=ko()?'✦ 방문 순서 확정하기':'✦ 訪問順を確定';
 const explanation=document.createElement('p');explanation.textContent=ko()?'추천된 방문 순서를 확정하면 STEP 06에 저장되어 언제든 다시 볼 수 있어요.':'おすすめ順を確定するとSTEP 06に保存され、いつでも見返せます。';
 const progress=document.createElement('div');progress.className='oshi-premium-confirm-progress';progress.hidden=true;
 const track=document.createElement('div');track.className='oshi-progress-track';track.setAttribute('role','progressbar');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow','0');
 const fill=document.createElement('div');fill.className='oshi-progress-fill';track.append(fill);
 const percentage=document.createElement('div');percentage.className='oshi-progress-number';percentage.textContent='0%';progress.append(track,percentage);
 const button=document.createElement('button');button.type='button';button.className='oshi-premium-confirm-button';button.textContent=ko()?'방문 순서 확정하고 STEP 06으로 →':'訪問順を確定して STEP 06へ →';
 button.addEventListener('click',()=>{
  if(button.disabled||!premiumResult?.rows?.length)return;
  const current=premiumResult;
  const stops=current.rows.map(row=>{
   const p=demoPlaces.find(v=>v.id===row.id);
   if(!p)return null;
   return {id:p.id,ko:p.ko||p.nameKo||p.ja||'',ja:p.ja||p.nameJa||p.ko||'',address:p.address||'',lat:Number(p.lat),lng:Number(p.lng),arrival:row.arrival,stay:row.stay,buffer:row.leg,group:p.group||''};
  }).filter(Boolean);
  if(!stops.length)return;
  const selectedOrigin=el('oshiPremiumOrigin');
  const payload={type:'premium',date:current.date||'',time:current.time||'',mode:current.mode||'walk',origin:selectedOrigin?.selectedOptions?.[0]?.textContent||'',groups:current.groups||[],stops};
  button.disabled=true;progress.hidden=false;fill.style.width='0%';percentage.textContent='0%';track.setAttribute('aria-valuenow','0');
  const begin=performance.now();const duration=1150;
  function animate(now){const ratio=Math.min(1,(now-begin)/duration);const pct=Math.round((1-(1-ratio)**3)*100);fill.style.width=pct+'%';percentage.textContent=pct+'%';track.setAttribute('aria-valuenow',String(pct));
   if(ratio<1){requestAnimationFrame(animate);return;}
   const ok=window.OSHI_STEP06_CONFIRM_PREMIUM?.(payload);
   if(!ok){button.disabled=false;progress.hidden=true;alert(ko()?'저장할 수 없어요. 브라우저 저장 설정을 확인해 주세요.':'保存できませんでした。ブラウザの保存設定をご確認ください。');}
  }
  requestAnimationFrame(animate);
 });
 confirm.append(heading,explanation,progress,button);wrap.append(confirm);
}
function generate(){
 // First two successful automatic recommendations are free; invalid inputs never consume a trial.
 if(!activeDemo()&&left<=0){hint(T().noTrials);openModal();return}
 const origin=geo();if(!origin){hint(T().needOrigin);return}if(processing)return;processing=true;
 el('oshiAutoBuild').disabled=true;hint(T().building);setTimeout(()=>{
  premiumResult=calculate();processing=false;el('oshiAutoBuild').disabled=false;
  if(premiumResult){
   if(!activeDemo()){left--;store('oshi-premium-auto-trials-v1',2-left);localized()}
   hint(T().estimate);paintPremium();
  }
 },240)}
function nearby(){if(!canPremium())return;function display(){const start=geo();if(!start){hint(T().needOrigin);return}const around=demoPlaces.filter(p=>valid(p)&&chosenGroups.has(placeGroup(p))).map(p=>({p,km:dist(start,p)})).sort((a,b)=>a.km-b.km).slice(0,5);
 hint(T().nearbyPrefix+': '+around.map(x=>`${placeName(x.p)} ${x.km.toFixed(1)}km`).join(' · '));}
 if(el('oshiPremiumOrigin').value==='current'&&!geo()&&navigator.geolocation&&window.isSecureContext){navigator.geolocation.getCurrentPosition(pos=>{userPosition={lat:pos.coords.latitude,lng:pos.coords.longitude};display()},()=>hint(T().gpsDenied),{enableHighAccuracy:true,timeout:12000});return}display()}
function currentSaved(type){const a=get('oshi-course-saved-v2',[]);return Array.isArray(a)?a.filter(v=>v&&v.type===type):[]}
function saveEntry(type){let value;if(type==='premium'){if(!premiumResult){hint(T().saveFailed);return}value={type,plan,rows:premiumResult.rows.map(r=>r.id),options:{groups:premiumResult.groups,origin:premiumResult.originChoice,time:premiumResult.time,date:premiumResult.date,duration:premiumResult.duration,mode:premiumResult.mode,savedOnly:premiumResult.savedOnly,excluded:[...excluded]}}}
 else{const ids=typeof route!=='undefined'&&Array.isArray(route)&&route.length?[...route]:[...courseChosen].filter(id=>favorites.includes(id));if(!ids.length){alert(T().saveFailed);return}value={type,rows:ids,options:{origin:el('originSelect').value,time:el('travelTime').value,duration:el('durationSelect').value,mode:el('travelMode').value,date:el('travelDate').value}}}
 value.id='o'+Date.now()+'_'+Math.random().toString(36).slice(2,6);value.savedAt=Date.now();const items=get('oshi-course-saved-v2',[]);items.unshift(value);store('oshi-course-saved-v2',items.slice(0,30));if(type==='premium'){hint(T().saved);savedOpen=true}else{savedFreeOpen=true;alert(T().saved)}paintSaved(type)}
function paintSaved(type){const list=el(type==='premium'?'oshiSavedList':'oshiFreeSavedList');list.replaceChildren();const entries=currentSaved(type);if(!entries.length){const empty=document.createElement('p');empty.className='oshi-premium-hint';empty.textContent=T().emptySaved;list.append(empty);return}for(const item of entries){const row=document.createElement('div');row.className='oshi-saved-row';const label=document.createElement('div');const name=document.createElement('b');name.style.fontSize='12px';name.textContent=`${type==='premium'?'PREMIUM · DEMO':T().freeDone} · ${item.rows.length}`;const time=document.createElement('small');time.textContent=new Date(item.savedAt).toLocaleString(ko()?'ko-KR':'ja-JP');label.append(name,time);
 const open=document.createElement('button');open.className='oshi-mini-btn';open.textContent=T().load;open.onclick=()=>loadSaved(item);
 const del=document.createElement('button');del.className='oshi-mini-btn';del.textContent=T().remove;del.onclick=()=>{store('oshi-course-saved-v2',get('oshi-course-saved-v2',[]).filter(x=>x.id!==item.id));paintSaved(type)};
 row.append(label,open,del);list.append(row)}}
function loadSaved(item){if(item.type==='premium'){if(!canPremium())return;switchMode('premium');const x=item.options||{};chosenGroups=new Set(x.groups||['TWICE']);excluded=new Set(x.excluded||[]);el('oshiPremiumOrigin').value=x.origin||'hongdae';el('oshiPremiumTime').value=x.time||'10:00';el('oshiPremiumDate').value=x.date||'';el('oshiPremiumDuration').value=x.duration||'480';el('oshiPremiumTransport').value=x.mode||'walk';el('oshiSavedOnly').checked=!!x.savedOnly;localized();
 // Recreate up-to-date itinerary with stored order, without claiming times stay current.
 const origin=geo();if(!origin){hint(T().needOrigin);return}let used=0,pos=origin,minute=Number((x.time||'10:00').slice(0,2))*60+Number((x.time||'10:00').slice(3,5));const rows=[];for(const id of item.rows){const p=demoPlaces.find(v=>v.id===id);if(!p||!valid(p))continue;let km=dist(pos,p),leg=travelMinutes(km,x.mode||'walk'),stay=Number(p.visitMinutes)||35;minute+=leg;rows.push({id,arrival:clock(minute),stay,leg,km,from:{...pos}});minute+=stay;used+=leg+stay;pos={lat:p.lat,lng:p.lng}}
 premiumResult={rows,mode:x.mode||'walk',used,budget:Number(x.duration)||480,groups:[...chosenGroups],time:x.time||'10:00',duration:x.duration||'480',originChoice:x.origin||'hongdae',savedOnly:!!x.savedOnly,date:x.date||''};paintPremium();}
 else{switchMode('free');const o=item.options||{};for(const [id,v] of [['originSelect',o.origin],['travelTime',o.time],['durationSelect',o.duration],['travelMode',o.mode],['travelDate',o.date]])if(v&&el(id))el(id).value=v;
 // Make stored spots available without destroying the current favorites.
 for(const id of item.rows)if(!favorites.includes(id)&&demoPlaces.some(p=>p.id===id))favorites.push(id);if(typeof save==='function')save();courseChosen=new Set(item.rows.filter(id=>favorites.includes(id)));route=[...courseChosen];if(typeof renderCourseChoices==='function')renderCourseChoices();if(typeof window.OSHI_PAINT_COURSE==='function')window.OSHI_PAINT_COURSE();}
 el('course').scrollIntoView({behavior:'smooth',block:'start'});}
// FREE manual course creation is unlimited; leave the original createCourse handler untouched.
// Start in the mode the visitor last viewed; do not assign paid entitlement for a demo.
el('oshiFreeTab').onclick=()=>switchMode('free');el('oshiPremiumTab').onclick=()=>switchMode('premium');
el('oshiViewPlans').onclick=openModal;el('oshiPlansClose').onclick=closeModal;
el('oshiPlansModal').addEventListener('click',e=>{if(e.target===el('oshiPlansModal'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&el('oshiPlansModal').getAttribute('aria-hidden')==='false')closeModal()});
for(const btn of document.querySelectorAll('[data-plan]'))btn.onclick=()=>{plan=Number(btn.dataset.plan);localized()};
el('oshiStartDemo').onclick=()=>{store('oshi-premium-demo-v1',{days:plan,expiry:Date.now()+plan*86400000,kind:'demo-only'});closeModal();switchMode('premium');hint(T().activeDemo)};
el('oshiAutoBuild').onclick=generate;el('oshiRebuild').onclick=generate;el('oshiNearbyButton').onclick=nearby;
el('oshiSavePremium').onclick=()=>{if(canPremium())saveEntry('premium')};el('oshiSaveFree').onclick=()=>saveEntry('free');
el('oshiShowSaved').onclick=()=>{savedOpen=!savedOpen;el('oshiSavedList').replaceChildren();if(savedOpen)paintSaved('premium')};
el('oshiOpenFreeSaved').onclick=()=>{savedFreeOpen=!savedFreeOpen;el('oshiFreeSavedList').replaceChildren();if(savedFreeOpen)paintSaved('free')};
// Synchronize in-progress controls when opening the premium page; retain FREE's previous selections.
const origShow=typeof showPage==='function'?showPage:null;if(origShow)showPage=function(){const res=origShow.apply(this,arguments);if(arguments[0]==='course'){if(typeof selectedGroup!=='undefined'&&groups.includes(selectedGroup)&&!chosenGroups.size)chosenGroups.add(selectedGroup);localized()}return res};
el('langSwitch').addEventListener('click',()=>setTimeout(localized,0));
// External localizers may rerender; reapply labels after DOM translation, without disturbing state.
el('oshiPremiumDate').value=el('travelDate')?.value||new Date().toISOString().slice(0,10);localized();hint(T().estimate);
})();
