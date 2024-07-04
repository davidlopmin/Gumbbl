<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger los datos del formulario
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Validar los datos (opcional - puedes añadir más validaciones según sea necesario)

    // Configurar el correo electrónico
    $to = "gumbbl.com@gmail.com";
    $subject = "Mensaje de contacto desde tu sitio web";
    $body = "Nombre: $name\nCorreo electrónico: $email\nMensaje:\n$message";

    // Enviar el correo electrónico
    if (mail($to, $subject, $body)) {
        // Éxito - redirigir a una página de confirmación o mostrar un mensaje de éxito
        header("Location: thankyou.html"); // Redirige a una página de agradecimiento
        exit();
    } else {
        // Error - redirigir a una página de error o mostrar un mensaje de error
        header("Location: error.html"); // Redirige a una página de error
        exit();
    }
} else {
    // Si alguien intenta acceder a este script directamente sin enviar datos por POST, redirigir a la página de contacto
    header("Location: contact.html");
    exit();
}
?>
