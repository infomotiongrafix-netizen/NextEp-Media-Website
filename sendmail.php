<?php
// ===============================
// CONFIGURACIÓN GENERAL
// ===============================
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Si PHPMailer no está cargado automáticamente:
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

// -------------------------
// DESTINATARIO Y ORIGEN
// -------------------------
$recipient   = "info@nextep.media";     // 📩 correo que recibirá los mensajes
$from_email  = "info@nextep.media"; // remitente (debe pertenecer a tu dominio)
$from_name   = "NEXTEP Media Website";
$subject_prefix = "[NEXTEP Contact Form] ";

// -------------------------
// SANITIZAR ENTRADAS
// -------------------------
function clean_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

$lang    = $_POST['lang']    ?? 'en';
$name    = clean_input($_POST['name'] ?? '');
$email   = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone   = clean_input($_POST['phone'] ?? '');
$country = clean_input($_POST['country'] ?? '');
$subject = clean_input($_POST['subject'] ?? '');
$message = clean_input($_POST['message'] ?? '');

// Validaciones
if (
    empty($name) ||
    empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    empty($subject) ||
    empty($message)
) {
    header("Location: contact.html?status=incomplete&lang=$lang");
    exit;
}

// -------------------------
// CONSTRUIR EL MENSAJE
// -------------------------
$email_subject = $subject_prefix . ucfirst($subject);
$email_body = "
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family:Arial, sans-serif; color:#333'>
  <h2>New Contact Message</h2>
  <p><strong>Name:</strong> {$name}</p>
  <p><strong>Email:</strong> {$email}</p>
  <p><strong>Phone:</strong> {$phone}</p>
  <p><strong>Country:</strong> {$country}</p>
  <p><strong>Subject:</strong> {$subject}</p>
  <p><strong>Message:</strong><br>" . nl2br($message) . "</p>
  <hr>
  <small>Sent automatically from NEXTEP Media website.</small>
</body>
</html>
";

// -------------------------
// CONFIGURAR PHPMailer
// -------------------------
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com'; // Servidor SMTP de Hostinger
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@nextep.media'; // ⚙️ Tu usuario SMTP
    $mail->Password   = 'Nextep2025.'; // ⚙️ Contraseña SMTP
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587; // Puerto TLS (465 para SSL)

    // Encabezados
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($from_email, $from_name);
    $mail->addAddress($recipient, 'NEXTEP Media');
    $mail->addReplyTo($email, $name);

    // Contenido del mensaje
    $mail->isHTML(true);
    $mail->Subject = $email_subject;
    $mail->Body    = $email_body;

    // -------------------------
    // ENVÍO
    // -------------------------
    $mail->send();
    header("Location: contact.html?status=success&lang=$lang");
    exit;

} catch (Exception $e) {
    // Log opcional (no mostrar errores al usuario)
    error_log("Mailer Error: {$mail->ErrorInfo}");
    header("Location: contact.html?status=error&lang=$lang");
    exit;
}
?>
