<?php
// Obtener la URL del archivo remoto desde un parámetro GET
//$remoteUrl = isset($_GET['url']) ? $_GET['url'] : null;
//
$remoteUrl = "https://infra.datos.gob.ar/catalog/sspm/dataset/145/distribution/145.3/download/indice-precios-al-consumidor-nivel-general-base-diciembre-2016-mensual.csv";

// Verificar si la URL fue proporcionada
if (!$remoteUrl) {
    http_response_code(400); // Respuesta de error (400 Bad Request)
    echo "Error: No se proporcionó una URL.";
    exit;
}

// Validar que la URL sea válida
if (!filter_var($remoteUrl, FILTER_VALIDATE_URL)) {
    http_response_code(400); // Respuesta de error (400 Bad Request)
    echo "Error: La URL proporcionada no es válida.";
    exit;
}

// Encabezados CORS para permitir acceso desde cualquier dominio
header("Access-Control-Allow-Origin: *"); // Permite cualquier dominio
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

// Manejar preflight (opcional, útil para solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // Sin contenido
    exit;
}

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
    http_response_code(500); // Respuesta de error (500 Internal Server Error)
    echo "Error: No se pudo obtener el archivo desde la URL proporcionada.";
    exit;
}

// Configurar los encabezados para devolver el archivo como texto
header('Content-Type: text/plain');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: 0');

// Devolver el contenido del archivo
echo $data;
