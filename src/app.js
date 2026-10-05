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
 "Comparativo de cenários","Estimativa de investimento","Recomendação","Cronograma","Próximos passos","Fecho e contato"];

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

/* 02 roteiro */
$$(".stop").forEach(function(s){
  s.addEventListener("mouseenter",function(){$("#trailCap").innerHTML="<b>"+s.querySelector("span").textContent+".</b> "+s.dataset.t;});
});

/* 03 desafio */
seg($("#dsSeg"),function(b){$("#dsCard").classList.toggle("real",b.dataset.k==="1")});

/* 04 desenhos */
var IMG={t1a:"__T1A__",t1b:"__T1B__",t2a:"__T2A__",t2b:"__T2B__",t3a:"__T3A__",t3b:"__T3B__"};
var DZ=[
 {a:"t1a",b:"t1b",rows:[["Tela que o desenho pede","Tela esticada (bar) de cerca de 43\", proporção próxima de 32:9"],["Imagem","30 × 105 cm, de 34 a 140 cm do chão"],["Uso","Só mídia: a parte de baixo fica abaixo do alcance da mão e do olhar"],["Acessórios","Nenhum"],["Tela estimada","R$ 8.000 a 12.000 sem touch"]],
  read:"O mais impactante e o mais caro. Tela esticada é importada, tem poucos fornecedores e custa de 3 a 4 vezes uma 24\". Não serve para touch."},
 {a:"t2a",b:"t2b",rows:[["Tela que o desenho pede","24\" vertical, padrão de mercado"],["Imagem","30 × 53 cm, de 87 a 140 cm do chão"],["Uso","Mídia ou touch: a tela está na altura certa do toque"],["Acessórios","Porta-óculos em acrílico 25,2 × 12 × 12 cm"],["Tela estimada","R$ 1.500 a 2.900 · touch R$ 3.800 a 5.800"]],
  read:"A base mais segura para os três cenários: tela comum de linha profissional, troca fácil e altura certa para o touch."},
 {a:"t3a",b:"t3b",rows:[["Tela que o desenho pede","24\" vertical, padrão de mercado"],["Imagem","30 × 53 cm, de 87 a 140 cm do chão"],["Uso","Mídia ou touch"],["Acessórios","Porta-folder em acrílico 12 × 15 × 3 cm"],["Tela estimada","R$ 1.500 a 2.900 · touch R$ 3.800 a 5.800"]],
  read:"Mesma tela da opção 2, com folder físico ao lado. O QR da tela e o folder fazem juntos a ponte para o celular."}
];
function dz(k){var d=DZ[k],box=$(".dz-imgs");box.classList.add("sw");
  setTimeout(function(){$("#dzA").src=IMG[d.a];$("#dzB").src=IMG[d.b];box.classList.remove("sw")},220);
  $("#dzData").innerHTML=d.rows.map(function(r){return '<div><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>'}).join("");
  $("#dzRead").innerHTML="<b>Leitura 75 LAB · opção "+(k+1)+"</b>"+d.read;}
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
  v.innerHTML=ok?'<span class="disp">Cabe</span><p>'+(mw>34?'Justo, mas cabe na chapa de 40 cm. Vale confirmar a moldura no desenho de produção.':'Cabe na chapa de 40 cm com folga para a moldura metálica e a fixação.')+'</p>'
    :'<span class="disp">Não cabe</span><p>'+(okW?'':'Pede chapa frontal de <b>'+need+' cm</b> no lugar de 40 cm. ')+(okH?'':'A tela ocupa quase toda a altura da chapa: o totem precisa ser redesenhado. ')+'Muda o desenho, o MDF e a caixa traseira.</p>';
  $("#szData").innerHTML=[["Área de imagem",f1(iw)+" × "+f1(ih)+" cm"],["Corpo com moldura",f1(mw)+" × "+f1(mh)+" cm"],["Chapa mínima",need+" cm de largura"],
    ["Imagem do chão",Math.round(bot)+" a "+Math.round(160-top)+" cm"],["Tela profissional",PR[szIn][0]],["Tela touch",PR[szIn][1]]]
    .map(function(r){return '<div><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>'}).join("");
}
seg($("#szSeg"),function(b){szIn=+b.dataset.in;sz()});
seg($("#szOri"),function(b){szOri=b.dataset.o;sz()});
sz();

/* 06 tipos de tela */
var TL=[
 {d:"Linha comercial feita para ficar ligada o dia todo, com garantia de fábrica para uso em loja. É o padrão para ambiente interno com luz normal.",
  b:[["Brilho",30,"350 a 500 nits"],["Horas por dia",100,"16 a 24 h"],["Garantia",100,"3 anos"],["Custo 24\"",28,"R$ 1.500 a 2.900"]],
  r:[["Prazo","1 a 3 semanas, estoque nacional"],["Quando usar","Revenda com iluminação interna: o caso dos totens Portinari"]]},
 {d:"Painel de 1.000 a 2.500 nits que continua legível com sol batendo. Esquenta mais e custa o dobro.",
  b:[["Brilho",100,"1.000 a 2.500 nits"],["Horas por dia",100,"24 h"],["Garantia",100,"3 anos"],["Custo 24\"",56,"R$ 3.500 a 5.500"]],
  r:[["Prazo","4 a 8 semanas, sob encomenda"],["Quando usar","Totem de frente para vitrine ou sol direto. Exceção, não regra"]]},
 {d:"Sensor capacitivo projetado (PCAP) atrás de um vidro de 3 a 4 mm: 10 toques, resposta de celular, funciona mesmo com o vidro de proteção.",
  b:[["Brilho",26,"350 a 450 nits"],["Horas por dia",100,"24 h"],["Garantia",60,"1 a 3 anos, conforme integrador"],["Custo 24\"",58,"R$ 3.800 a 5.800"]],
  r:[["Prazo","3 a 6 semanas"],["Quando usar","Catálogo, busca e captação de leads: cenário Interativo"]]},
 {d:"Vidro temperado ou laminado de 4 a 6 mm e moldura metálica com parafusos de segurança. Protege contra impacto e risco.",
  b:[["Proteção",100,"vidro 4 a 6 mm"],["Horas por dia",100,"conforme a tela"],["Garantia",100,"conforme a tela"],["Custo extra",10,"+ R$ 400 a 900"]],
  r:[["Prazo","+1 semana na integração"],["Quando usar","Grande circulação sem vendedor perto. Em revenda com atendimento, vidro de 3 a 4 mm resolve"]]}
];
function tl(k){var t=TL[k];$("#tlDesc").textContent=t.d;
  $("#tlBars").innerHTML=t.b.map(function(b){return '<div class="bar"><span class="k">'+b[0]+'</span><span class="t"><i style="width:0" data-w="'+b[1]+'"></i></span><span class="v">'+b[2]+'</span></div>'}).join("");
  requestAnimationFrame(function(){requestAnimationFrame(function(){$$("#tlBars i").forEach(function(x){x.style.width=x.dataset.w+"%"})})});
  $("#tlData").innerHTML=t.r.map(function(r){return '<div><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>'}).join("");}
seg($("#tlList"),function(b){tl(+b.dataset.k)});tl(0);
ENTER[6]=function(){tl(+$("#tlList .sel").dataset.k)};

/* 07 anatomia */
var AN=[
 {x:441,y:112,t:"Vidro",h:"Vidro de proteção",p:"Temperado de 3 a 4 mm, com tratamento antirreflexo. Protege a tela e, no touch, é a superfície que o cliente toca."},
 {x:179,y:150,t:"Tela",h:"Tela 24\" vertical",p:"Linha profissional homologada para retrato, presa por VESA 100 numa moldura metálica. Nunca colada no MDF: precisa sair inteira na manutenção."},
 {x:490,y:150,t:"Caixa traseira",h:"Caixa metálica traseira",p:"A chapa de 3 cm não esconde uma tela, que tem 4 a 6 cm de corpo. Pede uma caixa de aço de 6 a 8 cm atrás da chapa, com furação para ventilar."},
 {x:522,y:226,t:"Tampa de serviço",h:"Acesso por trás",p:"Tampa com chave na caixa traseira. Troca de tela ou player sem desmontar a frente nem marcar o adesivo Bruma."},
 {x:490,y:380,t:"Calha de cabos",h:"Cabos por dentro",p:"Vídeo, USB do touch e energia descem por dentro da chapa até a base. Nada aparente na frente nem nas laterais."},
 {x:179,y:508,t:"Base técnica",h:"Base 70 × 20 × 20 cm",p:"Player, nobreak, roteador 4G e protetor de surto moram aqui, numa bandeja removível, com grelha de ventilação nas laterais e porta com chave."},
 {x:586,y:520,t:"Um cabo",h:"Um cabo até a parede",p:"Só energia, e rede quando a loja tiver ponto. Saída pela traseira da base com passa-cabo: o vendedor não precisa mexer em nada."},
 {x:48,y:508,t:"Estabilidade",h:"Estabilidade",p:"1,60 m de altura apoiado em 20 cm de profundidade, com a tela no alto.",w:"Tomba com pouco esforço, ainda mais no touch. Precisa de contrapeso de aço na base (15 a 20 kg) ou fixação no piso. Ponto para a engenharia da NEOBAND validar no protótipo."}
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
 {pr:"R$ 0",u:"de player",y:["Sem aparelho extra: o sistema roda dentro da tela","Menos cabos e menos pontos de falha"],n:["Quase não existe em 24\": aparece de 32\" para cima","Prende a rede ao CMS do fabricante da tela"],i:"Fora para este totem, por causa do tamanho."},
 {pr:"R$ 450 a 1.400",u:"por totem",y:["Compatível com os principais CMS do mercado","Liga sozinho, relógio interno e atualização remota","Consumo baixo e cabe com folga na base"],n:["Qualidade varia muito entre marcas: homologar um modelo","Limitado para catálogo touch mais pesado"],i:"Essencial (4 GB) e Intermediário (8 GB)."},
 {pr:"R$ 2.800 a 4.500",u:"por totem, importado",y:["Referência de estabilidade em mídia, sem sistema exposto","Anos rodando sem intervenção"],n:["Caro para uma tela de 24\"","Pouco flexível para apps interativos"],i:"Quando a prioridade absoluta é zero manutenção de mídia."},
 {pr:"R$ 1.500 a 2.300",u:"por totem",y:["Roda a plataforma touch no navegador, em modo quiosque, com folga","SSD e memória de sobra para catálogo com muitas imagens"],n:["Precisa de controle remoto do sistema e travamento","Consome mais energia e esquenta mais que um player Android"],i:"Interativo."}
];
function pl(k){var p=PL[k];
  $("#plDet").innerHTML='<div class="pr"><b>'+p.pr+'</b><span>'+p.u+'</span></div><div class="pc"><ul class="y">'+p.y.map(function(x){return "<li>"+x+"</li>"}).join("")+'</ul><ul class="n">'+p.n.map(function(x){return "<li>"+x+"</li>"}).join("")+'</ul></div><div class="ind"><b>Indicado</b>'+p.i+'</div>';}
seg($("#plOpts"),function(b){pl(+b.dataset.k)});pl(1);

/* 09 rede e energia */
var NE=[
 {t:"Cai a internet",st:{lkN2:"cut",ndRot:"alt",lkN1:"alt",ndCache:"ok",lkN3:"ok",ndTot:"ok"},s:{ndRotS:"4G assumiu",ndTotS:"tocando"},
  l:[["0 s","O cabo de rede da loja cai, ou alguém troca a senha do Wi-Fi."],["30 s","O roteador percebe e passa sozinho para o chip 4G."],["1 min","O painel registra a troca. Ninguém na loja percebe nada."],["sempre","Mesmo sem 4G, o totem segue tocando: a programação inteira está salva no player."]]},
 {t:"Cai a energia",st:{ndTom:"err",lkE1:"cut",ndNob:"alt",lkE3:"alt",ndTot:"ok"},s:{ndRotS:"cabo · Wi-Fi · 4G",ndTotS:"no nobreak"},
  l:[["0 s","Queda de energia na loja."],["0 s","O nobreak segura player, tela e roteador por cerca de 15 minutos."],["15 min","Se a energia não voltou, o player desliga de forma limpa, sem corromper o sistema."],["volta","A energia volta e o totem liga sozinho, sem botão, já na campanha do horário."]]},
 {t:"O player trava",st:{ndTot:"err",ndCld:"alt",lkN1:"ok"},s:{ndRotS:"cabo · Wi-Fi · 4G",ndTotS:"travado"},
  l:[["0 s","O sistema do player congela."],["2 min","O watchdog percebe e reinicia o player."],["10 min","Se não voltou, o painel abre alerta e a 75 LAB corta e religa a tomada inteligente a distância."],["2 a 3 dias","Ainda assim parado? Um player reserva configurado sai pelo correio. A loja só troca o cabo."]]},
 {t:"A loja fecha",st:{ndTot:"dim",ndCache:"ok",lkN3:"ok"},s:{ndRotS:"cabo · Wi-Fi · 4G",ndTotS:"em repouso"},
  l:[["22 h","O relógio interno desliga a tela no fim do expediente: menos consumo, mais vida útil."],["madrugada","Reinício programado limpa a memória e baixa as campanhas do dia seguinte."],["8 h","A tela liga sozinha, já com a programação nova."]]}
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
 {n:"Sensor de presença",s:"indicado",on:1,w:"Acorda a tela quando alguém chega e troca o vídeo pelo convite ao toque. <b>Mesmo módulo que a 75 LAB já fabrica e opera</b> em displays da NEOBAND.",d:"Abordagens e tempo de permanência por hora",hw:280,m:0},
 {n:"QR Code dinâmico",s:"indicado",on:1,w:"Na tela e no folder, um código por totem. Leva a seleção do cliente para o celular.",d:"Quem continuou a jornada em casa, por loja",hw:0,m:0},
 {n:"Câmera de audiência",s:"opcional",on:0,w:"Conta pessoas e tempo de atenção <b>sem gravar e sem guardar rosto</b>. Exige aviso visível na loja.",d:"Impacto real de cada campanha",hw:650,m:45},
 {n:"RFID nas amostras",s:"opcional",on:0,w:"Lift and learn: o cliente pega a amostra de porcelanato e a tela mostra o produto, ambientes e especificação.",d:"Produto mais tocado em cada loja",hw:1100,m:0,x:"+ R$ 4 por etiqueta"}
];
function oxRender(){
  $("#oxList").innerHTML=OX.map(function(o,k){return '<button class="oxr'+(o.on?' on':'')+'" data-k="'+k+'"><span class="sw"></span><h4>'+o.n+'<small>'+o.s+'</small></h4><p class="w">'+o.w+'</p><p class="d"><span>Dado que gera</span>'+o.d+'</p><p class="c">'+(o.hw?brl(o.hw):"Incluso")+'<small>'+(o.m?"+ "+brl(o.m)+" por mês":(o.x||"sem mensalidade"))+'</small></p></button>'}).join("");
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
  $("#mkBe").textContent=n<be?"Próprio só empata perto de "+be+" telas":"Acima de "+be+" telas o próprio passa a compensar";
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
  risk:["Depende do cabo ou do Wi-Fi da loja: sem contingência de internet","Sem nobreak: a queda de energia apaga até a energia voltar","Tela de uso estendido, não 24/7","Não mede quem parou na frente"],
  r:"Serve para lojas com ponto de rede e horário comercial. Não indicado se a meta é provar resultado."},
 {n:"Intermediário",tag:"rede de mídia monitorada",hw:6200,res:4200,mes:160,plat:0,platMes:0,
  items:[["Tela 24\" profissional 24/7 com vidro",2900],["Player robusto 8 GB",1300],["Roteador 4G com troca automática",480],["Nobreak 600 VA e protetor de surto",520],["Tomada inteligente, cabos e ventilação",380],["Integração, configuração e teste 48 h",620]],
  rec:[["CMS com relatório de exibição",66],["Chip 4G de contingência",35],["Monitoramento e suporte 75 LAB",59]],
  d:[["Incluído","Tudo do Essencial + contingência de rede e energia, monitoramento ativo e programação por loja, região, data e horário"],["Hardware","Tela 24\" profissional 24/7 com vidro temperado, player 8 GB, roteador 4G, nobreak"],["Software","CMS com programação avançada, comprovação de exibição por totem, alerta de offline e reinício remoto"],["Implantação","R$ 6.200 por totem"],["Recorrente","R$ 160 por totem, por mês"],["Prazo","8 a 10 semanas"]],
  risk:["Sinal 4G fraco em algumas lojas: antena externa resolve","Recorrente dobra em relação ao Essencial","Comunica, mas não conversa: sem catálogo e sem lead"],
  r:"A base operacional certa para os 50 totens: fica ligado, atualiza sozinho e prova exibição."},
 {n:"Interativo",tag:"catálogo, lead e dado",hw:9300,res:6800,mes:160,plat:84000,platMes:2900,
  items:[["Tela 24\" touch capacitivo",4900],["Mini PC 16 GB em modo quiosque",1900],["Roteador 4G com troca automática",480],["Nobreak 600 VA e protetor de surto",520],["Sensor de presença",280],["Tomada inteligente, cabos e ventilação",400],["Integração, configuração e teste 48 h",820]],
  rec:[["CMS, chip 4G, monitoramento e suporte",160]],
  d:[["Incluído","Tudo do Intermediário + tela touch, catálogo digital, QR, captação de leads e painel de dados"],["Hardware","Tela 24\" touch capacitivo, mini PC 16 GB, sensor de presença, 4G e nobreak"],["Software","Plataforma 75 LAB: catálogo, busca, leads com LGPD, envio ao vendedor ou CRM, painel admin e dashboard"],["Implantação","R$ 9.300 por totem + plataforma R$ 84 mil (R$ 10.980 por totem em 50)"],["Recorrente","R$ 160 por totem + R$ 2.900 por mês da plataforma"],["Prazo","12 a 14 semanas"]],
  risk:["Catálogo precisa de dono: base de produtos sempre atualizada","Touch pede limpeza e checagem periódica","Lead só vira venda se alguém na loja responder rápido","Prazo maior por causa da plataforma"],
  r:"Para quando o objetivo é lead e dado de interesse. Veja na tela 19 o caminho que evita comprar tela duas vezes."}
];
var LY=[["Tela 24\"",["profissional","24/7 com vidro","touch capacitivo"]],["Player",["Android 4 GB","robusto 8 GB","mini PC 16 GB"]],["CMS de mídia",["com relatório","programação avançada","programação avançada"]],
  ["Rede 4G e nobreak",[0,"contingência","contingência"]],["Monitoramento ativo",[0,"alerta e reinício remoto","alerta e reinício remoto"]],["Sensor de presença",[0,0,"acorda a tela"]],
  ["Catálogo e leads",[0,0,"plataforma 75 LAB"]],["Painel de dados",[0,0,"dashboard e admin"]]];
function sc(k){var s=SC[k];
  $("#scLayers").innerHTML=LY.map(function(l,j){var v=l[1][k];return '<div class="ly'+(v?' on c'+(j<3?0:(j<5?1:2)):'')+'"><span>'+l[0]+'</span><small>'+(v||"não incluso")+'</small></div>'}).join("");
  $("#scName").textContent=s.n;$("#scTag").textContent=s.tag;
  $("#scData").innerHTML=s.d.map(function(r){return '<div><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>'}).join("");
  $("#scRisk").innerHTML=s.risk.map(function(r){return "<li>"+r+"</li>"}).join("");$("#scRec").textContent=s.r;}
seg($("#scSeg"),function(b){sc(+b.dataset.k)});sc(2);

var ivQ=50,ivS=1;
function tot(s,q,res){var kits=Math.ceil(q/10);var imp=s.hw*q+s.plat+(res?kits*s.res:0);var mes=s.mes*q+s.platMes;return {imp:imp,mes:mes,kits:kits,t36:imp+36*mes};}
function iv(){var s=SC[ivS],res=$("#ivR").checked,t=tot(s,ivQ,res);
  var L=s.items.map(function(it){return '<div><span>'+it[0]+'</span><span>'+brl(it[1])+' × '+ivQ+'</span><span>'+brl(it[1]*ivQ)+'</span></div>'}).join("");
  if(s.plat)L+='<div><span>Plataforma de catálogo, leads e painel</span><span>projeto</span><span>'+brl(s.plat)+'</span></div>';
  if(res)L+='<div><span>Kit reserva (tela + player)</span><span>'+t.kits+' kits</span><span>'+brl(t.kits*s.res)+'</span></div>';
  L+='<div class="tt"><span>Implantação</span><span></span><span>'+brl(t.imp)+'</span></div>';
  L+='<div class="rec"><span>Recorrente: '+s.rec.map(function(r){return r[0].toLowerCase()+" "+brl(r[1])}).join(" + ")+' por totem'+(s.platMes?' + plataforma '+brl(s.platMes):'')+'</span><span></span><span>'+brl(t.mes)+'/mês</span></div>';
  $("#ivLines").innerHTML=L;
  $("#ivPer").textContent=brl(t.imp/ivQ);$("#ivTot").textContent=brl(t.imp);$("#ivMes").textContent=brl(t.mes);
  var all=SC.map(function(x){return tot(x,ivQ,res).t36}),mx=Math.max.apply(null,all);
  $("#ivCmp").innerHTML=SC.map(function(x,k){return '<div class="cb'+(k===ivS?' sel':'')+'"><span>'+x.n+'</span><span class="t"><i style="width:'+(all[k]/mx*100)+'%"></i></span><b>'+brl(all[k])+'</b></div>'}).join("");
}
seg($("#ivQ"),function(b){ivQ=+b.dataset.q;iv()});seg($("#ivS"),function(b){ivS=+b.dataset.k;iv()});$("#ivR").addEventListener("change",iv);iv();

/* 18 recomendação */
function rc(q){$("#rcA1").textContent=brl(6200);$("#rcA2").textContent=brl(7400);$("#rcB1").textContent=brl(9300);
  $("#rcMore").textContent="+ "+brl(3100*q);$("#rcSave").textContent=brl((7400-3100)*q);}
seg($("#rcQ"),function(b){rc(+b.dataset.q)});rc(50);
ENTER[18]=function(sec){$$(".rp-bar i",sec).forEach(function(x){x.style.animation="none";x.offsetWidth;x.style.animation=""})};

/* 19 cronograma */
var GT=[
 [["Validação e cotação formal","NEOBAND · Portinari · 75 LAB",1,2,""],["Protótipo de fábrica","1 totem completo",2,3,"h"],["Compra das telas","estoque nacional",2,5,""],["CMS e conteúdo de lançamento","75 LAB",3,5,"t"],["Integração em série e teste","fábrica NEOBAND",5,6,"h"],["Instalação e ativação","em ondas por região",6,7,"l"],["Operação assistida","primeiras semanas no ar",7,8,"gh"]],
 [["Validação e cotação formal","NEOBAND · Portinari · 75 LAB",1,2,""],["Protótipo de fábrica","1 totem completo",2,4,"h"],["Compra das telas","24/7 com vidro",3,7,""],["CMS e conteúdo de lançamento","75 LAB",3,6,"t"],["Integração em série e teste 48 h","fábrica NEOBAND",7,8,"h"],["Instalação e ativação","em ondas por região",8,9,"l"],["Operação assistida","primeiras semanas no ar",9,10,"gh"]],
 [["Validação e cotação formal","NEOBAND · Portinari · 75 LAB",1,2,""],["Protótipo de fábrica","1 totem completo",2,4,"h"],["Compra das telas touch","lote importado",3,8,""],["CMS e conteúdo de lançamento","75 LAB",3,6,"t"],["Plataforma touch","design, catálogo, leads, painel",3,11,"t"],["Integração em série e teste 48 h","fábrica NEOBAND",8,10,"h"],["Instalação e ativação","em ondas por região",10,12,"l"],["Catálogo no ar","operação assistida",12,14,"t"]]
];
function gt(k){var h='<div class="h l">Etapa</div>';for(var w=1;w<=14;w++)h+='<div class="h">S'+w+'</div>';
  GT[k].forEach(function(r,j){h+='<div class="n">'+r[0]+'<small>'+r[1]+'</small></div>';
    for(var w=1;w<=14;w++){h+='<div class="cl">'+(w===r[2]?'<span class="bx '+r[4]+'" style="width:calc('+(r[3]-r[2]+1)+'00% + '+(r[3]-r[2])+'px);animation-delay:'+(j*80)+'ms"></span>':'')+'</div>';}});
  $("#gantt").innerHTML=h;}
seg($("#gtS"),function(b){gt(+b.dataset.k)});gt(2);

/* 20 próximos passos */
var NX=[["Decisão","Quantidade final","25 ou 50, e se há expansão prevista"],["Decisão","Desenho escolhido","Opção 1, 2 ou 3"],["Decisão","Touch","Sim, não ou pronto para touch"],
 ["Lojas","Lista de lojas","Cidade e endereço de cada totem"],["Lojas","Infraestrutura","Ponto de rede, Wi-Fi que aceita dispositivo, tomada perto"],["Lojas","Horário de funcionamento","Para o liga e desliga programado"],
 ["Conteúdo","Quem publica","Time Portinari, 75 LAB ou os dois"],["Conteúdo","Base de produtos","Site, planilha, API e imagens oficiais"],["Dados","Destino do lead","Vendedor, representante ou CRM, e qual CRM"],
 ["Dados","TI e LGPD da Dexco","Regras de rede, encarregado de dados, contrato de tratamento"],["Prazo","Data alvo","Inauguração ou evento que puxa o cronograma"]];
$("#nxList").innerHTML=NX.map(function(n,k){return '<button class="nq" data-k="'+k+'"><i></i><span><span class="grp">'+n[0]+'</span><b>'+n[1]+'</b><small>'+n[2]+'</small></span></button>'}).join("");
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
