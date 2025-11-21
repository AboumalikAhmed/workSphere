// const default_image = "./images/user.jpg";
// const editBtn = document.createElement("button");
// let id = 1;
// const addWorkerBtn = document.getElementById("add_new_worker");
// const overlay = document.querySelector(".overlay");
// const closeFormBtn = document.getElementById("close_form");
// const form = document.getElementById("form_worker_data");
// const avatarImageInput = form.querySelector("#image_url");
// const avatarImage = form.querySelector(".image_form img");
// const workerCardContainer = document.querySelector(".new_worker_container");
// const submitBtn = document.getElementById("submit");
// const addToRoomBtn = document.querySelectorAll(".add_to_room");
// let dataWorker = JSON.parse(localStorage.getItem("workerData")) || [];

// const showForm = () => {
//   overlay.style.display = "grid";
// };

// const closeForm = () => {
//   overlay.style.display = "none";
// };

// addWorkerBtn.addEventListener("click", showForm);
// closeFormBtn.addEventListener("click", closeForm);

// avatarImageInput.addEventListener("blur", (e) => {
//   e.target.value.trim() !== ""
//     ? (avatarImage.src = e.target.value)
//     : (avatarImage.src = default_image);
// });

// form.addEventListener("reset", () => {
//   avatarImage.src = default_image;
// });

// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   let formData = new FormData(form);
//   let data = Object.fromEntries(formData);

//   data.id = id;
//   id++;

//   switch (data.role) {
//     case "Manager":
//       data.access = [
//         "Reception",
//         "Salle de conference",
//         "Salle de securite",
//         "Salle des serveurs",
//         "Salle darchives",
//         "Salle du personnel",
//       ];
//       break;
//     case "Nettoyage":
//       data.access = [
//         "Reception",
//         "Salle de conference",
//         "Salle de securite",
//         "Salle des serveurs",
//         "Salle du personnel",
//       ];
//       break;
//     case "Agents de sécurité":
//       data.access = ["Salle de securite"];
//       break;
//     case "Techniciens IT":
//       data.access = ["Salle des serveurs"];
//       break;
//     case "Autres rôles":
//       data.access = ["Reception", "Salle de conference"];
//       break;
//   }

//   dataWorker.push(data);
//   localStorage.setItem("workerData", JSON.stringify(dataWorker));
//   showWorkerCard(dataWorker[dataWorker.length - 1]);
//   closeForm();
//   form.reset();
// });

// const showWorkerCard = (worker) => {
//   let workerCard = `
//     <div class="worker_card" id="${worker.id}">
//         <div class="workerAvatar">
//             <img src="${worker.image_url || default_image}" alt="worker image">
//         </div>
//         <div class="workerName">
//             <p>${worker.fullname}</p>
//         </div>
//         <div class="deleteWorker">
//             <em class="fas fa-trash-can"  onclick = deleteWOrker(${
//               worker.id
//             })></em>
//         </div>
//  <div
//         class="editWorker">
//             <em class="fas fa-pen" onclick= editWorker(${worker.id})></em>
//         </div>
//     </div>`;

//   workerCardContainer.innerHTML += workerCard;
// };

// const loadData = () => {
//   for (let i = 0; i < dataWorker.length; i++) {
//     showWorkerCard(dataWorker[i]);

//     if (dataWorker[i].id >= id) {
//       id = dataWorker[i].id + 1;
//     }
//   }
// };
// window.addEventListener("DOMContentLoaded", loadData);

// const deleteWOrker = (id) => {
//   console.log(id);
//   let newWorkers = [];
//   for (let i = 0; i < dataWorker.length; i++) {
//     if (dataWorker[i].id !== id) {
//       newWorkers.push(dataWorker[i]);
//     }
//   }

//   localStorage.setItem("workerData", JSON.stringify(newWorkers));

//   location.reload();
// };

// //content

// const popupContent = () => {
//   return (document.body.innerHTML += `
//     <div class="workers_popup_overlay">
//       <div class="worker_popup">
//         <div class="popup_header">
//           <h1>Lorem ipsum dolor sit amet.</h1>
//           <span id="close_popup" onclick="closePopUp()">&times;</span>
//         </div>
//         <div class="popup">
//           <div id="image_worker">
//             <img src="./images/B.jpg" alt="avatar" />
//           </div>

//           <div id="fullname_worker">
//             <p>ahmed aboumalik</p>
//           </div>

//           <div id="role_worker">
//             <p>manager</p>
//           </div>

//           <button id="add_to_area">add to area</button>
//         </div>
//       </div>
//     </div>`);
// };

// addToRoomBtn.forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     console.log(e.target.parentElement.dataset.access);
//     popupContent();
//   });
// });

// // // ==============================

// const closePopUp = () => {
//   document.querySelector(".workers_popup_overlay").remove();
// };

// const popupContent = () => {
//   const popupHTML = `
//     <div class="workers_popup_overlay">
//       <div class="worker_popup">
//         <div class="popup_header">
//           <h1>Lorem ipsum dolor sit amet.</h1>
//           <span id="close_popup">&times;</span>
//         </div>

//       </div>
//     </div>`;

//   document.body.insertAdjacentHTML("beforeend", popupHTML);
//   document.getElementById("close_popup").addEventListener("click", closePopUp);
// };

// document.querySelectorAll(".add_to_room").forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     const access = e.target.parentElement.dataset.access;
//     popupContent();

//     let filter = dataWorker.filter((worker) => {
//       return worker.access === access;
//     });
//     console.log(filter);
//   });
// });

// // ===================

// const createWorkerCard = (worker) => {
//   return `
//     <div class="popup">
//       <div id="image_worker">
//         <img src="${worker.image_url || "./images/user.jpg"}" alt="avatar" />
//       </div>
//       <div id="fullname_worker">
//         <p>${worker.fullname}</p>
//       </div>
//       <div id="role_worker">
//         <p>${worker.role}</p>
//       </div>
//       <button class="add_to_area" data-id="${
//         worker.id
//       }" onclick="test(event)">Add to area</button>
//     </div>`;
// };

// const popupContent = (workers) => {
//   const cardsHTML = workers.map((worker) => createWorkerCard(worker)).join("");

//   const popupHTML = `
//     <div class="workers_popup_overlay">
//       <div class="worker_popup">
//         <div class="popup_header">
//           <h1>Workers with access</h1>
//           <span id="close_popup" style="cursor:pointer;">&times;</span>
//         </div>
//         <div class="popup_body">
//           ${cardsHTML}
//         </div>
//       </div>
//     </div>`;

//   document.body.insertAdjacentHTML("beforeend", popupHTML);
//   document.getElementById("close_popup").addEventListener("click", closePopUp);
// };

// const closePopUp = () => {
//   document.querySelector(".workers_popup_overlay").remove();
// };

// document.querySelectorAll(".add_to_room").forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     const accessArea = e.target.parentElement.dataset.access;

//     const matchedWorkers = dataWorker.filter((worker) =>
//       worker.access.includes(accessArea)
//     );

//     if (matchedWorkers.length > 0) {
//       popupContent(matchedWorkers);
//     } else {
//       alert("No worker found with access to this area.");
//     }
//   });
// });

// const worker_room_container = document.querySelectorAll(
//   ".worker_room_container"
// );
// const test = (event) => {
//   const id = event.target.dataset.id;
//   const closest = event.target.closest(".popup");
//   closest.style.display = "none";
//   console.log(closest);
// };

// ==================================================================================================
// const CONFIG = {
//   defaultImage: "./Asset/images/user.jpg",
//   roomCapacity: 10,
//   requiredRooms: ["Salle des serveurs", "Salle de securite", "Reception", "Salle darchives"]
// };

// const REGEX = {
//   email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
//   phone: /^[0-9+\-\s()]{10,}$/,
//   url: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
//   name: /^[a-zA-Z\s]{2,50}$/
// };

// const ROLE_ACCESS = {
//   "Manager": ["Reception", "Salle de conference", "Salle de securite", "Salle des serveurs", "Salle darchives", "Salle du personnel"],
//   "Nettoyage": ["Reception", "Salle de conference", "Salle de securite", "Salle des serveurs", "Salle du personnel"],
//   "Agents de sécurité": ["Salle de securite"],
//   "Techniciens IT": ["Salle des serveurs"],
//   "Autres rôles": ["Reception", "Salle de conference", "Salle du personnel"]
// };

// // ============================================
// // GESTION DE L'ÉTAT
// // ============================================
// class AppState {
//   constructor() {
//     this.workers = this.loadFromStorage('workerData') || [];
//     this.assignments = this.loadFromStorage('assignedWorkers') || {};
//     this.nextId = this.calculateNextId();
//   }

//   loadFromStorage(key) {
//     try {
//       return JSON.parse(localStorage.getItem(key));
//     } catch (e) {
//       console.error(`Erreur lors du chargement de ${key}:`, e);
//       return null;
//     }
//   }

//   saveToStorage(key, data) {
//     try {
//       localStorage.setItem(key, JSON.stringify(data));
//       return true;
//     } catch (e) {
//       console.error(`Erreur lors de la sauvegarde de ${key}:`, e);
//       return false;
//     }
//   }

//   calculateNextId() {
//     return this.workers.length > 0
//       ? Math.max(...this.workers.map(w => w.id)) + 1
//       : 1;
//   }

//   addWorker(workerData) {
//     const worker = {
//       ...workerData,
//       id: this.nextId++,
//       access: ROLE_ACCESS[workerData.role] || []
//     };
//     this.workers.push(worker);
//     this.saveToStorage('workerData', this.workers);
//     return worker;
//   }

//   updateWorker(id, newData) {
//     const index = this.workers.findIndex(w => w.id === id);
//     if (index !== -1) {
//       this.workers[index] = { ...this.workers[index], ...newData };
//       this.saveToStorage('workerData', this.workers);
//       return true;
//     }
//     return false;
//   }

//   deleteWorker(id) {
//     // Retirer des assignations
//     Object.keys(this.assignments).forEach(room => {
//       this.assignments[room] = this.assignments[room].filter(wId => wId !== id);
//     });

//     // Retirer des workers
//     this.workers = this.workers.filter(w => w.id !== id);

//     this.saveToStorage('workerData', this.workers);
//     this.saveToStorage('assignedWorkers', this.assignments);
//     return true;
//   }

//   getWorker(id) {
//     return this.workers.find(w => w.id === id);
//   }

//   assignWorkerToRoom(workerId, roomName) {
//     if (!this.assignments[roomName]) {
//       this.assignments[roomName] = [];
//     }

//     if (this.assignments[roomName].length >= CONFIG.roomCapacity) {
//       return { success: false, message: "Cette salle est pleine !" };
//     }

//     if (this.isWorkerAssigned(workerId)) {
//       return { success: false, message: "Cet employé est déjà assigné !" };
//     }

//     this.assignments[roomName].push(workerId);
//     this.saveToStorage('assignedWorkers', this.assignments);
//     return { success: true };
//   }

//   removeWorkerFromRoom(workerId, roomName) {
//     if (this.assignments[roomName]) {
//       this.assignments[roomName] = this.assignments[roomName].filter(id => id !== workerId);
//       this.saveToStorage('assignedWorkers', this.assignments);
//     }
//   }

//   isWorkerAssigned(workerId) {
//     return Object.values(this.assignments).flat().includes(workerId);
//   }

//   getWorkerRoom(workerId) {
//     for (const [room, workers] of Object.entries(this.assignments)) {
//       if (workers.includes(workerId)) return room;
//     }
//     return null;
//   }

//   getEligibleWorkersForRoom(roomName) {
//     return this.workers.filter(worker =>
//       worker.access.includes(roomName) && !this.isWorkerAssigned(worker.id)
//     );
//   }
// }

// // ============================================
// // VALIDATION
// // ============================================
// class Validator {
//   static validateField(field) {
//     const value = field.value.trim();
//     let isValid = true;
//     let message = "";

//     switch (field.name) {
//       case "fullname":
//         isValid = REGEX.name.test(value);
//         message = isValid ? "" : "Nom invalide (2-50 caractères)";
//         break;
//       case "email":
//         isValid = REGEX.email.test(value);
//         message = isValid ? "" : "Email invalide";
//         break;
//       case "phone":
//         isValid = REGEX.phone.test(value);
//         message = isValid ? "" : "Téléphone invalide";
//         break;
//       case "image_url":
//         isValid = value === "" || REGEX.url.test(value);
//         message = isValid ? "" : "URL d'image invalide";
//         break;
//     }

//     return { isValid, message };
//   }

//   static validateDateRange(startDate, endDate) {
//     if (!startDate || !endDate) return { isValid: false, message: "Dates requises" };

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     if (start >= end) {
//       return { isValid: false, message: "La date de début doit être avant la date de fin" };
//     }

//     return { isValid: true, message: "" };
//   }

//   static displayValidation(field, result) {
//     const validateElement = document.querySelector(`.validate_${field.name}`);
//     if (validateElement) {
//       validateElement.textContent = result.message;
//       validateElement.style.color = result.isValid ? "green" : "red";
//     }
//   }
// }

// // ============================================
// // GESTION DES EXPÉRIENCES
// // ============================================
// class ExperienceManager {
//   static addExperienceField(form) {
//     const experienceContainer = document.createElement("div");
//     experienceContainer.className = "experience_input";
//     experienceContainer.innerHTML = `
//       <div class="experience-group">
//         <div class="input_info">
//           <label>Entreprise</label>
//           <input type="text" name="company" class="exp-field" required>
//         </div>
//         <div class="input_info">
//           <label>Poste</label>
//           <input type="text" name="position" class="exp-field" required>
//         </div>
//         <div class="input_info">
//           <label>Date de début</label>
//           <input type="date" name="start_date" class="exp-start-date exp-field" required>
//         </div>
//         <div class="input_info">
//           <label>Date de fin</label>
//           <input type="date" name="end_date" class="exp-end-date exp-field" required>
//         </div>
//         <p class="validate validate_experience"></p>
//         <button type="button" class="remove_experience">Supprimer</button>
//       </div>
//     `;

//     const submitButton = document.getElementById("submit");
//     form.insertBefore(experienceContainer, submitButton);

//     // Validation des dates
//     const startInput = experienceContainer.querySelector('.exp-start-date');
//     const endInput = experienceContainer.querySelector('.exp-end-date');
//     const validateEl = experienceContainer.querySelector('.validate_experience');

//     const validateDates = () => {
//       const result = Validator.validateDateRange(startInput.value, endInput.value);
//       validateEl.textContent = result.message;
//       validateEl.style.color = result.isValid ? "green" : "red";
//       return result.isValid;
//     };

//     startInput.addEventListener('change', validateDates);
//     endInput.addEventListener('change', validateDates);

//     experienceContainer.querySelector(".remove_experience").addEventListener("click", () => {
//       experienceContainer.remove();
//     });

//     return experienceContainer;
//   }

//   static getAllExperiences(form) {
//     const experiences = [];
//     const experienceContainers = form.querySelectorAll('.experience_input');

//     experienceContainers.forEach(container => {
//       const company = container.querySelector('[name="company"]').value;
//       const position = container.querySelector('[name="position"]').value;
//       const startDate = container.querySelector('[name="start_date"]').value;
//       const endDate = container.querySelector('[name="end_date"]').value;

//       experiences.push({ company, position, startDate, endDate });
//     });

//     return experiences;
//   }

//   static validateAllExperiences(form) {
//     const containers = form.querySelectorAll('.experience_input');
//     let allValid = true;

//     containers.forEach(container => {
//       const startDate = container.querySelector('.exp-start-date').value;
//       const endDate = container.querySelector('.exp-end-date').value;
//       const validateEl = container.querySelector('.validate_experience');

//       const result = Validator.validateDateRange(startDate, endDate);
//       validateEl.textContent = result.message;
//       validateEl.style.color = result.isValid ? "green" : "red";

//       if (!result.isValid) allValid = false;
//     });

//     return allValid;
//   }
// }

// // ============================================
// // INTERFACE UTILISATEUR
// // ============================================
// class UI {
//   static createWorkerCard(worker) {
//     return `
//       <div class="worker_card" id="worker-${worker.id}" data-id="${worker.id}">
//         <div class="workerAvatar">
//           <img src="${worker.image_url || CONFIG.defaultImage}" alt="worker image" onerror="this.src='${CONFIG.defaultImage}'">
//         </div>
//         <div class="workerName">
//           <p>${worker.fullname}</p>
//           <small>${worker.role}</small>
//         </div>
//         <div class="deleteWorker">
//           <em class="fas fa-trash-can" data-action="delete" data-id="${worker.id}"></em>
//         </div>
//         <div class="editWorker">
//           <em class="fas fa-pen" data-action="edit" data-id="${worker.id}"></em>
//         </div>
//       </div>
//     `;
//   }

//   static createWorkerInRoom(worker, roomName) {
//     const div = document.createElement("div");
//     div.className = "worker_in_room";
//     div.innerHTML = `
//       <img src="${worker.image_url || CONFIG.defaultImage}" alt="${worker.fullname}" onerror="this.src='${CONFIG.defaultImage}'">
//       <span>${worker.fullname}</span>
//       <button class="remove_worker" data-worker-id="${worker.id}" data-room="${roomName}">×</button>
//     `;
//     return div;
//   }

//   static createWorkerSelectionPopup(workers, roomName) {
//     return `
//       <div class="workers_popup_overlay">
//         <div class="worker_popup">
//           <div class="popup_header">
//             <h1>Sélectionner un employé pour ${roomName}</h1>
//             <span id="close_popup" style="cursor:pointer;">&times;</span>
//           </div>
//           <div class="popup_body">
//             ${workers.map(worker => `
//               <div class="popup">
//                 <div id="image_worker">
//                   <img src="${worker.image_url || CONFIG.defaultImage}" alt="avatar" onerror="this.src='${CONFIG.defaultImage}'" />
//                 </div>
//                 <div id="fullname_worker">
//                   <p>${worker.fullname}</p>
//                 </div>
//                 <div id="role_worker">
//                   <p>${worker.role}</p>
//                 </div>
//                 <button class="add_to_area" data-id="${worker.id}" data-room="${roomName}">Ajouter</button>
//               </div>
//             `).join("")}
//           </div>
//         </div>
//       </div>
//     `;
//   }

//   static createWorkerDetailPopup(worker, currentRoom) {
//     return `
//       <div class="worker_detail_popup">
//         <div class="popup_header">
//           <h2>Profil de l'employé</h2>
//           <span id="close_detail_popup" style="cursor:pointer;">&times;</span>
//         </div>
//         <div class="popup_content">
//           <img src="${worker.image_url || CONFIG.defaultImage}" alt="${worker.fullname}" class="worker_avatar_large" onerror="this.src='${CONFIG.defaultImage}'">
//           <h3>${worker.fullname}</h3>
//           <p><strong>Rôle:</strong> ${worker.role}</p>
//           <p><strong>Email:</strong> ${worker.email || "Non renseigné"}</p>
//           <p><strong>Téléphone:</strong> ${worker.phone || "Non renseigné"}</p>
//           <p><strong>Localisation actuelle:</strong> ${currentRoom || "Non assigné"}</p>
//           <div>
//             <h4>Accès autorisés:</h4>
//             <p>${worker.access ? worker.access.join(", ") : "Aucun"}</p>
//           </div>
//         </div>
//       </div>
//       <div class="overlay_detail" style="display: grid;"></div>
//     `;
//   }

//   static updateRoomCounter(roomElement, count) {
//     const counterElement = roomElement.querySelector(".room_header p:last-child");
//     if (counterElement) {
//       counterElement.innerHTML = `${count} /<span>${CONFIG.roomCapacity}</span>`;
//     }
//   }

//   static setRoomAlert(roomElement, isEmpty) {
//     const alertElement = roomElement.querySelector(".alert");
//     if (isEmpty) {
//       roomElement.classList.add("empty-required");
//       if (alertElement) alertElement.classList.add("active");
//     } else {
//       roomElement.classList.remove("empty-required");
//       if (alertElement) alertElement.classList.remove("active");
//     }
//   }
// }

// // ============================================
// // CONTRÔLEURS
// // ============================================
// class WorkerController {
//   constructor(state) {
//     this.state = state;
//     this.form = document.getElementById("form_worker_data");
//     this.workerContainer = document.querySelector(".new_worker_container");
//     this.avatarInput = document.getElementById("image_url");
//     this.avatarImage = document.querySelector(".image_form img");
//     this.isEditMode = false;
//     this.editingWorkerId = null;

//     this.init();
//   }

//   init() {
//     this.setupFormEvents();
//     this.setupImagePreview();
//     this.loadWorkers();
//   }

//   setupFormEvents() {
//     // Validation en temps réel
//     this.form.addEventListener("input", (e) => {
//       if (e.target.classList.contains('exp-field')) return;
//       const result = Validator.validateField(e.target);
//       Validator.displayValidation(e.target, result);
//     });

//     // Ajout d'expérience
//     document.getElementById("add_experience").addEventListener("click", (e) => {
//       e.preventDefault();
//       ExperienceManager.addExperienceField(this.form);
//     });

//     // Soumission
//     this.form.addEventListener("submit", (e) => this.handleSubmit(e));
//   }

//   setupImagePreview() {
//     this.avatarInput.addEventListener("blur", (e) => {
//       const url = e.target.value.trim();
//       if (url !== "" && REGEX.url.test(url)) {
//         this.avatarImage.src = url;
//       } else {
//         this.avatarImage.src = CONFIG.defaultImage;
//       }
//     });
//   }

//   handleSubmit(e) {
//     e.preventDefault();

//     // Validation de tous les champs
//     const inputs = this.form.querySelectorAll("input[type='text'], input[type='email'], select");
//     let allValid = true;

//     inputs.forEach(input => {
//       if (input.classList.contains('exp-field')) return;
//       const result = Validator.validateField(input);
//       if (!result.isValid && input.value.trim() !== "") {
//         allValid = false;
//       }
//     });

//     // Validation des expériences
//     if (!ExperienceManager.validateAllExperiences(this.form)) {
//       allValid = false;
//     }

//     if (!allValid) {
//       alert("Veuillez corriger les erreurs dans le formulaire");
//       return;
//     }

//     const formData = new FormData(this.form);
//     const data = {
//       fullname: formData.get('fullname'),
//       email: formData.get('email'),
//       phone: formData.get('phone'),
//       image_url: formData.get('image_url'),
//       role: formData.get('role'),
//       experiences: ExperienceManager.getAllExperiences(this.form)
//     };

//     if (this.isEditMode) {
//       this.state.updateWorker(this.editingWorkerId, data);
//       this.isEditMode = false;
//       this.editingWorkerId = null;
//       location.reload();
//     } else {
//       const worker = this.state.addWorker(data);
//       this.renderWorkerCard(worker);
//     }

//     this.closeForm();
//     this.form.reset();
//     this.avatarImage.src = CONFIG.defaultImage;
//   }

//   loadWorkers() {
//     this.state.workers.forEach(worker => {
//       if (!this.state.isWorkerAssigned(worker.id)) {
//         this.renderWorkerCard(worker);
//       }
//     });
//   }

//   renderWorkerCard(worker) {
//     const cardHTML = UI.createWorkerCard(worker);
//     this.workerContainer.insertAdjacentHTML('beforeend', cardHTML);

//     const card = document.getElementById(`worker-${worker.id}`);

//     // Événements pour la carte
//     card.addEventListener("click", (e) => {
//       const action = e.target.dataset.action;
//       const workerId = parseInt(e.target.dataset.id);

//       if (action === "delete") {
//         this.deleteWorker(workerId);
//       } else if (action === "edit") {
//         this.editWorker(workerId);
//       } else if (!e.target.closest(".deleteWorker") && !e.target.closest(".editWorker")) {
//         this.showWorkerDetail(workerId);
//       }
//     });
//   }

//   deleteWorker(id) {
//     if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
//       this.state.deleteWorker(id);
//       location.reload();
//     }
//   }

//   editWorker(id) {
//     const worker = this.state.getWorker(id);
//     if (!worker) return;

//     this.isEditMode = true;
//     this.editingWorkerId = id;

//     document.getElementById("fullname").value = worker.fullname || "";
//     document.getElementById("email").value = worker.email || "";
//     document.getElementById("phone").value = worker.phone || "";
//     document.getElementById("image_url").value = worker.image_url || "";
//     document.getElementById("role").value = worker.role || "";

//     if (worker.image_url) {
//       this.avatarImage.src = worker.image_url;
//     }

//     this.showForm();
//   }

//   showWorkerDetail(workerId) {
//     const worker = this.state.getWorker(workerId);
//     if (!worker) return;

//     const currentRoom = this.state.getWorkerRoom(workerId);
//     const popupHTML = UI.createWorkerDetailPopup(worker, currentRoom);

//     document.body.insertAdjacentHTML("beforeend", popupHTML);

//     document.getElementById("close_detail_popup").addEventListener("click", this.closeDetailPopup);
//     document.querySelector(".overlay_detail").addEventListener("click", this.closeDetailPopup);
//   }

//   closeDetailPopup() {
//     const popup = document.querySelector(".worker_detail_popup");
//     const overlay = document.querySelector(".overlay_detail");
//     if (popup) popup.remove();
//     if (overlay) overlay.remove();
//   }

//   showForm() {
//     document.querySelector(".overlay").style.display = "grid";
//   }

//   closeForm() {
//     document.querySelector(".overlay").style.display = "none";
//   }
// }

// class RoomController {
//   constructor(state) {
//     this.state = state;
//     this.init();
//   }

//   init() {
//     this.setupRoomButtons();
//     this.loadAssignedWorkers();
//     this.updateAllRooms();
//   }

//   setupRoomButtons() {
//     document.querySelectorAll(".add_to_room").forEach(btn => {
//       btn.addEventListener("click", (e) => {
//         const roomElement = e.target.closest("[data-access]");
//         if (roomElement) {
//           const roomName = roomElement.dataset.access;
//           this.showWorkerSelectionPopup(roomName);
//         }
//       });
//     });
//   }

//   loadAssignedWorkers() {
//     Object.entries(this.state.assignments).forEach(([room, workerIds]) => {
//       workerIds.forEach(workerId => {
//         const worker = this.state.getWorker(workerId);
//         if (worker) {
//           this.addWorkerToRoomUI(worker, room);
//         }
//       });
//     });
//   }

//   showWorkerSelectionPopup(roomName) {
//     const eligibleWorkers = this.state.getEligibleWorkersForRoom(roomName);

//     if (eligibleWorkers.length === 0) {
//       alert("Aucun employé disponible pour cette salle");
//       return;
//     }

//     const popupHTML = UI.createWorkerSelectionPopup(eligibleWorkers, roomName);
//     document.body.insertAdjacentHTML("beforeend", popupHTML);

//     document.getElementById("close_popup").addEventListener("click", this.closePopup);

//     document.querySelectorAll(".add_to_area").forEach(btn => {
//       btn.addEventListener("click", (e) => {
//         const workerId = parseInt(e.target.dataset.id);
//         const room = e.target.dataset.room;
//         this.assignWorker(workerId, room);
//         this.closePopup();
//       });
//     });
//   }

//   assignWorker(workerId, roomName) {
//     const result = this.state.assignWorkerToRoom(workerId, roomName);

//     if (!result.success) {
//       alert(result.message);
//       return;
//     }

//     const worker = this.state.getWorker(workerId);
//     this.addWorkerToRoomUI(worker, roomName);

//     // Retirer de la liste non assignée
//     const workerCard = document.getElementById(`worker-${workerId}`);
//     if (workerCard) workerCard.remove();

//     this.updateAllRooms();
//   }

//   addWorkerToRoomUI(worker, roomName) {
//     const roomElement = document.querySelector(`[data-access="${roomName}"]`);
//     if (!roomElement) return;

//     const container = roomElement.querySelector(".worker_room_container");
//     if (!container) return;

//     const workerElement = UI.createWorkerInRoom(worker, roomName);

//     workerElement.addEventListener("click", (e) => {
//       if (e.target.classList.contains("remove_worker")) {
//         const workerId = parseInt(e.target.dataset.workerId);
//         const room = e.target.dataset.room;
//         this.removeWorkerFromRoom(workerId, room);
//       } else {
//         app.workerController.showWorkerDetail(worker.id);
//       }
//     });

//     container.appendChild(workerElement);
//   }

//   removeWorkerFromRoom(workerId, roomName) {
//     this.state.removeWorkerFromRoom(workerId, roomName);

//     // Remettre dans la liste
//     const worker = this.state.getWorker(workerId);
//     if (worker) {
//       app.workerController.renderWorkerCard(worker);
//     }

//     // Supprimer de l'UI
//     const roomElement = document.querySelector(`[data-access="${roomName}"]`);
//     if (roomElement) {
//       const container = roomElement.querySelector(".worker_room_container");
//       container.innerHTML = "";

//       // Recharger les workers de cette salle
//       if (this.state.assignments[roomName]) {
//         this.state.assignments[roomName].forEach(wId => {
//           const w = this.state.getWorker(wId);
//           if (w) this.addWorkerToRoomUI(w, roomName);
//         });
//       }
//     }

//     this.updateAllRooms();
//   }

//   updateAllRooms() {
//     document.querySelectorAll("[data-access]").forEach(roomElement => {
//       const roomName = roomElement.dataset.access;
//       const assignedCount = this.state.assignments[roomName]?.length || 0;

//       UI.updateRoomCounter(roomElement, assignedCount);

//       if (CONFIG.requiredRooms.includes(roomName)) {
//         UI.setRoomAlert(roomElement, assignedCount === 0);
//       }
//     });
//   }

//   closePopup() {
//     const popup = document.querySelector(".workers_popup_overlay");
//     if (popup) popup.remove();
//   }
// }

// // ============================================
// // INITIALISATION
// // ============================================
// const app = {
//   state: null,
//   workerController: null,
//   roomController: null,

//   init() {
//     this.state = new AppState();
//     this.workerController = new WorkerController(this.state);
//     this.roomController = new RoomController(this.state);
//     this.setupGlobalEvents();
//   },

//   setupGlobalEvents() {
//     document.getElementById("add_new_worker").addEventListener("click", () => {
//       this.workerController.showForm();
//     });

//     document.getElementById("close_form").addEventListener("click", () => {
//       this.workerController.closeForm();
//     });
//   }
// };

// // Démarrage
// document.addEventListener("DOMContentLoaded", () => {
//   app.init();
// });

// // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
const CONFIG = {
  defaultImage: "./Asset/images/user.jpg",
  roomCapacity: 10,
  requiredRooms: ["Salle des serveurs", "Salle de securite", "Reception", "Salle darchives"],
  roleLimits: {
    "Manager": 1,
    "Nettoyage": 5,
    "Agents de sécurité": 3,
    "Techniciens IT": 2,
    "Autres rôles": 10
  }
};

const REGEX = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  phone: /^[0-9+\-\s()]{10,}$/,
  url: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
  name: /^[a-zA-Z\s]{2,50}$/
};

const ROLE_ACCESS = {
  "Manager": ["Reception", "Salle de conference", "Salle de securite", "Salle des serveurs", "Salle darchives", "Salle du personnel"],
  "Nettoyage": ["Reception", "Salle de conference", "Salle de securite", "Salle des serveurs", "Salle du personnel"],
  "Agents de sécurité": ["Salle de securite"],
  "Techniciens IT": ["Salle des serveurs"],
  "Autres rôles": ["Reception", "Salle de conference", "Salle du personnel"]
};

// Global state
let workers = [];
let assignments = {};
let nextId = 1;
let isEditMode = false;
let editingWorkerId = null;

// Storage functions
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

function initializeAppState() {
  workers = loadFromStorage('workerData') || [];
  assignments = loadFromStorage('assignedWorkers') || {};
  nextId = workers.length > 0 ? Math.max(...workers.map(w => w.id)) + 1 : 1;
}

// Role limit functions
function checkRoleLimit(role) {
  if (!CONFIG.roleLimits[role]) return true;
  
  const roleCount = workers.filter(worker => worker.role === role).length;
  return roleCount < CONFIG.roleLimits[role];
}

function getRoleLimitMessage(role) {
  const limit = CONFIG.roleLimits[role];
  const current = workers.filter(worker => worker.role === role).length;
  return `(${current}/${limit})`;
}

function updateRoleCounters() {
  document.querySelectorAll('.worker_card').forEach(card => {
    const workerId = parseInt(card.dataset.id);
    const worker = getWorker(workerId);
    if (worker) {
      const roleLimit = getRoleLimitMessage(worker.role);
      const roleElement = card.querySelector('small');
      if (roleElement) {
        roleElement.textContent = `${worker.role} ${roleLimit}`;
      }
    }
  });
}

// Worker management functions
function addWorker(workerData) {
  if (!checkRoleLimit(workerData.role)) {
    alert(`Cannot add more ${workerData.role}. Maximum is ${CONFIG.roleLimits[workerData.role]}`);
    return null;
  }

  const worker = {
    ...workerData,
    id: nextId++,
    access: ROLE_ACCESS[workerData.role] || []
  };
  workers.push(worker);
  saveToStorage('workerData', workers);
  updateRoleCounters();
  return worker;
}

function updateWorker(id, newData) {
  const index = workers.findIndex(w => w.id === id);
  if (index !== -1) {
    workers[index] = { ...workers[index], ...newData };
    saveToStorage('workerData', workers);
    updateRoleCounters();
    return true;
  }
  return false;
}

function deleteWorker(id) {
  // Remove from assignments
  Object.keys(assignments).forEach(room => {
    assignments[room] = assignments[room].filter(wId => wId !== id);
  });

  // Remove from workers
  workers = workers.filter(w => w.id !== id);

  saveToStorage('workerData', workers);
  saveToStorage('assignedWorkers', assignments);
  updateRoleCounters();
  return true;
}

function getWorker(id) {
  return workers.find(w => w.id === id);
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
  return workers.filter(worker =>
    worker.access.includes(roomName) && !isWorkerAssigned(worker.id)
  );
}

// Room assignment functions
function assignWorkerToRoom(workerId, roomName) {
  if (!assignments[roomName]) {
    assignments[roomName] = [];
  }

  if (assignments[roomName].length >= CONFIG.roomCapacity) {
    return { success: false, message: "This room is full!" };
  }

  if (isWorkerAssigned(workerId)) {
    return { success: false, message: "This employee is already assigned!" };
  }

  assignments[roomName].push(workerId);
  saveToStorage('assignedWorkers', assignments);
  updateRoomAlerts();
  return { success: true };
}

function removeWorkerFromRoom(workerId, roomName) {
  if (assignments[roomName]) {
    assignments[roomName] = assignments[roomName].filter(id => id !== workerId);
    saveToStorage('assignedWorkers', assignments);
    updateRoomAlerts();
  }
}

// Validation functions
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let message = "";

  switch (field.name) {
    case "fullname":
      isValid = REGEX.name.test(value);
      message = isValid ? "" : "Invalid name (2-50 characters)";
      break;
    case "email":
      isValid = REGEX.email.test(value);
      message = isValid ? "" : "Invalid email";
      break;
    case "phone":
      isValid = REGEX.phone.test(value);
      message = isValid ? "" : "Invalid phone";
      break;
    case "image_url":
      isValid = value === "" || REGEX.url.test(value);
      message = isValid ? "" : "Invalid image URL";
      break;
  }

  return { isValid, message };
}

function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return { isValid: false, message: "Dates required" };

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    return { isValid: false, message: "Start date must be before end date" };
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

// Experience management functions
function addExperienceField(form) {
  const experienceContainer = document.createElement("div");
  experienceContainer.className = "experience_input";
  experienceContainer.innerHTML = `
    <div class="experience-group">
      <div class="input_info">
        <label>Company</label>
        <input type="text" name="company" class="exp-field" required>
      </div>
      <div class="input_info">
        <label>Position</label>
        <input type="text" name="position" class="exp-field" required>
      </div>
      <div class="input_info">
        <label>Start date</label>
        <input type="date" name="start_date" class="exp-start-date exp-field" required>
      </div>
      <div class="input_info">
        <label>End date</label>
        <input type="date" name="end_date" class="exp-end-date exp-field" required>
      </div>
      <p class="validate validate_experience"></p>
      <button type="button" class="remove_experience">Remove</button>
    </div>
  `;

  const submitButton = document.getElementById("submit");
  form.insertBefore(experienceContainer, submitButton);

  const startInput = experienceContainer.querySelector('.exp-start-date');
  const endInput = experienceContainer.querySelector('.exp-end-date');
  const validateEl = experienceContainer.querySelector('.validate_experience');

  const validateDates = () => {
    const result = validateDateRange(startInput.value, endInput.value);
    validateEl.textContent = result.message;
    validateEl.style.color = result.isValid ? "green" : "red";
    return result.isValid;
  };

  startInput.addEventListener('change', validateDates);
  endInput.addEventListener('change', validateDates);

  experienceContainer.querySelector(".remove_experience").addEventListener("click", () => {
    experienceContainer.remove();
  });

  return experienceContainer;
}

function getAllExperiences(form) {
  const experiences = [];
  const experienceContainers = form.querySelectorAll('.experience_input');

  experienceContainers.forEach(container => {
    const company = container.querySelector('[name="company"]').value;
    const position = container.querySelector('[name="position"]').value;
    const startDate = container.querySelector('[name="start_date"]').value;
    const endDate = container.querySelector('[name="end_date"]').value;

    experiences.push({ company, position, startDate, endDate });
  });

  return experiences;
}

function validateAllExperiences(form) {
  const containers = form.querySelectorAll('.experience_input');
  let allValid = true;

  containers.forEach(container => {
    const startDate = container.querySelector('.exp-start-date').value;
    const endDate = container.querySelector('.exp-end-date').value;
    const validateEl = container.querySelector('.validate_experience');

    const result = validateDateRange(startDate, endDate);
    validateEl.textContent = result.message;
    validateEl.style.color = result.isValid ? "green" : "red";

    if (!result.isValid) allValid = false;
  });

  return allValid;
}

// UI functions
function createWorkerCard(worker) {
  const roleLimit = getRoleLimitMessage(worker.role);
  
  return `
    <div class="worker_card" id="worker-${worker.id}" data-id="${worker.id}">
      <div class="workerAvatar">
        <img src="${worker.image_url || CONFIG.defaultImage}" alt="worker image" onerror="this.src='${CONFIG.defaultImage}'">
      </div>
      <div class="workerName">
        <p>${worker.fullname}</p>
        <small>${worker.role} ${roleLimit}</small>
      </div>
      <div class="deleteWorker">
        <em class="fas fa-trash-can" data-action="delete" data-id="${worker.id}"></em>
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
    <img src="${worker.image_url || CONFIG.defaultImage}" alt="${worker.fullname}" onerror="this.src='${CONFIG.defaultImage}'">
    <span>${worker.fullname}</span>
    <button class="remove_worker" data-worker-id="${worker.id}" data-room="${roomName}">×</button>
  `;
  return div;
}

function createWorkerSelectionPopup(workers, roomName) {
  return `
    <div class="workers_popup_overlay">
      <div class="worker_popup">
        <div class="popup_header">
          <h1>Select employee for ${roomName}</h1>
          <span id="close_popup" style="cursor:pointer;">&times;</span>
        </div>
        <div class="popup_body">
          ${workers.map(worker => `
            <div class="popup">
              <div id="image_worker">
                <img src="${worker.image_url || CONFIG.defaultImage}" alt="avatar" onerror="this.src='${CONFIG.defaultImage}'" />
              </div>
              <div id="fullname_worker">
                <p>${worker.fullname}</p>
              </div>
              <div id="role_worker">
                <p>${worker.role}</p>
              </div>
              <button class="add_to_area" data-id="${worker.id}" data-room="${roomName}">Add</button>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function createWorkerDetailPopup(worker, currentRoom) {
  return `
    <div class="worker_detail_popup">
      <div class="popup_header">
        <h2>Employee Profile</h2>
        <span id="close_detail_popup" style="cursor:pointer;">&times;</span>
      </div>
      <div class="popup_content">
        <img src="${worker.image_url || CONFIG.defaultImage}" alt="${worker.fullname}" class="worker_avatar_large" onerror="this.src='${CONFIG.defaultImage}'">
        <h3>${worker.fullname}</h3>
        <p><strong>Role:</strong> ${worker.role}</p>
        <p><strong>Email:</strong> ${worker.email || "Not provided"}</p>
        <p><strong>Phone:</strong> ${worker.phone || "Not provided"}</p>
        <p><strong>Current location:</strong> ${currentRoom || "Not assigned"}</p>
        <div>
          <h4>Authorized access:</h4>
          <p>${worker.access ? worker.access.join(", ") : "None"}</p>
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

function updateRoomAlerts() {
  document.querySelectorAll("[data-access]").forEach(roomElement => {
    const roomName = roomElement.dataset.access;
    const assignedCount = assignments[roomName]?.length || 0;

    updateRoomCounter(roomElement, assignedCount);

    if (CONFIG.requiredRooms.includes(roomName)) {
      setRoomAlert(roomElement, assignedCount === 0);
    }
  });
}

// Worker controller functions
function setupWorkerController() {
  const form = document.getElementById("form_worker_data");
  const workerContainer = document.querySelector(".new_worker_container");
  const avatarInput = document.getElementById("image_url");
  const avatarImage = document.querySelector(".image_form img");

  function setupFormEvents() {
    form.addEventListener("input", (e) => {
      if (e.target.classList.contains('exp-field')) return;
      const result = validateField(e.target);
      displayValidation(e.target, result);
    });

    document.getElementById("add_experience").addEventListener("click", (e) => {
      e.preventDefault();
      addExperienceField(form);
    });

    form.addEventListener("submit", handleSubmit);
  }

  function setupImagePreview() {
    avatarInput.addEventListener("blur", (e) => {
      const url = e.target.value.trim();
      if (url !== "" && REGEX.url.test(url)) {
        avatarImage.src = url;
      } else {
        avatarImage.src = CONFIG.defaultImage;
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const inputs = form.querySelectorAll("input[type='text'], input[type='email'], select");
    let allValid = true;

    inputs.forEach(input => {
      if (input.classList.contains('exp-field')) return;
      const result = validateField(input);
      if (!result.isValid && input.value.trim() !== "") {
        allValid = false;
      }
    });

    if (!validateAllExperiences(form)) {
      allValid = false;
    }

    if (!allValid) {
      alert("Please correct errors in the form");
      return;
    }

    const formData = new FormData(form);
    const data = {
      fullname: formData.get('fullname'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      image_url: formData.get('image_url'),
      role: formData.get('role'),
      experiences: getAllExperiences(form)
    };

    if (isEditMode) {
      updateWorker(editingWorkerId, data);
      isEditMode = false;
      editingWorkerId = null;
      location.reload();
    } else {
      const worker = addWorker(data);
      if (worker) {
        renderWorkerCard(worker);
      }
    }

    closeForm();
    form.reset();
    avatarImage.src = CONFIG.defaultImage;
  }

  function loadWorkers() {
    workers.forEach(worker => {
      if (!isWorkerAssigned(worker.id)) {
        renderWorkerCard(worker);
      }
    });
  }

  function renderWorkerCard(worker) {
    const cardHTML = createWorkerCard(worker);
    workerContainer.insertAdjacentHTML('beforeend', cardHTML);

    const card = document.getElementById(`worker-${worker.id}`);

    card.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      const workerId = parseInt(e.target.dataset.id);

      if (action === "delete") {
        deleteWorkerHandler(workerId);
      } else if (action === "edit") {
        editWorker(workerId);
      } else if (!e.target.closest(".deleteWorker") && !e.target.closest(".editWorker")) {
        showWorkerDetail(workerId);
      }
    });
  }

  function deleteWorkerHandler(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteWorker(id);
      location.reload();
    }
  }

  function editWorker(id) {
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

    document.getElementById("close_detail_popup").addEventListener("click", closeDetailPopup);
    document.querySelector(".overlay_detail").addEventListener("click", closeDetailPopup);
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

  // Initialize
  setupFormEvents();
  setupImagePreview();
  loadWorkers();

  return {
    showForm,
    closeForm,
    showWorkerDetail,
    renderWorkerCard
  };
}

// Room controller functions
function setupRoomController() {
  function setupRoomButtons() {
    document.querySelectorAll(".add_to_room").forEach(btn => {
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
      workerIds.forEach(workerId => {
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
      alert("No available employees for this room");
      return;
    }

    const popupHTML = createWorkerSelectionPopup(eligibleWorkers, roomName);
    document.body.insertAdjacentHTML("beforeend", popupHTML);

    document.getElementById("close_popup").addEventListener("click", closePopup);

    document.querySelectorAll(".add_to_area").forEach(btn => {
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
      alert(result.message);
      return;
    }

    const worker = getWorker(workerId);
    addWorkerToRoomUI(worker, roomName);

    const workerCard = document.getElementById(`worker-${workerId}`);
    if (workerCard) workerCard.remove();

    updateRoomAlerts();
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
        removeWorkerFromRoomHandler(workerId, room);
      } else {
        showWorkerDetail(worker.id);
      }
    });

    container.appendChild(workerElement);
  }

  function removeWorkerFromRoomHandler(workerId, roomName) {
    removeWorkerFromRoom(workerId, roomName);

    const worker = getWorker(workerId);
    if (worker) {
      renderWorkerCard(worker);
    }

    const roomElement = document.querySelector(`[data-access="${roomName}"]`);
    if (roomElement) {
      const container = roomElement.querySelector(".worker_room_container");
      container.innerHTML = "";

      if (assignments[roomName]) {
        assignments[roomName].forEach(wId => {
          const w = getWorker(wId);
          if (w) addWorkerToRoomUI(w, roomName);
        });
      }
    }

    updateRoomAlerts();
  }

  function closePopup() {
    const popup = document.querySelector(".workers_popup_overlay");
    if (popup) popup.remove();
  }

  // Initialize
  setupRoomButtons();
  loadAssignedWorkers();
  updateRoomAlerts();
}

// Global event handlers
function setupGlobalEvents() {
  document.getElementById("add_new_worker").addEventListener("click", () => {
    showForm();
  });

  document.getElementById("close_form").addEventListener("click", () => {
    closeForm();
  });
}

// Form visibility functions
function showForm() {
  document.querySelector(".overlay").style.display = "grid";
}

function closeForm() {
  document.querySelector(".overlay").style.display = "none";
  isEditMode = false;
  editingWorkerId = null;
}

// Initialize application
function initializeApp() {
  initializeAppState();
  setupWorkerController();
  setupRoomController();
  setupGlobalEvents();
  updateRoleCounters();
  updateRoomAlerts();
}

// Start application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
