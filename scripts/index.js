///////////////////////// GENERER LA GALLERIE /////////////////////////

const reponseWorks = await fetch("http://localhost:5678/api/works");
const gallerie = await reponseWorks.json();

function genererProjet(gallerie) {
  const divGallery = document.querySelector(".gallery");

  for (let i = 0; i < gallerie.length; i++) {
    const projet = gallerie[i];

    const baliseFigure = document.createElement("figure");
    baliseFigure.classList.add(`projet${projet.id}`);

    const baliseImg = document.createElement("img");
    baliseImg.src = projet.imageUrl;
    baliseImg.alt = projet.title;

    const baliseFigcaption = document.createElement("figcaption");
    baliseFigcaption.innerText = projet.title;

    // Rattachement des balises dans leurs parents
    divGallery.appendChild(baliseFigure);
    baliseFigure.appendChild(baliseImg);
    baliseFigure.appendChild(baliseFigcaption);
  }
}
///////////////////////// FILTRER LES PROJETS /////////////////////////

const boutonsAll = document.querySelectorAll(".btn");
for (let i = 0; i < boutonsAll.length; i++) {
  const bouton = boutonsAll[i];
  bouton.addEventListener("click", function () {
    const projetsFiltres = gallerie.filter(function (projet) {
      return (
        projet.category.name === bouton.textContent.trim() ||
        bouton.textContent.trim() === "Tous"
      );
    });
    for (let j = 0; j < boutonsAll.length; j++) {
      boutonsAll[j].classList.remove("clique");
    }
    bouton.classList.add("clique");
    document.querySelector(".gallery").innerHTML = "";
    genererProjet(projetsFiltres);
  });
}

///////////////////////// MODE EDITION (USER LOGGé) /////////////////////////

function modeEdition() {
  const token = localStorage.getItem("token");

  if (token) {
    const baliseModeEdition = document.querySelector(".modeEdition");
    const baliseModifier = document.querySelector(".modifier");
    const baliseFiltres = document.querySelector("#portfolio .filtres");
    const baliseLogin = document.querySelector("nav .login");

    baliseModeEdition.style.display = "flex";
    baliseModifier.style.display = "flex";
    baliseFiltres.style.display = "none";
    baliseLogin.innerText = "logout";
    baliseLogin.href = "index.html";

    baliseLogin.addEventListener("click", function () {
      localStorage.removeItem("token");
    });
  }
}

///////////////////////// MODALE 1 /////////////////////////

function genererModale1(gallerie) {
  ////////////// CREER LES BALISES DANS LA MODALE //////////////
  const modaleBody = document.querySelector(".modale1-body");

  for (let i = 0; i < gallerie.length; i++) {
    const projet = gallerie[i];

    const baliseFigure = document.createElement("figure");
    baliseFigure.classList.add(`${projet.id}`);

    const baliseImg = document.createElement("img");
    baliseImg.src = projet.imageUrl;
    baliseImg.alt = projet.title;

    const btnSupprimer = document.createElement("i");
    btnSupprimer.classList.add("fa-solid", "fa-trash-can", "fa-xs");

    modaleBody.appendChild(baliseFigure);
    baliseFigure.appendChild(baliseImg);
    baliseFigure.appendChild(btnSupprimer);

    ////////////// SUPPRIMER PROJET //////////////
    btnSupprimer.addEventListener("click", function () {
      const id = projet.id;
      const token = localStorage.getItem("token");

      fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.status == 204) {
          baliseFigure.remove();
          const projetAccueil = document.querySelector(`.projet${id}`);
          if (projetAccueil) {
            projetAccueil.remove();
          }
        }
      });
    });
  }
}

////////////// FAIRE APPARAITRE/DISPARAITRE LA MODALE //////////////
const baliseOverlay = document.querySelector(".overlay");
const baliseModale1 = document.querySelector(".modale1");
const btnModifier = document.querySelector(".modifier button");
const modale1Close = document.querySelector(".modale1-close");

btnModifier.addEventListener("click", function () {
  baliseOverlay.style.display = "block";
  baliseModale1.style.display = "flex";
});

modale1Close.addEventListener("click", function () {
  baliseOverlay.style.display = "none";
  baliseModale1.style.display = "none";
});

baliseOverlay.addEventListener("click", function () {
  baliseOverlay.style.display = "none";
  baliseModale1.style.display = "none";
});
///////////////////////// MODALE 2 /////////////////////////

function genererModale2() {
  const baliseOverlay = document.querySelector(".overlay");
  const btnAjoutPhoto = document.querySelector(".modale1-footer button");
  const baliseModale1 = document.querySelector(".modale1");
  const baliseModale2 = document.querySelector(".modale2");
  const modale2Close = document.querySelector(".modale2-close");
  const modale2Return = document.querySelector(".modale2-return");
  const icone = document.querySelector(".ajoutPhoto i");
  const label = document.querySelector(".ajoutPhoto label");
  const text = document.querySelector(".ajoutPhoto p");

  btnAjoutPhoto.addEventListener("click", function () {
    baliseModale1.style.display = "none";
    baliseModale2.style.display = "flex";

    ////////// APERCU DE L'IMAGE //////////
    const imageUploader = document.getElementById("photo");
    const imagePreview = document.querySelector(".modale2-body img");
    imageUploader.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
          icone.style.display = "none";
          label.style.display = "none";
          text.style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    });
  });
  ////////// FERMETURE MODALE 2 //////////
  modale2Close.addEventListener("click", function () {
    baliseOverlay.style.display = "none";
    baliseModale2.style.display = "none";
    imagePreview.style.display = "none";
    icone.style.display = "block";
    label.style.display = "block";
    text.style.display = "block";
  });

  modale2Return.addEventListener("click", function () {
    baliseModale1.style.display = "flex";
    baliseModale2.style.display = "none";
    imagePreview.style.display = "none";
    icone.style.display = "block";
    label.style.display = "block";
    text.style.display = "block";
  });

  baliseOverlay.addEventListener("click", function () {
    baliseOverlay.style.display = "none";
    baliseModale2.style.display = "none";
    imagePreview.style.display = "none";
    icone.style.display = "block";
    label.style.display = "block";
    text.style.display = "block";
  });
}

///////////////////////// AJOUT PROJET /////////////////////////
function ajoutListenerValider() {
  const newForm = document.querySelector(".modale2-body form");
  newForm.addEventListener("submit", function (event) {
    event.preventDefault();

    ////////// MESSAGE ALERTE FORMULAIRE //////////
    const image = document.getElementById("photo").files[0];
    const category = parseInt(
      event.target.querySelector("[name=category]").value
    );
    const titre = document.getElementById("title").value;

    if (!image || !category || !titre) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }

    ////////// REQUETE POST //////////
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", titre);
    formData.append("category", category);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (res.status == 201) {
          return res.json();
        }
      })
      .then((data) => {
        const baliseModale1 = document.querySelector(".modale1");
        const baliseModale2 = document.querySelector(".modale2");
        const imagePreview = document.querySelector(".modale2-body img");
        const icone = document.querySelector(".ajoutPhoto i");
        const label = document.querySelector(".ajoutPhoto label");
        const text = document.querySelector(".ajoutPhoto p");

        imagePreview.style.display = "none";
        icone.style.display = "block";
        label.style.display = "block";
        text.style.display = "block";
        baliseModale1.style.display = "flex";
        baliseModale2.style.display = "none";

        genererProjet([data]);
        genererModale1([data]);
      });
  });
}

///////////////////////// APPEL DES FONCTIONS /////////////////////////

genererProjet(gallerie);
genererModale1(gallerie);
genererModale2();
modeEdition();
ajoutListenerValider();
