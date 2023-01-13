$(function () {
    console.log("ready1");

    // PARAMÈTRES DE LA REQUÊTE
    const requete = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify("")
    };
    console.log("ready2");

    // ENVOI ET RÉCUPÉRATION DE LA RÉPONSE
    const response = fetch('/mot_a_choisir/', requete)
    const data = response.json();
    console.log(data);
    console.log("ready3");

    var outText = document.getElementById('gameContent');
    outText.innerHTML = ""; // vider la div si elle contenait déjà qqc
    outText.innerHTML = str(data)
});