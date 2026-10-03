/**
 * Cloudflare Email Routing Worker para TempMail
 * 
 * Este script captura todos los correos entrantes (*@tu-pedido-mv.lat)
 * y los envía vía HTTP POST al backend fijo en la nube.
 */
import PostalMime from 'postal-mime';

export default {
  async email(message, env, ctx) {
    try {
      // 1. Obtener el cuerpo MIME crudo del correo
      const rawEmail = await new Response(message.raw).text();

      // 2. Extraer remitente y destinatario
      const recipient = message.to;
      const sender = message.from;

      // 3. Parsear opcionalmente con postal-mime
      const parser = new PostalMime();
      const parsed = await parser.parse(message.raw);

      // 4. URL de tu backend en la nube (ej: Render, Railway, VPS)
      // Configura la variable de entorno BACKEND_WEBHOOK_URL en Cloudflare Worker
      // o coloca tu URL directa aquí abajo:
      const BACKEND_URL = env.BACKEND_WEBHOOK_URL || 'https://tu-backend-tempmail.onrender.com/api/webhooks/inbound-email';

      const payload = {
        recipient: recipient,
        from: sender,
        subject: parsed.subject || '(Sin Asunto)',
        text: parsed.text || '',
        html: parsed.html || '',
        raw: rawEmail
      };

      // 5. Enviar el webhook al backend permanente
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error(`Error enviando webhook: HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Error procesando correo entrante:', err);
    }
  }
};
