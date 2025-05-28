// huys course list left index park menu or park infomation 
window.onload = function () {
    const courseList = document.getElementById("course-list");

    fetch('data/data.json')
      .then(response => response.json())
      .then(information => {
        information.forEach((course) => {
          const courseDiv = document.createElement("div");
          courseDiv.classList.add("course-item");

          courseDiv.innerHTML = `
            <img src="${course.imageUrl}" alt="${course.course_name}" class="course-img" />
  
            <div class="course-info">
              <h3 class="course-name">${course.course_name}</h3>
              <p class="course-email"><strong>Email:</strong> ${course.contact_info.email}</p>
              <p class="course-phone"><strong>Phone:</strong> ${course.contact_info.phone}</p>
              <p class="course-address"><strong>Address:</strong> ${course.contact_info.address}</p>
              <div class="extra-details">
                <p><strong>Holes</strong> ${course.holes}</p>
                <p><strong>reservation requirements:</strong> ${course.reservation_requirements}</p>
                <p><strong>Description:</strong> ${course.course_type}</p>
                <a href="${course.parkMapUrl}" target="_blank" class="view-map-btn">View Map</a>
                <button class="suggest-edit-btn">
                  Suggest an edit
                </button>
                <button class="reserve-btn">
                  Reserve
                </button>
              </div>
            </div>
          `;
          courseDiv.addEventListener('mouseover', () => {
            courseDiv.classList.toggle('expanded');
          });
          courseDiv.addEventListener('mouseout', () => {
              courseDiv.classList.remove('expanded');
          });
          courseList.appendChild(courseDiv);
          /* suggesting edit form*/
          const editBtn=courseDiv.querySelector(".suggest-edit-btn");
          editBtn.addEventListener("click", () => {
            //localStorage
            localStorage.setItem("editData", JSON.stringify(course));
          
            window.open("form/edit.html");
          }); 
          let reserveBtn=courseDiv.querySelector(".reserve-btn");
          reserveBtn.onclick = () => {
            localStorage.setItem("selectedPark", JSON.stringify(course));
            window.location.href = "form/td-form.html";
          };
          /*td-form*/
        });
      })
      .catch(error => console.error('error! file JSON:', error));
  };
  





 //<------------------------------------------------------------------------------->




// <---------------------- FEATURE: Park Search and Info Display (Fuzzy Search + Voice + Keyboard Nav) ------------------>

let allParks = [];
let fuse;
let currentSelectionIndex = -1;

fetch("./data/data.json")
  .then(res => res.json())
  .then(data => {
    allParks = data;

    // Initialize Fuse.js fuzzy search
    fuse = new Fuse(allParks, {
      keys: ['course_name'],
      threshold: 0.4, // Balance between fuzzy and accurate
    });
  });

const input = document.getElementById('liveParkSearch');
const resultsList = document.getElementById('dropdownResults');
const parkInfo = document.getElementById('selectedParkInfo');

// Handle input
input.addEventListener('input', updateDropdown);

// Handle focus (show dropdown immediately)
input.addEventListener('focus', updateDropdown);

// Hide dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!input.contains(e.target) && !resultsList.contains(e.target)) {
    resultsList.style.display = "none";
  }
});

// Handle keyboard navigation
input.addEventListener('keydown', function (e) {
  const items = resultsList.querySelectorAll("li");
  if (items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    currentSelectionIndex = (currentSelectionIndex + 1) % items.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    currentSelectionIndex = (currentSelectionIndex - 1 + items.length) % items.length;
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (currentSelectionIndex >= 0) {
      items[currentSelectionIndex].click();
    }
    return;
  }

  // Highlight selected item
  items.forEach((item, index) => {
    item.style.backgroundColor = index === currentSelectionIndex ? "#0db58f" : "#014134";
    item.style.color = index === currentSelectionIndex ? "#014134" : "#0db58f";
  });
});

// Update and display fuzzy dropdown results
function updateDropdown() {
  const query = input.value.toLowerCase().trim();
  resultsList.innerHTML = "";

  if (!query || allParks.length === 0) {
    resultsList.style.display = "none";
    return;
  }

  const matches = fuse.search(query).slice(0, 5); // Top 5 results for now

  if (matches.length === 0) {
    resultsList.style.display = "none";
    return;
  }

  matches.forEach((result, index) => {
    const park = result.item;
    const li = document.createElement('li');
    li.textContent = park.course_name;
    li.setAttribute("data-index", index);
    li.onclick = () => displayParkInfo(park);
    resultsList.appendChild(li);
  });

  currentSelectionIndex = -1;
  resultsList.style.display = "block";
}
//Create ratings
function getReservationScore(course) {
  let score = 0;
  const contact = course.contact_info || {};

  if (contact.phone && contact.phone.trim().toLowerCase() != "not available") score += 1;
  if (contact.email && contact.email.trim().toLowerCase() != "not available") score += 1;
  if (contact.website && contact.website.trim().toLowerCase() != "not available") score += 1;
  if (course.reservation_requirements && !course.reservation_requirements.toLowerCase().includes("not specified")) score += 1;
  if (course.policies_rules_dates_open) score += 1;

  return score;
}
// Populate park info section
function displayParkInfo(park) {
  //  Auto fill the search bar with selected park name
  document.getElementById('liveParkSearch').value = park.course_name;

  document.getElementById('selectedParkName').innerText = park.course_name;
  document.getElementById('selectedHoles').innerText = park.holes || "N/A";
  document.getElementById('selectedCourseType').innerText = park.course_type || "N/A";
  document.getElementById('selectedRequirements').innerText = park.reservation_requirements || "N/A";
  document.getElementById('selectedInfo').innerText = park.policies_rules_dates_open || "N/A";

  const contact = park.contact_info || {};
  const score = getReservationScore(park);
  const ratingText = score > 0 ? `Reservation Readiness Score: ${"★ ".repeat(score)}${"☆ ".repeat(5 - score).trim()}` : "Rating: N/A";

  document.getElementById('selectedContact').innerHTML = `
    <strong>Address:</strong> ${contact.address || "N/A"}<br>
    <strong>Phone:</strong> ${contact.phone || "N/A"}<br>
    <strong>Email:</strong> ${contact.email || "N/A"}<br>
    <strong>Website:</strong> <a href="${contact.website || '#'}" target="_blank">${contact.website || "N/A"}</a><br>
    <strong>${ratingText}</strong>
  `;

  document.getElementById('parkImage').src = park.imageUrl || "https://via.placeholder.com/400x200?text=No+Image";
  document.getElementById('parkMapLink').href = park.parkMapUrl || "#";

  parkInfo.style.display = "block";
  resultsList.style.display = "none";

  // enable suggest edit button with localStorage redirect cool stuff 
  const editBtn = document.getElementById("generalSuggestEditBtn");
if (editBtn) {
  editBtn.style.display = "inline-block";
  editBtn.onclick = () => {
    localStorage.setItem("editData", JSON.stringify(park));
    window.open("form/edit.html", "_blank");
  };

  // Add Reserve This Park Button dynamically
  let reserveBtn = document.getElementById("reserveSelectedParkBtn");
  if (!reserveBtn) {
    reserveBtn = document.createElement("button");
    reserveBtn.id = "reserveSelectedParkBtn";
    reserveBtn.className = "suggest-edit-btn";
    reserveBtn.textContent = "Reserve This Park";
    editBtn.insertAdjacentElement("afterend", reserveBtn);
  }

    // ok this fixes the folder redirect issue where it would open the website to the parks
 if (
  park &&
  park.course_name &&
  park.course_name.toLowerCase() !== "not available" &&
  park.course_name.toLowerCase() !== "n/a"
) {
  reserveBtn.style.display = "inline-block";
  reserveBtn.onclick = () => {
    localStorage.setItem("selectedPark", JSON.stringify(park));
    window.location.href = "form/td-form.html";
  };
} else {
  reserveBtn.style.display = "none"; // Hide the button if park is invalid next time lets use null guys
}



}


  
}



// Voice Search
const voiceBtn = document.getElementById("voiceSearchBtn");
const micIcon = document.getElementById("micIcon");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  let isListening = false;

  voiceBtn.addEventListener("click", () => {
    if (!isListening) {
      recognition.start();
      isListening = true;
      voiceBtn.classList.add('listening');
    } else {
      recognition.stop();
      isListening = false;
      voiceBtn.classList.remove('listening');
    }
  });

  recognition.addEventListener("result", (e) => {
    const transcript = e.results[0][0].transcript;
    input.value = transcript;
    updateDropdown();
  });

  recognition.addEventListener("end", () => {
    isListening = false;
    voiceBtn.classList.remove('listening');
  });

  recognition.addEventListener("error", (e) => {
    console.error("Speech recognition error:", e.error);
    isListening = false;
    voiceBtn.classList.remove('listening');
  });
} else {
  voiceBtn.disabled = true;
  voiceBtn.title = "Voice search not supported in this browser";
}









// <---------------------- FEATURE: Park Search and Info Display END ------------------>