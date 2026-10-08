(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var brl=function(n){return "R$ "+Math.round(n).toLocaleString("pt-BR")};
var brlc=function(n){return "R$ "+n.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})};
var milh=function(n){return Math.round(n).toLocaleString("pt-BR")};

/* cursor em dois tons */
var cur=$("#cur"),dot=$("#dot"),tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty;
addEventListener("mousemove",function(e){tx=e.clientX;ty=e.clientY;dot.style.transform="translate3d("+tx+"px,"+ty+"px,0)";});
(function loop(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform="translate3d("+cx+"px,"+cy+"px,0)";requestAnimationFrame(loop)})();
addEventListener("mouseover",function(e){document.body.classList.toggle("hot",!!e.target.closest("button,a,label,input,[data-go],[data-lb],.hs,.jr li,.st,.oxr,.nq"));});

/* palco */
var stage=$("#stage");
function fit(){var s=Math.min(innerWidth/1600,innerHeight/900);if(!(s>0))s=1;stage.style.transform="scale("+s+")";}
addEventListener("resize",fit);fit();

var slides=$$(".slide"),N=slides.length,i=0,busy=false;
var TITLES=["Totens digitais Portinari","O desafio","Os três desenhos","As telas orçadas","Anatomia do totem","Rede e energia","Experiência touch","Investimento"];

function chrome(){
  var dark=slides[i].classList.contains("dark");
  ["#top","#bot","#grain",".hint"].forEach(function(s){var el=$(s);if(el)el.classList.toggle("inv",dark)});
  $("#prog").style.width=((i+1)/N*100)+"%";
  $("#count").innerHTML="<b>"+String(i+1).padStart(2,"0")+"</b> / "+N;
  $("#partlbl").innerHTML="<i>"+String(i).padStart(2,"0")+"</i> · "+(slides[i].getAttribute("data-part")||"");
  $$("#mlist button").forEach(function(b,k){b.classList.toggle("cur",k===i)});
  $("#hint").style.opacity=i===0?1:0;
}
function go(n){
  n=Math.max(0,Math.min(N-1,n)); if(n===i||busy) return; busy=true;
  var old=slides[i]; old.classList.remove("on"); old.classList.add("out");
  setTimeout(function(){old.classList.remove("out")},390);
  i=n; slides[i].classList.add("on"); chrome(); enter(slides[i]);
  if(history.replaceState) history.replaceState(null,"","#"+(i+1));
  setTimeout(function(){busy=false},390);
}
var ENTER={};
function enter(sec){
  $$("[data-cu]",sec).forEach(function(el){
    var end=+el.dataset.cu,t0=null,f=el.dataset.fmt;
    function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1100,1),e=1-Math.pow(1-p,3);
      el.textContent=milh(end*e); if(p<1) requestAnimationFrame(step);}
    el.textContent="0"; requestAnimationFrame(step);
  });
  var k=slides.indexOf(sec); if(ENTER[k]) ENTER[k](sec);
}
function seg(root,cb){ // grupo de botões exclusivos
  root.addEventListener("click",function(e){var b=e.target.closest("button");if(!b||!root.contains(b))return;
    $$("button",root).forEach(function(x){x.classList.toggle("sel",x===b)});cb(b);});
}

/* 03 desafio */
seg($("#dsSeg"),function(b){$("#dsCard").classList.toggle("real",b.dataset.k==="1")});

/* 04 desenhos */
var IMG={t1a:"__T1A__",t1b:"__T1B__",t2a:"__T2A__",t2b:"__T2B__",t3a:"__T3A__",t3b:"__T3B__"};
var DZ=[
 {a:"t1a",b:"t1b",big:'Tela esticada <em>43"</em>',rows:[["Altura","34 a 140 cm do chão"],["Uso","Só mídia"],["Tela","Fora do orçamento"]],read:"Pede uma tela que não está entre as quatro orçadas."},
 {a:"t2a",b:"t2b",big:'Tela <em>24"</em> vertical',rows:[["Altura","85 a 140 cm do chão"],["Uso","Touch"],["Tela","R$ 5.090,91"]],read:"Recebe a 24\" do orçamento, na altura certa do toque."},
 {a:"t3a",b:"t3b",big:'Tela <em>24"</em> vertical',rows:[["Altura","85 a 140 cm do chão"],["Uso","Touch, com folder"],["Tela","R$ 5.090,91"]],read:"Mesma tela da opção 2, com folder físico ao lado."}
];
function dz(k){var d=DZ[k],box=$(".dz-imgs");box.classList.add("sw");
  setTimeout(function(){$("#dzA").src=IMG[d.a];$("#dzB").src=IMG[d.b];box.classList.remove("sw")},220);
  $("#dzBig").innerHTML=d.big;
  $("#dzData").innerHTML=d.rows.map(function(r){return '<div><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>'}).join("");
  $("#dzRead").textContent=d.read;}
seg($("#dzSeg"),function(b){dz(+b.dataset.k)});dz(1);

/* 04 telas orçadas */
var TS=[
 {n:'21,5"',p:4000,w:29.7,h:50,ph:"__P24__",sp:["IPS Full HD","Touch 10 pontos","Android 15","4 GB · 64 GB","Webcam","Wi-Fi · Bluetooth 5.0","Bateria interna"]},
 {n:'24"',p:5090.91,w:32.8,h:55.5,ph:"__P24__",sp:["IPS Full HD","Touch 10 pontos","Android","4 GB · 64 GB","Webcam","USB-C · HDMI","Bateria 10.000 mAh"]}
];
function cabe(t){return t.w<=36?0:(t.w<=38?1:2)}
$("#tsList").innerHTML=TS.map(function(t,k){return '<button data-k="'+k+'"'+(k===1?' class="sel"':'')+'><b>'+t.n+'</b><span>'+brlc(t.p)+'</span></button>'}).join("");
function ts(k){var t=TS[k],S=3.2,fl=580,cx=150,pw=40,ptop=fl-160*S,f=cabe(t),need=Math.ceil(t.w+4);
  var sy=ptop+20*S,o='';
  o+='<rect class="sz-base" x="'+(cx-35*S)+'" y="'+(fl-20*S)+'" width="'+70*S+'" height="'+20*S+'"/>';
  o+='<rect class="sz-st" x="'+(cx-pw*S/2)+'" y="'+ptop+'" width="'+pw*S+'" height="'+140*S+'"/>';
  if(f===2)o+='<rect x="'+(cx-need*S/2)+'" y="'+ptop+'" width="'+need*S+'" height="'+140*S+'" fill="none" stroke="#D9442E" stroke-width="2" stroke-dasharray="6 5"/>';
  o+='<rect class="sz-scr'+(f===2?' no':'')+'" x="'+(cx-t.w*S/2)+'" y="'+sy+'" width="'+t.w*S+'" height="'+t.h*S+'"/>';
  o+='<text x="'+cx+'" y="'+(ptop+12*S)+'" text-anchor="middle" font-family="Space Grotesk" font-size="16" font-weight="500" fill="#2b2b2b">portinari</text>';
  o+='<text class="sz-t" x="'+cx+'" y="'+(ptop-10)+'" text-anchor="middle">chapa 40 cm</text>';
  o+='<line x1="0" y1="'+fl+'" x2="300" y2="'+fl+'" stroke="#050505" stroke-width="2"/>';
  $("#tsSvg").innerHTML=o;
  var v=$("#tsVer");v.classList.toggle("no",f===2);v.classList.toggle("ju",f===1);
  v.innerHTML=['<span class="disp">Cabe</span><p>Com folga na chapa de 40 cm.</p>','<span class="disp">Justo</span><p>Cabe, com 1,7 cm de cada lado.</p>','<span class="disp">Não cabe</span><p>Pede chapa de <b>'+need+' cm</b>.</p>'][f];
  $("#tsSp").innerHTML=t.sp.map(function(x){return "<span>"+x+"</span>"}).join("");
  $("#tsPh").src=t.ph;}
seg($("#tsList"),function(b){ts(+b.dataset.k)});ts(1);

/* 07 anatomia */
var AN=[
 {x:441,y:112,t:"Bateria",h:"Bateria interna",p:"A própria tela segue ligada quando cai a energia."},
 {x:179,y:150,t:"Tela touch",h:"Tela touch com Android",p:"Tela, toque e sistema num aparelho só. Sem player separado."},
 {x:490,y:170,t:"Caixa traseira",h:"Caixa de aço",p:"A chapa de 3 cm não esconde a tela. Precisa de 6 a 8 cm atrás."},
 {x:522,y:236,t:"Tampa",h:"Acesso por trás",p:"Tampa com chave. Troca sem desmontar a frente."},
 {x:490,y:380,t:"Cabos",h:"Cabo por dentro",p:"Só a energia desce até a base. Nada aparente."},
 {x:179,y:508,t:"Base",h:"Base técnica",p:"Fonte da tela ventilada, com porta e chave."},
 {x:586,y:520,t:"Um cabo",h:"Um cabo só",p:"Da base até a tomada. A conexão é por Wi-Fi."},
 {x:48,y:508,t:"Estabilidade",h:"Estabilidade",p:"1,60 m de altura sobre 20 cm de base.",w:"Tomba fácil. Pede contrapeso de aço ou fixação no piso."}
];
$("#anDots").innerHTML=AN.map(function(a,k){return '<g class="hs" data-k="'+k+'" transform="translate('+a.x+','+a.y+')"><circle class="pulse" r="13"/><circle r="13"/><text y="4">'+(k+1)+'</text></g>'}).join("");
$("#anList").innerHTML=AN.map(function(a,k){return '<button data-k="'+k+'"><b>'+(k+1)+'</b>'+a.t+'</button>'}).join("");
function an(k){var a=AN[k];$$(".hs").forEach(function(h){h.classList.toggle("sel",+h.dataset.k===k)});
  $$("#anList button").forEach(function(b){b.classList.toggle("sel",+b.dataset.k===k)});
  $("#anBox").innerHTML='<h3>'+a.h+'</h3><p>'+a.p+'</p>'+(a.w?'<p class="warn">'+a.w+'</p>':'');}
$("#anDots").addEventListener("click",function(e){var h=e.target.closest(".hs");if(h)an(+h.dataset.k)});
$$(".hs").forEach(function(h){h.addEventListener("mouseenter",function(){an(+h.dataset.k)})});
$("#anList").addEventListener("click",function(e){var b=e.target.closest("button");if(b)an(+b.dataset.k)});
an(1);

/* 09 rede e energia */
var NE=[
 {t:"Cai a internet",st:{lkN2:"cut",ndWifi:"err",ndCache:"ok",lkN3:"ok",ndTot:"ok"},s:{ndTotS:"tocando"},
  l:[["0 s","Cai o Wi-Fi da loja."],["sempre","Segue tocando: o conteúdo está salvo na tela."],["volta","Baixa sozinho as campanhas novas."]]},
 {t:"Cai a energia",st:{ndTom:"err",lkE1:"cut",lkE2:"cut",ndBat:"alt",lkE3:"alt",ndTot:"ok"},s:{ndTotS:"na bateria"},
  l:[["0 s","Cai a energia."],["horas","A bateria interna segura a tela."],["volta","Recarrega e segue, sem botão."]]},
 {t:"A tela trava",st:{ndTot:"err",ndCld:"alt",lkN1:"ok"},s:{ndTotS:"travada"},
  l:[["0 s","O sistema trava."],["minutos","A 75 LAB reinicia pelo painel."],["dias","Se não voltar, visita técnica."]]},
 {t:"A loja fecha",st:{ndTot:"dim",ndCache:"ok",lkN3:"ok"},s:{ndTotS:"em repouso"},
  l:[["22 h","Apaga no horário."],["madrugada","Baixa as campanhas do dia."],["8 h","Acende sozinha."]]}
];
var neT=[];
function ne(k){var n=NE[k];neT.forEach(clearTimeout);neT=[];
  $$("#neSvg .nd,#neSvg .ne-links path").forEach(function(el){el.classList.remove("err","alt","ok","dim","cut")});
  Object.keys(n.st).forEach(function(id){$("#"+id).classList.add(n.st[id])});
  Object.keys(n.s).forEach(function(id){$("#"+id).textContent=n.s[id]});
  $("#neTitle").textContent=n.t;var ol=$("#neLog");ol.innerHTML="";
  n.l.forEach(function(r,j){neT.push(setTimeout(function(){var li=document.createElement("li");if(j===n.l.length-1)li.className="end";
    li.innerHTML="<b>"+r[0]+"</b><span>"+r[1]+"</span>";ol.appendChild(li);},j*650));});
}
seg($("#neBtns"),function(b){ne(+b.dataset.k)});
ENTER[5]=function(){$$("#neBtns button").forEach(function(b){b.classList.remove("sel")});$("#neBtns button").classList.add("sel");ne(0)};

/* 14 protótipo touch */
var P_LOGO="__PORTINARI__",QR='__QR__';
var KX=[
 '<div class="ks k0" data-s="0"><div class="mrb"></div><div class="ov"><img src="'+P_LOGO+'" alt=""><p>Revestimentos que transformam espaços.</p><button class="tap" data-to="1">toque</button></div></div>',
 '<div class="ks k1" data-s="1"><div class="ks-hd"><img src="'+P_LOGO+'" alt=""><button data-to="0">sair</button></div><div class="ks-bd"><div class="hero mrb"><span>Coleção em destaque · Bruma</span></div><h5>O que você quer explorar?</h5><div class="g4"><button data-to="2">Coleções<small>linhas e acabamentos</small></button><button data-to="2">Produtos<small>todos os formatos</small></button><button data-to="2">Ambientes<small>sala, banho, área externa</small></button><button data-to="2">Inspirações<small>projetos reais</small></button></div><div class="srch">Buscar produto ou cor</div></div></div>',
 '<div class="ks k2" data-s="2"><div class="ks-hd"><img src="'+P_LOGO+'" alt=""><button data-to="1">início</button></div><div class="ks-bd"><div class="srch">Buscar produto ou cor</div><div class="chips"><span class="s">Todos</span><span>Mármores</span><span>Madeiras</span><span>Cimentícios</span><span>100 × 100</span></div><div class="grid"><button class="pd" data-to="3"><div class="mrb"></div>Bruma GR<small>100 × 100 cm</small></button><button class="pd" data-to="3"><div class="mrb"></div>Bruma SBE<small>100 × 100 cm</small></button><button class="pd" data-to="3"><div class="mrb dk"></div>Linha mármores<small>exemplo</small></button><button class="pd" data-to="3"><div class="mrb wd"></div>Linha madeirada<small>exemplo</small></button></div></div></div>',
 '<div class="ks k3" data-s="3"><div class="ks-hd"><img src="'+P_LOGO+'" alt=""><button data-to="2">voltar</button></div><div class="ks-bd"><div class="big mrb"></div><div class="row2"><div class="mrb"></div><div class="mrb cm"></div><div class="mrb wd"></div></div><h5>Bruma GR</h5><div class="spec"><div><span>Formato</span>100 × 100 cm</div><div><span>Acabamento</span>GR</div><div><span>Uso e espessura</span>da ficha técnica</div><div><span>Nesta loja</span>sob consulta</div></div><div class="two"><button class="cta alt" data-to="4">Levar no celular</button><button class="cta" data-to="5">Quero atendimento</button></div></div></div>',
 '<div class="ks k4" data-s="4"><div class="ks-hd"><img src="'+P_LOGO+'" alt=""><button data-to="3">voltar</button></div><div class="ks-bd"><h5>Sua seleção vai com você</h5><p class="sm">Aponte a câmera do celular. Os produtos que você viu ficam salvos.</p><div class="qr">'+QR+'</div><div class="sel3"><div class="mrb"></div><div class="mrb dk"></div><div class="mrb wd"></div></div><button class="cta" data-to="5">Quero ser atendido agora</button></div></div>',
 '<div class="ks k5" data-s="5"><div class="ks-hd"><img src="'+P_LOGO+'" alt=""><button data-to="3">voltar</button></div><div class="ks-bd"><h5>Um especialista fala com você</h5><div class="fm"><label>Nome<span class="in">Mariana</span></label><label>WhatsApp ou e-mail<span class="in">(11) 9 ••••-••••</span></label><label>Cidade<span class="in">Campinas</span></label><label>Interesse<span class="in">Bruma GR · sala e cozinha</span></label><button class="lgpd" id="kxL"><i></i><span>Autorizo a Portinari e esta loja a usarem meus dados só para retornar este contato. Posso pedir a exclusão a qualquer momento.</span></button></div><button class="cta" id="kxSend">Enviar</button></div></div>',
 '<div class="ks k6" data-s="6"><div class="ks-hd"><img src="'+P_LOGO+'" alt=""><button data-to="0">fim</button></div><div class="ks-bd"><div class="ok">✓</div><h5 style="text-align:center">Pronto, Mariana.</h5><p class="sm" style="text-align:center">Seu contato seguiu para:</p><div class="route"><div><i></i>Vendedor desta loja, com aviso no WhatsApp</div><div><i></i>Representante Portinari da região</div><div><i></i>CRM da Portinari, com o produto de interesse</div></div><button class="cta" data-to="1">Voltar ao início</button></div></div>'
];
var kx=$("#kx");kx.innerHTML=KX.join("");var kxS=0,kxT;
function kgo(s){kxS=s;$$(".ks",kx).forEach(function(el){el.classList.toggle("on",+el.dataset.s===s)});
  $$("#jr li").forEach(function(li){li.classList.toggle("sel",+li.dataset.s===s)});
  if(s===5){$("#kxL").classList.remove("ok")}
  clearTimeout(kxT);if(s===6)kxT=setTimeout(function(){if(kxS===6)kgo(0)},9000);}
kx.addEventListener("click",function(e){var b=e.target.closest("[data-to]");if(b){kgo(+b.dataset.to);return;}
  if(e.target.closest("#kxL")){$("#kxL").classList.toggle("ok");return;}
  if(e.target.closest("#kxSend")){if($("#kxL").classList.contains("ok"))kgo(6);else{var l=$("#kxL");l.style.outline="2px solid #D9442E";setTimeout(function(){l.style.outline=""},900);}}
});
$("#jr").addEventListener("click",function(e){var li=e.target.closest("li");if(li){kgo(+li.dataset.s);if(+li.dataset.s===6)$("#kxL").classList.add("ok");}});
kgo(0);ENTER[6]=function(){kgo(0)};

/* orçamento ORC-33766 v2 */
/* lightbox */
var lb=$("#lb");
document.addEventListener("click",function(e){var im=e.target.closest("img[data-lb]");if(im){$("img",lb).src=im.src;lb.classList.add("on");}});
lb.addEventListener("click",function(){lb.classList.remove("on")});

/* navegação */
document.addEventListener("click",function(e){var g=e.target.closest("[data-go]");if(g){go(+g.dataset.go);$("#menu").classList.remove("on");}});
$("#mlist").innerHTML=TITLES.map(function(t,k){return '<li><button data-go="'+k+'"><b>'+String(k+1).padStart(2,"0")+'</b><span>'+t+'</span><i>'+(slides[k].getAttribute("data-part")||"")+'</i></button></li>';}).join("");
$("#bMenu").addEventListener("click",function(){$("#menu").classList.add("on")});
$("#bClose").addEventListener("click",function(){$("#menu").classList.remove("on")});
$("#bPrint").addEventListener("click",function(){window.print()});
$("#prev").addEventListener("click",function(){go(i-1)});
$("#next").addEventListener("click",function(){go(i+1)});
addEventListener("keydown",function(e){
  if(e.target.tagName==="INPUT"&&e.target.type==="range"&&(e.key==="ArrowLeft"||e.key==="ArrowRight"))return;
  if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" "){e.preventDefault();go(i+1)}
  else if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();go(i-1)}
  else if(e.key==="Home"){go(0)}else if(e.key==="End"){go(N-1)}
  else if(e.key==="m"||e.key==="M"){$("#menu").classList.toggle("on")}
  else if(e.key==="Escape"){$("#menu").classList.remove("on");lb.classList.remove("on")}
});
var sx=0,sy=0;
addEventListener("touchstart",function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
addEventListener("touchend",function(e){if(e.target.closest("#kx,input,.cms,#szSvg"))return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
  if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)) go(dx<0?i+1:i-1);},{passive:true});

slides[0].classList.add("on");chrome();enter(slides[0]);
function porHash(){var h=parseInt(location.hash.slice(1),10);if(h>0&&h<=N&&h-1!==i)go(h-1);}
addEventListener("hashchange",porHash);
if(location.hash)porHash();
})();
