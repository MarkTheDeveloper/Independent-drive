
    document.getElementById('eventDays').addEventListener('change', function () {
      const days = parseInt(this.value);
      const container = document.getElementById('eventDetailsContainer');
      container.innerHTML = ``; 
      for (let i = 1; i <= days; i++) {
        const group = document.createElement('div');
        group.innerHTML = `
          <div class="eventDays-flex">
            <div class="days-flex1">
              <label>Day ${i}</label>
              <input type="date" name="eventDate${i} required">
            </div>
            <div class="days-flex2">
              <label>Time Range: </label> 
              <input type="time" name="startTime${i}" required> to
              <input type="time" name="endTime${i}" required>
            </div>
            <div class="days-flex3">
              <label>Estimated Attendance:</label>
              <input type="time" name="attendance${i}" required>
            </div>
          </div>
        `;
        container.appendChild(group);
      }
      container.style.marginBottom = '35px';

    });

      fetch("../footer/footer.html")
        .then(res => res.text())
        .then(data => {
          document.getElementById("footer-placeholder").innerHTML = data;
        });

        
 

// load park data
let allParks = [];
let parkReqData = {};

Promise.all([
  fetch("../data/data.json").then(res => res.json()),
  fetch("../data/park-req.json").then(res => res.json())
])
.then(([parks, parkReqs]) => {
  allParks = parks;
  parkReqData = parkReqs;

  initializeFuseSearch();

  const selected = JSON.parse(localStorage.getItem("selectedPark"));
  const input = document.getElementById("parkSearchInput");
  const infoBox = document.getElementById("park-info-box");
  const form = document.querySelector("form");

  if (selected) {
    input.value = selected.course_name;
    displayParkInfo(selected);
    showSpecificRequirements(selected.course_name);
    showFormCalendarForPark(selected);
    disableFormIfExternal(selected);
    localStorage.removeItem("selectedPark");
  } else {
    input.value = "";
    if (infoBox) infoBox.style.display = "none";
    if (form) form.reset();
  }
});


  // brendons score system
  function getReservationScore(course) {
  let score = 0;
  const contact = course.contact_info || {};

  if (contact.phone && contact.phone.trim().toLowerCase() !== "not available") score += 1;
  if (contact.email && contact.email.trim().toLowerCase() !== "not available") score += 1;
  if (contact.website && contact.website.trim().toLowerCase() !== "not available") score += 1;
  if (course.reservation_requirements && !course.reservation_requirements.toLowerCase().includes("not specified")) score += 1;
  if (course.policies_rules_dates_open) score += 1;

  return score;
}






  // helper to set the dropdown to a selected park
  function setDropdown(name) {
    const select = document.querySelector("select[name='park_selection']");
    const options = select.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].textContent.trim() === name.trim()) {
        select.selectedIndex = i;
        break;
      }
    }
  }

  // display park info section
  function displayParkInfo(park) {
  const box = document.getElementById("park-info-box");
  const wrapper = document.getElementById("park-info-wrapper");
  if (!box || !wrapper) return;

  const score = getReservationScore(park);
  const ratingText = score > 0
  ? `Reservation Readiness Score: <span class="stars">${"★".repeat(score)}${"☆".repeat(5 - score)}</span>`
  : "Reservation Readiness Score: N/A";



  const website = park.contact_info.website?.toLowerCase();
  const websiteHTML =
    website && website !== "null" && website !== "not available"
      ? `<a href="${park.contact_info.website}" target="_blank">Website</a><br>`
      : "";

  box.innerHTML = `
    <h3>${park.course_name}</h3>
    <p><strong>Holes:</strong> ${park.holes}</p>
    <p><strong>Type:</strong> ${park.course_type}</p>
    <p><strong>Reservation:</strong> ${park.reservation_requirements}</p>
    <p><strong>Contact:</strong><br>
      ${park.contact_info.address || "N/A"}<br>
      ${park.contact_info.phone || "N/A"}<br>
      ${park.contact_info.email || "N/A"}<br>
      ${websiteHTML}
    </p>
    <p><strong>${ratingText}</strong></p>
  `;

  wrapper.style.display = "block";
  box.style.display = "block";
}



  // setup Fuse.js search
  function initializeFuseSearch() {
  const fuse = new Fuse(allParks, {
    keys: ["course_name"],
    threshold: 0.4
  });

  const input = document.getElementById("parkSearchInput");
  const results = document.getElementById("searchResults");

  function showMatches(query) {
  results.innerHTML = "";
  results.style.display = "none";

  if (!query) return;

  const matches = fuse.search(query).slice(0, 5);
  if (matches.length > 0) {
    results.style.display = "block";
    matches.forEach(({ item }) => {
      const li = document.createElement("li");
      li.textContent = item.course_name;
      li.className = "dropdown-item";
      li.onclick = () => {
        input.value = item.course_name;
        displayParkInfo(item);
        showSpecificRequirements(item.course_name);
        showFormCalendarForPark(item);
        disableFormIfExternal(item); 
        results.innerHTML = "";
        results.style.display = "none";
      };
      results.appendChild(li);
    });
  }
}

  input.addEventListener("input", function () {
    const query = this.value.trim();
    showMatches(query);
  });

  //  also show matches when input gets focus
  input.addEventListener("focus", function () {
    const query = this.value.trim();
    if (query.length > 0) {
      showMatches(query);
    }
  });

  // hide dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.style.display = "none";
    }
  });
  }

  /*specific req for spec park*/ 


// Trigger when user picks a park
document.getElementById("parkSearchInput").addEventListener("change", function () {
  const selected = this.value;
  showSpecificRequirements(selected);
});

function showSpecificRequirements(parkName) {
  const fields = parkReqData[parkName] || [];
  const fieldset = document.getElementById("specific-req");
  const container = document.getElementById("specific-req-container");
  container.innerHTML = "";

  if (fields.length === 0) {
    fieldset.style.display = "none";
    return;
  }

  fields.forEach(field => {
    const wrapper = document.createElement("div");

    if (field.type === "confirm_with_notice") {
      const notice = document.createElement("label");
      notice.textContent = field.notice || "⚠️ Please confirm this requirement.";
      notice.style.display = "block";
      notice.style.fontWeight = "bold";
      notice.style.marginBottom = "6px";

      const label = document.createElement("label");
      label.style.fontWeight = "normal"; 
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "custom_" + field.label.toLowerCase().replace(/\s+/g, "_");
      if (field.required) checkbox.required = true;

      label.appendChild(checkbox);
      label.append(" " + field.label);

      wrapper.appendChild(notice);
      wrapper.appendChild(label);
    } else {
      const label = document.createElement("label");
      label.textContent = field.label;

      let input;
      if (field.type === "textarea") {
        input = document.createElement("textarea");
      } else {
        input = document.createElement("input");
        input.type = field.type || "text";
      }

      input.name = "custom_" + field.label.toLowerCase().replace(/\s+/g, "_");
      if (field.required) input.required = true;

      wrapper.appendChild(label);
      wrapper.appendChild(document.createElement("br"));
      wrapper.appendChild(input);
    }

    wrapper.appendChild(document.createElement("br"));
    container.appendChild(wrapper);
  });

  fieldset.style.display = "block";
}



function disableFormIfExternal(park) {
  const keywords = ["contact", "email", "form", ".pdf", "mobile app", "cannot", "in person"];
  const reservationText = (park.reservation_requirements || "").toLowerCase();
  const isExternal = keywords.some(keyword => reservationText.includes(keyword));
  if (!isExternal) return;

  const form = document.querySelector("form");
  const inputs = form.querySelectorAll("input, select, textarea, button");
  const submitBtn = form.querySelector("input[type='submit']");
  const parkInput = document.getElementById("parkSearchInput");

  // Disable everything except the park search input
  inputs.forEach(el => {
    if (el !== parkInput) {
      el.disabled = true;
      el.style.opacity = "0.6";
      el.style.cursor = "not-allowed";
    }
  });

  // Re-enable the search input (in case it was disabled before)
  parkInput.disabled = false;
  parkInput.style.opacity = "1";
  parkInput.style.cursor = "text";

  // Add a top warning banner if not already there
  if (!document.getElementById("external-notice")) {
    const notice = document.createElement("div");
    notice.id = "external-notice";
    notice.style.cssText = `
      background: #fff5f5;
      border: 2px solid #cc0000;
      color: #660000;
      padding: 16px;
      border-radius: 6px;
      font-size: 15px;
      margin-bottom: 20px;
    `;
    notice.innerHTML = `
      <strong>⚠️ Reservation Not Supported on This Form</strong><br><br>
      This park must be reserved through a separate method.<br>
      Please follow the instructions in the <strong>Park Info</strong> section below.<br><br>
      You may search and select a different park above.
    `;
    form.prepend(notice);
  }
}


