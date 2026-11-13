/* Comércio MLG — scripts do site
   1. Menu do celular   2. Busca de produtos   3. Formulário de contato */

// 1. Menu do celular (abre e fecha)
const botaoMenu = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botaoMenu.setAttribute("aria-expanded", aberto);
    botaoMenu.textContent = aberto ? "✕" : "☰";
  });
}

// 2. Busca: esconde os cards que não combinam com o texto digitado
const busca = document.getElementById("busca");
if (busca) {
  const cards = document.querySelectorAll(".card");
  const info = document.getElementById("busca-info");
  const semAcento = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  busca.addEventListener("input", () => {
    const termo = semAcento(busca.value.trim());
    let mostrando = 0;
    cards.forEach((card) => {
      const combina = semAcento(card.dataset.busca).includes(termo);
      card.hidden = !combina;
      if (combina) mostrando++;
    });
    // esconde as seções que ficaram sem nenhum produto
    document.querySelectorAll("main .secao").forEach((sec) => {
      const temCard = sec.querySelector(".card");
      if (temCard) sec.hidden = !sec.querySelector(".card:not([hidden])");
    });
    info.textContent = termo ? `${mostrando} produto(s) encontrado(s).` : "";
  });
}

// 3. Formulário: a validação é feita pelo próprio HTML5 (required, type, pattern, minlength).
//    O JavaScript só pré-seleciona o produto vindo do botão "Quero este" e mostra a confirmação.
const form = document.getElementById("form-contato");
if (form) {
  const produto = new URLSearchParams(location.search).get("produto");
  if (produto) document.getElementById("produto").value = produto;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // site estático: não há servidor para receber a mensagem
    form.reset();
    const ok = document.getElementById("form-ok");
    ok.hidden = false;
    ok.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// 4. Novidades: a faixa anda sozinha e também pelos botões ‹ ›
const rail = document.getElementById("rail");
if (rail) {
  const passo = () => (rail.querySelector(".card")?.offsetWidth || 300) + 20;
  const mover = (dir) => {
    const fim = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 5;
    if (dir > 0 && fim) rail.scrollTo({ left: 0, behavior: "smooth" });
    else rail.scrollBy({ left: dir * passo(), behavior: "smooth" });
  };
  document.querySelectorAll(".rail-btn").forEach((b) => b.addEventListener("click", () => mover(Number(b.dataset.dir))));
  let pausado = false;
  ["mouseenter", "touchstart", "focusin"].forEach((ev) => rail.addEventListener(ev, () => (pausado = true), { passive: true }));
  ["mouseleave", "touchend", "focusout"].forEach((ev) => rail.addEventListener(ev, () => (pausado = false), { passive: true }));
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(() => { if (!pausado) mover(1); }, 3200);
}

// 5. Botões de categoria na página inicial
const chips = document.querySelectorAll(".chip");
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.toggle("ativo", c === chip));
    const cat = chip.dataset.cat;
    document.querySelectorAll(".cat-sec").forEach((sec) => (sec.hidden = cat !== "todos" && sec.dataset.cat !== cat));
  });
});
