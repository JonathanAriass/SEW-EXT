class Meteorologia {
    constructor(apiKey, codigoMunicipio = "33037") {
        this.apiKey = apiKey;
        this.codigoMunicipio = codigoMunicipio;
        this.urlBase = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria";
        this.iniciar();
    }

    iniciar() {
        // Utilizamos un servicio JSONP para eludir las restricciones CORS
        const urlConProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(`${this.urlBase}/${this.codigoMunicipio}/?api_key=${this.apiKey}`)}`;
        
        $.ajax({
            url: urlConProxy,
            method: "GET",
            dataType: "json"
        })
            .done((respuestaProxy) => {
                try {
                    // La respuesta viene dentro de la propiedad "contents" como string
                    const respuesta = JSON.parse(respuestaProxy.contents);
                    if (respuesta.estado === 200 && respuesta.datos) {
                        this.obtenerDatosMeteo(respuesta.datos);
                    } else {
                        this.mostrarError(`Error en la respuesta: ${respuesta.descripcion || "No se pudo obtener la URL de datos"}`);
                    }
                } catch (e) {
                    console.error("Error al parsear la respuesta:", e);
                    this.mostrarError("Error al procesar la respuesta del servidor meteorológico.");
                }
            })
            .fail((error) => {
                console.error("Error en la primera petición:", error);
                this.mostrarError("No se pudo conectar con el servicio de meteorología.");
            });
    }

    obtenerDatosMeteo(urlDatos) {
        // Usamos el mismo proxy para la segunda petición
        const urlConProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(urlDatos)}`;
        
        $.ajax({
            url: urlConProxy,
            method: "GET",
            dataType: "json"
        })
            .done((respuestaProxy) => {
                try {
                    // La respuesta viene dentro de la propiedad "contents" como string
                    const datos = JSON.parse(respuestaProxy.contents);
                    if (datos && datos.length > 0) {
                        this.generarHTML(datos[0]);
                    } else {
                        this.mostrarError("No hay datos de predicción disponibles.");
                    }
                } catch (e) {
                    console.error("Error al parsear la respuesta:", e);
                    this.mostrarError("Error al procesar los datos meteorológicos.");
                }
            })
            .fail((error) => {
                console.error("Error en la segunda petición:", error);
                this.mostrarError("No se pudieron cargar los datos meteorológicos.");
            });
    }

    generarHTML(datos) {
        const $seccion = $("<section></section>");
        const $titulo = $("<h2></h2>").text(`Predicción meteorológica para ${datos.nombre}, ${datos.provincia}`);
        const $fechaActualizacion = $("<p></p>")
            .text(`Actualizado: ${new Date(datos.elaborado).toLocaleString('es-ES')}`);

        $seccion.append($titulo, $fechaActualizacion);

        // Crear la predicción por días
        if (datos.prediccion && datos.prediccion.dia) {
            // Solo mostrar los primeros 5 dias
            const diasMostrar = datos.prediccion.dia.slice(0, 5);
            
            $.each(diasMostrar, (_, dia) => {
                const fecha = new Date(dia.fecha);
                const $articulo = $("<article></article>");
                
                // Cabecera del día
                const $cabecera = $("<header></header>");
                const $fecha = $("<h3></h3>").text(fecha.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                }));
                $cabecera.append($fecha);
                $articulo.append($cabecera);
                
                // Usar definition list para mostrar los datos meteorológicos
                const $listaDatos = $("<dl></dl>");
                
                // Temperaturas
                if (dia.temperatura) {
                    const $termino = $("<dt></dt>").text("Temperatura");
                    const $definicion = $("<dd></dd>").html(`${dia.temperatura.minima}°C - ${dia.temperatura.maxima}°C`);
                    $listaDatos.append($termino, $definicion);
                }
                
                // Probabilidad de precipitación
                if (dia.probPrecipitacion && dia.probPrecipitacion.length > 0) {
                    const probDia = dia.probPrecipitacion.find(p => p.periodo === "00-24");
                    
                    if (probDia) {
                        const $termino = $("<dt></dt>").text("Probabilidad de lluvia");
                        const $definicion = $("<dd></dd>").text(`${probDia.value}%`);
                        $listaDatos.append($termino, $definicion);
                    }
                }
                
                // Estado del cielo
                if (dia.estadoCielo && dia.estadoCielo.length > 0) {
                    var estadoDia = dia.estadoCielo.find(e => e.periodo === "00-24");

                    // Comprobar que el estado del cielo no sea vacio
                    if (estadoDia && estadoDia.descripcion == '') {
                        // Obtener el primero que no sea vacio
                        estadoDia = dia.estadoCielo.find(e => e.periodo !== "00-24" && e.descripcion !== '');
                    }

                    if (estadoDia) {
                        const $termino = $("<dt></dt>").text("Estado del cielo");
                        const $definicion = $("<dd></dd>").text(estadoDia.descripcion);
                        $listaDatos.append($termino, $definicion);
                    }
                }
                
                // Viento
                if (dia.viento && dia.viento.length > 0) {
                    var vientoDia = dia.viento.find(v => v.periodo === "00-24");
                
                    // Comprobar que el viento no sea vacio
                    if (vientoDia && vientoDia.direccion == '') {
                        // Obtener el primero que no sea vacio
                        vientoDia = dia.viento.find(v => v.periodo !== "00-24" && v.direccion !== '');
                    }

                    if (vientoDia) {
                        const $termino = $("<dt></dt>").text("Viento");
                        const $definicion = $("<dd></dd>").text(`${vientoDia.direccion} a ${vientoDia.velocidad} km/h`);
                        $listaDatos.append($termino, $definicion);
                    }
                }
                
                // Añadir lista de definición al artículo
                $articulo.append($listaDatos);
                
                // Añadir el artículo a la sección
                $seccion.append($articulo);
            });
        }

        // Añadir atribución
        if (datos.origen) {
            const $atribucion = $("<footer></footer>")
                .html(`<small>Fuente: <a href="${datos.origen.web}" target="_blank">${datos.origen.productor}</a> | ${datos.origen.copyright}</small>`)
                .css({
                    "margin-top": "1.5rem",
                    "font-size": "0.8rem",
                    "color": "#666",
                    "text-align": "center"
                });
            $seccion.append($atribucion);
        }

        $("main").append($seccion);
    }

    mostrarError(mensaje) {
        const $p = $("<p></p>").text(mensaje).css("color", "red");
        $("main").append($p);
    }
}

// Inicializar cuando el documento esté listo
$(document).ready(function () {
    new Meteorologia("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJieWpvbnkxQGdtYWlsLmNvbSIsImp0aSI6IjQ3Y2VkY2E3LTU4MzQtNDAyOC1hODIzLTQ0NTYxMTgzNDdiOSIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNzQ0NTQyMDIwLCJ1c2VySWQiOiI0N2NlZGNhNy01ODM0LTQwMjgtYTgyMy00NDU2MTE4MzQ3YjkiLCJyb2xlIjoiIn0.mj1uenqxgPrFcFIYCdGCYUFad4vPa-dHHoT6gNPnRcQ");
});