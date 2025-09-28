const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

fetch("https://zyaoilcrfxqhmkrmrqfd.functions.supabase.co/ai-chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Olá" })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);

const sendMessage = async () => {
  const messageInput = document.getElementById("messageInput");
  const chatResponse = document.getElementById("chatResponse");
  const message = messageInput.value.trim();

  if (!message) {
    chatResponse.innerText = "Digite uma mensagem antes de enviar.";
    return;
  }

  chatResponse.innerText = "Enviando...";

  try {
    const res = await fetch("https://zyaoilcrfxqhmkrmrqfd.functions.supabase.co/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const text = await res.text(); // Para ver erro detalhado
    if (!res.ok) {
      chatResponse.innerText = `Erro no servidor: ${res.status} - ${text}`;
      console.error(text);
      return;
    }

    const data = JSON.parse(text);
    chatResponse.innerText = data.response || "Sem resposta do servidor.";

  } catch (err) {
    console.error(err);
    chatResponse.innerText = `Erro ao enviar a mensagem: ${err.message}`;
  }
};