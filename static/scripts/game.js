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
    nb_players = data['players_num']
    //console.log(List)
    var word_list = ""
    for (i in List) {
        mot = List[i]
        if (mot != "-") {
            mot = "<button onclick='choose_words(event)' value = '" + mot + "'>" + mot + "</button> ";
            word_list += mot
        }
    }
    //console.log(word_list) ; 
    var outText = document.getElementById('gameContent');
    outText.innerHTML = ""; // vider la div si elle contenait déjà qqc
    outText.innerHTML = word_list
    var try1 = document.getElementById('try');
    try1.innerHTML = nb_players;
}

get_words();

var v_li = []
var vocab_list = {}
var nb_players = document.getElementById('try').innerHTML
nb_players = parseInt(nb_players)
var player = 1

function choose_words(e) {
    v_li.push(e.target.value)
    e.target.classList.toggle("choisi")
}

function finir(e){
    console.log("finir")
        vocab_list[player.toString()] = v_li;
        v_li = []
        player++;
        var list_words = document.getElementById('gameContent');
        console.log(list_words)
        var i = "";
        console.log(list_words.children.length)
        childrens = list_words.children
        for (i in childrens){
            console.log(childrens[i].className = "hahaha");
        }
    }
    
/*
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
*/