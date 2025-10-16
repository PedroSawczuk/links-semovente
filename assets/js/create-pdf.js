
async function generatePDF() {
    const pdfDoc = await PDFLib.PDFDocument.create()

    const page = pdfDoc.addPage([595, 842])
    const { height } = page.getSize()

    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)

    const imageUrl = '../assets/img/logo.png'
    try {
        const imageBytes = await fetch(imageUrl).then((res) =>
            res.arrayBuffer()
        )
        const image = await pdfDoc.embedPng(imageBytes)
        const imageDims = image.scale(0.1)
        page.drawImage(image, {
            x: 50,
            y: height - 20 - imageDims.height,
            width: imageDims.width,
            height: imageDims.height,
            opacity: 0.5,
        })
    } catch (e) {}

    const titulo = 'Relatório - Semovente'
    const titleSize = 30
    const textWidth = font.widthOfTextAtSize(titulo, titleSize)
    const x = (595 - textWidth) / 2
    page.drawText(titulo, {
        x,
        y: height - 120,
        size: titleSize,
        font,
        color: PDFLib.rgb(0.49, 0.713, 0.109),
        fontWeight: 'bold',
    })

    page.drawText('Totais do Rebanho:', {
        x: 370,
        y: height - 170,
        size: 14,
        font,
        color: PDFLib.rgb(0.49, 0.713, 0.109),
    })

    const campoTotalRebanho = document.querySelectorAll(
        'td.px-4.py-2.text-center input.p-1.w-32'
    )[0]
    let valorTotalRebanho = campoTotalRebanho?.value || ''
    valorTotalRebanho = valorTotalRebanho
        .replace(/[^\d,]/g, '')
        .replace(',', '.')
    valorTotalRebanho = valorTotalRebanho ? Number(valorTotalRebanho) : 0
    const valorTotalRebanhoFormatado = valorTotalRebanho.toLocaleString(
        'pt-BR',
        { style: 'currency', currency: 'BRL' }
    )
    page.drawText(`Valor total: ${valorTotalRebanhoFormatado}`, {
        x: 370,
        y: height - 185,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
    })

    const campoMedioRebanho = document.querySelectorAll(
        'td.px-4.py-2.text-center input.p-1.w-32'
    )[1]
    let valorMedioRebanho = campoMedioRebanho?.value || ''
    valorMedioRebanho = valorMedioRebanho
        .replace(/[^\d,]/g, '')
        .replace(',', '.')
    valorMedioRebanho = valorMedioRebanho ? Number(valorMedioRebanho) : 0
    const valorMedioRebanhoFormatado = valorMedioRebanho.toLocaleString(
        'pt-BR',
        { style: 'currency', currency: 'BRL' }
    )
    page.drawText(`Valor médio: ${valorMedioRebanhoFormatado}`, {
        x: 370,
        y: height - 200,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
    })

    const nomeProprietario =
        document.getElementById('nome-proprietario').value || 'Não Informado'
    const enderecoPropriedade =
        document.getElementById('endereco-propriedade').value || 'Não Informado'
    const areaPropriedade =
        document.getElementById('area-propriedade').value || '0'
    const orgaoEmissor =
        document.getElementById('orgao-emissor').value || 'Não Informado'
    const numeroDeclaracao =
        document.getElementById('numero-declaracao').value || '000000'
    const dataEmissao =
        document.getElementById('data-emissao').value || '00/00/0000'

    page.drawText('Informações do Proprietário:', {
        x: 50,
        y: height - 170,
        size: 14,
        font,
        color: PDFLib.rgb(0.49, 0.713, 0.109),
    })
    page.drawText(`Nome: ${nomeProprietario}`, {
        x: 50,
        y: height - 185,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
    })
    page.drawText(`Endereço: ${enderecoPropriedade}`, {
        x: 50,
        y: height - 200,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
    })
    page.drawText(`Área (ha): ${areaPropriedade}`, {
        x: 50,
        y: height - 215,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
    })
    page.drawText(`Órgão Emissor: ${orgaoEmissor}`, {
        x: 50,
        y: height - 230,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
    })
    page.drawText(`Nº Declaração: ${numeroDeclaracao}`, {
        x: 50,
        y: height - 245,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
    })
    page.drawText(`Data de Emissão: ${dataEmissao}`, {
        x: 50,
        y: height - 260,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
    })

    const tableStartY = height - 320

    const marginX = 40
    const tableWidth = 595 - marginX * 2
    const col1X = marginX + 50
    const col2X = marginX + 50 + tableWidth * 0.4
    const col3X = marginX + 50 + tableWidth * 0.7

    const AnimaisCadastradosSize = 16
    const animaisTitle = 'Animais cadastrados por faixa etária e sexo:'
    const animaisTextWidth = font.widthOfTextAtSize(
        animaisTitle,
        AnimaisCadastradosSize
    )
    const animaisX = (595 - animaisTextWidth) / 2

    page.drawText(animaisTitle, {
        x: animaisX,
        y: tableStartY + 20,
        size: AnimaisCadastradosSize,
        font,
        color: PDFLib.rgb(0.49, 0.713, 0.109),
    })

    const headerY = tableStartY - 25
    page.drawRectangle({
        x: marginX,
        y: headerY,
        width: tableWidth,
        height: 28,
        color: PDFLib.rgb(0.49, 0.713, 0.109),
        borderColor: PDFLib.rgb(0.0, 0.4, 0.15),
        borderWidth: 1,
    })

    page.drawText('Faixa Etária', {
        x: col1X,
        y: headerY + 10,
        size: 13,
        font,
        color: PDFLib.rgb(1, 1, 1),
    })
    page.drawText('Macho', {
        x: col2X,
        y: headerY + 10,
        size: 13,
        font,
        color: PDFLib.rgb(1, 1, 1),
    })
    page.drawText('Fêmea', {
        x: col3X,
        y: headerY + 10,
        size: 13,
        font,
        color: PDFLib.rgb(1, 1, 1),
    })

    const macho0_12 = document.getElementById('macho0_12').value || '0'
    const femea0_12 = document.getElementById('femea0_12').value || '0'
    const macho13_24 = document.getElementById('macho13_24').value || '0'
    const femea13_24 = document.getElementById('femea13_24').value || '0'
    const macho25_36 = document.getElementById('macho25_36').value || '0'
    const femea25_36 = document.getElementById('femea25_36').value || '0'
    const macho36mais = document.getElementById('macho36mais').value || '0'
    const femea36mais = document.getElementById('femea36mais').value || '0'

    const rows = [
        ['0 a 12 meses', macho0_12, femea0_12],
        ['13 a 24 meses', macho13_24, femea13_24],
        ['25 a 36 meses', macho25_36, femea25_36],
        ['+36 meses', macho36mais, femea36mais],
        [
            'Total',
            String(
                Number(macho0_12) +
                    Number(macho13_24) +
                    Number(macho25_36) +
                    Number(macho36mais)
            ),
            String(
                Number(femea0_12) +
                    Number(femea13_24) +
                    Number(femea25_36) +
                    Number(femea36mais)
            ),
        ],
        [
            'Somatória',
            '',
            String(
                Number(macho0_12) +
                    Number(macho13_24) +
                    Number(macho25_36) +
                    Number(macho36mais) +
                    Number(femea0_12) +
                    Number(femea13_24) +
                    Number(femea25_36) +
                    Number(femea36mais)
            ),
        ],
    ]

    rows.forEach((row, i) => {
        const y = headerY - 28 * (i + 1)

        page.drawRectangle({
            x: marginX,
            y: y - 5,
            width: tableWidth,
            height: 28,
            color:
                i % 2 === 0
                    ? PDFLib.rgb(0.95, 1, 0.95)
                    : PDFLib.rgb(0.98, 0.98, 1),
        })

        page.drawText(row[0], {
            x: col1X,
            y,
            size: 12,
            font,
            color: PDFLib.rgb(0.2, 0.2, 0.2),
        })
        page.drawText(row[1], {
            x: col2X,
            y,
            size: 12,
            font,
            color: PDFLib.rgb(0.1, 0.4, 0.2),
        })
        page.drawText(row[2], {
            x: col3X,
            y,
            size: 12,
            font,
            color: PDFLib.rgb(0.4, 0.2, 0.2),
        })
    })

    const arrobaSectionY = tableStartY - 220
    const arrobaTitle = 'Arrobas por Faixa Etária:'
    const arrobaTextWidth = font.widthOfTextAtSize(arrobaTitle, 16)
    const arrobaX = (595 - arrobaTextWidth) / 2
    page.drawText(arrobaTitle, {
        x: arrobaX,
        y: arrobaSectionY,
        size: 16,
        font,
        color: PDFLib.rgb(0.49, 0.713, 0.109),
    })

    const arrobaHeaderY = arrobaSectionY - 40
    page.drawRectangle({
        x: marginX,
        y: arrobaHeaderY - 5,
        width: tableWidth,
        height: 28,
        color: PDFLib.rgb(0.49, 0.713, 0.109),
        borderColor: PDFLib.rgb(0.0, 0.4, 0.15),
        borderWidth: 1,
    })
    page.drawText('Faixa Etária', {
        x: col1X,
        y: arrobaHeaderY + 5,
        size: 13,
        font,
        color: PDFLib.rgb(1, 1, 1),
    })
    page.drawText('Macho', {
        x: col2X,
        y: arrobaHeaderY + 5,
        size: 13,
        font,
        color: PDFLib.rgb(1, 1, 1),
    })
    page.drawText('Fêmea', {
        x: col3X,
        y: arrobaHeaderY + 5,
        size: 13,
        font,
        color: PDFLib.rgb(1, 1, 1),
    })

    const arrobaM0_12 = document.getElementById('arrobaM0_12').value || '0'
    const arrobaF0_12 = document.getElementById('arrobaF0_12').value || '0'
    const arrobaM13_24 = document.getElementById('arrobaM13_24').value || '0'
    const arrobaF13_24 = document.getElementById('arrobaF13_24').value || '0'
    const arrobaM25_36 = document.getElementById('arrobaM25_36').value || '0'
    const arrobaF25_36 = document.getElementById('arrobaF25_36').value || '0'
    const arrobaM36mais = document.getElementById('arrobaM36mais').value || '0'
    const arrobaF36mais = document.getElementById('arrobaF36mais').value || '0'

    const arrobaRows = [
        ['0 a 12 meses', arrobaM0_12, arrobaF0_12],
        ['13 a 24 meses', arrobaM13_24, arrobaF13_24],
        ['25 a 36 meses', arrobaM25_36, arrobaF25_36],
        ['+36 meses', arrobaM36mais, arrobaF36mais],
    ]

    arrobaRows.forEach((row, i) => {
        const y = arrobaHeaderY - 28 * (i + 1)

        page.drawRectangle({
            x: marginX,
            y: y - 5,
            width: tableWidth,
            height: 28,
            color:
                i % 2 === 0
                    ? PDFLib.rgb(0.95, 1, 0.95)
                    : PDFLib.rgb(0.98, 0.98, 1),
        })
        page.drawText(row[0], {
            x: col1X,
            y,
            size: 12,
            font,
            color: PDFLib.rgb(0.2, 0.2, 0.2),
        })
        page.drawText(row[1], {
            x: col2X,
            y,
            size: 12,
            font,
            color: PDFLib.rgb(0.1, 0.4, 0.2),
        })
        page.drawText(row[2], {
            x: col3X,
            y,
            size: 12,
            font,
            color: PDFLib.rgb(0.4, 0.2, 0.2),
        })
    })

    const date = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })

    page.drawText(`${date}`, {
        x: 525,
        y: 10,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
        opacity: 0.5,
    })

    const textSicoob = 'Sicoob Amazônia'
    page.drawText(`${textSicoob}`, {
        x: 8,
        y: 10,
        size: 12,
        font,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
        opacity: 0.5,
    })

    const pdfBytes = await pdfDoc.save()

    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    function formataNome(nome) {
        return nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '_')
            .replace(/[^\w\-]+/g, '')
    }

    const randomID = Math.floor(Math.random() * 999999 - 100000) + 100000

    link.download = `${randomID}-relatorio-${formataNome(nomeProprietario)}.pdf`
    link.click()
}