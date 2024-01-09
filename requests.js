function getRandomColor() {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    return `rgba(${red}, ${green}, ${blue}, ${0.65})`;
}

const stocksDiv = document.getElementById('stocks');

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        authorization: `Bearer ${localStorage.getItem('token')}`,
    }
};
try {
    fetch('https://www.nuinvest.com.br/api/samwise/v2/custody-position', options)
        .then(response => response.json())
        .then(response => {
            let stocksCount = 0;
            let fiisCount = 0;

            response.investments.forEach(stock => {
                if (!stock.stockCode || !stock.financialCurrentValue || !stock.lastPrice) return;
                const stockDiv = document.createElement('div');
                stockDiv.textContent = `Código da Ação: ${stock.stockCode}, Último Preço: ${stock.lastPrice}`;
                stocksDiv.appendChild(stockDiv);

                if (stock.marketCode === 'Ação') {
                    stocksCount++;
                } else if (stock.marketCode === 'FII') {
                    fiisCount++;
                }
            });

            const ctx = document.getElementById('myChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Ações', 'FIIs'],
                    datasets: [{
                        data: [stocksCount, fiisCount],
                        borderColor: ['rgb(253, 253, 150)', 'rgb(150, 111, 214)'],
                        backgroundColor: ['rgb(253, 253, 150)', 'rgb(150, 111, 214)'],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: 'rgb(255, 255, 255)',
                            }
                        },
                        title: {
                            display: true,
                            text: 'Distribuição de Investimentos',
                            color: 'rgb(255, 255, 255)',
                        }
                    }
                },
            });

            let totalCapital = response.investments.reduce((total, stock) => total + stock.financialValueCurrent, 0);

            let percentages = response.investments.map(stock => ((stock.financialValueCurrent / totalCapital) * 100).toFixed(2));

            // Crie um array de labels para o gráfico
            let labels = response.investments.map(stock => stock.stockCode);

            // Crie o gráfico
            let colors = getRandomColor;
            let ctx2 = document.getElementById('myChart2').getContext('2d');
            new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: percentages,
                        backgroundColor: colors,
                        borderColor: colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: 'rgb(255, 255, 255)',
                            }
                        },
                        title: {
                            display: true,
                            text: 'Distribuição da carteira por ativo (Ação e FIIS)',
                            color: 'rgb(255, 255, 255)',
                        }
                    }
                },
            });
        });
} catch (error) {
    console.error(error);
    localStorage.clear();
    window.location.href = 'index.html';
}