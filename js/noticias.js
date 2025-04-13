class Noticias {
    constructor(apiKey, termino = "Riosa") {
        this.apiKey = apiKey;
        this.termino = termino;
        this.url = "https://newsapi.org/v2/everything";
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
                pageSize: 3,
                page: 1,
                apiKey: this.apiKey,
            },
        })
            .done((respuesta) => this.generarHTML(respuesta.articles))
            .fail((error) => {
                console.error("Error details:", error);
                this.mostrarError("No se pudieron cargar las noticias.");
            });
    }

    generarHTML(articulos) {
        const $seccion = $("<section></section>");
        const $titulo = $("<h2></h2>").text("Últimas noticias sobre Asturias");
        $seccion.append($titulo);

        if (!articulos || articulos.length === 0) {
            $seccion.append($("<p></p>").text("No hay noticias disponibles."));
            $("main").append($seccion);
            return;
        }

        $.each(articulos, (_, articulo) => {
            const $article = $("<article></article>");
            const $h3 = $("<h3></h3>").text(articulo.title);
            const $p = $("<p></p>").text(articulo.description || "Sin descripción.");
            const $a = $("<a></a>")
                .attr("href", articulo.url)
                .attr("target", "_blank")
                .text("Leer más");

            $article.append($h3, $p, $a);
            $seccion.append($article);
        });

        $("main").append($seccion);
    }

    mostrarError(mensaje) {
        const $p = $("<p></p>").text(mensaje).css("color", "red");
        $("main").append($p);
    }
}

$(document).ready(function () {
    new Noticias("323817f0d0f843a886bdbfbfd17b7f04");
});
