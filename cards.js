/* ==========================================================================
   Seção "Nossas plataformas": gera os cards a partir de platforms.js.
   Para adicionar, remover ou editar uma plataforma, altere apenas platforms.js.
   ========================================================================== */
(() => {
    const list = document.getElementById("plataformas-lista");
    const platforms = window.PLATFORMS;
    const icons = window.ICONS || {};
    if (!list || !Array.isArray(platforms)) return;

    const SVG_NS = "http://www.w3.org/2000/svg";

    const el = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };

    const icon = (name, className) => {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.setAttribute("class", className);
        svg.innerHTML = icons[name] || "";
        return svg;
    };

    // Logo da marca (logos.js): monocromática, herda a cor do card via currentColor.
    const logo = (key) => {
        const data = (window.LOGOS || {})[key];
        if (!data) return null;
        const [, , w, h] = data.viewBox.split(" ").map(Number);
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", data.viewBox);
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.setAttribute("class", "card__logo-svg");
        svg.style.height = `${data.height}rem`;
        svg.style.aspectRatio = `${w} / ${h}`;
        svg.innerHTML = data.body;
        return svg;
    };

    // Só aceita links https absolutos; qualquer outra coisa vira "pendente".
    const hasValidUrl = (p) => typeof p.url === "string" && /^https:\/\//i.test(p.url);

    const stateOf = (p) => {
        if (p.estado === "indisponivel") return "indisponivel";
        if (p.estado === "pendente" || !hasValidUrl(p)) return "pendente";
        return "ativo";
    };

    const STATE_LABEL = {
        pendente: "Acesso em breve",
        indisponivel: "Temporariamente indisponível"
    };

    const buildCard = (p, index) => {
        const state = stateOf(p);
        const isLink = state === "ativo";
        const card = el(isLink ? "a" : "div", `card card--${state}`);
        card.style.setProperty("--i", index);

        const nameId = `plataforma-${p.id}-nome`;

        if (isLink) {
            card.href = p.url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";
            card.setAttribute("aria-labelledby", nameId);
        }

        const top = el("span", "card__top");
        const logoBox = el("span", "card__logo");
        const logoSvg = logo(p.logo);
        if (logoSvg) logoBox.append(logoSvg);
        top.append(logoBox, el("span", "card__num", String(index + 1).padStart(2, "0")));

        const name = el("span", "card__name", p.nome);
        name.id = nameId;
        if (isLink) name.append(el("span", "sr-only", " (abre em uma nova aba)"));

        const footer = el("span", "card__footer");
        footer.append(el("span", "card__action", isLink ? "Acessar" : STATE_LABEL[state]));
        if (isLink) footer.append(icon("arrow-up-right", "card__arrow"));

        card.append(top, name, footer);

        const item = el("li", "platforms__item");
        item.append(card);
        return item;
    };

    list.replaceChildren(...platforms.map(buildCard));
})();
