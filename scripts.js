/*
[X] Pegar os dados do input quando o botão for clicado
[X] Ir até o servidor e trazer os produtos
[ ] Colocar os produtos na tela
[ ] Criar grafico de preços
*/

const searchForm = document.querySelector('.search-form')
const productList = document.querySelector('.product-list')
const priceChart = document.querySelector('.price-chart')
let myChart = ''

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    const inputValue = event.target[0].value

    //Acesso ao servidor do ML
    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`)

    //Alterando para formato json e colocando filtro de 0 a 10 resultados
    const products = (await data.json()).results.slice(0, 10)

    displayItems(products)
    updatePriceChart(products)
})

//Colocando as imagens e informações dos produtos na tela
function displayItems(products) {
    console.log(products)
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="product-price">${product.price.toLocaleString('pt-br', { style: "currency", currency: "BRL" })}</p>
            <p class="product-store">Loja: ${product.seller.nickname}</p>
            </div>
        `).join('')
}

function updatePriceChart(products) {
    const ctx = priceChart.getContext('2d')

    if (myChart) {
        myChart.destroy()
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(p=>p.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'preço [R$]',
                data: products.map(p => p.price),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidht: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return ('R$ ' + value.toLocaleString('pt-br', {
                                style: 'currency',
                                currency: 'BRL',
                            })
                            )
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Comparador De Preços',
                            font: {
                                size: 18,
                            },
                        },
                    },
                },
            },
        },
    })
}

// REGEX -> Regular Expressions (Expressões Regulares)
// replace ('.jpg -- w.jpg')
//gráfico - chart.js (https://www.chartjs.org/)
