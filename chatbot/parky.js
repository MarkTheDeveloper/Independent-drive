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

      // Add resize handles
      ["right", "bottom"].forEach(side => {
        const handle = document.createElement("div");
        handle.classList.add("parky-resize-handle", side);
        chatbox.appendChild(handle);
      });

      // Welcome message
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
          inputField.focus();
        } else {
          chatbox.style.display = "none";
        }
      });

      closeBtn.onclick = () => {
        chatbox.style.display = "none";
      };

      function addUserMessage(text) {
        const userWrap = document.createElement("div");
        userWrap.className = "parky-msg user";
        userWrap.innerHTML = `
          <img src="../images/TD-Profile.png" class="parky-icon" />
          <div class="bubble">${text}</div>
        `;
        messages.appendChild(userWrap);
        messages.scrollTop = messages.scrollHeight;
      }

      function addBotMessage(text) {
        const botWrap = document.createElement("div");
        botWrap.className = "parky-msg bot";
        botWrap.innerHTML = `
          <div class="bubble">${text}</div>
          <img src="../images/Parky.png" class="parky-icon" />
        `;
        messages.appendChild(botWrap);
        messages.scrollTop = messages.scrollHeight;
      }

      function showTypingIndicator(show) {
        if (show) {
          const typing = document.createElement("div");
          typing.className = "parky-msg bot typing-indicator";
          typing.id = "typing-indicator";
          typing.innerHTML = `<div class="parky-typing">Parky is typing...</div>`;
          messages.appendChild(typing);
          messages.scrollTop = messages.scrollHeight;
        } else {
          const typing = document.getElementById("typing-indicator");
          if (typing) typing.remove();
        }
      }

      async function handleSend() {
        const userMsg = inputField.value.trim();
        if (!userMsg) return;

        addUserMessage(userMsg);
        inputField.value = "";

        showTypingIndicator(true);

        try {
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
                  content: "You are Parky, a helpful assistant for tournament directors managing disc golf park reservations. Answer clearly and helpfully."
                },
                { role: "user", content: userMsg }
              ],
              max_tokens: 300
            })
          });

          const data = await response.json();
          const botReply = data.choices?.[0]?.message?.content || "Sorry, I didn't get that.";

          showTypingIndicator(false);
          addBotMessage(botReply);

        } catch (error) {
          showTypingIndicator(false);
          addBotMessage("⚠️ Error getting reply. Please try again.");
          console.error(error);
        }
      }

      sendBtn.onclick = handleSend;

      inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });

      // Draggable
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

      // Resize handlers
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
    .catch(err => {
      console.error("Parky failed to load:", err);
    });
});
