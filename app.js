(function(){
  var d=document, top=d.querySelector('.top');
  function sc(){ top.classList.toggle('sc', window.scrollY>8); }
  addEventListener('scroll', sc, {passive:true}); sc();
  // menu mobilne
  var bur=d.querySelector('.burger');
  bur.addEventListener('click', function(){
    var o=top.classList.toggle('open'); bur.setAttribute('aria-expanded', o?'true':'false');
  });
  d.querySelectorAll('.menu a').forEach(function(a){ a.addEventListener('click', function(){ top.classList.remove('open'); bur.setAttribute('aria-expanded','false'); }); });
  // aktywna pozycja menu
  var links={}; d.querySelectorAll('.menu a[href^="#"]').forEach(function(a){ links[a.getAttribute('href').slice(1)]=a; });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ for(var k in links) links[k].classList.toggle('on', k===e.target.id); } });
    }, {rootMargin:'-45% 0px -50% 0px'});
    Object.keys(links).forEach(function(id){ var s=d.getElementById(id); if(s) io.observe(s); });
  }
  // karuzele: palec natywnie, mysz przeciaganiem, strzalki, licznik
  d.querySelectorAll('.karuzela').forEach(function(k){
    var tor=k.querySelector('.tor'), prev=k.querySelector('.prev'), next=k.querySelector('.next'), lic=k.querySelector('.licznik');
    var n=tor.children.length;
    function krok(){ var c=tor.children[0]; return c.getBoundingClientRect().width + parseFloat(getComputedStyle(tor).columnGap||0); }
    function stan(){
      var max=tor.scrollWidth-tor.clientWidth-2;
      prev.disabled = tor.scrollLeft<=2;
      next.disabled = tor.scrollLeft>=max;
      var i=Math.round(tor.scrollLeft/krok());
      if(tor.scrollLeft>=max) i=n-1;
      if(lic) lic.textContent=(Math.min(i,n-1)+1)+' / '+n;
    }
    prev.addEventListener('click', function(){ tor.scrollBy({left:-krok(), behavior:'smooth'}); });
    next.addEventListener('click', function(){ tor.scrollBy({left:krok(), behavior:'smooth'}); });
    tor.addEventListener('scroll', stan, {passive:true}); addEventListener('resize', stan); stan();
    var dn=false, x0=0, s0=0, ruch=false;
    tor.addEventListener('pointerdown', function(e){ if(e.pointerType!=='mouse') return; dn=true; ruch=false; x0=e.clientX; s0=tor.scrollLeft; });
    addEventListener('pointermove', function(e){ if(!dn) return; var dx=e.clientX-x0; if(Math.abs(dx)>5){ ruch=true; tor.classList.add('ciag'); } tor.scrollLeft=s0-dx; });
    addEventListener('pointerup', function(){ if(!dn) return; dn=false; tor.classList.remove('ciag'); });
    tor.addEventListener('click', function(e){ if(ruch){ e.preventDefault(); e.stopPropagation(); ruch=false; } }, true);
    tor.addEventListener('dragstart', function(e){ e.preventDefault(); });
  });
  // formularz pokazowy
  var f=d.querySelector('.form');
  f.addEventListener('submit', function(e){ e.preventDefault(); f.querySelector('.form-info').hidden=false; });
})();
