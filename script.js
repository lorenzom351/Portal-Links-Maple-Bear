/* ==========================================================================
   Hero: rotação de fotos (crossfade).
   - A primeira foto vem no HTML; as demais só são baixadas pouco antes de aparecerem.
   - Sem JS, fica apenas a primeira foto.
   - Respeita prefers-reduced-motion e "economia de dados"; pausa com a aba oculta.
   ========================================================================== */
(() => {
    const INTERVAL = 4000; // tempo (ms) que cada foto permanece na tela

    const hero = document.querySelector(".hero");
    if (!hero) return;

    const slides = [...hero.querySelectorAll(".hero__slide")];
    if (slides.length < 2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = navigator.connection && navigator.connection.saveData;

    let current = 0;
    let timer = null;

    // Baixa e decodifica a foto (uma vez) antes de exibi-la.
    const load = (img) => {
        if (img.dataset.srcset) {
            img.sizes = "100vw";
            img.srcset = img.dataset.srcset;
            delete img.dataset.srcset;
        }
        if (!img.decode) return Promise.resolve();
        // Nunca trava a rotação: se a decodificação demorar, segue mesmo assim.
        const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
        return Promise.race([img.decode().catch(() => {}), timeout]);
    };

    const preloadNext = () => {
        const next = slides[(current + 1) % slides.length];
        if ("requestIdleCallback" in window) {
            requestIdleCallback(() => load(next), { timeout: 2000 });
        } else {
            setTimeout(() => load(next), 200);
        }
    };

    const show = (index) =>
        load(slides[index]).then(() => {
            slides[current].classList.remove("is-active");
            slides[index].classList.add("is-active");
            current = index;
            preloadNext();
        });

    const schedule = () => {
        clearTimeout(timer);
        timer = null;
        if (reducedMotion.matches || document.hidden) return;
        timer = setTimeout(() => show((current + 1) % slides.length).then(schedule), INTERVAL);
    };

    const start = () => {
        if (saveData) return;
        document.addEventListener("visibilitychange", schedule);
        reducedMotion.addEventListener("change", schedule);
        schedule();
        preloadNext();
    };

    // Só começa depois que a página (e a primeira foto) terminaram de carregar.
    if (document.readyState === "complete") {
        start();
    } else {
        window.addEventListener("load", start, { once: true });
    }
})();
