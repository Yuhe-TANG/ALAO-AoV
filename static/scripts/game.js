//--- obtenir la langue du site
var lang = document.getElementById('playerX');
if (lang.innerText == "Player") {
    mode_lang = "en";
} else {
    mode_lang = "fr";
}


//--- obtenir les mots depuis views.py : views.send_words
async function get_words() {

    //--- PARAMÈTRES DE LA REQUÊTE
    const requete = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    //--- ENVOI ET RÉCUPÉRATION DE LA RÉPONSE
    const response = await fetch('/game/get_words', requete)
    const data = await response.json();

    //--- traitement de la réponse
    //console.table(data['key']);
    List = data['key']
    nb_players = data['players_num']
    //console.log(List)
    var word_list = ""
    for (i in List) {
        mot = List[i]
        if (mot != "-") {
            //--- créer le lien vers le dictionnaire en ligne
            if (mode_lang == "fr") {
                href = "https://www.larousse.fr/dictionnaires/francais/" + mot;
            } else {
                href = "https://dictionary.cambridge.org/dictionary/english/" + mot;
            }
            //--- créer le code html pour chaque mot
            mot = "<button onclick='choose_words(event)' value = '" + mot + "' ondblclick = 'visite_dic_en_ligne(event)' href = '"+ href +"' >" + mot + "</button> ";
            word_list += mot
        }
    }
    //--- afficher le code html vers game.html
    //console.log(word_list) ; 
    var outText = document.getElementById('gameContent');
    outText.innerHTML = ""; // vider la div si elle contenait déjà qqc
    outText.innerHTML = word_list
    var try1 = document.getElementById('try'); // sauvegarder le nombre de personnes
    try1.innerHTML = nb_players;               // pour le récupérer dans les fonctions suivantes
}
// -------------------------------------------------------------------------------------------------------
get_words();

var v_li = []
var vocab_list = {}
var nb_players = document.getElementById('try').innerHTML // récupérer le nb de pers
nb_players = parseInt(nb_players)
var outText = document.getElementById('gameContent');
var player = 1
var dict_envoyer = {}

//--- cliquer une fois le mot : ajouter la class "choisi"
function choose_words(e) {
    v_li.push(e.target.value)
    e.target.classList.toggle("choisi")
}
//--- cliquer deux fois le mot : visiter le site dictionnaire
function visite_dic_en_ligne(e) {
    window.open(e.target.getAttribute("href"));
}

dict = {};
word_color = [];
word_color_span = {};

sentences = [];

// -------------------------------------------------------------------------------------------------------

async function finir(e) {

    var words_choisi = [];
    var list_words = document.getElementById('gameContent');

    vocab_list[player.toString()] = v_li;
    //console.log(v_li);
    v_li = [];
    if (mode_lang = "en") {
        var list_w_choisi = "<div> <p>Player "+ player.toString() + "</p>";
    } else {
        var list_w_choisi = "<div> <p>Joueur "+ player.toString() + "</p>";
    }
    
    //console.log(list_words);
    var i = "";
    //console.log(list_words.children.length);
    childrens = list_words.children;
    for (i in childrens) {
        if (childrens[i].className == "choisi") {
            words_choisi.push(childrens[i].innerHTML);
            childrens[i].className = "";
        }
    }

    for (i in words_choisi) {
        //console.log(words_choisi[i]) ;
        list_w_choisi += "<a>" + words_choisi[i] + "</a>" ;
    }
    
    var html = document.getElementById('wordlist') ;
    list_w_choisi += "</div>";
    html.innerHTML += list_w_choisi ;
    indice_dict_envoyer = "player" + player.toString();
    dict_envoyer[indice_dict_envoyer] = words_choisi;
    //console.log(dict_envoyer);

    // --- Quand tout le monde a choisi les mots : envoyer les mots choisi vers back-end ---
    if (player == nb_players) {
        const requete = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dict_envoyer)
        };
        // récupérer les phrases depuis back-end
        const response = await fetch('/game/send_dict_envoyer', requete)
        const data = await response.json();
        phrases = data['phrase']
        dict = data['words']
        console.log(data['words'])
        player = 0 ;

        outText.innerHTML = "";
        console.log(dict["difficult"]);
        console.log(dict["middle"]);
        console.log(dict["easy"]);

        dic = dict["easy"];

        // --- ajouter les couleurs sur les phrases : 

        // "<span style = \"color: "+ color + ";\">" + key + "</span>"
        for (dic in dict){
            dic = dict[dic]
            for (i in dic) { // i est un dictionnaire de {"sentence": {word:color}}
                for (key in dic[i]) {// key is the sentence
                    dic_words = dic[i][key];
                    sentence = key;
                    for (word in dic_words){
                        // word_color += key
                        color = dic_words[word];
                        a = "<span style = \"color: "+ color + ";\">" + word + "</span>";
                        sentence = sentence.replace(word, a.toString())
                    }
                    //outText.innerHTML += sentence;
                    sentences.push(sentence);
                }
            }
        }
        outText.innerHTML = sentences[0];
        

        var bt_phrase = document.getElementById('divEnsuite');
        bt_phrase.style.display="flex";

        var bt_fini = document.getElementById('fini');
        bt_fini.style.display="none";
        document.getElementById('p_indice_dic').style.display="none";

    }
    player++;
}

var sents_count = 1;

function next_sentence() {
    console.log(dict["middle"].length);
    console.log(sents_count);
    if (sents_count <= dict["middle"].length) {
        console.log(i);
        outText.innerHTML = sentences[sents_count];
        sents_count ++;
        /*for (key in dict["middle"][i]) {
            sentence = key.toString();
            for (w_with_color in word_color_span) {
    
                sentence.replace(new RegExp(w_with_color,'g'), word_color_span[w_with_color]);
    
            }
            outText.innerHTML = sentence;
        }*/
    } else {
        outText.innerHTML = "Le jeu est terminé ! Merci !";
    }
    player++;
    i++;
}

// function à sauvegarder
function strReplaceAll(search = ' ', replacement = '_', string){
    if(!string) return;
    return string.replace(new RegExp(search,'g'), replacement);
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