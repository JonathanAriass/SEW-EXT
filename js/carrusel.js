class Carrusel {
    constructor() {
        this.imagenes = [
            { src: "multimedia/imagenes/la_vega_riosa-711.jpg", alt: "Mapa de Riosa" },
            { src: "multimedia/imagenes/angliru.jpg", alt: "Gastronomía asturiana" },
            { src: "multimedia/imagenes/mercado.jpg", alt: "Montañas del Aramo" },
            { src: "multimedia/imagenes/senda_fluvial.jpg", alt: "Fiestas populares" },
            { src: "multimedia/imagenes/socavon_rioseco.jpg", alt: "Naturaleza y senderismo" }
        ];
        this.indice = 0;

        // Selección por estructura, sin ids ni clases
        this.section = document.querySelector("section");
        this.article = this.section.querySelector("article");
        this.img = this.article.querySelector("img");
        this.botones = this.article.querySelectorAll("button");

        this.botones[0].addEventListener("click", () => this.anterior());
        this.botones[1].addEventListener("click", () => this.siguiente());

        this.mostrarImagen();
    }

    mostrarImagen() {
        const actual = this.imagenes[this.indice];
        this.img.src = actual.src;
        this.img.alt = actual.alt;
    }

    siguiente() {
        this.indice = (this.indice + 1) % this.imagenes.length;
        this.mostrarImagen();
    }

    anterior() {
        this.indice = (this.indice - 1 + this.imagenes.length) % this.imagenes.length;
        this.mostrarImagen();
    }
}

// TODO: Cambiar a cargar en el .html
document.addEventListener("DOMContentLoaded", () => {
    new Carrusel();
});
