const default_image = "./images/user.jpg";
const editBtn = document.createElement("button");
let id = 1;
const addWorkerBtn = document.getElementById("add_new_worker");
const overlay = document.querySelector(".overlay");
const closeFormBtn = document.getElementById("close_form");
const form = document.getElementById("form_worker_data");
const avatarImageInput = form.querySelector("#image_url");
const avatarImage = form.querySelector(".image_form img");
const workerCardContainer = document.querySelector(".new_worker_container");
const submitBtn = document.getElementById("submit");
const addToRoomBtn = document.querySelectorAll(".add_to_room");
let dataWorker = JSON.parse(localStorage.getItem("workerData")) || [];

const showForm = () => {
  overlay.style.display = "grid";
};

const closeForm = () => {
  overlay.style.display = "none";
};

addWorkerBtn.addEventListener("click", showForm);
closeFormBtn.addEventListener("click", closeForm);

avatarImageInput.addEventListener("blur", (e) => {
  e.target.value.trim() !== ""
    ? (avatarImage.src = e.target.value)
    : (avatarImage.src = default_image);
});

form.addEventListener("reset", () => {
  avatarImage.src = default_image;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let data = Object.fromEntries(formData);

  data.id = id;
  id++;

  switch (data.role) {
    case "Manager":
      data.access = [
        "Reception",
        "Salle de conference",
        "Salle de securite",
        "Salle des serveurs",
        "Salle darchives",
        "Salle du personnel",
      ];
      break;
    case "Nettoyage":
      data.access = [
        "Reception",
        "Salle de conference",
        "Salle de securite",
        "Salle des serveurs",
        "Salle du personnel",
      ];
      break;
    case "Agents de sécurité":
      data.access = ["Salle de securite"];
      break;
    case "Techniciens IT":
      data.access = ["Salle des serveurs"];
      break;
    case "Autres rôles":
      data.access = ["Reception", "Salle de conference"];
      break;
  }

  dataWorker.push(data);
  localStorage.setItem("workerData", JSON.stringify(dataWorker));
  showWorkerCard(dataWorker[dataWorker.length - 1]);
  closeForm();
  form.reset();
});

const showWorkerCard = (worker) => {
  let workerCard = `
    <div class="worker_card" id="${worker.id}">
        <div class="workerAvatar">
            <img src="${worker.image_url || default_image}" alt="worker image">
        </div>
        <div class="workerName">
            <p>${worker.fullname}</p>
        </div>
        <div class="deleteWorker">
            <em class="fas fa-trash-can"  onclick = deleteWOrker(${
              worker.id
            })></em>
        </div>
 <div 
        class="editWorker">
            <em class="fas fa-pen" onclick= editWorker(${worker.id})></em>
        </div>
    </div>`;

  workerCardContainer.innerHTML += workerCard;
};

const loadData = () => {
  for (let i = 0; i < dataWorker.length; i++) {
    showWorkerCard(dataWorker[i]);

    if (dataWorker[i].id >= id) {
      id = dataWorker[i].id + 1;
    }
  }
};
window.addEventListener("DOMContentLoaded", loadData);

const deleteWOrker = (id) => {
  console.log(id);
  let newWorkers = [];
  for (let i = 0; i < dataWorker.length; i++) {
    if (dataWorker[i].id !== id) {
      newWorkers.push(dataWorker[i]);
    }
  }

  localStorage.setItem("workerData", JSON.stringify(newWorkers));

  location.reload();
};

//content

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

// ==============================

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

// ===================

const createWorkerCard = (worker) => {
  return `
    <div class="popup">
      <div id="image_worker">
        <img src="${worker.image_url || "./images/user.jpg"}" alt="avatar" />
      </div>
      <div id="fullname_worker">
        <p>${worker.fullname}</p>
      </div>
      <div id="role_worker">
        <p>${worker.role}</p>
      </div>
      <button class="add_to_area" data-id="${
        worker.id
      }" onclick="test(event)">Add to area</button>
    </div>`;
};

const popupContent = (workers) => {
  const cardsHTML = workers.map((worker) => createWorkerCard(worker)).join("");

  const popupHTML = `
    <div class="workers_popup_overlay">
      <div class="worker_popup">
        <div class="popup_header">
          <h1>Workers with access</h1>
          <span id="close_popup" style="cursor:pointer;">&times;</span>
        </div>
        <div class="popup_body">
          ${cardsHTML}
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", popupHTML);
  document.getElementById("close_popup").addEventListener("click", closePopUp);
};

const closePopUp = () => {
  document.querySelector(".workers_popup_overlay").remove();
};

document.querySelectorAll(".add_to_room").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const accessArea = e.target.parentElement.dataset.access;

    const matchedWorkers = dataWorker.filter((worker) =>
      worker.access.includes(accessArea)
    );

    if (matchedWorkers.length > 0) {
      popupContent(matchedWorkers);
    } else {
      alert("No worker found with access to this area.");
    }
  });
});

const worker_room_container = document.querySelectorAll(
  ".worker_room_container"
);
const test = (event) => {
  const id = event.target.dataset.id;
  const closest = event.target.closest(".popup");
  closest.style.display = "none";
  console.log(closest);
};
