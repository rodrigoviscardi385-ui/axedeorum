const router = require('express').Router();

// Endpoint para solicitar orçamento via WhatsApp
router.post('/solicitar-orcamento', (req, res) => {
  const {
    userName, userEmail, userPhone,
    orixa, colors, size, firmes,
    pendant, extras, price, recado
  } = req.body;

  // Montar mensagem para WhatsApp
  const mensagem = `*NOVO ORÇAMENTO AXÉ DE ORUM*\n\n`;
  mensagem += `*Nome:* ${userName || 'Não informado'}\n`;
  mensagem += `*E-mail:* ${userEmail || 'Não informado'}\n`;
  mensagem += `*Telefone:* ${userPhone || 'Não informado'}\n\n`;
  mensagem += `*Orixá/Linha:* ${orixa || 'Não informado'}\n`;
  mensagem += `*Cores:* ${colors || 'Não informado'}\n`;
  mensagem += `*Tamanho:* ${size} cm\n`;
  mensagem += `*Firmas:* ${JSON.stringify(firmes).replace(/[\[\],]/g, '')}\n`;
  mensagem += `*Pingente:* ${pendant || 'Não informado'}\n`;
  mensagem += `*Extras:* ${extras || 'Nenhum'}\n`;
  mensagem += `*Preço:* R$ ${price || 'Confirmar no WhatsApp'}\n\n`;
  if (recado) {
    mensagem += `*Recado:* ${recado}\n`;
  }
  mensagem += `\n---\nMensagem gerada automaticamente pelo sistema Axé de Orum.`;

  // URL do WhatsApp Business API (exemplo - substituir por credenciais reais)
  const whatsappNumber = '5513997781447';
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;

  // Em produção, aqui seria um POST real para a API do Twilio/WA Business
  // const twilio = require('twilio');
  // client.messages.create({ body: mensagem, from: 'whatsapp:', to: `whatsapp:${whatsappNumber}` });

  res.json({ success: true, waUrl });
});

module.exports = router;
