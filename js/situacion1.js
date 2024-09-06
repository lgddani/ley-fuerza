// Constante de gravedad
const gravedad = 9.81; // m/s^2

document.getElementById('calcularBtn').disabled = true;

// Función para habilitar/deshabilitar el botón de calcular
function checkInputs() {
    const masa1 = document.getElementById("masa1").value;
    const masas2 = [
        document.getElementById("masa2-1").value,
        document.getElementById("masa2-2").value,
        document.getElementById("masa2-3").value,
        document.getElementById("masa2-4").value,
        document.getElementById("masa2-5").value
    ];

    const allFilled = masa1 && masas2.every(masa => masa !== "");

    document.getElementById('calcularBtn').disabled = !allFilled;
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', checkInputs);
});

function calcular() {
    // Obtener los valores de las masas
    const masa1 = parseFloat(document.getElementById("masa1").value);
    const masa2Array = [
        parseFloat(document.getElementById("masa2-1").value),
        parseFloat(document.getElementById("masa2-2").value),
        parseFloat(document.getElementById("masa2-3").value),
        parseFloat(document.getElementById("masa2-4").value),
        parseFloat(document.getElementById("masa2-5").value)
    ];

    // Verificar que masa1 esté en el rango permitido
    if (isNaN(masa1) || masa1 < 0.03 || masa1 > 0.5) {
        alert("Por favor, ingrese un valor de Masa 1 entre 0.03 y 0.5.");
        return;  // Detener la función si masa1 no está en el rango
    }

    // Verificar que todas las masas en masa2Array estén en el rango permitido
    for (let i = 0; i < masa2Array.length; i++) {
        if (isNaN(masa2Array[i]) || masa2Array[i] < 0.03 || masa2Array[i] > 0.3) {
            alert(`Por favor, ingrese un valor de Masa 2 - ${i+1} entre 0.03 y 0.3.`);
            return;  // Detener la función si alguna masa2 no está en el rango
        }
    }

    // Si todas las validaciones pasan, realizar los cálculos
    let resultados = [];
    let aceleraciones = [];
    let fuerzas = [];

    masa2Array.forEach(masa2 => {
        const aceleracion = (masa2 * gravedad) / (masa1 + masa2);
        const fuerza = masa1 * aceleracion;

        resultados.push({
            masa1: masa1.toFixed(2),
            masa2: masa2.toFixed(2),
            aceleracion: aceleracion.toFixed(2),
            fuerza: fuerza.toFixed(2)
        });

        aceleraciones.push(aceleracion);
        fuerzas.push(fuerza);
    });

    mostrarResultados(resultados);
    dibujarGrafica(aceleraciones, fuerzas);

    // Habilitar el botón de guardar en PDF
    document.getElementById('guardarPDFBtn').disabled = false;
}

function mostrarResultados(resultados) {
    const resultadosDiv = document.getElementById("resultados");
    const tabla = document.getElementById('resultadosTabla').getElementsByTagName('tbody')[0];
    tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

    resultados.forEach(resultado => {
        const fila = tabla.insertRow();

        fila.insertCell(0).innerText = resultado.masa1;
        fila.insertCell(1).innerText = resultado.masa2;
        fila.insertCell(2).innerText = resultado.aceleracion;
        fila.insertCell(3).innerText = resultado.fuerza;

        const botonSimular = document.createElement('button');
        botonSimular.innerText = 'Simular';
        botonSimular.className = 'btn-simular';
        botonSimular.onclick = function() {
            simular(parseFloat(resultado.masa1), parseFloat(resultado.masa2), parseFloat(resultado.aceleracion), parseFloat(resultado.fuerza));
        };
        fila.insertCell(4).appendChild(botonSimular);
    });

    resultadosDiv.style.display = "block";
    document.getElementById('simCanvas').style.display = 'block';
    document.getElementById('guardarPDFBtn').style.display = 'block';

}

function simular(masa1, masa2, aceleracion, fuerza) {
    const canvas = document.getElementById("simCanvas");
    const ctx = canvas.getContext("2d");

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración de la simulación
    const mesonX = 30;
    const mesonY = canvas.height / 2;
    const mesonWidth = 300;  // Ajustado para el tamaño del canvas más pequeño
    const mesonHeight = 10;

    const masa1Width = 30;
    const masa1Height = 30;
    const masa2Width = 30;
    const masa2Height = 30;

    const poleaRadius = 8;
    const poleaX = mesonX + mesonWidth + 20;
    const poleaY = mesonY - mesonHeight / 2 - 15;

    const velocidad = aceleracion * 5; // Escala de velocidad ajustada para el tamaño más pequeño

    // Posiciones iniciales
    let masa1X = mesonX;
    let masa1Y = mesonY - mesonHeight / 2 - masa1Height;
    let masa2X = poleaX + poleaRadius - 5;
    let masa2Y = poleaY + poleaRadius;

    // Definir el límite para detener la animación
    const limiteInferior = canvas.height - masa2Height;

    // Variable para controlar la animación
    let animacionEnCurso = true;

    // Dibujar el mesón
    ctx.fillStyle = "#888";
    ctx.fillRect(mesonX, mesonY - mesonHeight / 2, mesonWidth, mesonHeight);

    // Dibujar la polea
    ctx.beginPath();
    ctx.arc(poleaX, poleaY, poleaRadius, 0, Math.PI * 2, true);
    ctx.fillStyle = "white";
    ctx.fill();

    // Animación
    const duracion = 3000; // Duración de la animación en ms
    const interval = 20; // Intervalo de actualización en ms
    const frames = duracion / interval;
    const pasoX = velocidad / frames;
    const pasoY = pasoX;

    function animar() {
        if (!animacionEnCurso) return; // Salir si la animación ha terminado

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas

        // Redibujar el mesón y la polea
        ctx.fillStyle = "#888";
        ctx.fillRect(mesonX, mesonY - mesonHeight / 2, mesonWidth, mesonHeight);

        ctx.beginPath();
        ctx.arc(poleaX, poleaY, poleaRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = "white";
        ctx.fill();

        // Dibujar cuerda desde masa1 hasta polea
        ctx.beginPath();
        ctx.moveTo(masa1X + masa1Width, masa1Y + masa1Height / 2); // Cuerda horizontal
        ctx.lineTo(poleaX, poleaY); // Punto en la polea
        ctx.lineTo(poleaX, masa2Y); // Cuerda vertical, usa poleaX para una línea recta
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dibujar masa 1
        ctx.fillStyle = "#FF5733";
        ctx.fillRect(masa1X, masa1Y, masa1Width, masa1Height);

        // Dibujar masa 2
        ctx.fillStyle = "#33C1FF";
        ctx.fillRect(masa2X - masa2Width / 2, masa2Y, masa2Width, masa2Height);

        // Actualizar posiciones
        masa1X += pasoX;
        masa2Y += pasoY;

        // Verificar si masa2 ha alcanzado el límite inferior del canvas
        if (masa2Y >= limiteInferior) {
            masa2Y = limiteInferior; // Ajustar posición para no pasar el límite
            animacionEnCurso = false; // Detener la animación
        }

        requestAnimationFrame(animar);
    }

    animar();
}

function dibujarGrafica(aceleraciones, fuerzas) {
    const ctx = document.getElementById('graficaCanvas').getContext('2d');

    // Calcular la línea de ajuste por mínimos cuadrados
    const n = aceleraciones.length;
    const sumX = aceleraciones.reduce((a, b) => a + b, 0);
    const sumY = fuerzas.reduce((a, b) => a + b, 0);
    const sumXY = aceleraciones.reduce((sum, x, i) => sum + x * fuerzas[i], 0);
    const sumX2 = aceleraciones.reduce((sum, x) => sum + x * x, 0);
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    // Datos para la gráfica
    const data = {
        labels: aceleraciones,
        datasets: [{
            label: 'Datos',
            data: fuerzas,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)'
        }, {
            label: 'Ajuste Lineal',
            data: aceleraciones.map(x => m * x + b),
            type: 'line',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false
        }]
    };

    new Chart(ctx, {
        type: 'scatter',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Aceleración (m/s²)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Fuerza (N)'
                    }
                }
            }
        }
    });

    document.getElementById('graficaContainer').style.display = 'block';

    // Mostrar la ecuación en el div
    document.getElementById('ecuacionRecta').style.display = 'block';
    document.getElementById('ecuacionTexto').innerText = `y = ${m.toFixed(2)}x + ${b.toFixed(2)}`;

}

async function guardarPDF() {
    const { jsPDF } = window.jspdf;

    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Añadir título y subtítulos
    doc.setFontSize(16);
    doc.text('UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE', 105, 20, { align: 'center'}); // Título centrado

    doc.setFontSize(12);
    doc.text('Departamento de Ciencias Exactas -  Física 1', 105, 30, { align: 'center' }); // Primer subtítulo
    doc.text('Resultados de la Relación directamente proporcial', 105, 40, { align: 'center' }); // Segundo subtítulo

    // var image = new Image();
    // image.src = "../img/espe.png";
    // doc.addImage(image, 'PNG', 105, 45, 50, 50);

    // Capturar la tabla de resultados
    const tabla = document.getElementById('resultados');
    doc.autoTable({ html: '#resultadosTabla', startY: 60 });

    // Capturar la gráfica
    const canvasGrafica = document.getElementById('graficaCanvas');
    if (canvasGrafica) {
        try {
            const canvasImg = canvasGrafica.toDataURL('image/png');
            doc.addImage(canvasImg, 'PNG', 10, 120, 180, 100);
        } catch (error) {
            console.error('Error al capturar la gráfica:', error);
        }
    }

    // Capturar la ecuación
    const ecuacionTexto = document.getElementById('ecuacionTexto').innerText;
    if (ecuacionTexto) {
        try {
            doc.text('Ecuación de la Recta:', 10, 250);
            doc.text(ecuacionTexto, 10, 260);
        } catch (error) {
            console.error('Error al agregar la ecuación:', error);
        }
    }

    // Guardar el PDF
    doc.save('simulacion.pdf');
}


async function fetchImageAsDataUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}



