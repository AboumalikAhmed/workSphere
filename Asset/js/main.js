const workers = [
  { name: "mohammed", id: "id-1", role: "dev web" },
  { name: "rida", id: "id-2", role: "dev web" },
  { name: "omar", id: "id-3", role: "manager" },
  { name: "saad", id: "id-4", role: "cleaner" },
];

const workersConference = [];

const workersContainer = document.getElementById("worker_container");

const btnConference = document.getElementById("btn_conference");

const modal = document.getElementById("simpleModal");
const closeBtn = document.querySelector(".close");
const addWorkerBtn = document.getElementById("addWorker");
const conferenceBtn = document.getElementById("btn_conference");

const modalBody = document.getElementById("modal-body");

const workersCard = (data) => {
  return `
    <div onclick="" id="${data.id}" class="TEST">
        <p>${data.name}</p>
        <p>${data.role}</p>
    </div>
    `;
};

const loadWorkers = (workers) => {
  workers.forEach((worker) => {
    workersContainer.innerHTML += workersCard(worker);
  });
};

const loadWorkersInTheModal = (workers) => {
  workers.forEach((worker) => {
    modalBody.innerHTML += workersCard(worker);
  });
};

const addToArea = (arrOfRoles, containerId) => {
  const workersData = workers.filter((worker) => {
    return arrOfRoles.includes(worker.role);
  });

  loadWorkersInTheModal(workersData);

  modal.style.display = "block";
};

btnConference.addEventListener("click", () => {
  const id = "conference_content_worker";
  addToArea(["dev web", "cleaner"], id);
});

loadWorkers(workers);

addWorkerBtn.addEventListener("click", function () {});

conferenceBtn.addEventListener("click", function () {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal.style.display === "block") {
    modal.style.display = "none";
  }
});
