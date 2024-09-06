const questions = [
    // Ejemplo de preguntas, reemplaza con tus propias preguntas
    { question: "¿Cuál es la primera ley del movimiento de Newton?", 
        options: [
        "Ley de la Gravedad", 
        "Ley de la Inercia", 
        "Ley de Acción y Reacción", 
        "Ley de la Fuerza"], 
        answer: 1 },

    { question: "¿Qué establece la segunda ley del movimiento de Newton?", 
        options: [
        "La fuerza es igual a la masa por la aceleración", 
        "Para cada acción, hay una reacción opuesta", 
        "Un objeto en reposo permanecerá en reposo", 
        "La fuerza de gravedad aumenta con la distancia"], 
        answer: 0 },

    { question: "¿Cómo se define la fuerza en términos de las leyes de Newton?", 
        options: [
        "La resistencia al movimiento", 
        "La tasa de cambio de momento", 
        "La aceleración producida por un objeto", 
        "La capacidad de un objeto para cambiar su velocidad"], 
        answer: 1 },

    { question: "Si un objeto tiene una masa de 10 kg y experimenta una aceleración de 2 m/s², ¿cuál es la fuerza que actúa sobre él?", 
        options: [
        "5 N", 
        "20 N", 
        "10 N", 
        "30 N"], 
        answer: 1 },

    { question: "Según la tercera ley de Newton, si un objeto A ejerce una fuerza sobre un objeto B, ¿qué ocurre con la fuerza que ejerce el objeto B sobre el objeto A?", 
        options: [
        "La fuerza es menor", 
        "La fuerza es mayor", 
        "La fuerza es igual y opuesta", 
        "La fuerza es inexistente"], 
        answer: 2 },
    
    { question: "¿Qué tipo de fuerza mantiene un objeto en movimiento circular?", 
        options: [
        "Fuerza de fricción", 
        "Fuerza normal", 
        "Fuerza centrípeta", 
        "Fuerza de gravedad"], 
        answer: 2 },

    { question: "¿Cuál es la unidad de medida de la fuerza en el Sistema Internacional?", 
        options: [
        "Joule.", 
        "Watt", 
        "Newton.", 
        "Pascal"], 
        answer: 2 },

    { question: "Si un objeto está en equilibrio, ¿qué podemos decir sobre las fuerzas que actúan sobre él?", 
        options: [
        "Las fuerzas están en equilibrio", 
        "La fuerza neta es cero", 
        "Hay una fuerza dominante", 
        "La aceleración es máxima"], 
        answer: 1 },

    { question: "¿Cuál es la relación entre masa, fuerza y aceleración según la segunda ley de Newton?", 
        options: [
        "F = m + a", 
        "a = F/m", 
        "F = m/a", 
        "m = F * a"], 
        answer: 1 },

    { question: "En un sistema cerrado y aislado, si se aplican dos fuerzas iguales y opuestas sobre dos cuerpos diferentes, ¿qué pasa con el movimiento de los cuerpos?", 
        options: [
        "Ambos cuerpos se mueven a la misma velocidad",
        "Ambos cuerpos se mueven en la misma dirección",
        "Los cuerpos no se mueven si están en equilibrio",
        "Los cuerpos se mueven con aceleraciones diferentes"],
        answer: 3 }

];

let currentQuestionIndex = 0;
let score = 0;
let timer;
const totalQuestions = questions.length;
const timeLimit = 10 * 60 * 1000; // 10 minutos en milisegundos

function startTest() {
    const studentName = document.getElementById('student-name').value.trim();
    
    // Expresión regular para permitir solo letras y sílabas en español, incluidas tildes y ñ
    const namePattern = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/;

    // Validar que el nombre tenga al menos 5 caracteres y solo contenga caracteres permitidos
    if (studentName.length < 5) {
        alert('El nombre debe tener al menos 5 caracteres.');
        return;
    }
    if (!namePattern.test(studentName)) {
        alert('El nombre solo debe contener letras, tildes y ñ.');
        return;
    }
    
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('test-screen').style.display = 'block';
    loadQuestion();
    startTimer();
}


function loadQuestion() {
    const questionData = questions[currentQuestionIndex];
    document.getElementById('question').innerText = questionData.question;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    questionData.options.forEach((option, index) => {
        const optionHtml = `<label><input type="radio" name="option" value="${index}"> ${option}</label>`;
        optionsDiv.innerHTML += optionHtml;
    });
    document.getElementById('next-button').style.display = currentQuestionIndex < totalQuestions - 1 ? 'block' : 'none';
    document.getElementById('finish-button').style.display = currentQuestionIndex === totalQuestions - 1 ? 'block' : 'none';
}

function nextQuestion() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const answer = parseInt(selectedOption.value);
        if (answer === questions[currentQuestionIndex].answer) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
            loadQuestion();
        } else {
            finishTest();
        }
    } else {
        alert('Por favor, selecciona una opción.');
    }
}

function finishTest() {
    clearInterval(timer);
    document.getElementById('test-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    document.getElementById('result-text').innerText = `Nombre: ${document.getElementById('student-name').value}\nPuntaje: ${score+1} de ${totalQuestions}`;
}

function restartTest() {
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    clearInterval(timer);
    document.getElementById('time').innerText = '10:00';
}

function startTimer() {
    let timeRemaining = timeLimit;
    const timerElement = document.getElementById('time');
    timer = setInterval(() => {
        timeRemaining -= 1000;
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);
        timerElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            finishTest();
        }
    }, 1000);
}


