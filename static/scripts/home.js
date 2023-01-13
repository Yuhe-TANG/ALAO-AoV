async function send_nb_pers() {
    // ON RÉCUPÈRE LES VARIABLES À ENVOYER AU SERVEUR
    var nb_pers = document.getElementById('inputNb').value ;
    var is_checked = document.getElementById("sel_change_language_form") ;
    var index = is_checked.selectedIndex ;
    var mode_lang = is_checked.options[index].value ;
    console.log(nb_pers) ;
    console.log(mode_lang) ;
    
    // ON EMBALLE NOTRE VARIABLE DANS UN DICTIONNAIRE
    // ON PEUT ENVOYER AUTANT DE VARIABLES QU'ON VEUT, ICI ON SE CONTENTE D'ENVOYER inText
    var colis = {
        nb_lan: [nb_pers,mode_lang]
    }
    console.log('Envoi nb:',colis);

    // PARAMÈTRES DE LA REQUÊTE
    const requete = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(colis)
    };

    const response = await fetch('/game/send_nb_lang', requete)
    const data = await response.json();
    List = data['key']
    //console.log(List)
    var word_list = ""
    for (i in List) {
        mot = List[i]
        if (mot != "-") {
            mot = "<button>" + mot + "</button> ";
            word_list += mot
        }
    }
    //console.log(word_list) ; 
    window.location.href="game/";
    var outText = document.getElementById('gameContent');
    outText.innerHTML = ""; // vider la div si elle contenait déjà qqc
    outText.innerHTML = word_list


}