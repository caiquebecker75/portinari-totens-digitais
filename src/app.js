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
var TITLES=["Totens digitais Portinari","O desafio","Os três desenhos","Tipo de tela","Anatomia do totem","Rede e energia","Gestão remota de mídia","Experiência touch","Locação","Resumo do investimento"];

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
ENTER[3]=function(){tl(+$("#tlList .sel").dataset.k)};

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
ENTER[5]=function(){$$("#neBtns button").forEach(function(b){b.classList.remove("sel")});$("#neBtns button").classList.add("sel");ne(0)};

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
kgo(0);ENTER[7]=function(){kgo(0)};

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
function tot(s,q){var kits=Math.ceil(q/10);var imp=s.hw*q+s.plat+kits*s.res;var mes=s.mes*q+s.platMes;return {imp:imp,mes:mes,kits:kits,t36:imp+36*mes};}
/* resumo final */
var RS=[
 {inc:["Tela 24\"","Player","CMS de mídia"],pz:"7 semanas"},
 {inc:["Tudo do Essencial","4G e nobreak","Monitoramento"],pz:"9 semanas"},
 {inc:["Tudo do Intermediário","Tela touch","Catálogo, leads e painel"],pz:"13 semanas",rec:1}
];
function rs(q){
  $("#rs").innerHTML=SC.map(function(s,k){var t=tot(s,q),r=rent(s,q),x=RS[k];
    return '<div class="rc3'+(x.rec?' rec':'')+'">'+(x.rec?'<span class="rbadge">Recomendado</span>':'')+
    '<h3>'+s.n+'</h3><div class="inc">'+x.inc.map(function(c){return "<span>"+c+"</span>"}).join("")+'</div>'+
    '<div class="pay"><span class="mono">Comprar</span><b>'+brl(t.imp/q)+'</b><small>por totem</small>'+
    '<p><span>Total</span>'+brl(t.imp)+'</p><p><span>Mensal da rede</span>'+brl(t.mes)+'</p></div>'+
    '<div class="pay alt"><span class="mono">Alugar</span><b>'+brl(r)+'</b><small>por totem, por mês</small>'+
    '<p><span>Entrada</span>R$ 0</p><p><span>Mensal da rede</span>'+brl(r*q)+'</p></div>'+
    '<p class="pz"><span>Prazo</span>'+x.pz+'</p></div>';}).join("");
}

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
seg($("#rsQ"),function(b){rs(+b.dataset.q)});rs(50);

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
