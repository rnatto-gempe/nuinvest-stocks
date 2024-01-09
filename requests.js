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
        });
} catch (error) {
    console.error(error);
    localStorage.clear();
    window.location.href = 'index.html';
}