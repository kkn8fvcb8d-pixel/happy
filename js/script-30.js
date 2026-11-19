
(function(){
 const select=document.getElementById('originSelect');
 const cfg=document.querySelector('#course .course-config');
 if(!select||!cfg)return;
 const gpsOption=select.querySelector('option[value="current"]');
 const placeholder=select.querySelector('option[value=""]');
 const create=document.getElementById('createCourse');
 const languageButton=document.getElementById('langSwitch');
 const ko=()=>document.documentElement.lang==='ko';
 const phrase=(kr,jp)=>ko()?kr:jp;
 const hasGps=()=>window.OSHI_GPS_VERIFIED===true&&typeof userPosition!=='undefined'&&userPosition&&Number.isFinite(userPosition.lat)&&Number.isFinite(userPosition.lng);
 const status=document.createElement('div');status.className='oshi-origin-feedback';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const message=document.createElement('span');message.className='oshi-origin-message';
 const refresh=document.createElement('button');refresh.type='button';
 status.append(message,refresh);
 const settings=cfg.querySelector('.course-settings');
 (settings||cfg).insertAdjacentElement(settings?'afterend':'beforeend',status);
 let gpsError='';
 function update(){
  if(placeholder)placeholder.textContent=phrase('선택 지역','地域を選択');
  if(gpsOption)gpsOption.textContent=phrase('현재 위치 (GPS)','現在地 (GPS)');
  refresh.textContent=phrase('현재 위치 확인','現在地を取得');
  if(select.value==='current'){
   if(hasGps()){status.dataset.mode='gps';message.textContent=phrase('✓ GPS 위치 확인됨 · 실제 위치를 출발점으로 사용합니다.','✓ GPS取得済み · 実際の現在地を出発点として使用します。')}
   else{status.dataset.mode='warn';message.textContent=gpsError||phrase('GPS가 아직 확인되지 않았어요. 현재 위치 확인 버튼을 누르거나 지역을 직접 선택해 주세요.','GPS位置情報が未取得です。現在地を取得するか、地域を選択してください。')}
  }else if(select.value){status.dataset.mode='area';message.textContent=phrase('선택한 출발 지역: ','選択した出発地域：')+select.selectedOptions[0].textContent+phrase(' · 지역 대표 좌표 사용(GPS 아님)',' · 地域の代表地点を使用（GPSではありません）')}
  else{status.dataset.mode='area';message.textContent=phrase('출발 지역을 선택하거나, 「현재 위치 확인」으로 GPS를 사용할 수 있어요.','出発地域を選ぶか、「現在地を取得」でGPSを使用できます。')}
 }
 refresh.addEventListener('click',()=>{
  if(!window.isSecureContext){gpsError=phrase('GPS는 HTTPS 또는 localhost 환경에서만 사용할 수 있어요. 지역을 선택해 주세요.','GPSはHTTPSまたはlocalhostでのみ使えます。地域を選択してください。');status.dataset.mode='warn';message.textContent=gpsError;return}
  if(!navigator.geolocation){gpsError=phrase('이 브라우저에서는 GPS를 사용할 수 없어요.','このブラウザではGPSを使用できません。');status.dataset.mode='warn';message.textContent=gpsError;return}
  gpsError='';refresh.disabled=true;message.textContent=phrase('GPS 위치 권한을 확인하고 있어요…','GPS位置情報を取得中です…');
  navigator.geolocation.getCurrentPosition(position=>{
   userPosition={lat:position.coords.latitude,lng:position.coords.longitude};window.OSHI_GPS_VERIFIED=true;
   select.value='current';refresh.disabled=false;update();
   window.dispatchEvent(new Event('oshi-gps-updated'));
   select.dispatchEvent(new Event('change',{bubbles:true}));
  },error=>{
   refresh.disabled=false;gpsError=error.code===1?phrase('위치 권한이 거부됐어요. 브라우저 설정을 변경하거나 지역을 선택해 주세요.','位置情報が拒否されました。ブラウザ設定を変更するか地域を選択してください。'):phrase('위치를 확인할 수 없어요. 지역을 선택해 주세요.','位置を取得できませんでした。地域を選択してください。');
   status.dataset.mode='warn';message.textContent=gpsError;
  },{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
 });
 select.addEventListener('change',()=>{gpsError='';update()});
 window.addEventListener('oshi-gps-updated',()=>{if(hasGps()&&!select.value)select.value='current';update()});
 // When an existing course is created, do not secretly substitute city hall for a missing origin.
 if(create)create.addEventListener('click',event=>{
  if(!select.value||(select.value==='current'&&!hasGps())){
   event.preventDefault();event.stopImmediatePropagation();update();status.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
 },true);
 // Steps and language can change without any new GPS reading.
 if(typeof showPage==='function'){
  const old=showPage;
  showPage=function(){const result=old.apply(this,arguments);if(arguments[0]==='course'){if(hasGps()&&!select.value)select.value='current';update()}return result};
 }
 if(languageButton)languageButton.addEventListener('click',()=>queueMicrotask(update));
 update();
})();
