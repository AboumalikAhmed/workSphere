// main.js
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
// STATE MANAGEMENT
// ============================================
let workers = [];
let assignments = {};
let nextId = 1;

function loadFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return null;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
    return false;
  }
}

function initializeState() {
  workers = loadFromStorage("workerData") || [];
  assignments = loadFromStorage("assignedWorkers") || {};

  if (workers.length > 0) {
    nextId = Math.max(...workers.map((w) => w.id)) + 1;
  }
}

function addWorker(workerData) {
  const worker = {
    ...workerData,
    id: nextId++,
    access: ROLE_ACCESS[workerData.role] || [],
  };
  workers.push(worker);
  saveToStorage("workerData", workers);
  return worker;
}

function updateWorker(id, newData) {
  const index = workers.findIndex((w) => w.id === id);
  if (index !== -1) {
    workers[index] = { ...workers[index], ...newData };
    saveToStorage("workerData", workers);
    return true;
  }
  return false;
}

function deleteWorker(id) {
  // Remove from assignments
  Object.keys(assignments).forEach((room) => {
    assignments[room] = assignments[room].filter((wId) => wId !== id);
  });

  // Remove from workers
  workers = workers.filter((w) => w.id !== id);

  saveToStorage("workerData", workers);
  saveToStorage("assignedWorkers", assignments);
  return true;
}

function getWorker(id) {
  return workers.find((w) => w.id === id);
}

function assignWorkerToRoom(workerId, roomName) {
  if (!assignments[roomName]) {
    assignments[roomName] = [];
  }

  if (assignments[roomName].length >= CONFIG.roomCapacity) {
    return { success: false, message: "Cette salle est pleine !" };
  }

  if (isWorkerAssigned(workerId)) {
    return { success: false, message: "Cet employé est déjà assigné !" };
  }

  assignments[roomName].push(workerId);
  saveToStorage("assignedWorkers", assignments);
  return { success: true };
}

function removeWorkerFromRoom(workerId, roomName) {
  if (assignments[roomName]) {
    assignments[roomName] = assignments[roomName].filter(
      (id) => id !== workerId
    );
    saveToStorage("assignedWorkers", assignments);
  }
}

function isWorkerAssigned(workerId) {
  return Object.values(assignments).flat().includes(workerId);
}

function getWorkerRoom(workerId) {
  for (const [room, workers] of Object.entries(assignments)) {
    if (workers.includes(workerId)) return room;
  }
  return null;
}

function getEligibleWorkersForRoom(roomName) {
  return workers.filter(
    (worker) => worker.access.includes(roomName) && !isWorkerAssigned(worker.id)
  );
}

// ============================================
// POPUP MESSAGES
// ============================================
function showMessagePopup(message) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "overlay-message";

  // Create popup
  const popup = document.createElement("div");
  popup.className = "message-popup";
  popup.innerHTML = `
    <div class="message-popup-content">
      <p>${message}</p>
    </div>
    <button id="close-message-popup">OK</button>
  `;

  // Add to DOM
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Add event listener to close button
  document
    .getElementById("close-message-popup")
    .addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

  // Close when clicking outside
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// ============================================
// VALIDATION
// ============================================
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let message = "";

  switch (field.name) {
    case "fullname":
      isValid = REGEX.name.test(value);
      message = isValid ? "" : "Nom invalide (2-50 caractères)";
      break;
    case "email":
      isValid = REGEX.email.test(value);
      message = isValid ? "" : "Email invalide";
      break;
    case "phone":
      isValid = REGEX.phone.test(value);
      message = isValid ? "" : "Téléphone invalide";
      break;
    case "image_url":
      isValid = value === "" || REGEX.url.test(value);
      message = isValid ? "" : "URL d'image invalide";
      break;
  }

  return { isValid, message };
}

function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate)
    return { isValid: false, message: "Dates requises" };

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    return {
      isValid: false,
      message: "La date de début doit être avant la date de fin",
    };
  }

  return { isValid: true, message: "" };
}

function displayValidation(field, result) {
  const validateElement = document.querySelector(`.validate_${field.name}`);
  if (validateElement) {
    validateElement.textContent = result.message;
    validateElement.style.color = result.isValid ? "green" : "red";
  }
}

// ============================================
// EXPERIENCE MANAGEMENT
// ============================================
function addExperienceField(form) {
  const experienceContainer = document.createElement("div");
  experienceContainer.className = "experience_input";
  experienceContainer.innerHTML = `
    <div class="experience-group">
      <div class="input_info">
        <label>Entreprise</label>
        <input type="text" name="company" class="exp-field" required>
      </div>
      <div class="input_info">
        <label>Poste</label>
        <input type="text" name="position" class="exp-field" required>
      </div>
      <div class="input_info">
        <label>Date de début</label>
        <input type="date" name="start_date" class="exp-start-date exp-field" required>
      </div>
      <div class="input_info">
        <label>Date de fin</label>
        <input type="date" name="end_date" class="exp-end-date exp-field" required>
      </div>
      <p class="validate validate_experience"></p>
      <button type="button" class="remove_experience">Supprimer</button>
    </div>
  `;

  const submitButton = document.getElementById("submit");
  form.insertBefore(experienceContainer, submitButton);

  // Date validation
  const startInput = experienceContainer.querySelector(".exp-start-date");
  const endInput = experienceContainer.querySelector(".exp-end-date");
  const validateEl = experienceContainer.querySelector(".validate_experience");

  const validateDates = () => {
    const result = validateDateRange(startDate.value, endDate.value);
    validateEl.textContent = result.message;
    validateEl.style.color = result.isValid ? "green" : "red";
    return result.isValid;
  };

  startInput.addEventListener("change", validateDates);
  endInput.addEventListener("change", validateDates);

  experienceContainer
    .querySelector(".remove_experience")
    .addEventListener("click", () => {
      experienceContainer.remove();
    });

  return experienceContainer;
}

function getAllExperiences(form) {
  const experiences = [];
  const experienceContainers = form.querySelectorAll(".experience_input");

  experienceContainers.forEach((container) => {
    const company = container.querySelector('[name="company"]').value;
    const position = container.querySelector('[name="position"]').value;
    const startDate = container.querySelector('[name="start_date"]').value;
    const endDate = container.querySelector('[name="end_date"]').value;

    experiences.push({ company, position, startDate, endDate });
  });

  return experiences;
}

function validateAllExperiences(form) {
  const containers = form.querySelectorAll(".experience_input");
  let allValid = true;

  containers.forEach((container) => {
    const startDate = container.querySelector(".exp-start-date").value;
    const endDate = container.querySelector(".exp-end-date").value;
    const validateEl = container.querySelector(".validate_experience");

    const result = validateDateRange(startDate, endDate);
    validateEl.textContent = result.message;
    validateEl.style.color = result.isValid ? "green" : "red";

    if (!result.isValid) allValid = false;
  });

  return allValid;
}

// ============================================
// UI FUNCTIONS
// ============================================
function createWorkerCard(worker) {
  return `
    <div class="worker_card" id="worker-${worker.id}" data-id="${worker.id}">
      <div class="workerAvatar">
        <img src="${
          worker.image_url || CONFIG.defaultImage
        }" alt="worker image" onerror="this.src='${CONFIG.defaultImage}'">
      </div>
      <div class="workerName">
        <p>${worker.fullname}</p>
        <small>${worker.role}</small>
      </div>
      <div class="deleteWorker">
        <em class="fas fa-trash-can" data-action="delete" data-id="${
          worker.id
        }"></em>
      </div>
      <div class="editWorker">
        <em class="fas fa-pen" data-action="edit" data-id="${worker.id}"></em>
      </div>
    </div>
  `;
}

function createWorkerInRoom(worker, roomName) {
  const div = document.createElement("div");
  div.className = "worker_in_room";
  div.innerHTML = `
    <img src="${worker.image_url || CONFIG.defaultImage}" alt="${
    worker.fullname
  }" onerror="this.src='${CONFIG.defaultImage}'">
    <span>${worker.fullname}</span>
    <button class="remove_worker" data-worker-id="${
      worker.id
    }" data-room="${roomName}">×</button>
  `;
  return div;
}

function createWorkerSelectionPopup(workers, roomName) {
  return `
    <div class="workers_popup_overlay">
      <div class="worker_popup">
        <div class="popup_header">
          <h1>Sélectionner un employé pour ${roomName}</h1>
          <span id="close_popup" style="cursor:pointer;">&times;</span>
        </div>
        <div class="popup_body">
          ${workers
            .map(
              (worker) => `
            <div class="popup">
              <div id="image_worker">
                <img src="${
                  worker.image_url || CONFIG.defaultImage
                }" alt="avatar" onerror="this.src='${CONFIG.defaultImage}'" />
              </div>
              <div id="fullname_worker">
                <p>${worker.fullname}</p>
              </div>
              <div id="role_worker">
                <p>${worker.role}</p>
              </div>
              <button class="add_to_area" data-id="${
                worker.id
              }" data-room="${roomName}">Ajouter</button>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function createWorkerDetailPopup(worker, currentRoom) {
  return `
    <div class="worker_detail_popup">
      <div class="popup_header">
        <h2>Profil de l'employé</h2>
        <span id="close_detail_popup" style="cursor:pointer;">&times;</span>
      </div>
      <div class="popup_content">
        <img src="${worker.image_url || CONFIG.defaultImage}" alt="${
    worker.fullname
  }" class="worker_avatar_large" onerror="this.src='${CONFIG.defaultImage}'">
        <h3>${worker.fullname}</h3>
        <p><strong>Rôle:</strong> ${worker.role}</p>
        <p><strong>Email:</strong> ${worker.email || "Non renseigné"}</p>
        <p><strong>Téléphone:</strong> ${worker.phone || "Non renseigné"}</p>
        <p><strong>Localisation actuelle:</strong> ${
          currentRoom || "Non assigné"
        }</p>
        <div>
          <h4>Accès autorisés:</h4>
          <p>${worker.access ? worker.access.join(", ") : "Aucun"}</p>
        </div>
      </div>
    </div>
    <div class="overlay_detail" style="display: grid;"></div>
  `;
}

function updateRoomCounter(roomElement, count) {
  const counterElement = roomElement.querySelector(".room_header p:last-child");
  if (counterElement) {
    counterElement.innerHTML = `${count} /<span>${CONFIG.roomCapacity}</span>`;
  }
}

function setRoomAlert(roomElement, isEmpty) {
  const alertElement = roomElement.querySelector(".alert");
  if (isEmpty) {
    roomElement.classList.add("empty-required");
    if (alertElement) alertElement.classList.add("active");
  } else {
    roomElement.classList.remove("empty-required");
    if (alertElement) alertElement.classList.remove("active");
  }
}

// ============================================
// WORKER MANAGEMENT
// ============================================
function setupWorkerForm() {
  const form = document.getElementById("form_worker_data");
  const workerContainer = document.querySelector(".new_worker_container");
  const avatarInput = document.getElementById("image_url");
  const avatarImage = document.querySelector(".image_form img");
  let isEditMode = false;
  let editingWorkerId = null;

  // Real-time validation
  form.addEventListener("input", (e) => {
    if (e.target.classList.contains("exp-field")) return;
    const result = validateField(e.target);
    displayValidation(e.target, result);
  });

  // Add experience
  document.getElementById("add_experience").addEventListener("click", (e) => {
    e.preventDefault();
    addExperienceField(form);
  });

  // Image preview
  avatarInput.addEventListener("blur", (e) => {
    const url = e.target.value.trim();
    if (url !== "" && REGEX.url.test(url)) {
      avatarImage.src = url;
    } else {
      avatarImage.src = CONFIG.defaultImage;
    }
  });

  // Form submission
  form.addEventListener("submit", handleFormSubmit);

  function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const inputs = form.querySelectorAll(
      "input[type='text'], input[type='email'], select"
    );
    let allValid = true;

    inputs.forEach((input) => {
      if (input.classList.contains("exp-field")) return;
      const result = validateField(input);
      if (!result.isValid && input.value.trim() !== "") {
        allValid = false;
      }
    });

    // Validate experiences
    if (!validateAllExperiences(form)) {
      allValid = false;
    }

    if (!allValid) {
      showMessagePopup("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    const formData = new FormData(form);
    const data = {
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      image_url: formData.get("image_url"),
      role: formData.get("role"),
      experiences: getAllExperiences(form),
    };

    if (isEditMode) {
      updateWorker(editingWorkerId, data);
      isEditMode = false;
      editingWorkerId = null;
      location.reload();
    } else {
      const worker = addWorker(data);
      renderWorkerCard(worker);
    }

    closeForm();
    form.reset();
    avatarImage.src = CONFIG.defaultImage;
  }

  function renderWorkerCard(worker) {
    const cardHTML = createWorkerCard(worker);
    workerContainer.insertAdjacentHTML("beforeend", cardHTML);

    const card = document.getElementById(`worker-${worker.id}`);

    // Card events
    card.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      const workerId = parseInt(e.target.dataset.id);

      if (action === "delete") {
        deleteWorkerHandler(workerId);
      } else if (action === "edit") {
        editWorkerHandler(workerId);
      } else if (
        !e.target.closest(".deleteWorker") &&
        !e.target.closest(".editWorker")
      ) {
        showWorkerDetail(workerId);
      }
    });
  }

  function deleteWorkerHandler(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      deleteWorker(id);
      location.reload();
    }
  }

  function editWorkerHandler(id) {
    const worker = getWorker(id);
    if (!worker) return;

    isEditMode = true;
    editingWorkerId = id;

    document.getElementById("fullname").value = worker.fullname || "";
    document.getElementById("email").value = worker.email || "";
    document.getElementById("phone").value = worker.phone || "";
    document.getElementById("image_url").value = worker.image_url || "";
    document.getElementById("role").value = worker.role || "";

    if (worker.image_url) {
      avatarImage.src = worker.image_url;
    }

    showForm();
  }

  function showWorkerDetail(workerId) {
    const worker = getWorker(workerId);
    if (!worker) return;

    const currentRoom = getWorkerRoom(workerId);
    const popupHTML = createWorkerDetailPopup(worker, currentRoom);

    document.body.insertAdjacentHTML("beforeend", popupHTML);

    document
      .getElementById("close_detail_popup")
      .addEventListener("click", closeDetailPopup);
    document
      .querySelector(".overlay_detail")
      .addEventListener("click", closeDetailPopup);
  }

  function closeDetailPopup() {
    const popup = document.querySelector(".worker_detail_popup");
    const overlay = document.querySelector(".overlay_detail");
    if (popup) popup.remove();
    if (overlay) overlay.remove();
  }

  function showForm() {
    document.querySelector(".overlay").style.display = "grid";
  }

  function closeForm() {
    document.querySelector(".overlay").style.display = "none";
  }

  // Load existing workers
  function loadWorkers() {
    workers.forEach((worker) => {
      if (!isWorkerAssigned(worker.id)) {
        renderWorkerCard(worker);
      }
    });
  }

  return {
    loadWorkers,
    showForm,
    closeForm,
    showWorkerDetail,
  };
}

// ============================================
// ROOM MANAGEMENT
// ============================================
function setupRoomManagement() {
  function setupRoomButtons() {
    document.querySelectorAll(".add_to_room").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const roomElement = e.target.closest("[data-access]");
        if (roomElement) {
          const roomName = roomElement.dataset.access;
          showWorkerSelectionPopup(roomName);
        }
      });
    });
  }

  function loadAssignedWorkers() {
    Object.entries(assignments).forEach(([room, workerIds]) => {
      workerIds.forEach((workerId) => {
        const worker = getWorker(workerId);
        if (worker) {
          addWorkerToRoomUI(worker, room);
        }
      });
    });
  }

  function showWorkerSelectionPopup(roomName) {
    const eligibleWorkers = getEligibleWorkersForRoom(roomName);

    if (eligibleWorkers.length === 0) {
      showMessagePopup("Aucun employé disponible pour cette salle");
      return;
    }

    const popupHTML = createWorkerSelectionPopup(eligibleWorkers, roomName);
    document.body.insertAdjacentHTML("beforeend", popupHTML);

    document
      .getElementById("close_popup")
      .addEventListener("click", closePopup);

    document.querySelectorAll(".add_to_area").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const workerId = parseInt(e.target.dataset.id);
        const room = e.target.dataset.room;
        assignWorker(workerId, room);
        closePopup();
      });
    });
  }

  function assignWorker(workerId, roomName) {
    const result = assignWorkerToRoom(workerId, roomName);

    if (!result.success) {
      showMessagePopup(result.message);
      return;
    }

    const worker = getWorker(workerId);
    addWorkerToRoomUI(worker, roomName);

    // Remove from unassigned list
    const workerCard = document.getElementById(`worker-${workerId}`);
    if (workerCard) workerCard.remove();

    updateAllRooms();
  }

  function addWorkerToRoomUI(worker, roomName) {
    const roomElement = document.querySelector(`[data-access="${roomName}"]`);
    if (!roomElement) return;

    const container = roomElement.querySelector(".worker_room_container");
    if (!container) return;

    const workerElement = createWorkerInRoom(worker, roomName);

    workerElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove_worker")) {
        const workerId = parseInt(e.target.dataset.workerId);
        const room = e.target.dataset.room;
        removeWorkerFromRoom(workerId, room);
      } else {
        // Show worker details when clicking on the worker
        const workerId = parseInt(
          e.target.closest(".worker_in_room").querySelector(".remove_worker")
            .dataset.workerId
        );
        setupWorkerForm().showWorkerDetail(workerId);
      }
    });

    container.appendChild(workerElement);
  }

  function removeWorkerFromRoom(workerId, roomName) {
    removeWorkerFromRoom(workerId, roomName);

    // Add back to unassigned list
    const worker = getWorker(workerId);
    if (worker) {
      const workerContainer = document.querySelector(".new_worker_container");
      const cardHTML = createWorkerCard(worker);
      workerContainer.insertAdjacentHTML("beforeend", cardHTML);
    }

    // Remove from UI
    const roomElement = document.querySelector(`[data-access="${roomName}"]`);
    if (roomElement) {
      const container = roomElement.querySelector(".worker_room_container");
      container.innerHTML = "";

      // Reload workers for this room
      if (assignments[roomName]) {
        assignments[roomName].forEach((wId) => {
          const w = getWorker(wId);
          if (w) addWorkerToRoomUI(w, roomName);
        });
      }
    }

    updateAllRooms();
  }

  function updateAllRooms() {
    document.querySelectorAll("[data-access]").forEach((roomElement) => {
      const roomName = roomElement.dataset.access;
      const assignedCount = assignments[roomName]?.length || 0;

      updateRoomCounter(roomElement, assignedCount);

      if (CONFIG.requiredRooms.includes(roomName)) {
        setRoomAlert(roomElement, assignedCount === 0);
      }
    });
  }

  function closePopup() {
    const popup = document.querySelector(".workers_popup_overlay");
    if (popup) popup.remove();
  }

  return {
    setupRoomButtons,
    loadAssignedWorkers,
    updateAllRooms,
  };
}

// ============================================
// INITIALIZATION
// ============================================
function initializeApp() {
  // Initialize state
  initializeState();

  // Setup worker form
  const workerForm = setupWorkerForm();
  workerForm.loadWorkers();

  // Setup room management
  const roomManager = setupRoomManagement();
  roomManager.setupRoomButtons();
  roomManager.loadAssignedWorkers();
  roomManager.updateAllRooms();

  // Global events
  document.getElementById("add_new_worker").addEventListener("click", () => {
    workerForm.showForm();
  });

  document.getElementById("close_form").addEventListener("click", () => {
    workerForm.closeForm();
  });
}

// Start the app
document.addEventListener("DOMContentLoaded", initializeApp);
