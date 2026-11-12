// Fichas sueltas (p/<id>.html): «Comprar» mete el producto en la cesta de la tienda y abre el pedido; fotos; contador de visitas
(function(){
  var id=document.body.getAttribute('data-id');if(!id)return;
  var CLAVE='carmolamp-cesta',STATS='https://carmolamp-stats.josugarciandia.workers.dev/hit';
  var b=document.getElementById('comprar');
  if(b)b.addEventListener('click',function(e){
    try{var c=JSON.parse(localStorage.getItem(CLAVE)||'{}')||{};if(!(c[id]>0))c[id]=1;localStorage.setItem(CLAVE,JSON.stringify(c));}
    catch(x){return;}                                    // sin almacenamiento: el enlace lleva a la ficha de la tienda
    e.preventDefault();location.href='../#/pedido';
  });
  var foto=document.getElementById('foto');
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-foto]');if(!t||!foto)return;
    foto.src=t.getAttribute('data-foto');
    [].forEach.call(document.querySelectorAll('[data-foto]'),function(x){x.setAttribute('aria-current',x===t?'true':'false');});
  });
  // contador: esta página es la entrada (con de dónde llega); lo mismo que hace la tienda en su primera vista
  if(!/^(www\.)?carmolamp\.com$/.test(location.hostname))return;
  var cuenta=function(d){try{navigator.sendBeacon(STATS,JSON.stringify(d));}catch(x){}};
  cuenta({t:'vista',p:'p/'+id,e:1,r:document.referrer});
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var u=a.getAttribute('href')||'';
    if(/wa\.me|api\.whatsapp/.test(u))cuenta({t:'wa',p:'p/'+id});else if(u.indexOf('tel:')===0)cuenta({t:'tel',p:'p/'+id});
  },true);
})();
