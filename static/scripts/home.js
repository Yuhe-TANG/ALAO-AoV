async function send_nb_pers() {
    // ON RÉCUPÈRE LES VARIABLES À ENVOYER AU SERVEUR
    var nb_pers = document.getElementById('inputNb').value;
    console.log(nb_pers);
    
    // ON EMBALLE NOTRE VARIABLE DANS UN DICTIONNAIRE
    // ON PEUT ENVOYER AUTANT DE VARIABLES QU'ON VEUT, ICI ON SE CONTENTE D'ENVOYER inText
    var nb = {
        nb_pers: nb_pers
    }
    console.log('Envoi nb:',nb);

    // PARAMÈTRES DE LA REQUÊTE
    const requete = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nb)
    };

    window.location.href="game/";
}