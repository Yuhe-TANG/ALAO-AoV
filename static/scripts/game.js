async function get_words() {

    // PARAMÈTRES DE LA REQUÊTE
    const requete = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // ENVOI ET RÉCUPÉRATION DE LA RÉPONSE
    const response = await fetch('/game/get_words', requete)
    const data = await response.json();
    //console.table(data['key']);
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
    var outText = document.getElementById('gameContent');
    outText.innerHTML = ""; // vider la div si elle contenait déjà qqc
    outText.innerHTML = word_list
}

get_words();

$("#gameContent button").on('click', '.stop_btn', function(e) {
    console.log("okk")
    if ($(this).hasClass("choisi")) {
        $(this).removeClass("choisi");
    } else {
        $(this).addClass("choisi");
    }
});

$("#fini").on({
    "click": function () {
        var words_choisi = [];
        var list_w_choisi = "<p>Joueur 1</p>";
        var l_words = $("#gameContent button");

        l_words.each(function () {
            if ($(this).hasClass("choisi")) {
                words_choisi.append($(this).html());
            }
        });

        for (i in words_choisi) {
            console.log(i);
            list_w_choisi += "<p>" + str(words_choisi[i]) + "</p>";
        }

        $("wordlist").append(words_choisi);
    }
});