// Fichas sueltas (p/<id>.html): «Comprar» mete el producto en la cesta de la tienda y abre el pedido; fotos; contador de visitas
(function(){
  var id=document.body.getAttribute('data-id');if(!id)return;
  var CLAVE='carmolamp-cesta',STATS='https://carmolamp-stats.josugarciandia.workers.dev/hit';
  var real=/^(www\.)?carmolamp\.com$/.test(location.hostname);
  var cuenta=function(d){if(!real)return;try{navigator.sendBeacon(STATS,JSON.stringify(d));}catch(x){}};
  var b=document.getElementById('comprar');
  if(b)b.addEventListener('click',function(e){
    try{var c=JSON.parse(localStorage.getItem(CLAVE)||'{}')||{};if(!(c[id]>0))c[id]=1;localStorage.setItem(CLAVE,JSON.stringify(c));}
    catch(x){return;}                                    // sin almacenamiento: el enlace lleva a la ficha de la tienda
    e.preventDefault();cuenta({t:'cesta',p:'p/'+id});cuenta({t:'tramitar',p:'p/'+id});location.href='../#/pedido';
  });
  var foto=document.getElementById('foto');
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-foto]');if(!t||!foto)return;
    foto.src=t.getAttribute('data-foto');
    [].forEach.call(document.querySelectorAll('[data-foto]'),function(x){x.setAttribute('aria-current',x===t?'true':'false');});
  });
  // Black Friday (data/black-friday.json, el mismo que usan la tienda y el Worker de cobros): precio tachado, rebajado, cinta en
  // la foto y, en los muebles al 50 %, los portes por unidad. Fuera de sus fechas no cambia nada (en el PC se ve con ?bf=1).
  fetch('../data/black-friday.json').then(function(r){return r.ok?r.json():null;}).then(function(c){
    if(!c)return;
    var prueba=/[?&]bf=1\b/.test(location.search)&&/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    if(!prueba&&!(Date.now()>=Date.parse(c.ini)&&Date.now()<Date.parse(c.fin)))return;
    var ld=document.querySelector('script[type="application/ld+json"]'),precio=0;
    try{var j=JSON.parse(ld.textContent);precio=parseFloat((j.offers||{}).price);}catch(x){}
    var caja=document.querySelector('.precio');if(!(precio>0)||!caja)return;
    var mitad=c.mitad.ids.indexOf(id)>=0,d=mitad?c.mitad.dto:c.dto,b=c.base&&c.base[id]>0&&c.base[id]<precio?c.base[id]:precio;
    var f=function(n){return n.toLocaleString('es-ES',{style:'currency',currency:'EUR'});};
    caja.innerHTML='<s><span class="sr">Antes </span>'+f(b)+'</s> <strong>'+f(Math.round(b*(100-d))/100)+'</strong> <span>IVA incluido · Black Friday −'+d+' %</span>';
    var ft=document.querySelector('.foto');
    if(ft)ft.insertAdjacentHTML('beforeend','<span class="bf-sello" aria-hidden="true"><span class="bf-cinta">Black Friday</span><span class="bf-dto">−'+d+'%</span></span>');
    if(mitad){var pu=(c.mitad.portesId||{})[id]||c.mitad.portes;
      [].forEach.call(document.querySelectorAll('.vent li'),function(li){if(/^Envío a domicilio/.test(li.textContent))li.textContent='Envío a domicilio (península): '+f(pu)+' por unidad, precio especial del Black Friday';});}
  }).catch(function(){});
  // contador: esta página es la entrada (con de dónde llega); lo mismo que hace la tienda en su primera vista
  cuenta({t:'vista',p:'p/'+id,e:1,r:document.referrer});
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var u=a.getAttribute('href')||'';
    if(/wa\.me|api\.whatsapp/.test(u))cuenta({t:'wa',p:'p/'+id});else if(u.indexOf('tel:')===0)cuenta({t:'tel',p:'p/'+id});
  },true);
})();
