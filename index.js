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
              <a href="${course.parkMapUrl}" target="_blank" class="view-map-btn">View Map</a>
            </div>
          `;
  
          courseList.appendChild(courseDiv);
        });
      })
      .catch(error => console.error('error! file JSON:', error));
  };
  