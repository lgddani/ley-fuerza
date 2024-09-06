const masas = [2, 5, 10]; // kg
const aceleracion = 2; // m/s²
const fuerzas = masas.map(masa => masa * aceleracion); // F = m * a

// Crear la gráfica
const ctx = document.getElementById('fuerzaMasaChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Objeto 1', 'Objeto 2', 'Objeto 3'],
        datasets: [{
            label: 'Fuerza (N)',
            data: fuerzas,
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Fuerza (N)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Objetos'
                }
            }
        }
    }
});