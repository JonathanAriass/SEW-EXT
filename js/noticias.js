class Noticias {
    constructor(apiKey, termino = "Riosa") {
        this.apiKey = apiKey;
        this.termino = termino;
        this.url = "https://newsdata.io/api/1/news";
        this.iniciar();
    }

    iniciar() {
        $.ajax({
            url: this.url,
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
            data: {
                q: this.termino,
                language: "es",
                country: "es",
                apiKey: this.apiKey
            },
        })
            .done((respuesta) => this.generarHTML(respuesta))
            .fail((error) => {
                console.error("Error details:", error);
                this.mostrarError("No se pudieron cargar las noticias.");
            });
    }

    generarHTML(data) {
        const $seccion = $("<section></section>");
        const $titulo = $("<h2></h2>").text("Últimas noticias sobre Riosa");
        $seccion.append($titulo);

        // Verificar si hay resultados disponibles
        if (!data || !data.results || data.results.length === 0) {
            $seccion.append($("<p></p>").text("No hay noticias disponibles."));
            $("main").append($seccion);
            return;
        }

        // Iterar a través de los resultados
        $.each(data.results, (_, noticia) => {
            const $article = $("<article></article>");

            // Añadir imagen si está disponible
            // if (noticia.image_url) {
            //     const $imagen = $("<img>")
            //         .attr("src", noticia.image_url)
            //         .attr("alt", noticia.title)
            //         .css({
            //             "max-width": "100%",
            //             "height": "auto",
            //             "margin-bottom": "1rem",
            //             "border-radius": "4px"
            //         });
            //     $article.append($imagen);
            // }

            // Fuente y fecha
            const fechaPub = new Date(noticia.pubDate);
            const $meta = $("<div></div>")
                .addClass("noticia-meta")
                .html(`<span class="fuente">${noticia.source_name}</span> | <span class="fecha">${fechaPub.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>`)
                .css({
                    "font-size": "0.85rem",
                    "color": "#666",
                    "margin-bottom": "0.5rem"
                });

            // Título, descripción y enlace
            const $h3 = $("<h3></h3>").text(noticia.title);
            const $p = $("<p></p>").text(noticia.description || "Sin descripción disponible.");
            const $a = $("<a></a>")
                .attr("href", noticia.link)
                .attr("target", "_blank")
                .text("Leer más");

            // Si hay creadores/autores, añadirlos
            if (noticia.creator && noticia.creator.length > 0) {
                const $autor = $("<p></p>")
                    .addClass("autor")
                    .text(`Por: ${noticia.creator.join(", ")}`)
                    .css({
                        "font-style": "italic",
                        "margin-top": "0.5rem",
                        "font-size": "0.9rem"
                    });
                $article.append($h3, $meta, $autor, $p, $a);
            } else {
                $article.append($h3, $meta, $p, $a);
            }

            $seccion.append($article);
        });

        // Información sobre la paginación
        if (data.nextPage) {
            const $paginacion = $("<div></div>")
                .addClass("paginacion")
                .text("Hay más noticias disponibles")
                .css({
                    "text-align": "center",
                    "margin-top": "1rem",
                    "font-style": "italic"
                });
            $seccion.append($paginacion);
        }

        $("main").append($seccion);
    }

    mostrarError(mensaje) {
        const $p = $("<p></p>").text(mensaje).css("color", "red");
        $("main").append($p);
    }
}

$(document).ready(function () {
    new Noticias("pub_80131ceb8488851feb98c27f1a77612260829");
});
