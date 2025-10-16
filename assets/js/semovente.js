const valoresMacho = {
    RO: 'R$ 272,50',
    RR: 'R$ 1.400,00',
    AM: 'R$ 1.250,00',
}
const valoresFemea = {
    RO: 'R$ 252,50',
    RR: 'R$ 1.300,00',
    AM: 'R$ 1.150,00',
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('estado').addEventListener('change', function () {
        const estado = this.value
        const machoSpan = document.getElementById('valor-macho')
        const femeaSpan = document.getElementById('valor-femea')
        machoSpan.textContent = valoresMacho[estado] || 'R$ 0,00'
        femeaSpan.textContent = valoresFemea[estado] || 'R$ 0,00'
        localStorage.setItem('valor-macho', machoSpan.textContent)
        localStorage.setItem('valor-femea', femeaSpan.textContent)
    })

    // Carregar valor salvo do localStorage, se existir
    const machoSpan = document.getElementById('valor-macho')
    const femeaSpan = document.getElementById('valor-femea')
    const machoSalvo = localStorage.getItem('valor-macho')
    const femeaSalvo = localStorage.getItem('valor-femea')
    const estadoInicial = document.getElementById('estado').value
    machoSpan.textContent =
        machoSalvo || valoresMacho[estadoInicial] || 'R$ 0,00'
    femeaSpan.textContent =
        femeaSalvo || valoresFemea[estadoInicial] || 'R$ 0,00'

    machoSpan.addEventListener('input', function () {
        localStorage.setItem('valor-macho', machoSpan.textContent)
    })
    femeaSpan.addEventListener('input', function () {
        localStorage.setItem('valor-femea', femeaSpan.textContent)
    })

    const machoInputs = document.querySelectorAll('input[type="number"].macho')
    const femeaInputs = document.querySelectorAll('input[type="number"].femea')
    const somatoriaInput = document.querySelector('#somatoria')

    function mostrarValores(array) {
        const valores = Array.from(array).map((input) => input.value || 0)
        return valores
    }

    function adicionarTotal(array, totalID) {
        const total = mostrarValores(array).reduce(
            (acc, val) => acc + Number(val),
            0
        )
        document.querySelector(`#${totalID} input`).value = total
        return total
    }

    function atualizarSomatoriaTotal() {
        const machoTotal = adicionarTotal(machoInputs, 'machoTotal')
        const femeaTotal = adicionarTotal(femeaInputs, 'femeaTotal')
        if (somatoriaInput) {
            somatoriaInput.value = machoTotal + femeaTotal
        }
    }

    function atualizarTabelaAvaliacao() {
        // Utiliza o valor editado pelo usuário nos campos contenteditable
        const machoSpan = document.getElementById('valor-macho')
        const femeaSpan = document.getElementById('valor-femea')
        const valorMacho = Number(
            machoSpan.textContent.replace(/[^\d,]/g, '').replace(',', '.')
        )
        const valorFemea = Number(
            femeaSpan.textContent.replace(/[^\d,]/g, '').replace(',', '.')
        )

        const machoFaixa = [
            document.getElementById('macho0_12'),
            document.getElementById('macho13_24'),
            document.getElementById('macho25_36'),
            document.getElementById('macho36mais'),
        ]
        const femeaFaixa = [
            document.getElementById('femea0_12'),
            document.getElementById('femea13_24'),
            document.getElementById('femea25_36'),
            document.getElementById('femea36mais'),
        ]
        const arrobaMFaixa = [
            document.getElementById('arrobaM0_12'),
            document.getElementById('arrobaM13_24'),
            document.getElementById('arrobaM25_36'),
            document.getElementById('arrobaM36mais'),
        ]
        const arrobaFFaixa = [
            document.getElementById('arrobaF0_12'),
            document.getElementById('arrobaF13_24'),
            document.getElementById('arrobaF25_36'),
            document.getElementById('arrobaF36mais'),
        ]

        const tabelaAvaliacao = document.querySelectorAll(
            'section table:nth-of-type(3) tbody tr'
        )
        let totalRebanho = 0
        for (let i = 0; i < 4; i++) {
            const machoQtd = Number(machoFaixa[i]?.value || 0)
            const femeaQtd = Number(femeaFaixa[i]?.value || 0)
            const machoArroba = Number(arrobaMFaixa[i]?.value || 0)
            const femeaArroba = Number(arrobaFFaixa[i]?.value || 0)

            const valorMachoFaixa = machoQtd * machoArroba * valorMacho
            const valorFemeaFaixa = femeaQtd * femeaArroba * valorFemea
            const totalFaixa = valorMachoFaixa + valorFemeaFaixa
            totalRebanho += totalFaixa
            const linha = tabelaAvaliacao[i]
            if (linha) {
                const tdMacho = linha.children[1].querySelector('input')
                const tdFemea = linha.children[2].querySelector('input')
                const tdTotal = linha.children[3].querySelector('input')
                if (tdMacho)
                    tdMacho.value = valorMachoFaixa
                        ? valorMachoFaixa.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                          })
                        : ''
                if (tdFemea)
                    tdFemea.value = valorFemeaFaixa
                        ? valorFemeaFaixa.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                          })
                        : ''
                if (tdTotal)
                    tdTotal.value = totalFaixa
                        ? totalFaixa.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                          })
                        : ''
            }
        }
        const campoTotalRebanho = document.querySelectorAll(
            'td.px-4.py-2.text-center input.p-1.w-32'
        )[0]
        if (campoTotalRebanho) {
            campoTotalRebanho.value = totalRebanho
                ? totalRebanho.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                  })
                : ''
        }
        const campoMedioRebanho = document.querySelectorAll(
            'td.px-4.py-2.text-center input.p-1.w-32'
        )[1]
        const somatoria = Number(
            document.getElementById('somatoria').value.replace(/\D/g, '')
        )
        if (campoMedioRebanho) {
            let valorMedio = ''
            if (totalRebanho > 0 && somatoria > 0) {
                valorMedio = (totalRebanho / somatoria).toLocaleString(
                    'pt-BR',
                    { style: 'currency', currency: 'BRL' }
                )
            }
            campoMedioRebanho.value = valorMedio
        }
    }

    function atualizarTudo() {
        atualizarSomatoriaTotal()
        atualizarDeclaracao()
        atualizarTabelaAvaliacao()
    }

    machoInputs.forEach((input) => {
        input.addEventListener('input', atualizarTudo)
    })
    femeaInputs.forEach((input) => {
        input.addEventListener('input', atualizarTudo)
    })
    const arrobasInputs = [
        document.getElementById('arrobaM0_12'),
        document.getElementById('arrobaF0_12'),
        document.getElementById('arrobaM13_24'),
        document.getElementById('arrobaF13_24'),
        document.getElementById('arrobaM25_36'),
        document.getElementById('arrobaF25_36'),
        document.getElementById('arrobaM36mais'),
        document.getElementById('arrobaF36mais'),
    ]
    arrobasInputs.forEach((input) => {
        input.addEventListener('input', atualizarTabelaAvaliacao)
    })
    document.getElementById('estado').addEventListener('change', atualizarTudo)

    atualizarTudo()
})

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
    },
})

function copyToClipboard() {
    const declaracaoText = document.getElementById('declaracao').innerText
    navigator.clipboard
        .writeText(declaracaoText)
        .then(() => {
            Toast.fire({
                icon: 'success',
                title: 'Declaração copiada para a área de transferência!',
            })
        })
        .catch((err) => {
            console.error('Erro ao copiar texto: ', err)
        })
}

function atualizarDeclaracao() {
    const orgao = document.getElementById('orgao-emissor').value || '-'
    const numDec = document.getElementById('numero-declaracao').value || '-'
    const macho0_12 =
        document.querySelectorAll('tbody input.macho')[0]?.value || '0'
    const femea0_12 =
        document.querySelectorAll('tbody input.femea')[0]?.value || '0'
    const macho13_24 =
        document.querySelectorAll('tbody input.macho')[1]?.value || '0'
    const femea13_24 =
        document.querySelectorAll('tbody input.femea')[1]?.value || '0'
    const macho24_36 =
        document.querySelectorAll('tbody input.macho')[2]?.value || '0'
    const femea24_36 =
        document.querySelectorAll('tbody input.femea')[2]?.value || '0'
    const total =
        Number(document.querySelector('#machoTotal input').value || 0) +
        Number(document.querySelector('#femeaTotal input').value || 0)

    const texto = `Declaração ${orgao} Nº ${numDec} / 0 a 12 meses: ${macho0_12}M e ${femea0_12}F / 13 a 24 meses: ${macho13_24}M e ${femea13_24}F / 24 a 36 meses: ${macho24_36}M e ${femea24_36}F.<br>Produtividade: REBANHO BOVINHO COM ${total} UNIDADES, CONFORME A DECLARACAO ${orgao} Nº ${numDec}.`
    document.getElementById('declaracao').innerHTML = texto
}

document
    .getElementById('orgao-emissor')
    .addEventListener('input', atualizarDeclaracao)
document
    .getElementById('numero-declaracao')
    .addEventListener('input', atualizarDeclaracao)
