/**
 * Juego de preguntas sobre Riosa
 * Desarrollado con ECMAScript puro
 */

// Array de preguntas con sus opciones y respuesta correcta
const preguntas = [
    {
        pregunta: "¿Cuál es la capital del concejo de Riosa?",
        opciones: [
            "La Vega", 
            "Rioseco", 
            "La Paraya", 
            "La Felguera", 
            "Sama"
        ],
        respuestaCorrecta: 0  // La Vega
    },
    {
        pregunta: "¿Qué montaña emblemática se encuentra en Riosa?",
        opciones: [
            "Pico Ubiña", 
            "El Angliru", 
            "Picos de Europa", 
            "Peña Santa", 
            "Sierra del Aramo"
        ],
        respuestaCorrecta: 1  // El Angliru
    },
    {
        pregunta: "¿Qué río principal atraviesa el concejo de Riosa?",
        opciones: [
            "Río Nalón", 
            "Río Aller", 
            "Río Caudal", 
            "Río Riosa", 
            "Río Morcín"
        ],
        respuestaCorrecta: 3  // Río Riosa
    },
    {
        pregunta: "¿A qué altitud aproximada se encuentra La Vega, la capital de Riosa?",
        opciones: [
            "250 metros", 
            "400 metros", 
            "550 metros", 
            "700 metros", 
            "850 metros"
        ],
        respuestaCorrecta: 2  // 550 metros
    },
    {
        pregunta: "¿Cuál es la población aproximada del concejo de Riosa?",
        opciones: [
            "Menos de 1.000 habitantes", 
            "Entre 1.000 y 2.000 habitantes", 
            "Entre 2.000 y 3.000 habitantes", 
            "Entre 3.000 y 5.000 habitantes", 
            "Más de 5.000 habitantes"
        ],
        respuestaCorrecta: 1  // Entre 1.000 y 2.000 habitantes
    },
    {
        pregunta: "¿Qué actividad económica tradicional ha sido importante históricamente en Riosa?",
        opciones: [
            "Pesca", 
            "Agricultura intensiva", 
            "Minería del carbón", 
            "Industria textil", 
            "Producción vinícola"
        ],
        respuestaCorrecta: 2  // Minería del carbón
    },
    {
        pregunta: "¿Cuál de estos platos es típico de la gastronomía de Riosa?",
        opciones: [
            "Fabada asturiana", 
            "Cachopo", 
            "Verdinas con mariscos", 
            "Arroz con leche", 
            "Todas las anteriores son correctas"
        ],
        respuestaCorrecta: 4  // Todas las anteriores son correctas
    },
    {
        pregunta: "¿Qué celebración popular tiene lugar en Riosa durante el mes de octubre?",
        opciones: [
            "Fiestas de San Bartolomé", 
            "Festival de la Sidra", 
            "Mercado tradicional asturiano", 
            "Fiesta del Pastor", 
            "Fiestas de San Antonio"
        ],
        respuestaCorrecta: 3  // Fiesta del Pastor
    },
    {
        pregunta: "¿Qué monumento histórico destaca en el patrimonio cultural de Riosa?",
        opciones: [
            "Palacio renacentista", 
            "Iglesia de Santa Eulalia", 
            "Castillo medieval", 
            "Teatro romano", 
            "Puente romano"
        ],
        respuestaCorrecta: 1  // Iglesia de Santa Eulalia
    },
    {
        pregunta: "¿Con qué otros concejos limita Riosa?",
        opciones: [
            "Mieres, Lena y Quirós", 
            "Oviedo, Llanera y Gijón", 
            "Morcín, Quirós y Mieres", 
            "Langreo, San Martín y Laviana", 
            "Lena, Aller y Caso"
        ],
        respuestaCorrecta: 2  // Morcín, Quirós y Mieres
    }
];

// Variables globales
let preguntaActual = 0;
let respuestas = [];
let tiempoInicio;

// Elementos del DOM
const seccionJuego = document.getElementById('juego');
const seccionResultados = document.getElementById('resultados');
const textoResultado = document.getElementById('puntuacion');
const mensajeResultado = document.getElementById('mensaje');
const btnReiniciar = document.getElementById('reiniciar');

// Iniciar el juego cuando se cargue la página
document.addEventListener('DOMContentLoaded', iniciarJuego);

// Añadir evento para reiniciar el juego
btnReiniciar.addEventListener('click', iniciarJuego);

/**
 * Inicia el juego mostrando la primera pregunta
 */
function iniciarJuego() {
    preguntaActual = 0;
    respuestas = [];
    tiempoInicio = new Date();
    
    // Mostrar la sección de juego y ocultar la de resultados
    seccionJuego.hidden = false;
    seccionResultados.hidden = true;
    
    // Limpiar la sección del juego
    seccionJuego.innerHTML = '';
    
    // Mostrar la primera pregunta
    mostrarPregunta();
}

/**
 * Muestra la pregunta actual y sus opciones
 */
function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];
    
    // Crear el elemento para la pregunta actual
    const elementoPregunta = document.createElement('article');
    elementoPregunta.className = 'pregunta';
    
    // Añadir contador de preguntas
    const contador = document.createElement('p');
    contador.className = 'contador';
    contador.textContent = `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;
    elementoPregunta.appendChild(contador);
    
    // Añadir texto de la pregunta
    const tituloPregunta = document.createElement('h3');
    tituloPregunta.textContent = pregunta.pregunta;
    elementoPregunta.appendChild(tituloPregunta);
    
    // Crear formulario para las opciones
    const formOpciones = document.createElement('form');
    
    // Añadir las opciones como radio buttons
    pregunta.opciones.forEach((opcion, index) => {
        const labelOpcion = document.createElement('label');
        labelOpcion.className = 'opcion';
        
        const radioOpcion = document.createElement('input');
        radioOpcion.type = 'radio';
        radioOpcion.name = 'respuesta';
        radioOpcion.value = index;
        radioOpcion.id = `opcion${index}`;
        radioOpcion.required = true;
        
        const textoOpcion = document.createElement('span');
        textoOpcion.textContent = opcion;
        
        labelOpcion.appendChild(radioOpcion);
        labelOpcion.appendChild(textoOpcion);
        formOpciones.appendChild(labelOpcion);
    });
    
    // Botón para enviar la respuesta
    const btnResponder = document.createElement('button');
    btnResponder.type = 'submit';
    btnResponder.textContent = preguntaActual < preguntas.length - 1 ? 'Siguiente pregunta' : 'Finalizar juego';
    formOpciones.appendChild(btnResponder);
    
    // Evento de envío del formulario
    formOpciones.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener la opción seleccionada
        const seleccionada = document.querySelector('input[name="respuesta"]:checked');
        if (!seleccionada) {
            alert('Por favor, selecciona una respuesta.');
            return;
        }
        
        // Guardar la respuesta
        respuestas.push(parseInt(seleccionada.value));
        
        // Pasar a la siguiente pregunta o mostrar resultados
        if (preguntaActual < preguntas.length - 1) {
            preguntaActual++;
            mostrarPregunta();
        } else {
            mostrarResultados();
        }
    });
    
    elementoPregunta.appendChild(formOpciones);
    
    // Limpiar y añadir la pregunta a la sección del juego
    seccionJuego.innerHTML = '';
    seccionJuego.appendChild(elementoPregunta);
}

/**
 * Calcula y muestra los resultados del juego
 */
function mostrarResultados() {
    // Calcular puntuación
    let puntuacion = 0;
    let respuestasCorrectas = 0;
    
    respuestas.forEach((respuesta, index) => {
        if (respuesta === preguntas[index].respuestaCorrecta) {
            puntuacion += 1;
            respuestasCorrectas++;
        }
    });
    
    // Calcular tiempo empleado
    const tiempoFin = new Date();
    const tiempoEmpleado = Math.floor((tiempoFin - tiempoInicio) / 1000); // en segundos
    const minutos = Math.floor(tiempoEmpleado / 60);
    const segundos = tiempoEmpleado % 60;
    
    // Mostrar puntuación
    textoResultado.textContent = `Tu puntuación es: ${puntuacion} de 10 puntos.`;
    textoResultado.textContent += ` Has acertado ${respuestasCorrectas} de ${preguntas.length} preguntas.`;
    
    // Mensaje según la puntuación
    let mensaje;
    if (puntuacion >= 9) {
        mensaje = '¡Excelente! Eres un auténtico experto en Riosa.';
    } else if (puntuacion >= 7) {
        mensaje = 'Muy bien. Tienes un buen conocimiento de Riosa.';
    } else if (puntuacion >= 5) {
        mensaje = 'Aprobado. Conoces lo básico sobre Riosa.';
    } else {
        mensaje = 'Necesitas explorar más sobre Riosa. Te animamos a seguir leyendo nuestro sitio web.';
    }
    
    // Añadir tiempo empleado
    mensaje += ` Has tardado ${minutos} minutos y ${segundos} segundos en completar el test.`;
    mensajeResultado.textContent = mensaje;
    
    // Ocultar juego y mostrar resultados
    seccionJuego.hidden = true;
    seccionResultados.hidden = false;
    
    // Scroll hacia arriba para ver los resultados
    window.scrollTo(0, 0);
}   