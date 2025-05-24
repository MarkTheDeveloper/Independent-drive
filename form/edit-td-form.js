
  /*park names drop-down menu*/
fetch('../data/data.json')
  .then(response => response.json())
  .then(data => {
    const select = document.getElementById('courseSelect');
    select.innerHTML = ''; // Clear loading option

    data.forEach(course => {
      const option = document.createElement('option');
      option.value = course.course_name;
      option.textContent = course.course_name;
      select.appendChild(option);
    });
  })
  .catch(error => {
    console.error("Error loading course list:", error);
    const select = document.getElementById('courseSelect');
    select.innerHTML = '<option disabled>Error loading data</option>';
  });

  document.getElementById("typeInput").addEventListener("change", function () {
    const type = this.value;
    const basic = document.getElementById("basicFields");
    const notice = document.getElementById("noticeFields");

  if (type === "confirm_with_notice") {
    basic.style.display = "none";
    notice.style.display = "block";
  } else {
    basic.style.display = "block";
    notice.style.display = "none";
  }
});

/*adding field process */

let fields = [];

function addField() {
    console.log("fields array in add:", fields);

  const course = document.getElementById("courseSelect").value;
  const type = document.getElementById("typeInput").value;

  let field = { type };

  if (type === "confirm_with_notice") {
    const notice = document.getElementById("noticeInput").value;
    const confirmText = document.getElementById("confirmLabelInput").value;
    const required = document.getElementById("confirmRequiredInput").checked;

    field.label = confirmText;
    field.notice = notice;
    field.required = required;
  } else {
    const label = document.getElementById("labelInput").value;
    const required = document.getElementById("requiredInput").checked;

    field.label = label;
    field.required = required;
  }

  fields.push(field);
  alert("Field added!");
  
  /*This section will appear when users make changes*/
  if (fields.length > 0) {
  document.getElementById('changes').innerHTML = `
    <label>
      ✅ You have unsaved changes: ${fields.length} field(s) added.
    </label>
  `;
} else {
  document.getElementById('changes').innerHTML = '';
}
}



/*send to php*/
function saveFields() {
  const course = document.getElementById("courseSelect").value;
    console.log("fields array in save:", fields);
  if (!course || fields.length === 0) {
    alert("Please choose a course and add at least one field.");
    return;
  }

  fetch('../data/save_custom_fields.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      course_name: course,
      custom_fields: fields
    })
  })
  .then(res => res.text())
  .then(msg => {
    fields = [];
    document.getElementById("changes").innerHTML = '';
    alert("Saved: " + msg);})
  .catch(err => {
    console.error("Save failed:", err);
    alert("Failed to save.");
  });
}

