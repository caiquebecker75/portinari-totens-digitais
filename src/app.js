(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var brl=function(n){return "R$ "+Math.round(n).toLocaleString("pt-BR")};
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
var TITLES=["18 mil horas por mês","Totens digitais Portinari","Roteiro","Leitura do desafio","Os três desenhos",
 "Simulador de tamanho","Opções de tela","Anatomia do totem","Tecnologia embarcada","Rede e energia","Recursos complementares",
 "Manutenção e suporte","Gestão remota de mídia","Mercado ou desenvolvimento próprio","Experiência touch","Painel de dados e LGPD",
 "Comparativo de cenários","Estimativa de investimento","Locação","Recomendação","Cronograma","Próximos passos","Fecho e contato"];

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

/* 00 abertura: 50 totens acendendo, alguns apagados */
var opGrid=$("#opGrid"),opT=[];
opGrid.innerHTML=new Array(51).join("<i></i>");
ENTER[0]=function(){
  opT.forEach(clearTimeout);opT=[];
  var cells=$$("i",opGrid);cells.forEach(function(c){c.className=""});
  cells.forEach(function(c,k){opT.push(setTimeout(function(){c.classList.add("lit")},300+k*28));});
  opT.push(setTimeout(function blink(){
    var dead=[7,23,38,44];
    dead.forEach(function(d,j){opT.push(setTimeout(function(){cells[d].classList.remove("lit");cells[d].classList.add("dead")},j*420));});
    opT.push(setTimeout(function(){dead.forEach(function(d){cells[d].classList.remove("dead");cells[d].classList.add("lit")});opT.push(setTimeout(blink,1400));},3400));
  },2200));
};

/* 03 desafio */
seg($("#dsSeg"),function(b){$("#dsCard").classList.toggle("real",b.dataset.k==="1")});

/* 04 desenhos */
var IMG={t1a:"__T1A__",t1b:"__T1B__",t2a:"__T2A__",t2b:"__T2B__",t3a:"__T3A__",t3b:"__T3B__"};
var DZ=[
 {a:"t1a",b:"t1b",big:'Tela esticada <em>43"</em>',rows:[["Altura","34 a 140 cm do chão"],["Uso","Só mídia"],["Tela","R$ 8.000 a 12.000"]],read:"O mais impactante e o mais caro. Não serve para touch."},
 {a:"t2a",b:"t2b",big:'Tela <em>24"</em> vertical',rows:[["Altura","87 a 140 cm do chão"],["Uso","Mídia ou touch"],["Tela","R$ 1.500 a 2.900"]],read:"A base mais segura para os três cenários."},
 {a:"t3a",b:"t3b",big:'Tela <em>24"</em> vertical',rows:[["Altura","87 a 140 cm do chão"],["Uso","Mídia ou touch, com folder"],["Tela","R$ 1.500 a 2.900"]],read:"Mesma tela da opção 2, com folder físico ao lado."}
];
function dz(k){var d=DZ[k],box=$(".dz-imgs");box.classList.add("sw");
  setTimeout(function(){$("#dzA").src=IMG[d.a];$("#dzB").src=IMG[d.b];box.classList.remove("sw")},220);
  $("#dzBig").innerHTML=d.big;
  $("#dzData").innerHTML=d.rows.map(function(r){return '<div><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>'}).join("");
  $("#dzRead").textContent=d.read;}
seg($("#dzSeg"),function(b){dz(+b.dataset.k)});dz(1);

/* 05 simulador de tamanho */
var PR={24:["R$ 1.500 a 2.900","R$ 3.800 a 5.800"],27:["R$ 2.000 a 3.400","R$ 4.500 a 6.500"],32:["R$ 2.500 a 3.800","R$ 5.500 a 8.000"],
        43:["R$ 3.500 a 5.500","R$ 7.500 a 11.000"],50:["R$ 4.500 a 6.500","R$ 9.500 a 14.000"],55:["R$ 5.000 a 7.500","R$ 11.000 a 16.000"]};
var szIn=24,szOri="v";
function f1(n){return (Math.round(n*10)/10).toLocaleString("pt-BR")}
function sz(){
  var S=3.4,fl=580,cxm=210,d=szIn*2.54,L=d*0.8716,A=d*0.4903;
  var iw=szOri==="v"?A:L, ih=szOri==="v"?L:A, mw=iw+2, mh=ih+2;
  var need=Math.ceil(mw+4), okW=mw<=36, okH=mh<=124, ok=okW&&okH;
  var pw=40, ptop=fl-160*S, top=20; if(mh>140-20-8) top=8;
  var sx=cxm-mw*S/2, sy=ptop+top*S, bot=160-top-mh;
  var o='';
  o+='<rect class="sz-base" x="'+(cxm-35*S)+'" y="'+(fl-20*S)+'" width="'+70*S+'" height="'+20*S+'"/>';
  o+='<path class="sz-hn" d="M'+(cxm+pw*S/2)+' '+(ptop+60*S)+' h'+(9*S)+' a'+(4*S)+' '+(4*S)+' 0 0 1 '+(4*S)+' '+(4*S)+' V'+(fl-20*S)+' H'+(cxm+pw*S/2)+'z"/>';
  o+='<rect class="sz-st" x="'+(cxm-pw*S/2)+'" y="'+ptop+'" width="'+pw*S+'" height="'+140*S+'"/>';
  if(!okW) o+='<rect x="'+(cxm-need*S/2)+'" y="'+ptop+'" width="'+need*S+'" height="'+140*S+'" fill="none" stroke="#D9442E" stroke-width="2" stroke-dasharray="6 5"/>';
  o+='<rect class="sz-scr'+(ok?'':' no')+'" x="'+sx+'" y="'+sy+'" width="'+mw*S+'" height="'+mh*S+'"/>';
  o+='<text x="'+cxm+'" y="'+(ptop+12*S)+'" text-anchor="middle" font-family="Space Grotesk" font-size="17" font-weight="500" fill="#2b2b2b">portinari</text>';
  var dx=cxm+pw*S/2+60;
  o+='<path class="sz-dim" d="M'+dx+' '+fl+' V'+(fl-bot*S)+' M'+(dx-6)+' '+(fl-bot*S)+' h12 M'+(dx-6)+' '+fl+' h12"/>';
  o+='<text class="sz-t" x="'+(dx+10)+'" y="'+(fl-bot*S/2+4)+'">'+Math.round(bot)+' cm</text>';
  o+='<path class="sz-dim" d="M'+(dx+70)+' '+fl+' V'+sy+' M'+(dx+64)+' '+sy+' h12"/>';
  o+='<text class="sz-t" x="'+(dx+80)+'" y="'+(sy+4)+'">'+Math.round(160-top)+' cm</text>';
  o+='<path class="sz-dim" d="M'+(cxm-pw*S/2)+' '+(ptop-16)+' h'+pw*S+' M'+(cxm-pw*S/2)+' '+(ptop-22)+' v12 M'+(cxm+pw*S/2)+' '+(ptop-22)+' v12"/>';
  o+='<text class="sz-t" x="'+cxm+'" y="'+(ptop-24)+'" text-anchor="middle">chapa 40 cm</text>';
  o+='<line x1="0" y1="'+fl+'" x2="420" y2="'+fl+'" stroke="#050505" stroke-width="2"/>';
  $("#szSvg").innerHTML=o;
  var v=$("#szVer"); v.classList.toggle("no",!ok);
  v.innerHTML=ok?'<span class="disp">Cabe</span><p>'+(mw>34?'Justo na chapa de 40 cm.':'Com folga na chapa de 40 cm.')+'</p>'
    :'<span class="disp">Não cabe</span><p>'+(okH?'Pede chapa de <b>'+need+' cm</b>.':'Pede outro totem.')+'</p>';
  $("#szData").innerHTML=[["Imagem",f1(iw)+" × "+f1(ih)+" cm"],["Tela",PR[szIn][0]],["Touch",PR[szIn][1]]]
    .map(function(r){return '<div><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>'}).join("");
}
seg($("#szSeg"),function(b){szIn=+b.dataset.in;sz()});
seg($("#szOri"),function(b){szOri=b.dataset.o;sz()});
sz();

/* 06 tipos de tela */
var TL=[
 {b:[["Brilho",30,"500 nits"],["Uso",100,"24/7"],["Garantia",100,"3 anos"],["Custo 24\"",28,"R$ 1.500 a 2.900"]],w:"Loja com luz interna. O caso Portinari."},
 {b:[["Brilho",100,"2.500 nits"],["Uso",100,"24/7"],["Garantia",100,"3 anos"],["Custo 24\"",56,"R$ 3.500 a 5.500"]],w:"Só se o totem pegar sol ou vitrine."},
 {b:[["Brilho",26,"450 nits"],["Uso",100,"24/7"],["Garantia",60,"1 a 3 anos"],["Custo 24\"",58,"R$ 3.800 a 5.800"]],w:"Catálogo e leads. Cenário Interativo."},
 {b:[["Vidro",100,"4 a 6 mm"],["Uso",100,"24/7"],["Garantia",100,"da tela"],["Custo extra",10,"+ R$ 400 a 900"]],w:"Corredor sem vendedor por perto."}
];
function tl(k){var t=TL[k];
  $("#tlBars").innerHTML=t.b.map(function(b){return '<div class="bar"><span class="k">'+b[0]+'</span><span class="t"><i style="width:0" data-w="'+b[1]+'"></i></span><span class="v">'+b[2]+'</span></div>'}).join("");
  requestAnimationFrame(function(){requestAnimationFrame(function(){$$("#tlBars i").forEach(function(x){x.style.width=x.dataset.w+"%"})})});
  $("#tlWhen").textContent=t.w;}
seg($("#tlList"),function(b){tl(+b.dataset.k)});tl(0);
ENTER[6]=function(){tl(+$("#tlList .sel").dataset.k)};

/* 07 anatomia */
var AN=[
 {x:441,y:112,t:"Vidro",h:"Vidro temperado",p:"3 a 4 mm, antirreflexo. No touch, é onde se toca."},
 {x:179,y:150,t:"Tela",h:"Tela 24\" vertical",p:"Presa por VESA numa moldura metálica. Nunca colada no MDF."},
 {x:490,y:150,t:"Caixa traseira",h:"Caixa de aço",p:"A chapa de 3 cm não esconde a tela. Precisa de 6 a 8 cm atrás."},
 {x:522,y:226,t:"Tampa",h:"Acesso por trás",p:"Tampa com chave. Troca sem desmontar a frente."},
 {x:490,y:380,t:"Cabos",h:"Cabos por dentro",p:"Nada aparente na frente nem nas laterais."},
 {x:179,y:508,t:"Base",h:"Base técnica",p:"Player, nobreak e 4G ventilados, com porta e chave."},
 {x:586,y:520,t:"Um cabo",h:"Um cabo só",p:"Da base até a tomada. O vendedor não mexe em nada."},
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
an(2);

/* 08 player */
var PL=[
 {pr:"R$ 0",i:"Quase não existe em 24\".",sp:["sem aparelho extra","preso ao fabricante"]},
 {pr:"R$ 450 a 1.400",i:"Essencial e Intermediário.",sp:["4 a 8 GB","liga sozinho","watchdog","atualização remota"]},
 {pr:"R$ 2.800 a 4.500",i:"Quando a prioridade é zero manutenção.",sp:["o mais estável","importado","pouco flexível"]},
 {pr:"R$ 1.500 a 2.300",i:"Interativo.",sp:["16 GB","SSD","modo quiosque","roda o catálogo"]}
];
function pl(k){var p=PL[k];
  $("#plDet").innerHTML='<b class="pl-pr">'+p.pr+'</b><span class="mono">por totem</span><div class="pl-sp">'+p.sp.map(function(x){return "<span>"+x+"</span>"}).join("")+'</div><p class="pl-in"><b>Indicado</b>'+p.i+'</p>';}
seg($("#plOpts"),function(b){pl(+b.dataset.k)});pl(1);

/* 09 rede e energia */
var NE=[
 {t:"Cai a internet",st:{lkN2:"cut",ndRot:"alt",lkN1:"alt",ndCache:"ok",lkN3:"ok",ndTot:"ok"},s:{ndRotS:"4G assumiu",ndTotS:"tocando"},
  l:[["0 s","Cai a internet da loja."],["30 s","O 4G assume sozinho."],["sempre","Sem sinal nenhum, segue tocando: o conteúdo está salvo."]]},
 {t:"Cai a energia",st:{ndTom:"err",lkE1:"cut",ndNob:"alt",lkE3:"alt",ndTot:"ok"},s:{ndRotS:"cabo · Wi-Fi · 4G",ndTotS:"no nobreak"},
  l:[["0 s","Cai a energia."],["15 min","O nobreak segura e desliga com segurança."],["volta","Liga sozinho, na campanha certa."]]},
 {t:"O player trava",st:{ndTot:"err",ndCld:"alt",lkN1:"ok"},s:{ndRotS:"cabo · Wi-Fi · 4G",ndTotS:"travado"},
  l:[["2 min","Reinicia sozinho."],["10 min","A 75 LAB religa a tomada a distância."],["3 dias","Player reserva chega. A loja só pluga."]]},
 {t:"A loja fecha",st:{ndTot:"dim",ndCache:"ok",lkN3:"ok"},s:{ndRotS:"cabo · Wi-Fi · 4G",ndTotS:"em repouso"},
  l:[["22 h","Desliga sozinho."],["madrugada","Baixa as campanhas do dia."],["8 h","Liga sozinho."]]}
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
ENTER[9]=function(){$$("#neBtns button").forEach(function(b){b.classList.remove("sel")});$("#neBtns button").classList.add("sel");ne(0)};

/* 10 opcionais */
var OX=[
 {n:"Sensor de presença",s:"indicado",on:1,w:"Acorda a tela e conta abordagens.",hw:280,m:0},
 {n:"QR Code dinâmico",s:"indicado",on:1,w:"Leva a seleção para o celular.",hw:0,m:0},
 {n:"Câmera de audiência",s:"opcional",on:0,w:"Mede atenção, sem guardar rosto.",hw:650,m:45},
 {n:"RFID nas amostras",s:"opcional",on:0,w:"Pegou a amostra, a tela mostra o produto.",hw:1100,m:0}
];
function oxRender(){
  $("#oxList").innerHTML=OX.map(function(o,k){return '<button class="oxr'+(o.on?' on':'')+'" data-k="'+k+'"><span class="sw"></span><h4>'+o.n+'<small>'+o.s+'</small></h4><p class="w">'+o.w+'</p><p class="c">'+(o.hw?brl(o.hw):"Incluso")+'<small>'+(o.m?"+ "+brl(o.m)+"/mês":"sem mensalidade")+'</small></p></button>'}).join("");
  var hw=0,m=0;OX.forEach(function(o){if(o.on){hw+=o.hw;m+=o.m}});
  $("#oxHw").textContent=brl(hw);$("#oxMes").textContent=brl(m);$("#ox50").textContent=brl(hw*50);
}
$("#oxList").addEventListener("click",function(e){var b=e.target.closest(".oxr");if(!b)return;OX[+b.dataset.k].on^=1;oxRender();});
oxRender();

/* 12 CMS */
var REG=[["SP Capital",14],["SP Interior",10],["Sul",11],["Sudeste",8],["Nordeste",7]],DIAS=["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
var CAMP=[
 {n:"Institucional Portinari",s:"toda a rede · o dia todo",c:"#A49183",on:function(r,d){return true}},
 {n:"Lançamento Bruma",s:"SP e Sul · todos os dias",c:"#06C6AE",on:function(r,d){return r<=2}},
 {n:"Feirão de fim de mês",s:"Sul · sexta a domingo",c:"#C0EE4E",on:function(r,d){return r===2&&d>=4}},
 {n:"Noite do arquiteto",s:"SP Capital · quinta, 18 h a 21 h",c:"#F2F1E9",on:function(r,d){return r===0&&d===3}}
];
$("#cmCamps").innerHTML='<button class="cp sel" data-k="-1"><i style="background:linear-gradient(90deg,#A49183,#06C6AE)"></i><span>Todas<small>4 campanhas ativas</small></span></button>'+
  CAMP.map(function(c,k){return '<button class="cp" data-k="'+k+'"><i style="background:'+c.c+'"></i><span>'+c.n+'<small>'+c.s+'</small></span></button>'}).join("");
var g='<div></div>'+DIAS.map(function(d){return '<div class="h">'+d+'</div>'}).join("");
REG.forEach(function(r,ri){g+='<div class="r">'+r[0]+'<small>'+r[1]+' totens</small></div>';
  DIAS.forEach(function(d,di){var act=CAMP.map(function(c,k){return c.on(ri,di)?k:-1}).filter(function(k){return k>=0});
    g+='<div class="c" data-a2="'+act.join(",")+'" style="background:linear-gradient(180deg,'+act.map(function(k,j){var a=j/act.length*100,b=(j+1)/act.length*100;return CAMP[k].c+" "+a+"% "+b+"%"}).join(",")+');opacity:.9"></div>';});});
$("#cmGrid").innerHTML=g;
seg($("#cmCamps"),function(b){var k=b.dataset.k;
  $$("#cmGrid .c").forEach(function(c){var has=k==="-1"||c.dataset.a2.split(",").indexOf(k)>=0;c.classList.toggle("fade",!has);c.classList.toggle("hl",has&&k!=="-1")});});

/* 13 mercado x próprio */
var mkN=$("#mkN");
function mk(){var n=+mkN.value;$("#mkNv").textContent=n;
  var A=function(m){return n*66*m},B=function(m){return 120000+3500*m+5*n*m};
  var max=Math.max(A(36),B(36))*1.08,W=640,H=300,px=function(m){return m/36*W},py=function(v){return H-v/max*H};
  var pa="M0 "+py(A(0)),pb="M0 "+py(B(0));for(var m=1;m<=36;m++){pa+=" L"+px(m)+" "+py(A(m));pb+=" L"+px(m)+" "+py(B(m));}
  var ax="";for(var q=12;q<36;q+=12)ax+='<line class="ax" x1="'+px(q)+'" y1="0" x2="'+px(q)+'" y2="'+H+'"/>';
  $("#mkSvg").innerHTML=ax+'<path class="lb" d="'+pb+'"/><path class="la" d="'+pa+'"/>';
  $("#mkA").textContent=brl(A(36));$("#mkB").textContent=brl(B(36));
  var be=Math.ceil((120000+3500*36)/(36*(66-5)));
  $("#mkBe").textContent=n<be?"Construir só empata com "+be+" telas":"Acima de "+be+" telas, construir compensa";
}
mkN.addEventListener("input",mk);mk();

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
kgo(0);ENTER[14]=function(){kgo(0)};

/* 15 painel */
var DB=[["Bruma GR",100,"412"],["Bruma SBE",78,"321"],["Linha mármores",61,"251"],["Linha madeirada",47,"194"],["Linha cimentícia",33,"136"]];
$("#dbBars").innerHTML=DB.map(function(d){return '<div><span>'+d[0]+'</span><span class="t"><i data-w="'+d[1]+'"></i></span><span>'+d[2]+'</span></div>'}).join("");
var FN=[["Toque na tela",100,"3.412"],["Catálogo",70,"2.380"],["Produto",38,"1.290"],["QR ou lead",15,"520"]];
$("#dbFun").innerHTML=FN.map(function(f){return '<div data-w="'+f[1]+'"><span>'+f[0]+'</span><b>'+f[2]+'</b></div>'}).join("");
var HR=[18,26,38,52,61,48,44,57,70,86,100,92,64,31];
$("#dbHr").innerHTML=HR.map(function(h,k){return '<i data-h="'+h+'"><span>'+(8+k)+'h</span></i>'}).join("");
ENTER[15]=function(){
  $$("#dbBars i,#dbFun div").forEach(function(x){x.style.width="0"});$$("#dbHr i").forEach(function(x){x.style.height="0"});
  setTimeout(function(){$$("#dbBars i").forEach(function(x){x.style.width=x.dataset.w+"%"});
    $$("#dbFun div").forEach(function(x){x.style.width=Math.max(+x.dataset.w,34)+"%"});
    $$("#dbHr i").forEach(function(x){x.style.height=x.dataset.h+"%"});},300);
};

/* 16 a 18: cenários e investimento */
var SC=[
 {n:"Essencial",tag:"mídia que roda sozinha",hw:3500,res:2550,mes:80,plat:0,platMes:0,
  items:[["Tela 24\" profissional",1900],["Player Android de sinalização",650],["Protetor de surto e tomada inteligente",280],["Cabos, suporte VESA e ventilação",220],["Integração, configuração e teste",450]],
  rec:[["CMS de mercado",45],["Suporte remoto 75 LAB",35]],
  d:[["Incluído","Tela não touch, player, exibição de vídeos e imagens, gestão remota de mídia"],["Hardware","Tela 24\" profissional, player Android 4 GB, protetor de surto, tomada inteligente"],["Software","CMS de mercado com programação, monitoramento e relatório de exibição"],["Implantação","R$ 3.500 por totem"],["Recorrente","R$ 80 por totem, por mês"],["Prazo","6 a 8 semanas"]],
  nums:[["Por totem","R$ 3.500"],["Por mês","R$ 80"],["Prazo","7 sem"]],for:"Lojas com cabo de rede e horário comercial.",
  risk:["Sem 4G nem nobreak","Não mede resultado"],
  r:"Serve para lojas com ponto de rede e horário comercial. Não indicado se a meta é provar resultado."},
 {n:"Intermediário",tag:"rede de mídia monitorada",hw:6200,res:4200,mes:160,plat:0,platMes:0,
  items:[["Tela 24\" profissional 24/7 com vidro",2900],["Player robusto 8 GB",1300],["Roteador 4G com troca automática",480],["Nobreak 600 VA e protetor de surto",520],["Tomada inteligente, cabos e ventilação",380],["Integração, configuração e teste 48 h",620]],
  rec:[["CMS com relatório de exibição",66],["Chip 4G de contingência",35],["Monitoramento e suporte 75 LAB",59]],
  d:[["Incluído","Tudo do Essencial + contingência de rede e energia, monitoramento ativo e programação por loja, região, data e horário"],["Hardware","Tela 24\" profissional 24/7 com vidro temperado, player 8 GB, roteador 4G, nobreak"],["Software","CMS com programação avançada, comprovação de exibição por totem, alerta de offline e reinício remoto"],["Implantação","R$ 6.200 por totem"],["Recorrente","R$ 160 por totem, por mês"],["Prazo","8 a 10 semanas"]],
  nums:[["Por totem","R$ 6.200"],["Por mês","R$ 160"],["Prazo","9 sem"]],for:"Uma rede de mídia que liga, atualiza e prova sozinha.",
  risk:["4G fraco em algumas lojas","Sem catálogo e sem lead"],
  r:"A base operacional certa para os 50 totens: fica ligado, atualiza sozinho e prova exibição."},
 {n:"Interativo",tag:"catálogo, lead e dado",hw:9300,res:6800,mes:160,plat:84000,platMes:2900,
  items:[["Tela 24\" touch capacitivo",4900],["Mini PC 16 GB em modo quiosque",1900],["Roteador 4G com troca automática",480],["Nobreak 600 VA e protetor de surto",520],["Sensor de presença",280],["Tomada inteligente, cabos e ventilação",400],["Integração, configuração e teste 48 h",820]],
  rec:[["CMS, chip 4G, monitoramento e suporte",160]],
  d:[["Incluído","Tudo do Intermediário + tela touch, catálogo digital, QR, captação de leads e painel de dados"],["Hardware","Tela 24\" touch capacitivo, mini PC 16 GB, sensor de presença, 4G e nobreak"],["Software","Plataforma 75 LAB: catálogo, busca, leads com LGPD, envio ao vendedor ou CRM, painel admin e dashboard"],["Implantação","R$ 9.300 por totem + plataforma R$ 84 mil (R$ 10.980 por totem em 50)"],["Recorrente","R$ 160 por totem + R$ 2.900 por mês da plataforma"],["Prazo","12 a 14 semanas"]],
  nums:[["Por totem","R$ 9.300"],["Por mês","R$ 160"],["Prazo","13 sem"]],for:"Gerar lead e saber o que o cliente procura. Mais a plataforma de R$ 84 mil.",
  risk:["Catálogo precisa de dono","Lead precisa de resposta rápida"],
  r:"Para quando o objetivo é lead e dado de interesse. Veja na tela 19 o caminho que evita comprar tela duas vezes."}
];
var LY=[["Tela 24\"",["profissional","24/7 com vidro","touch capacitivo"]],["Player",["Android 4 GB","robusto 8 GB","mini PC 16 GB"]],["CMS de mídia",["com relatório","programação avançada","programação avançada"]],
  ["Rede 4G e nobreak",[0,"contingência","contingência"]],["Monitoramento ativo",[0,"alerta e reinício remoto","alerta e reinício remoto"]],["Sensor de presença",[0,0,"acorda a tela"]],
  ["Catálogo e leads",[0,0,"plataforma 75 LAB"]],["Painel de dados",[0,0,"dashboard e admin"]]];
function sc(k){var s=SC[k];
  $("#scLayers").innerHTML=LY.map(function(l,j){var v=l[1][k];return '<div class="ly'+(v?' on c'+(j<3?0:(j<5?1:2)):'')+'"><span>'+l[0]+'</span><small>'+(v||"não incluso")+'</small></div>'}).join("");
  $("#scName").textContent=s.n;$("#scTag").textContent=s.tag;
  $("#scNums").innerHTML=s.nums.map(function(r){return '<div><small>'+r[0]+'</small><b>'+r[1]+'</b></div>'}).join("");
  $("#scFor").innerHTML="<b>Ideal para</b>"+s.for;
  $("#scRisk").innerHTML=s.risk.map(function(r){return "<li>"+r+"</li>"}).join("");}
seg($("#scSeg"),function(b){sc(+b.dataset.k)});sc(2);

var ivQ=50,ivS=1;
function tot(s,q){var kits=Math.ceil(q/10);var imp=s.hw*q+s.plat+kits*s.res;var mes=s.mes*q+s.platMes;return {imp:imp,mes:mes,kits:kits,t36:imp+36*mes};}
function iv(){var s=SC[ivS],t=tot(s,ivQ);
  var L=s.items.map(function(it){return '<div><span>'+it[0]+'</span><span>'+brl(it[1])+' × '+ivQ+'</span><span>'+brl(it[1]*ivQ)+'</span></div>'}).join("");
  if(s.plat)L+='<div><span>Plataforma de catálogo e leads</span><span>projeto</span><span>'+brl(s.plat)+'</span></div>';
  L+='<div><span>Kit reserva</span><span>'+t.kits+' kits</span><span>'+brl(t.kits*s.res)+'</span></div>';
  L+='<div class="tt"><span>Implantação</span><span></span><span>'+brl(t.imp)+'</span></div>';
  $("#ivLines").innerHTML=L;
  $("#ivPer").textContent=brl(t.imp/ivQ);$("#ivTot").textContent=brl(t.imp);$("#ivMes").textContent=brl(t.mes);
  var all=SC.map(function(x){return tot(x,ivQ).t36}),mx=Math.max.apply(null,all);
  $("#ivCmp").innerHTML=SC.map(function(x,k){return '<div class="cb'+(k===ivS?' sel':'')+'"><span>'+x.n+'</span><span class="t"><i style="width:'+(all[k]/mx*100)+'%"></i></span><b>'+brl(all[k])+'</b></div>'}).join("");
}
seg($("#ivQ"),function(b){ivQ=+b.dataset.q;iv()});seg($("#ivS"),function(b){ivS=+b.dataset.k;iv()});iv();
$("#ivTg").addEventListener("click",function(){var o=$("#iv").classList.toggle("itens");this.textContent=o?"Ver resumo":"Ver itens";});

/* locação */
var lcQ=50,lcS=1;
function rent(s,q){var t=tot(s,q);var m=(t.imp/q)*1.35/36+s.mes+s.platMes/q;return Math.ceil(m/10)*10-1;}
function lc(){var s=SC[lcS],t=tot(s,lcQ),r=rent(s,lcQ);
  $("#lcBuy0").textContent=brl(t.imp);$("#lcBuyM").textContent=brl(t.mes);
  $("#lcRent").textContent=brl(r);$("#lcRentS").textContent="por totem · "+brl(r*lcQ)+" na rede";
  var W=600,H=150,max=Math.max(t.imp+36*t.mes,r*lcQ*36)*1.05,px=function(m){return m/36*W},py=function(v){return H-v/max*H};
  var pa="M0 "+py(0),pb="M0 "+py(t.imp);for(var m=1;m<=36;m++){pa+=" L"+px(m)+" "+py(r*lcQ*m);pb+=" L"+px(m)+" "+py(t.imp+t.mes*m);}
  $("#lcSvg").innerHTML='<path class="lb" d="'+pb+'"/><path class="la" d="'+pa+'"/>';
  var cross=Math.ceil(t.imp/(r*lcQ-t.mes));
  $("#lcCross").textContent=cross<=36?"Alugar sai na frente até o mês "+cross:"Alugar sai na frente os 36 meses";
}
seg($("#lcQ"),function(b){lcQ=+b.dataset.q;lc()});seg($("#lcS"),function(b){lcS=+b.dataset.k;lc()});lc();

/* 18 recomendação */
function rc(q){$("#rcA1").textContent=brl(6200);$("#rcA2").textContent=brl(7400);$("#rcB1").textContent=brl(9300);
  $("#rcSave").textContent=brl((7400-3100)*q);}
seg($("#rcQ"),function(b){rc(+b.dataset.q)});rc(50);
ENTER[19]=function(sec){$$(".rp-bar i",sec).forEach(function(x){x.style.animation="none";x.offsetWidth;x.style.animation=""})};

/* 19 cronograma */
var GT=[
 [["Validação e cotação formal","todos",1,2,""],["Protótipo de fábrica","1 totem completo",2,3,"h"],["Compra das telas","estoque nacional",2,5,""],["CMS e conteúdo de lançamento","75 LAB",3,5,"t"],["Integração em série e teste","fábrica NEOBAND",5,6,"h"],["Instalação e ativação","em ondas por região",6,7,"l"],["Operação assistida","primeiras semanas no ar",7,8,"gh"]],
 [["Validação e cotação formal","todos",1,2,""],["Protótipo de fábrica","1 totem completo",2,4,"h"],["Compra das telas","24/7 com vidro",3,7,""],["CMS e conteúdo de lançamento","75 LAB",3,6,"t"],["Integração em série e teste 48 h","fábrica NEOBAND",7,8,"h"],["Instalação e ativação","em ondas por região",8,9,"l"],["Operação assistida","primeiras semanas no ar",9,10,"gh"]],
 [["Validação e cotação formal","todos",1,2,""],["Protótipo de fábrica","1 totem completo",2,4,"h"],["Compra das telas touch","lote importado",3,8,""],["CMS e conteúdo de lançamento","75 LAB",3,6,"t"],["Plataforma touch","design, catálogo, leads, painel",3,11,"t"],["Integração em série e teste 48 h","fábrica NEOBAND",8,10,"h"],["Instalação e ativação","em ondas por região",10,12,"l"],["Catálogo no ar","operação assistida",12,14,"t"]]
];
function gt(k){var h='<div class="h l">Etapa</div>';for(var w=1;w<=14;w++)h+='<div class="h">S'+w+'</div>';
  GT[k].forEach(function(r,j){h+='<div class="n">'+r[0]+'<small>'+r[1]+'</small></div>';
    for(var w=1;w<=14;w++){h+='<div class="cl">'+(w===r[2]?'<span class="bx '+r[4]+'" style="width:calc('+(r[3]-r[2]+1)+'00% + '+(r[3]-r[2])+'px);animation-delay:'+(j*80)+'ms"></span>':'')+'</div>';}});
  $("#gantt").innerHTML=h;}
seg($("#gtS"),function(b){gt(+b.dataset.k)});gt(2);

/* 20 próximos passos */
var NX=[["Decisão","Quantidade final"],["Decisão","Desenho escolhido"],["Decisão","Touch ou não"],["Decisão","Comprar ou alugar"],
 ["Lojas","Lista de lojas"],["Lojas","Rede e tomada"],["Conteúdo","Quem publica"],["Conteúdo","Base de produtos"],["Dados","Destino do lead"],["Prazo","Data alvo"]];
$("#nxList").innerHTML=NX.map(function(n,k){return '<button class="nq" data-k="'+k+'"><i></i><span><span class="grp">'+n[0]+'</span><b>'+n[1]+'</b></span></button>'}).join("");
$("#nxList").addEventListener("click",function(e){var b=e.target.closest(".nq");if(!b)return;b.classList.toggle("ok");$("#nxC").textContent=$$("#nxList .ok").length+" de "+NX.length;});

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
