document.addEventListener('DOMContentLoaded', () => {

  // ===== MODO ESCURO =====
  const botao = document.getElementById('botao-tema');
  const linkCss = document.getElementById('tema-css');
  const logo = document.getElementById('logo');
  let tema = localStorage.getItem('tema') || 'claro';

  function setTema(t) {
    if (linkCss) linkCss.href = t === 'escuro' ? 'escuro.css' : 'claro.css';
    if (logo) logo.src = t === 'escuro' ? 'mindflow_logo_branca.png' : 'mindflow_logo_transparente.png';
    if (botao) botao.textContent = t === 'escuro' ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    localStorage.setItem('tema', t);
  }
  setTema(tema);

  if (botao) {
    botao.addEventListener('click', () => {
      tema = tema === 'escuro' ? 'claro' : 'escuro';
      setTema(tema);
    });
  }

  // ===== CALENDÁRIO =====
  let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    window.calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'pt-br',
      editable: true,
      selectable: true,
      height: 'auto',
      contentHeight: 'auto',
      headerToolbar: {
        left: 'prev,next today addEventButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      customButtons: {
        addEventButton: {
          text: '➕ Adicionar Evento',
          click: adicionarEvento
        }
      },
      events: eventos
    });
    window.calendar.render();
  }

  function adicionarEvento() {
    const titulo = prompt("Digite o nome do evento:");
    if (!titulo) return;
    const descricao = prompt("Descrição (opcional):");
    const data = prompt("Data (AAAA-MM-DD):");
    const hora = prompt("Hora (HH:MM) ou deixe em branco:");
    if (!data) { alert("⚠️ Data inválida"); return; }
    const evento = { title: titulo, start: hora ? `${data}T${hora}` : data, description: descricao || '' };
    window.calendar.addEvent(evento);
    eventos.push(evento);
    localStorage.setItem('eventos', JSON.stringify(eventos));
  }

  // ===== DIÁRIO =====
  let currentEntry = null;
  const tituloEl = document.getElementById("titulo");
  const textoEl = document.getElementById("texto");
  const humorEl = document.getElementById("humor");
  const container = document.getElementById("entries-container");

  function renderEntries() {
    if (!container) return;
    container.innerHTML = "";
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.forEach(entry => {
      const div = document.createElement("div");
      div.className = "entry";
      div.innerHTML = `<h3>${entry.title} <span class="mood">${entry.humor}</span></h3>
                       <small>${entry.date}</small>
                       <p>${entry.text.substring(0, 150)}...</p>`;
      div.onclick = () => openPopup(entry);
      container.appendChild(div);
    });
  }

  window.salvarEntrada = function() {
    if (!tituloEl || !textoEl || !humorEl) return;
    const titulo = tituloEl.value.trim();
    const texto = textoEl.value.trim();
    const humor = humorEl.value;
    if (!titulo || !texto) { alert("Preencha o título e o texto!"); return; }
    const entrada = { id: Date.now(), title: titulo, text: texto, humor, date: new Date().toLocaleString() };
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.unshift(entrada);
    localStorage.setItem("entries", JSON.stringify(entries));
    renderEntries();
    tituloEl.value = "";
    textoEl.value = "";
  }

  window.openPopup = function(entry) {
    currentEntry = entry;
    document.getElementById("popup-title").textContent = entry.title;
    document.getElementById("popup-date").textContent = entry.date;
    document.getElementById("popup-text").textContent = entry.text;
    document.getElementById("popup").classList.remove("hidden");
  }

  window.closePopup = function() {
    document.getElementById("popup").classList.add("hidden");
    currentEntry = null;
  }

  window.editEntry = function() {
    if (!currentEntry) return;
    const novoTexto = prompt("Edite seu texto:", currentEntry.text);
    if (novoTexto !== null) {
      let entries = JSON.parse(localStorage.getItem("entries")) || [];
      const idx = entries.findIndex(e => e.id === currentEntry.id);
      entries[idx].text = novoTexto;
      localStorage.setItem("entries", JSON.stringify(entries));
      renderEntries();
      openPopup(entries[idx]);
    }
  }

  window.deleteEntry = function() {
    if (!currentEntry) return;
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries = entries.filter(e => e.id !== currentEntry.id);
    localStorage.setItem("entries", JSON.stringify(entries));
    renderEntries();
    closePopup();
  }

  renderEntries();

  // ===== LOGOUT =====
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      alert('Você será desconectado!');
      window.location.href = 'login.html';
    });
  }

  // ===== CHAT IA =====
  const chatToggle = document.getElementById("chat-toggle");
  const chatWindow = document.getElementById("chat-window");
  const chatClose = document.getElementById("chat-close");
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  if(chatToggle && chatWindow && chatClose && sendBtn && userInput && chatBox) {

    chatToggle.addEventListener("click", () => chatWindow.classList.toggle("hidden"));
    chatClose.addEventListener("click", () => chatWindow.classList.add("hidden"));

    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;

      // Mostra no chat
      chatBox.innerHTML += `<div class="user-msg"><strong>Você:</strong> ${message}</div>`;
      userInput.value = "";

      try {
        // Chama o seu backend Express
        const res = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });

        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

        const data = await res.json();
        const reply = data.reply || "Sem resposta.";
        chatBox.innerHTML += `<div class="ai-msg"><strong>IA:</strong> ${reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
      } catch (err) {
        console.error("Erro chat: ", err);
        chatBox.innerHTML += `<div class="ai-msg"><strong>IA:</strong> Erro ao responder.</div>`;
      }
    }


    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

});

