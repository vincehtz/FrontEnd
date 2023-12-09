//// Déclaration de la fonction pour le Log In ////

function ajoutListenerLogin() {
  // On récupère le formulaire dans le fichier HTML et on le stocke dans une variable
  const formLogin = document.querySelector(".formulaireLogin");
  // On écoute l'évenement "submit" avec addEventListener
  // On passe une fonction anonyme qui s'éxécutera quand l'événement sera déclenché
  // La variable "event" est fournie par JS et contient les infos liées à l'évènement
  formLogin.addEventListener("submit", function (event) {
    // On empèche le rechargement de la page après le déclenchement de l'evenement
    event.preventDefault();
    // On déclare une variable qui stocke un objet
    // L'objet contient les informations (propriétés + valeurs) à envoyer à l'API
    const login = {
      // On récupère les éléments rentrés par l'utilisateur au moment du login
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };
    // On déclare une variable qui converti et stocke l'objet au format JSON
    const chargeUtile = JSON.stringify(login);
    // On appelle la fonction "fetch" et avec les propriétés pour envoyer les données à l'API
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    })
      // le premier .then traite la Réponse du serveur
      // On stocke la réponse de l'API dans une variable "res" pour la convertir en format JS
      .then((res) => {
        // On déclare une condition selon la réponse de l'API
        if (res.status == 200) {
          // si status=200 (requete acceptée)...
          return res.json(); // ...alors convertir la réponse en format JS
        } else {
          // sinon, ne pas convertir la réponse,
          // et modifier l'élément CSS pour afficher le message d'erreur
          document.getElementById("error").style.display = "block";
        }
      })
      // Le deuxieme .then traite un bloc de code à exécuter
      .then((data) => {
        // On déclare une variable et une fonction anonyme
        // On déclare une condition
        if (data.token) {
          // Si un token est présent dans la réponse...
          // ...alors stoker les infos dans le localStorage...
          localStorage.setItem("token", data.token);
          // ... et rediriger sur la page d'acceuil
          window.location.href = "index.html";
        } // Sinon... rien.
      });
  });
}

// Appel de la fonction
ajoutListenerLogin();

// email : sophie.bluel@test.tld
// mtp : S0phie
