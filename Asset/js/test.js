// ============================================
// CONFIGURATION & CONSTANTS
// ============================================
const CONFIG = {
  defaultImage: "./Asset/images/user.jpg",
  roomCapacity: 5,
  requiredRooms: [
    "Salle des serveurs",
    "Salle de securite",
    "Reception",
    "Salle darchives",
  ],
};

const REGEX = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  phone: /^[0-9+\-\s()]{10,}$/,
  url: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
  name: /^[a-zA-Z\s]{2,50}$/,
};

const ROLE_ACCESS = {
  Manager: [
    "Reception",
    "Salle de conference",
    "Salle de securite",
    "Salle des serveurs",
    "Salle darchives",
    "Salle du personnel",
  ],
  Nettoyage: [
    "Reception",
    "Salle de conference",
    "Salle de securite",
    "Salle des serveurs",
    "Salle du personnel",
  ],
  "Agents de sécurité": ["Salle de securite"],
  "Techniciens IT": ["Salle des serveurs"],
  "Autres rôles": ["Reception", "Salle de conference", "Salle du personnel"],
};

// ============================================
// STATE MANAGEMENT (Global Variables)
// ============================================
let workers = [];
let assignments = {};
let editingWorkerId = null; // Tracks if we are adding or editing

// Utility: XSS Protection
const safe = (str) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// ============================================
// DATA FUNCTIONS
// ============================================

function initData() {
  try {
    workers = JSON.parse(localStorage.getItem("workerData")) || [];
    assignments = JSON.parse(localStorage.getItem("assignedWorkers")) || {};
  } catch (e) {
    console.error("Error loading data", e);
    workers = [];
    assignments = {};
  }
}

function saveData() {
  localStorage.setItem("workerData", JSON.stringify(workers));
  localStorage.setItem("assignedWorkers", JSON.stringify(assignments));
}

function getNextId() {
  return workers.length > 0 ? Math.max(...workers.map((w) => w.id)) + 1 : 1;
}

function findWorker(id) {
  return workers.find((w) => w.id === id);
}

function addWorkerData(data) {
  const worker = {
    ...data,
    id: getNextId(),
    access: ROLE_ACCESS[data.role] || [],
  };
  workers.push(worker);
  saveData();
  return worker;
}

function updateWorkerData(id, newData) {
  const index = workers.findIndex((w) => w.id === id);
  if (index !== -1) {
    const updatedAccess = ROLE_ACCESS[newData.role] || workers[index].access;
    workers[index] = {
      ...workers[index],
      ...newData,
      access: updatedAccess,
    };
    saveData();
    return workers[index];
  }
  return null;
}

function deleteWorkerData(id) {
  // Remove from rooms
  Object.keys(assignments).forEach((room) => {
    assignments[room] = assignments[room].filter((wId) => wId !== id);
  });

  // Remove from list
  workers = workers.filter((w) => w.id !== id);
  saveData();
}

function isWorkerAssigned(id) {
  return Object.values(assignments).flat().includes(id);
}

function getWorkerRoom(id) {
  for (const [room, workerIds] of Object.entries(assignments)) {
    if (workerIds.includes(id)) return room;
  }
  return null;
}

function assignWorkerToRoom(workerId, roomName) {
  if (!assignments[roomName]) assignments[roomName] = [];

  if (assignments[roomName].length >= CONFIG.roomCapacity) {
    return { success: false, message: "Cette salle est pleine !" };
  }
  if (isWorkerAssigned(workerId)) {
    return { success: false, message: "Cet employé est déjà assigné !" };
  }

  assignments[roomName].push(workerId);
  saveData();
  return { success: true };
}

function removeWorkerFromRoomData(workerId, roomName) {
  if (assignments[roomName]) {
    assignments[roomName] = assignments[roomName].filter((id) => id !== workerId);
    saveData();
  }
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================
function validateField(input) {
  const value = input.value.trim();
  let isValid = true;
  let message = "";

  switch (input.name) {
    case "fullname":
      isValid = REGEX.name.test(value);
      message = isValid ? "" : "Nom invalide (2-50 lettres)";
      break;
    case "email":
      isValid = REGEX.email.test(value);
      message = isValid ? "" : "Email invalide";
      break;
    case "phone":
      isValid = REGEX.phone.test(value);
      message = isValid ? "" : "Téléphone invalide (min 10 chiffres)";
      break;
    case "image_url":
      isValid = value === "" || REGEX.url.test(value);
      message = isValid ? "" : "URL invalide (jpg, png, webp)";
      break;
  }
  return { isValid, message };
}

function validateDateRange(start, end) {
  if (!start || !end) return { isValid: false, message: "Dates requises" };
  if (new Date(start) > new Date(end)) {
    return { isValid: false, message: "Fin avant Début impossible" };
  }
  return { isValid: true, message: "" };
}

function displayValidation(input, result) {
  const validateElement = document.querySelector(`.validate_${input.name}`);
  if (validateElement) {
    validateElement.textContent = result.message;
    validateElement.style.color = result.isValid ? "green" : "red";
    input.style.borderColor = result.isValid ? "#ddd" : "red";
  }
}

// ============================================
// DOM / UI FUNCTIONS
// ============================================

// --- Workers List Sidebar ---
function createWorkerCardHTML(worker) {
  return `
      <div class="worker_card" id="worker-${worker.id}" data-id="${worker.id}">
        <div class="workerAvatar">
          <img src="${safe(worker.image_url) || CONFIG.defaultImage}" 
               alt="avatar" onerror="this.src='${CONFIG.defaultImage}'">
        </div>
        <div class="workerName">
          <p>${safe(worker.fullname)}</p>
          <small>${safe(worker.role)}</small>
        </div>
        <div class="card-actions" style="display:flex; justify-content:center; gap:10px; padding:10px;">
            <div class="editWorker" style="cursor:pointer; color:blue;">
              <i class="fas fa-pen" data-action="edit" data-id="${worker.id}"></i>
            </div>
            <div class="deleteWorker" style="cursor:pointer; color:red;">
              <i class="fas fa-trash-can" data-action="delete" data-id="${worker.id}"></i>
            </div>
        </div>
      </div>
    `;
}

function renderWorkerCard(worker) {
  const container = document.querySelector(".new_worker_container");
  container.insertAdjacentHTML("beforeend", createWorkerCardHTML(worker));

  // Attach events immediately
  const card = document.getElementById(`worker-${worker.id}`);
  card.addEventListener("click", handleWorkerCardClick);
}

function updateWorkerCardDOM(worker) {
  const card = document.getElementById(`worker-${worker.id}`);
  if (card) {
    const img = card.querySelector(".workerAvatar img");
    const name = card.querySelector(".workerName p");
    const role = card.querySelector(".workerName small");

    if (img) img.src = safe(worker.image_url) || CONFIG.defaultImage;
    if (name) name.textContent = safe(worker.fullname);
    if (role) role.textContent = safe(worker.role);
  }
}

// --- Room Management UI ---
function renderWorkerInRoom(worker, roomName) {
  const div = document.createElement("div");
  div.className = "worker_in_room";
  div.id = `room-worker-${worker.id}`;
  div.innerHTML = `
      <img src="${safe(worker.image_url) || CONFIG.defaultImage}" alt="${safe(
    worker.fullname
  )}" onerror="this.src='${CONFIG.defaultImage}'">
      <span>${safe(worker.fullname)}</span>
      <button class="remove_worker_btn" style="color:red; border:none; background:none; font-weight:bold; cursor:pointer;">&times;</button>
    `;

  // Event: Remove from room or View Details
  div.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove_worker_btn")) {
      handleRemoveFromRoom(worker.id, roomName);
    } else {
      showWorkerDetail(worker.id);
    }
  });

  const roomEl = document.querySelector(`[data-access="${roomName}"]`);
  if (roomEl) {
    roomEl.querySelector(".worker_room_container").appendChild(div);
  }
}

function updateAllRoomsUI() {
  document.querySelectorAll("[data-access]").forEach((roomEl) => {
    const roomName = roomEl.dataset.access;
    const count = assignments[roomName] ? assignments[roomName].length : 0;

    // Update counter
    const counterEl = roomEl.querySelector(".room_header p:last-child");
    if (counterEl) {
      counterEl.innerHTML = `${count} / <span>${CONFIG.roomCapacity}</span>`;
    }

    // Update Alert
    const alertEl = roomEl.querySelector(".alert");
    if (CONFIG.requiredRooms.includes(roomName)) {
      if (count === 0) {
        roomEl.classList.add("empty-required");
        if (alertEl) alertEl.style.display = "block";
      } else {
        roomEl.classList.remove("empty-required");
        if (alertEl) alertEl.style.display = "none";
      }
    }
  });
}

// --- Form & Experience UI ---
function addExperienceField(data = null) {
  const form = document.getElementById("form_worker_data");
  const container = document.createElement("div");
  container.className = "experience_input";
  container.innerHTML = `
      <div class="experience-group" style="border-top:1px solid #ccc; padding-top:10px; margin-top:10px;">
        <div class="input_info">
          <label>Entreprise</label>
          <input type="text" name="company" class="exp-field" value="${
            data ? safe(data.company) : ""
          }" required>
        </div>
        <div class="input_info">
          <label>Poste</label>
          <input type="text" name="position" class="exp-field" value="${
            data ? safe(data.position) : ""
          }" required>
        </div>
        <div class="input_info">
          <label>Début</label>
          <input type="date" name="start_date" class="exp-start-date exp-field" value="${
            data ? data.startDate : ""
          }" required>
        </div>
        <div class="input_info">
          <label>Fin</label>
          <input type="date" name="end_date" class="exp-end-date exp-field" value="${
            data ? data.endDate : ""
          }" required>
        </div>
        <p class="validate validate_experience"></p>
        <button type="button" class="remove_exp_btn" style="background:#ff4444; color:white; border:none; padding:5px;">Supprimer</button>
      </div>
    `;

  // Insert before submit button
  form.insertBefore(container, document.getElementById("submit"));

  // Internal Logic for this specific block
  const start = container.querySelector(".exp-start-date");
  const end = container.querySelector(".exp-end-date");
  const valMsg = container.querySelector(".validate_experience");

  const checkDates = () => {
    const res = validateDateRange(start.value, end.value);
    valMsg.textContent = res.message;
    valMsg.style.color = res.isValid ? "green" : "red";
    return res.isValid;
  };

  start.addEventListener("change", checkDates);
  end.addEventListener("change", checkDates);
  container
    .querySelector(".remove_exp_btn")
    .addEventListener("click", () => container.remove());
}

function getExperienceDataFromForm() {
  const exps = [];
  document.querySelectorAll(".experience_input").forEach((div) => {
    exps.push({
      company: div.querySelector('[name="company"]').value,
      position: div.querySelector('[name="position"]').value,
      startDate: div.querySelector('[name="start_date"]').value,
      endDate: div.querySelector('[name="end_date"]').value,
    });
  });
  return exps;
}

function validateAllExperiences() {
  let isValid = true;
  document.querySelectorAll(".experience_input").forEach((div) => {
    const start = div.querySelector(".exp-start-date").value;
    const end = div.querySelector(".exp-end-date").value;
    const res = validateDateRange(start, end);
    if (!res.isValid) {
      div.querySelector(".validate_experience").textContent = res.message;
      isValid = false;
    }
  });
  return isValid;
}

// --- Popups ---
function showWorkerDetail(id) {
  const worker = findWorker(id);
  if (!worker) return;

  const room = getWorkerRoom(id);
  const expList = (worker.experiences || [])
    .map(
      (e) =>
        `<li>${safe(e.company)} - ${safe(e.position)} <small>(${e.startDate} au ${e.endDate})</small></li>`
    )
    .join("");

  const html = `
      <div class="worker_detail_popup">
        <div class="popup_header"><h2>${safe(worker.fullname)}</h2><span id="close_detail">&times;</span></div>
        <div class="popup_content">
          <div style="text-align:center"><img src="${
            safe(worker.image_url) || CONFIG.defaultImage
          }" style="width:100px;height:100px;border-radius:50%"></div>
          <p><strong>Rôle:</strong> ${safe(worker.role)}</p>
          <p><strong>Email:</strong> ${safe(worker.email)}</p>
          <p><strong>Salle:</strong> ${safe(room || "Non assigné")}</p>
          <h4>Expériences</h4><ul>${expList || "Aucune"}</ul>
        </div>
      </div>
      <div class="overlay_detail" style="display:block;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:998"></div>
    `;

  document.body.insertAdjacentHTML("beforeend", html);

  const close = () => {
    document.querySelector(".worker_detail_popup").remove();
    document.querySelector(".overlay_detail").remove();
  };
  document.getElementById("close_detail").addEventListener("click", close);
  document.querySelector(".overlay_detail").addEventListener("click", close);
}

function showSelectionPopup(roomName) {
  const candidates = workers.filter(
    (w) => w.access.includes(roomName) && !isWorkerAssigned(w.id)
  );

  if (candidates.length === 0) {
    alert("Personne disponible pour cette salle.");
    return;
  }

  const html = `
      <div class="workers_popup_overlay">
        <div class="worker_popup">
          <div class="popup_header"><h3>Ajouter à ${safe(
            roomName
          )}</h3><span id="close_sel">&times;</span></div>
          <div class="popup_body">
            ${candidates
              .map(
                (w) => `
              <div class="popup" style="display:flex; align-items:center; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
                <img src="${
                  safe(w.image_url) || CONFIG.defaultImage
                }" style="width:40px;height:40px;border-radius:50%">
                <div><strong>${safe(w.fullname)}</strong><br><small>${safe(
                  w.role
                )}</small></div>
                <button class="select_worker_btn" data-id="${
                  w.id
                }">Ajouter</button>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML("beforeend", html);

  const close = () =>
    document.querySelector(".workers_popup_overlay")?.remove();
  document.getElementById("close_sel").addEventListener("click", close);

  document.querySelectorAll(".select_worker_btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      handleAssignWorker(id, roomName);
      close();
    });
  });
}

// ============================================
// EVENT HANDLERS (LOGIC)
// ============================================

function handleWorkerCardClick(e) {
  const card = e.currentTarget;
  const id = parseInt(card.dataset.id);
  const actionIcon = e.target.closest("i");
  const action = actionIcon ? actionIcon.dataset.action : null;

  if (action === "delete") {
    if (confirm("Supprimer cet employé ?")) {
      deleteWorkerData(id);
      card.remove();
      // If in a room, remove them there too (visually)
      const roomEl = document.getElementById(`room-worker-${id}`);
      if (roomEl) roomEl.remove();
      updateAllRoomsUI();
    }
  } else if (action === "edit") {
    openFormForEdit(id);
  } else {
    showWorkerDetail(id);
  }
}

function openFormForEdit(id) {
  const worker = findWorker(id);
  if (!worker) return;

  editingWorkerId = id;
  const form = document.getElementById("form_worker_data");
  document.getElementById("submit").textContent = "Modifier";

  // Fill Basic inputs
  form.fullname.value = worker.fullname;
  form.email.value = worker.email;
  form.phone.value = worker.phone;
  form.role.value = worker.role;
  form.image_url.value = worker.image_url;
  document.querySelector(".image_form img").src =
    worker.image_url || CONFIG.defaultImage;

  // Fill Experiences
  document.querySelectorAll(".experience_input").forEach((e) => e.remove());
  if (worker.experiences) {
    worker.experiences.forEach((exp) => addExperienceField(exp));
  }

  document.querySelector(".overlay").style.display = "flex";
}

function openFormForNew() {
  editingWorkerId = null;
  const form = document.getElementById("form_worker_data");
  form.reset();
  document.getElementById("submit").textContent = "Ajouter";
  document.querySelector(".image_form img").src = CONFIG.defaultImage;
  document.querySelectorAll(".experience_input").forEach((e) => e.remove());
  document.querySelector(".overlay").style.display = "flex";
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;

  // Validate Main Fields
  let valid = true;
  ["fullname", "email", "phone", "image_url"].forEach((name) => {
    const input = form[name];
    const res = validateField(input);
    if (!res.isValid && input.value.trim() !== "") valid = false;
    // Force empty image to be valid if regex failed on empty string
    if (name === "image_url" && input.value === "") valid = true; 
  });

  if (!validateAllExperiences()) valid = false;

  if (!valid) {
    alert("Veuillez corriger les erreurs.");
    return;
  }

  const formData = {
    fullname: form.fullname.value,
    email: form.email.value,
    phone: form.phone.value,
    image_url: form.image_url.value,
    role: form.role.value,
    experiences: getExperienceDataFromForm(),
  };

  if (editingWorkerId) {
    // UPDATE MODE
    const updated = updateWorkerData(editingWorkerId, formData);
    updateWorkerCardDOM(updated);
    // If they are in a room, update that view too
    const roomWorkerEl = document.getElementById(
      `room-worker-${editingWorkerId}`
    );
    if (roomWorkerEl) {
      roomWorkerEl.querySelector("img").src =
        safe(updated.image_url) || CONFIG.defaultImage;
      roomWorkerEl.querySelector("span").textContent = safe(updated.fullname);
    }
  } else {
    // ADD MODE
    const newWorker = addWorkerData(formData);
    renderWorkerCard(newWorker);
  }

  document.querySelector(".overlay").style.display = "none";
  form.reset();
}

function handleAssignWorker(id, roomName) {
  const res = assignWorkerToRoom(id, roomName);
  if (!res.success) {
    alert(res.message);
    return;
  }

  // Remove from sidebar list
  document.getElementById(`worker-${id}`)?.remove();

  // Add to room UI
  renderWorkerInRoom(findWorker(id), roomName);
  updateAllRoomsUI();
}

function handleRemoveFromRoom(id, roomName) {
  removeWorkerFromRoomData(id, roomName);

  // Remove from room UI
  document.getElementById(`room-worker-${id}`)?.remove();

  // Add back to sidebar
  const worker = findWorker(id);
  if (worker) renderWorkerCard(worker);

  updateAllRoomsUI();
}

// ============================================
// INITIALIZATION & SETUP
// ============================================

function setupEventListeners() {
  // 1. Open Form
  document
    .getElementById("add_new_worker")
    .addEventListener("click", openFormForNew);

  // 2. Close Form
  document.getElementById("close_form").addEventListener("click", () => {
    document.querySelector(".overlay").style.display = "none";
  });

  // 3. Form Validation (Real-time)
  const form = document.getElementById("form_worker_data");
  form.addEventListener("input", (e) => {
    if (!e.target.classList.contains("exp-field")) {
      displayValidation(e.target, validateField(e.target));
    }
  });

  // 4. Image Preview
  document.getElementById("image_url").addEventListener("blur", (e) => {
    const url = e.target.value;
    document.querySelector(".image_form img").src = REGEX.url.test(url)
      ? url
      : CONFIG.defaultImage;
  });

  // 5. Add Experience Button
  document.getElementById("add_experience").addEventListener("click", (e) => {
    e.preventDefault();
    addExperienceField();
  });

  // 6. Submit Form
  form.addEventListener("submit", handleFormSubmit);

  // 7. Room "Add" Buttons
  document.querySelectorAll(".add_to_room").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const room = e.target.closest("[data-access]").dataset.access;
      showSelectionPopup(room);
    });
  });
}

function init() {
  initData(); // Load from LocalStorage
  setupEventListeners(); // Attach clicks

  // Render Unassigned Workers in Sidebar
  workers.forEach((w) => {
    if (!isWorkerAssigned(w.id)) {
      renderWorkerCard(w);
    }
  });

  // Render Assigned Workers in Rooms
  Object.entries(assignments).forEach(([room, ids]) => {
    ids.forEach((id) => {
      const w = findWorker(id);
      if (w) renderWorkerInRoom(w, room);
    });
  });

  updateAllRoomsUI();
}

// Start the app
document.addEventListener("DOMContentLoaded", init);