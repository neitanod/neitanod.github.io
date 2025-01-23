<?php
// Obtener la URL del archivo remoto desde un parámetro GET
//$remoteUrl = isset($_GET['url']) ? $_GET['url'] : null;
$remoteUrl = "https://infra.datos.gob.ar/catalog/sspm/dataset/145/distribution/145.3/download/indice-precios-al-consumidor-nivel-general-base-diciembre-2016-mensual.csv";

// Carpeta donde se almacenarán los archivos en caché
$cacheDir = __DIR__ . '/cache/';
// Duración de la caché en segundos (24 horas = 86400 segundos)
$cacheDuration = 86400;

// Verificar si la URL fue proporcionada
if (!$remoteUrl) {
    http_response_code(400);
    echo "Error: No se proporcionó una URL.";
    exit;
}

// Validar que la URL sea válida
if (!filter_var($remoteUrl, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo "Error: La URL proporcionada no es válida.";
    exit;
}

// Generar un nombre de archivo único para la caché basado en la URL
$cacheFile = $cacheDir . md5($remoteUrl) . '.txt';

// Crear la carpeta de caché si no existe
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

// Verificar si el archivo en caché existe y si sigue siendo válido
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheDuration) {
    // Leer el contenido del archivo en caché
    $data = file_get_contents($cacheFile);
} else {
    // Usar cURL para obtener el contenido del archivo remoto
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $remoteUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Seguir redirecciones si las hay

    $data = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Verificar si la solicitud fue exitosa
    if ($httpCode !== 200 || $data === false) {
        http_response_code(500);
        echo "Error: No se pudo obtener el archivo desde la URL proporcionada.";
        exit;
    }

    // Guardar el contenido en el archivo de caché
    file_put_contents($cacheFile, $data);
}

// Configurar los encabezados para devolver el archivo como texto
header('Content-Type: text/plain');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: 0');

// Encabezados CORS para permitir acceso desde cualquier dominio
header("Access-Control-Allow-Origin: *"); // Permite cualquier dominio
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos


// Devolver el contenido del archivo (desde la caché o remoto)
echo $data;
