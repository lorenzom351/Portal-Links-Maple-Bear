// Aguarda o conteúdo da página ser totalmente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Função para animar a entrada dos itens da lista (Stagger Effect)
    function animateLinkItems() {
        const linksList = document.querySelector('.links-list');
        const listItems = linksList.querySelectorAll('li');

        if (!linksList || listItems.length === 0) {
            console.warn('Elementos da lista de links não encontrados.');
            return;
        }

        // Percorre cada item da lista para aplicar um atraso na transição
        listItems.forEach((item, index) => {
            // A cada item, o atraso é incrementado em 100ms
            item.style.transitionDelay = `${index * 100}ms`;
        });

        // Adiciona a classe 'loaded' ao pai (UL) para iniciar a animação
        // A transição é definida no CSS
        linksList.classList.add('loaded');
    }

    // Chama a função de animação
    animateLinkItems();

});