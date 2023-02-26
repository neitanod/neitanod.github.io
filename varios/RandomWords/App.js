var palabras = [""]

function elegirPalabraAzar(lista) {
    return lista[Math.floor(Math.random() * palabras.length)];
}

function mostrar(texto) {
    var caja = document.getElementById("caja");
    caja.value = texto
}

function construirArray() {
    return document.getElementById("texto").value.trim().split("\n");
}

function mostrarEditor(palabras) {
    var z = document.getElementById("mostrar-ocultar");
    z.style.display = "block"
}

function ocultarEditor() {
    var x = document.getElementById("mostrar-ocultar");
    x.style.display = "none"
    guardarPalabra(document.getElementById("texto").value)
    palabras = construirArray();
}

function guardarPalabra(texto) {
    $.ajax({
        type: "POST",
        url: "https://publish.ip1.cc",
        data: { data: JSON.stringify({ data: texto }) },
    }).done(function(r) {
        window.location.hash = r.key;
    });
}

function cargarPalabraDeURL() {
    if (window.location.hash) {
        $.get(
            "https://publish.ip1.cc/storage/uploads/" + window.location.hash.substr(1) + ".json"
        ).done(function(r) {
            document.getElementById("texto").value = r.data;
            palabras = construirArray();
        });
    }
}

function init() {

    cargarPalabraDeURL();
    mostrar(elegirPalabraAzar(palabras));

}
init();

$(function() {

    // window.screen.orientation.lock.call(window.screen.orientation, 'landscape');
    //
    // screen.orientation.lock('landscape');

    cargarPalabraDeURL();

    var hammer = new Hammer(document);

    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

    hammer.on("press", function() {
        document.body.requestFullscreen();
    });

    hammer.on("swipe swipeleft swiperight pinch zoom", function() {
        mostrar(elegirPalabraAzar(palabras));
    });

    $("#caja-wrapper").on('click', function(){ mostrar(elegirPalabraAzar(palabras)); });
    $("#caja-wrapper").on('click', function(e){ if(e.ctrlKey) $("#editar").toggle(); });
});
