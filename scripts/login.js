function ajoutListenerLogin() {
  const formLogin = document.querySelector(".formulaireLogin");

  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();
    /////// RECUPERATION INFOS FORMULAIRE ///////
    const login = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };
    const chargeUtile = JSON.stringify(login);
    /////// REQUETE POST ///////
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    })
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          /////// MESSAGE D'ERREUR ///////
          document.getElementById("error").style.display = "block";
        }
      })
      .then((data) => {
        ////// RECUPERATION TOKEN ///////
        if (data.token) {
          localStorage.setItem("token", data.token);
          ////// REDIRECTION HP LOGGEE ///////
          window.location.href = "index.html";
        }
      });
  });
}

// Appel de la fonction
ajoutListenerLogin();

// email : sophie.bluel@test.tld
// mtp : S0phie
