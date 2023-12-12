// Récupération de l'API
//  fetch("http://localhost:5678/api/works")
//  .then((res) => res.json()) // converti le json en JS
//  .then((data) => genererProjet(data)); // applique la fonction "genereProjet" sur les données récupérées de l'API, après leur conversion de json à JS

const reponseWorks = await fetch("http://localhost:5678/api/works");
const gallerie = await reponseWorks.json();

////// GENERER LA GALLERIE ////////

// Fonction qui génère les fiches projet (image+titre).
function genererProjet(gallerie) {
  const divGallery = document.querySelector(".gallery");

  // Boucle pour parcourir les éléments de la BDD
  for (let i = 0; i < gallerie.length; i++) {
    // variable qui stocke chaque élément de la BDD individuellement
    const projet = gallerie[i];

    // Création de la balise <figure> pour chaque projet et qui accueillera les images et le titre
    const baliseFigure = document.createElement("figure");
    baliseFigure.classList.add(`projet${projet.id}`);
    // Création de la balise <img> et des attributs
    const baliseImg = document.createElement("img");
    baliseImg.src = projet.imageUrl;
    baliseImg.alt = projet.title;

    // Création de la balise <figcaption>
    const baliseFigcaption = document.createElement("figcaption");
    baliseFigcaption.innerText = projet.title;

    // Rattachement des balises dans leurs parents
    divGallery.appendChild(baliseFigure);
    baliseFigure.appendChild(baliseImg);
    baliseFigure.appendChild(baliseFigcaption);
  }
}
////// FILTRER LES PROJETS ////////

// Récupération des balises <button>
const boutonsAll = document.querySelectorAll(".btn");
// On déclare une boucle pour parcourir chaque bouton
for (let i = 0; i < boutonsAll.length; i++) {
  // On déclare une variable qui stocke chaque bouton individuellement
  const bouton = boutonsAll[i];
  // On ecoute le clic sur le bouton
  bouton.addEventListener("click", function () {
    // Bloc de code à éxecuter quand le clic se produit
    // On déclare une variable qui stocke la méthode "filter"
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

////// MODE EDITION (USER LOGGé)////////
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

function genererModale1(gallerie) {
  const modaleBody = document.querySelector(".modale1-body");

  for (let i = 0; i < gallerie.length; i++) {
    // variable qui stocke chaque élément de la BDD individuellement
    const projet = gallerie[i];
    // Récupération de la <div> "modale1-body" dans le code HTML

    // Création de la balise <figure> pour chaque projet et qui accueillera les images
    const baliseFigure = document.createElement("figure");
    baliseFigure.classList.add(`${projet.id}`);

    // Création de la balise <img> et des attributs
    const baliseImg = document.createElement("img");
    baliseImg.src = projet.imageUrl;
    baliseImg.alt = projet.title;

    // Création de la balise <img> et des attributs
    const btnSupprimer = document.createElement("i");
    btnSupprimer.classList.add("fa-solid", "fa-trash-can", "fa-xs");

    modaleBody.appendChild(baliseFigure);
    baliseFigure.appendChild(baliseImg);
    baliseFigure.appendChild(btnSupprimer);

    btnSupprimer.addEventListener("click", function () {
      const id = projet.id;
      const token = localStorage.getItem("token");
      fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.status == 204) {
          console.log("Projet supprimé");
          console.log(baliseFigure);
          baliseFigure.remove();
          const projetAccueil = document.querySelector(`.projet${id}`);
          console.log(projetAccueil);
          if (projetAccueil) {
            projetAccueil.remove();
          }
        }
      });
    });
  }
}

const baliseOverlay = document.querySelector(".overlay");
const baliseModale1 = document.querySelector(".modale1");
const btnModifier = document.querySelector(".modifier button");
const modale1Close = document.querySelector(".modale1-close");
// On écoute le bouton Modifier
btnModifier.addEventListener("click", function () {
  // Bloc de coe exécuté
  // Affichage des balises Overlay et Modale1
  baliseOverlay.style.display = "block";
  baliseModale1.style.display = "flex";
  // On reset le contenu de la balise .modale1-body
  //modaleBody.innerHTML = "";
  console.log();
});

modale1Close.addEventListener("click", function () {
  baliseOverlay.style.display = "none";
  baliseModale1.style.display = "none";
});

baliseOverlay.addEventListener("click", function () {
  baliseOverlay.style.display = "none";
  baliseModale1.style.display = "none";
});
////// GENERER MODALE 2 ////////

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

    const imageUploader = document.getElementById("photo");
    const imagePreview = document.querySelector(".modale2-body img");

    imageUploader.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader(); // Création d'un objet FileReader

        // Fonction exécutée lorsque la lecture du fichier est terminée
        reader.onload = function (e) {
          imagePreview.src = e.target.result; // Affichage de l'image dans l'aperçu
          imagePreview.style.display = "block"; // Affichage de l'élément img
          icone.style.display = "none";
          label.style.display = "none";
          text.style.display = "none";
        };

        // Lecture du contenu du fichier en tant que URL de données
        reader.readAsDataURL(file);
      }
    });
  });

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

// AJOUT PROJET //
function ajoutListenerValider() {
  // Sélection du Formulaire
  const newForm = document.querySelector(".modale2-body form");
  // Ecoute de l'event submit
  newForm.addEventListener("submit", function (event) {
    // Empeche le refresh de la page
    event.preventDefault();
    //récupération du token

    const image = document.getElementById("photo").files[0];
    const category = parseInt(
      event.target.querySelector("[name=category]").value
    );
    const titre = document.getElementById("title").value;

    if (!image || !category || !titre) {
      // Afficher un message à l'utilisateur pour lui indiquer de remplir tous les champs
      alert("Veuillez remplir tous les champs du formulaire.");
      return; // Arrête l'exécution si un champ est vide
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", titre);
    formData.append("category", category);

    // Requete fetch
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (res.status == 201) {
          // si status=201 (requete acceptée)...
          return res.json(); // ...alors convertir la réponse en format JS
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

genererProjet(gallerie);
genererModale1(gallerie);
genererModale2();
modeEdition();
ajoutListenerValider();
