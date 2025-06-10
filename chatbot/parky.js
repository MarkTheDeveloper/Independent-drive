window.addEventListener("DOMContentLoaded", () => {
  fetch("../chatbot/parky.html")
    .then(res => res.text())
    .then(html => {
      const container = document.createElement("div");
      container.innerHTML = html;
      document.body.appendChild(container);

      const toggleBtn = document.getElementById("parky-button");
      const chatbox = document.getElementById("parky-chatbox");
      const closeBtn = document.getElementById("parky-close");
      const inputField = document.getElementById("parky-input");
      const sendBtn = document.getElementById("parky-send");
      const messages = document.getElementById("parky-messages");

      chatbox.style.position = "fixed";
      chatbox.style.left = "unset";
      chatbox.style.top = "unset";
      chatbox.style.right = "20px";
      chatbox.style.bottom = "100px";

      ["right", "bottom"].forEach(side => {
        const handle = document.createElement("div");
        handle.classList.add("parky-resize-handle", side);
        chatbox.appendChild(handle);
      });

      const welcome = document.createElement("div");
      welcome.className = "parky-msg bot";
      welcome.innerHTML = `
        <div class="bubble">
          👋 Hello! I'm <strong>Parky</strong>, your assistant. Ask me anything about disc golf park reservations and tools for tournament directors!
        </div>
        <img src="../images/Parky.png" class="parky-icon" />
      `;
      messages.appendChild(welcome);

      toggleBtn.addEventListener("click", () => {
        if (chatbox.style.display === "none" || !chatbox.style.display) {
          chatbox.style.display = "flex";
          chatbox.style.flexDirection = "column";
        } else {
          chatbox.style.display = "none";
        }
      });

      closeBtn.onclick = () => {
        chatbox.style.display = "none";
      };

      async function handleSend() {
        const userMsg = inputField.value.trim();
        if (!userMsg) return;

        const userWrap = document.createElement("div");
        userWrap.className = "parky-msg user";
        userWrap.innerHTML = `
          <img src="../images/TD-Profile.png" class="parky-icon" />
          <div class="bubble">${userMsg}</div>
        `;
        messages.appendChild(userWrap);
        messages.scrollTop = messages.scrollHeight;
        inputField.value = "";

        const typing = document.createElement("div");
        typing.className = "parky-msg bot";
        typing.innerHTML = `<div class="parky-typing">Parky is typing...</div>`;
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;

        try {
          let botReply = "Sorry, I didn’t get that.";

          const greetings = ["hello", "hi", "hey", "yo", "sup"];
          if (greetings.some(word => userMsg.toLowerCase().includes(word))) {
            botReply = "👋 Hi there! I'm Parky, your helpful assistant. Let me know if you need help with parks, reservations, or anything tournament-related!";
          } else {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer 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"
              },
              body: JSON.stringify({
                model: "gpt-4",
                messages: [
                  {
                    role: "system",
                    content: "You are Parky, a helpful assistant for tournament directors. You help users reserve disc golf parks and answer questions about park rules, locations, and reservation steps."
                  },
                  { role: "user", content: userMsg }
                ]
              })
            });
            const data = await response.json();
            botReply = data.choices?.[0]?.message?.content || botReply;
          }

          messages.removeChild(typing);
          const botWrap = document.createElement("div");
          botWrap.className = "parky-msg bot";
          botWrap.innerHTML = `
            <div class="bubble">${botReply}</div>
            <img src="../images/Parky.png" class="parky-icon" />
          `;
          messages.appendChild(botWrap);
          messages.scrollTop = messages.scrollHeight;
        } catch (e) {
          messages.removeChild(typing);
          const err = document.createElement("div");
          err.className = "parky-msg bot";
          err.innerHTML = `<div class="bubble">⚠️ Error getting reply.</div>`;
          messages.appendChild(err);
        }
      }

      sendBtn.onclick = handleSend;

      inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });

      function makeDraggable(elem, handle) {
        let offsetX = 0, offsetY = 0, isDragging = false;

        handle.addEventListener("mousedown", (e) => {
          if (e.target.classList.contains("parky-resize-handle")) return;
          isDragging = true;
          offsetX = e.clientX - elem.offsetLeft;
          offsetY = e.clientY - elem.offsetTop;
          document.body.style.userSelect = "none";
        });

        document.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          const newLeft = Math.min(window.innerWidth - elem.offsetWidth, Math.max(0, e.clientX - offsetX));
          const newTop = Math.min(window.innerHeight - elem.offsetHeight, Math.max(0, e.clientY - offsetY));
          elem.style.left = `${newLeft}px`;
          elem.style.top = `${newTop}px`;
          elem.style.right = "unset";
          elem.style.bottom = "unset";
        });

        document.addEventListener("mouseup", () => {
          isDragging = false;
          document.body.style.userSelect = "auto";
        });
      }

      makeDraggable(chatbox, document.getElementById("parky-header"));

      const handles = chatbox.querySelectorAll(".parky-resize-handle.right, .parky-resize-handle.bottom");
      let isResizing = false, startX, startY, startWidth, startHeight, currentHandle;

      handles.forEach(handle => {
        handle.addEventListener("mousedown", e => {
          e.preventDefault();
          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = parseInt(getComputedStyle(chatbox).width, 10);
          startHeight = parseInt(getComputedStyle(chatbox).height, 10);
          currentHandle = handle.classList.contains("right") ? "right" : "bottom";
          document.documentElement.addEventListener("mousemove", doResize, false);
          document.documentElement.addEventListener("mouseup", stopResize, false);
        });
      });

      function doResize(e) {
        if (!isResizing) return;

        if (currentHandle === "right") {
          const newWidth = startWidth + (e.clientX - startX);
          chatbox.style.width = `${Math.min(window.innerWidth - chatbox.offsetLeft, newWidth)}px`;
        } else if (currentHandle === "bottom") {
          const newHeight = startHeight + (e.clientY - startY);
          chatbox.style.height = `${Math.min(window.innerHeight - chatbox.offsetTop, newHeight)}px`;
        }
      }

      function stopResize() {
        isResizing = false;
        document.documentElement.removeEventListener("mousemove", doResize, false);
        document.documentElement.removeEventListener("mouseup", stopResize, false);
      }
    })
    .catch(err => console.error("Parky failed to load:", err));
});
