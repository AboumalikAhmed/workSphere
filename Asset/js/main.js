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
// GESTION DE L'ÉTAT
// ============================================
class AppState {
  constructor() {
    this.workers = this.loadFromStorage("workerData") || [];
    this.assignments = this.loadFromStorage("assignedWorkers") || {};
    this.nextId = this.calculateNextId();
  }

  loadFromStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error(`Erreur lors du chargement de ${key}:`, e);
      return null;
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, e);
      return false;
    }
  }

  calculateNextId() {
    return this.workers.length > 0
      ? Math.max(...this.workers.map((w) => w.id)) + 1
      : 1;
  }

  addWorker(workerData) {
    const worker = {
      ...workerData,
      id: this.nextId++,
      access: ROLE_ACCESS[workerData.role] || [],
    };
    this.workers.push(worker);
    this.saveToStorage("workerData", this.workers);
    return worker;
  }

  updateWorker(id, newData) {
    const index = this.workers.findIndex((w) => w.id === id);
    if (index !== -1) {
      this.workers[index] = { ...this.workers[index], ...newData };
      this.saveToStorage("workerData", this.workers);
      return true;
    }
    return false;
  }

  deleteWorker(id) {
    // Retirer des assignations
    Object.keys(this.assignments).forEach((room) => {
      this.assignments[room] = this.assignments[room].filter(
        (wId) => wId !== id
      );
    });

    // Retirer des workers
    this.workers = this.workers.filter((w) => w.id !== id);

    this.saveToStorage("workerData", this.workers);
    this.saveToStorage("assignedWorkers", this.assignments);
    return true;
  }

  getWorker(id) {
    return this.workers.find((w) => w.id === id);
  }

  assignWorkerToRoom(workerId, roomName) {
    if (!this.assignments[roomName]) {
      this.assignments[roomName] = [];
    }

    if (this.assignments[roomName].length >= CONFIG.roomCapacity) {
      return { success: false, message: "Cette salle est pleine !" };
    }

    if (this.isWorkerAssigned(workerId)) {
      return { success: false, message: "Cet employé est déjà assigné !" };
    }

    this.assignments[roomName].push(workerId);
    this.saveToStorage("assignedWorkers", this.assignments);
    return { success: true };
  }

  removeWorkerFromRoom(workerId, roomName) {
    if (this.assignments[roomName]) {
      this.assignments[roomName] = this.assignments[roomName].filter(
        (id) => id !== workerId
      );
      this.saveToStorage("assignedWorkers", this.assignments);
    }
  }

  isWorkerAssigned(workerId) {
    return Object.values(this.assignments).flat().includes(workerId);
  }

  getWorkerRoom(workerId) {
    for (const [room, workers] of Object.entries(this.assignments)) {
      if (workers.includes(workerId)) return room;
    }
    return null;
  }

  getEligibleWorkersForRoom(roomName) {
    return this.workers.filter(
      (worker) =>
        worker.access.includes(roomName) && !this.isWorkerAssigned(worker.id)
    );
  }
}

// ============================================
// VALIDATION
// ============================================
class Validator {
  static validateField(field) {
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

  static validateDateRange(startDate, endDate) {
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

  static displayValidation(field, result) {
    const validateElement = document.querySelector(`.validate_${field.name}`);
    if (validateElement) {
      validateElement.textContent = result.message;
      validateElement.style.color = result.isValid ? "green" : "red";
    }
  }
}

// ============================================
// GESTION DES EXPÉRIENCES
// ============================================
class ExperienceManager {
  static addExperienceField(form) {
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

    // Validation des dates
    const startInput = experienceContainer.querySelector(".exp-start-date");
    const endInput = experienceContainer.querySelector(".exp-end-date");
    const validateEl = experienceContainer.querySelector(
      ".validate_experience"
    );

    const validateDates = () => {
      const result = Validator.validateDateRange(
        startInput.value,
        endInput.value
      );
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

  static getAllExperiences(form) {
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

  static validateAllExperiences(form) {
    const containers = form.querySelectorAll(".experience_input");
    let allValid = true;

    containers.forEach((container) => {
      const startDate = container.querySelector(".exp-start-date").value;
      const endDate = container.querySelector(".exp-end-date").value;
      const validateEl = container.querySelector(".validate_experience");

      const result = Validator.validateDateRange(startDate, endDate);
      validateEl.textContent = result.message;
      validateEl.style.color = result.isValid ? "green" : "red";

      if (!result.isValid) allValid = false;
    });

    return allValid;
  }
}

// ============================================
// INTERFACE UTILISATEUR
// ============================================
class UI {
  static createWorkerCard(worker) {
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

  static createWorkerInRoom(worker, roomName) {
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

  static createWorkerSelectionPopup(workers, roomName) {
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

  static createWorkerDetailPopup(worker, currentRoom) {
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

  static updateRoomCounter(roomElement, count) {
    const counterElement = roomElement.querySelector(
      ".room_header p:last-child"
    );
    if (counterElement) {
      counterElement.innerHTML = `${count} /<span>${CONFIG.roomCapacity}</span>`;
    }
  }

  static setRoomAlert(roomElement, isEmpty) {
    const alertElement = roomElement.querySelector(".alert");
    if (isEmpty) {
      roomElement.classList.add("empty-required");
      if (alertElement) alertElement.classList.add("active");
    } else {
      roomElement.classList.remove("empty-required");
      if (alertElement) alertElement.classList.remove("active");
    }
  }
}

// ============================================
// CONTRÔLEURS
// ============================================
class WorkerController {
  constructor(state) {
    this.state = state;
    this.form = document.getElementById("form_worker_data");
    this.workerContainer = document.querySelector(".new_worker_container");
    this.avatarInput = document.getElementById("image_url");
    this.avatarImage = document.querySelector(".image_form img");
    this.isEditMode = false;
    this.editingWorkerId = null;

    this.init();
  }

  init() {
    this.setupFormEvents();
    this.setupImagePreview();
    this.loadWorkers();
  }

  setupFormEvents() {
    // Validation en temps réel
    this.form.addEventListener("input", (e) => {
      if (e.target.classList.contains("exp-field")) return;
      const result = Validator.validateField(e.target);
      Validator.displayValidation(e.target, result);
    });

    // Ajout d'expérience
    document.getElementById("add_experience").addEventListener("click", (e) => {
      e.preventDefault();
      ExperienceManager.addExperienceField(this.form);
    });

    // Soumission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  setupImagePreview() {
    this.avatarInput.addEventListener("blur", (e) => {
      const url = e.target.value.trim();
      if (url !== "" && REGEX.url.test(url)) {
        this.avatarImage.src = url;
      } else {
        this.avatarImage.src = CONFIG.defaultImage;
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // Validation de tous les champs
    const inputs = this.form.querySelectorAll(
      "input[type='text'], input[type='email'], select"
    );
    let allValid = true;

    inputs.forEach((input) => {
      if (input.classList.contains("exp-field")) return;
      const result = Validator.validateField(input);
      if (!result.isValid && input.value.trim() !== "") {
        allValid = false;
      }
    });

    // Validation des expériences
    if (!ExperienceManager.validateAllExperiences(this.form)) {
      allValid = false;
    }

    if (!allValid) {
      alert("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    const formData = new FormData(this.form);
    const data = {
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      image_url: formData.get("image_url"),
      role: formData.get("role"),
      experiences: ExperienceManager.getAllExperiences(this.form),
    };

    if (this.isEditMode) {
      this.state.updateWorker(this.editingWorkerId, data);
      this.isEditMode = false;
      this.editingWorkerId = null;
      location.reload();
    } else {
      const worker = this.state.addWorker(data);
      this.renderWorkerCard(worker);
    }

    this.closeForm();
    this.form.reset();
    this.avatarImage.src = CONFIG.defaultImage;
  }

  loadWorkers() {
    this.state.workers.forEach((worker) => {
      if (!this.state.isWorkerAssigned(worker.id)) {
        this.renderWorkerCard(worker);
      }
    });
  }

  renderWorkerCard(worker) {
    const cardHTML = UI.createWorkerCard(worker);
    this.workerContainer.insertAdjacentHTML("beforeend", cardHTML);

    const card = document.getElementById(`worker-${worker.id}`);

    // Événements pour la carte
    card.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      const workerId = parseInt(e.target.dataset.id);

      if (action === "delete") {
        this.deleteWorker(workerId);
      } else if (action === "edit") {
        this.editWorker(workerId);
      } else if (
        !e.target.closest(".deleteWorker") &&
        !e.target.closest(".editWorker")
      ) {
        this.showWorkerDetail(workerId);
      }
    });
  }

  deleteWorker(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      this.state.deleteWorker(id);
      location.reload();
    }
  }

  editWorker(id) {
    const worker = this.state.getWorker(id);
    if (!worker) return;

    this.isEditMode = true;
    this.editingWorkerId = id;

    document.getElementById("fullname").value = worker.fullname || "";
    document.getElementById("email").value = worker.email || "";
    document.getElementById("phone").value = worker.phone || "";
    document.getElementById("image_url").value = worker.image_url || "";
    document.getElementById("role").value = worker.role || "";

    if (worker.image_url) {
      this.avatarImage.src = worker.image_url;
    }

    this.showForm();
  }

  showWorkerDetail(workerId) {
    const worker = this.state.getWorker(workerId);
    if (!worker) return;

    const currentRoom = this.state.getWorkerRoom(workerId);
    const popupHTML = UI.createWorkerDetailPopup(worker, currentRoom);

    document.body.insertAdjacentHTML("beforeend", popupHTML);

    document
      .getElementById("close_detail_popup")
      .addEventListener("click", this.closeDetailPopup);
    document
      .querySelector(".overlay_detail")
      .addEventListener("click", this.closeDetailPopup);
  }

  closeDetailPopup() {
    const popup = document.querySelector(".worker_detail_popup");
    const overlay = document.querySelector(".overlay_detail");
    if (popup) popup.remove();
    if (overlay) overlay.remove();
  }

  showForm() {
    document.querySelector(".overlay").style.display = "grid";
  }

  closeForm() {
    document.querySelector(".overlay").style.display = "none";
  }
}

class RoomController {
  constructor(state) {
    this.state = state;
    this.init();
  }

  init() {
    this.setupRoomButtons();
    this.loadAssignedWorkers();
    this.updateAllRooms();
  }

  setupRoomButtons() {
    document.querySelectorAll(".add_to_room").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const roomElement = e.target.closest("[data-access]");
        if (roomElement) {
          const roomName = roomElement.dataset.access;
          this.showWorkerSelectionPopup(roomName);
        }
      });
    });
  }

  loadAssignedWorkers() {
    Object.entries(this.state.assignments).forEach(([room, workerIds]) => {
      workerIds.forEach((workerId) => {
        const worker = this.state.getWorker(workerId);
        if (worker) {
          this.addWorkerToRoomUI(worker, room);
        }
      });
    });
  }

  showWorkerSelectionPopup(roomName) {
    const eligibleWorkers = this.state.getEligibleWorkersForRoom(roomName);

    if (eligibleWorkers.length === 0) {
      alert("Aucun employé disponible pour cette salle");
      return;
    }

    const popupHTML = UI.createWorkerSelectionPopup(eligibleWorkers, roomName);
    document.body.insertAdjacentHTML("beforeend", popupHTML);

    document
      .getElementById("close_popup")
      .addEventListener("click", this.closePopup);

    document.querySelectorAll(".add_to_area").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const workerId = parseInt(e.target.dataset.id);
        const room = e.target.dataset.room;
        this.assignWorker(workerId, room);
        this.closePopup();
      });
    });
  }

  assignWorker(workerId, roomName) {
    const result = this.state.assignWorkerToRoom(workerId, roomName);

    if (!result.success) {
      alert(result.message);
      return;
    }

    const worker = this.state.getWorker(workerId);
    this.addWorkerToRoomUI(worker, roomName);

    // Retirer de la liste non assignée
    const workerCard = document.getElementById(`worker-${workerId}`);
    if (workerCard) workerCard.remove();

    this.updateAllRooms();
  }

  addWorkerToRoomUI(worker, roomName) {
    const roomElement = document.querySelector(`[data-access="${roomName}"]`);
    if (!roomElement) return;

    const container = roomElement.querySelector(".worker_room_container");
    if (!container) return;

    const workerElement = UI.createWorkerInRoom(worker, roomName);

    workerElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove_worker")) {
        const workerId = parseInt(e.target.dataset.workerId);
        const room = e.target.dataset.room;
        this.removeWorkerFromRoom(workerId, room);
      } else {
        app.workerController.showWorkerDetail(worker.id);
      }
    });

    container.appendChild(workerElement);
  }

  removeWorkerFromRoom(workerId, roomName) {
    this.state.removeWorkerFromRoom(workerId, roomName);

    // Remettre dans la liste
    const worker = this.state.getWorker(workerId);
    if (worker) {
      app.workerController.renderWorkerCard(worker);
    }

    // Supprimer de l'UI
    const roomElement = document.querySelector(`[data-access="${roomName}"]`);
    if (roomElement) {
      const container = roomElement.querySelector(".worker_room_container");
      container.innerHTML = "";

      // Recharger les workers de cette salle
      if (this.state.assignments[roomName]) {
        this.state.assignments[roomName].forEach((wId) => {
          const w = this.state.getWorker(wId);
          if (w) this.addWorkerToRoomUI(w, roomName);
        });
      }
    }

    this.updateAllRooms();
  }

  updateAllRooms() {
    document.querySelectorAll("[data-access]").forEach((roomElement) => {
      const roomName = roomElement.dataset.access;
      const assignedCount = this.state.assignments[roomName]?.length || 0;

      UI.updateRoomCounter(roomElement, assignedCount);

      if (CONFIG.requiredRooms.includes(roomName)) {
        UI.setRoomAlert(roomElement, assignedCount === 0);
      }
    });
  }

  closePopup() {
    const popup = document.querySelector(".workers_popup_overlay");
    if (popup) popup.remove();
  }
}

// ============================================
// INITIALISATION
// ============================================
const app = {
  state: null,
  workerController: null,
  roomController: null,

  init() {
    this.state = new AppState();
    this.workerController = new WorkerController(this.state);
    this.roomController = new RoomController(this.state);
    this.setupGlobalEvents();
  },

  setupGlobalEvents() {
    document.getElementById("add_new_worker").addEventListener("click", () => {
      this.workerController.showForm();
    });

    document.getElementById("close_form").addEventListener("click", () => {
      this.workerController.closeForm();
    });
  },
};

// Démarrage
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});

// // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
