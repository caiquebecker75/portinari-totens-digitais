#!/usr/bin/env python3
"""Monta index.html a partir de src/. Uso: python3 build.py"""
import re, pathlib

R = pathlib.Path(__file__).parent
S = R / "src"
TELAS = 22

CHROME = """
<svg style="display:none" aria-hidden="true"><defs>
<symbol id="ar" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="lt" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></symbol>
<symbol id="gt" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></symbol>
</defs></svg>
<div id="cur"></div><div id="dot"></div>
<main id="deck"><div id="stage">
<div id="prog" style="width:5%"></div>
<header id="top">
  <div class="brand">
    <img class="l75 lt" src="__LOGO75__" alt="75 LAB"><img class="l75 dk" src="__L75W__" alt="75 LAB">
    <span class="x">&times;</span>
    <img class="lnb lt" src="__NEOBAND__" alt="NEOBAND"><img class="lnb dk" src="__NEOBANDW__" alt="NEOBAND">
  </div>
  <div class="sp"></div>
  <span class="client">Totens digitais <img src="__PORTINARI__" alt="Portinari"></span>
  <button class="chip" id="bMenu">Índice</button>
</header>
__SLIDES__
<svg id="grain" aria-hidden="true"><filter id="gf"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter><rect width="100%" height="100%" filter="url(#gf)"/></svg>
<footer id="bot">
  <span class="part" id="partlbl"></span>
  <div class="sp"></div>
  <button class="chip" id="bPrint">Baixar PDF</button>
  <button class="nb" id="prev" aria-label="Anterior"><svg><use href="#lt"/></svg></button>
  <span id="count"></span>
  <button class="nb" id="next" aria-label="Próximo"><svg><use href="#gt"/></svg></button>
</footer>
<div class="hint" id="hint">Setas ou espaço para navegar · M abre o índice</div>
</div></main>
<div id="menu">
  <div style="display:flex;align-items:center;gap:16px">
    <span class="eyebrow" style="color:rgba(242,241,233,.6)"><i>(**)</i> Índice da apresentação</span>
    <div class="sp"></div><button class="chip" id="bClose" style="border-color:rgba(242,241,233,.3)">Fechar</button>
  </div>
  <ol id="mlist"></ol>
</div>
<div id="lb"><img alt=""><button>Fechar</button></div>
"""

EXTRA_CSS = """
#top .dk{display:none}
#top.inv .lt{display:none}
#top.inv .dk{display:block}
"""

TOKENS = ["LOGO75", "L75W", "NEOBAND", "NEOBANDW", "PORTINARI", "LOJA", "QR",
          "T1A", "T1B", "T2A", "T2B", "T3A", "T3B"]


def main():
    head = (S / "head.html").read_text()
    comp = (S / "comp.css").read_text()
    assert head.count("<style>") == 1 and head.count("</style>") == 1, "head.html: tag <style> desbalanceada"
    head = head.replace("</style>", comp + EXTRA_CSS + "\n</style>")
    assert ".fx-sig{" in head, "comp.css nao entrou no <style>"

    slides = "".join((S / "slides" / f"{n:02d}.html").read_text() + "\n" for n in range(1, TELAS + 1))
    html = head + CHROME.replace("__SLIDES__", slides) + \
        "\n<script>\n" + (S / "app.js").read_text() + "\n</script>\n</body>\n</html>\n"

    for t in TOKENS:
        val = (S / "assets" / f"{t.lower()}.txt").read_text().strip()
        if t == "QR":
            val = val.replace("'", "\\'")
        html = html.replace(f"__{t}__", val)

    leftover = re.findall(r"__[A-Z0-9_]+__", html)
    assert not leftover, f"tokens nao substituidos: {leftover}"
    dash = html.count("—") + html.count("–")
    assert dash == 0, f"{dash} travessao(oes) no HTML final"
    n = len(re.findall(r'<section class="slide\b', html))
    assert n == TELAS, f"esperava {TELAS} telas, achei {n}"

    (R / "index.html").write_text(html)
    print(f"index.html: {len(html)//1024} KB · {n} telas · 0 travessoes")


if __name__ == "__main__":
    main()
