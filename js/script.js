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
