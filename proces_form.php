<?php
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
  header("Location: thankyou.html"); // Puedes crear una página thankyou.html para mostrar un mensaje de agradecimiento
  exit();
} else {
  // Error - redirigir a una página de error o mostrar un mensaje de error
  header("Location: error.html"); // Puedes crear una página error.html para mostrar un mensaje de error
  exit();
}
?>
