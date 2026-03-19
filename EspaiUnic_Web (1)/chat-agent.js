/**
 * 🤖 ESPAI BOT - Chat Agent for Espai Únic
 * Knowledge-based assistant for customer queries.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 📚 KNOWLEDGE BASE ---
    const KB = {
        general: {
            name: "Espai Únic",
            location: "Cami Ral, 11 semisótano, 08292 Esparreguera, Barcelona",
            locationShort: "Esparreguera (Barcelona)",
            phone: "+34 695 613 985",
            whatsapp: "https://wa.me/34695613985",
            hours: "Lunes-Jueves: 10:30-14:30. Viernes-Domingo: 10:30-01:30.",
            description: "Somos un espacio polivalente de 215m² diseñado para crear recuerdos inolvidables. Ofrecemos una sala privada totalmente equipada para que tú solo te preocupes de disfrutar.",
            philosophy: "Nos adaptamos a tu estilo y nos importa tu celebración como si fuera nuestra. Queremos ser el escenario de tus momentos más felices."
        },
        services: [
            {
                id: 1,
                name: "Fiestas de Cumpleaños",
                price: "Desde 160€",
                details: "Sala de 215m² decorada para el cumple de tu peque. Incluye zona de juegos Chikipark (5-11 años).",
                keywords: ["cumpleaños", "cumple", "niños", "infantil", "fiesta"]
            },
            {
                id: 5,
                name: "Baby Showers",
                price: "Desde 160€",
                details: "Celebra la llegada del bebé en un entorno íntimo con decoración a medida.",
                keywords: ["baby", "shower", "bebe", "embarazo"]
            },
            {
                id: 6,
                name: "Eventos Temáticos",
                price: "Desde 200€",
                details: "Transformamos la sala en cualquier universo (Piratas, Princesas, etc.) con decoración completa.",
                keywords: ["tematico", "piratas", "princesas", "personajes", "tematica"]
            },
            {
                id: 7,
                name: "Pack DJ Superior",
                price: "600€",
                details: "DJ/Speaker 4h, sonido alta potencia (4 altavoces + 2 sub), iluminación profesional, truss con TV 65\", máquina de humo y micros.",
                keywords: ["dj superior", "dj profesional", "musica", "superior", "luces", "truss"]
            },
            {
                id: 8,
                name: "Pack DJ Esencial",
                price: "400€",
                details: "DJ 4h, 2 altavoces 15\", truss 4x3m, cabezas móviles, láser y flash.",
                keywords: ["dj esencial", "dj musica", "esencial", "equipo sonido"]
            },
            {
                id: 9,
                name: "Espectáculo de Magia",
                price: "215€ o 265€",
                details: "Show infantil 50 min (265€) o magia de cerca para adultos 1h (215€).",
                keywords: ["mago", "magia", "espectaculo", "ilusionismo", "show magia"]
            },
            {
                id: 10,
                name: "Alquiler de Sala (215m²)",
                price: "Desde 160€",
                details: "Uso exclusivo de la sala con WiFi, sonido Bluetooth, nevera, cafetera, microondas, Chikipark, futbolín, diana, disfraces, TV y mobiliario completo.",
                keywords: ["alquiler", "sala", "espacio", "precio sala", "cuanto cuesta", "cuantos metros", "metros cuadrados"]
            },
            {
                id: 11,
                name: "La Pilar (Animación)",
                price: "280€",
                details: "Animación teatral guionizada (~90 min) exclusivamente para adultos. Interactiva y personalizada.",
                keywords: ["pilar", "adultos", "teatro", "animacion adultos", "guionizado"]
            },
            {
                id: 2,
                name: "Chikipark",
                price: "Incluido en el alquiler",
                details: "Zona de juegos con parque de bolas, toboganes, colchonetas, futbolín y diana. Ideal para 5 a 11 años.",
                keywords: ["bolas", "parque", "juego", "chikipark", "tobogan", "colchonetas", "futbolin", "diana"]
            }
        ],
        pricingDetails: [
            { text: "Lunes a Jueves y Viernes mañana: 160€ (limpieza incluida)." },
            { text: "Viernes tarde, Sábados y Domingos (Mañana/Tarde): 180€ (+20€ limpieza)." },
            { text: "Viernes y Sábados noche (21:30 - 01:30): 250€ (+20€ limpieza)." },
            { text: "Festivos mañana (12h-19h): 390€. Noche (20h-03h): 420€." }
        ],
        faqs: [
            { q: ["comida", "catering", "nevera", "microondas", "comer", "beber"], a: "¡Claro! Puedes traer tu propia comida y bebida. Tenemos nevera, microondas y cafetera. También ofrecemos un Pack Catering Básico por 50€." },
            { q: ["limpieza", "limpiar", "recoger"], a: "La limpieza está incluida de Lunes a Jueves y Viernes mañana. En otros horarios tiene un suplemento de 20€ si no se deja la sala recogida." },
            { q: ["reserva", "disponibilidad", "libre", "fecha", "reservar", "visita", "ver la sala"], a: "Para consultar fechas o concertar una visita, lo mejor es escribirnos por WhatsApp al 695 613 985. ¡Te responderemos enseguida!" },
            { q: ["aparcamiento", "aparcar", "coche", "donde dejar"], a: "Es una zona muy tranquila en Esparreguera y es muy fácil aparcar justo al lado de la sala." },
            { q: ["que incluye", "inclusiones", "equipamiento", "que hay"], a: "El alquiler incluye: 215m² exclusivos, WiFi, sonido Bluetooth, nevera, microondas, cafetera, Chikipark, futbolín, diana, disfraces, TV, y mobiliario (52 sillas adultos + 15 niños)." }
        ]
    };
    // --- 🛠️ UI INJECTION ---
    const chatHTML = `
        <div id="espaiChatWidget" class="espai-chat-widget">
            <button id="chatToggleBtn" class="chat-toggle-btn" aria-label="Abrir chat">
                <ion-icon name="chatbubbles-outline"></ion-icon>
            </button>
            <div id="chatWindow" class="chat-window hidden">
                <div class="chat-header">
                    <div class="chat-avatar">🤖</div>
                    <div class="chat-title-box">
                        <span class="chat-name">Espai Bot</span>
                        <span class="chat-status">En línea</span>
                    </div>
                </div>
                <div id="chatBody" class="chat-body">
                    <div class="chat-msg bot">Hola! Soy el asistente de Espai Únic. ¿En qué puedo ayudarte hoy? ✨</div>
                </div>
                <div class="chat-footer">
                    <input type="text" id="chatInput" placeholder="Escribe tu duda..." autocomplete="off">
                    <button id="chatSendBtn"><ion-icon name="send"></ion-icon></button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    // --- 🧠 LOGIC ---
    function toggleChat() {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    }

    function addMessage(text, side) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${side}`;
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    let pendingAction = null;

    // --- 🧠 LOGIC ---
    function getBotResponse(input) {
        const text = input.toLowerCase().trim();

        // --- Contextual Handling (Yes/No) ---
        if (pendingAction === "RESERVA") {
            if (text === "si" || text === "sí" || text.includes("vale") || text.includes("perfecto") || text.includes("claro")) {
                pendingAction = null;
                return `¡Genial! Puedes reservar directamente o preguntarnos disponibilidad por WhatsApp aquí: ${KB.general.phone} (Enlace: ${KB.general.whatsapp})`;
            }
            if (text === "no" || text.includes("nada más") || text.includes("así está bien")) {
                pendingAction = null;
                return "¿Entiendo, hay alguna otra cosa en la que pueda ayudarte?";
            }
        }

        // Reset context if it's a new query
        pendingAction = null;

        // Check Company Info
        if (text.includes("quienes") || text.includes("que haceis") || text.includes("dedica") || text.includes("empresa")) {
            return KB.general.description + " " + KB.general.philosophy;
        }
        if (text.includes("donde") || text.includes("ubicacion") || text.includes("donde estais") || text.includes("direccion")) {
            return `Estamos en ${KB.general.location}. Es una zona de fácil aparcamiento en ${KB.general.locationShort}.`;
        }

        // Check Prices General
        if ((text.includes("cuanto cuesta") || text.includes("precios") || text.includes("tarifas")) && !KB.services.some(s => s.keywords.some(k => text.includes(k)))) {
            let res = "Nuestras tarifas varían según el horario: \n";
            KB.pricingDetails.forEach(p => res += "- " + p.text + "\n");
            return res + "¿Te interesa algún horario o servicio en concreto?";
        }

        // Check services
        for (const s of KB.services) {
            if (s.keywords.some(k => text.includes(k))) {
                pendingAction = "RESERVA";
                return `Sobre ${s.name}: El precio es ${s.price}. ${s.details} ¿Te gustaría que te explicara cómo reservar o consultar fechas?`;
            }
        }

        // Check FAQs
        for (const f of KB.faqs) {
            if (f.q.some(keyword => text.includes(keyword))) {
                return f.a;
            }
        }

        // Generic Handlers
        if (text.includes("contacto") || text.includes("telefono") || text.includes("whatsapp")) {
            return `Puedes contactarnos por WhatsApp al ${KB.general.phone} (clic aquí: ${KB.general.whatsapp}). ¡Estaremos encantados de ayudarte!`;
        }
        if (text.includes("hola") || text.includes("buenos dias") || text.includes("buenas tardes")) {
            return "¡Hola! Soy Espai Bot, el asistente de Espai Únic. ¿Quieres saber sobre nuestros servicios, precios o dónde estamos?";
        }

        return "No estoy seguro de haberte entendido bien. Puedo informarte sobre nuestros servicios (Cumpleaños, DJ, Magia, etc.), precios según horario, o nuestra ubicación en Esparreguera. ¿Qué prefieres?";
    }

    function handleSend() {
        const val = chatInput.value.trim();
        if (!val) return;

        addMessage(val, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const reply = getBotResponse(val);
            addMessage(reply, 'bot');
        }, 600);
    }

    // --- ⌨️ EVENTS ---
    chatToggleBtn.addEventListener('click', toggleChat);
    chatSendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
