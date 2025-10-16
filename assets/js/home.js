function filtrarCards() {
    const tipo = document.getElementById('filtro-tipo').value
    const texto = document.getElementById('filtro-texto').value.toLowerCase()
    const cards = document.querySelectorAll('section.grid > div')
    cards.forEach((card) => {
        let mostra = true
        if (tipo) {
            mostra = card.classList.contains(tipo)
        }
        if (mostra && texto) {
            mostra = card.textContent.toLowerCase().includes(texto)
        }
        card.style.display = mostra ? '' : 'none'
    })
}
document.getElementById('btn-filtrar').addEventListener('click', filtrarCards)
document.getElementById('filtro-tipo').addEventListener('change', filtrarCards)
document.getElementById('filtro-texto').addEventListener('input', filtrarCards)
