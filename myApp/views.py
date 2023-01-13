from django.shortcuts import render
from django.utils.translation import gettext_lazy as _
from django.http import JsonResponse
import json

# Create your views here.

def home(request):
    return render(request, 'home.html')

def game(request):
    size = 10
    mode = "fr"
    if (mode == "en"):
        df = pd.read_csv("en_data.csv", encoding="utf-8", delimiter="\t")
    else:
        df = pd.read_csv("fr_data.csv", encoding="utf-8", delimiter="\t")
    
    key_words = get_words(size, df)

    li_to_front_vocab = vocab_list_to_front_end(key_words)

    for mot in li_to_front_vocab : 
        mot = "<m>" + mot + "</m>"

    reponse = {
       "reponse" : li_to_front_vocab
    }

    # reponse = json.dumps(reponse)
    return render(request, 'game.html', reponse)


import requests
from lxml import etree
import spacy
import pandas as pd


url_fr = "https://loisirs.toutcomment.com/article/les-meilleures-questions-pour-jouer-a-action-ou-verite-13592.html"
url_en = "https://www.scienceofpeople.com/truth-or-dare/"

def get_content_en(url):
    questions = requests.get(url) # parcourir tous les contenus de real_url
    selector = etree.HTML(questions.text)

    num_blocks = 11
    list_questions = []
    for i in range(1,num_blocks):
        list_questions.append('//*[@id="post-299812"]/div/ol[' + str(i) + ']/text()')
    
    # number of questions
    li_lens = []
    for question in list_questions:
        li_lens.append(len(selector.xpath(question)))

    q_list = []
    content = ""
    # get content
    index_block = 1
    for li_len in li_lens:
        for i in range(1, li_len):
            content = (selector.xpath('//*[@id="post-299812"]/div/ol['+ str(index_block) + ']/li[' + str(i) + ']/text()'))
            q_list.append(content[0])
        index_block += 1
    return q_list

def get_content_fr(url_fr):
    questions = requests.get(url_fr) # parcourir tous les contenus de real_url
    selector = etree.HTML(questions.text)

    num_blocks = 15
    list_questions = []
    for i in range(9,num_blocks):
        content = selector.xpath('/html/body/div/div[3]/div[2]/article/div[2]/div[' + str(i) + ']/ol//child::li/text()')
        if (content != []):
            for under_content in content:
                list_questions.append(under_content)
    return list_questions


def make_csv(questions, file_path, language):
    nlp_en = spacy.load("en_core_web_sm")
    nlp_fr = spacy.load("fr_core_news_sm")
    with open(file_path, "w", encoding="UTF-8") as output:
        i = 0
        output.write("id\tquestion\tkey_words\n")
        for question in questions:
            i += 1
            if (language == "en"):
                toks = nlp_en(str(question))
            else:
                toks = nlp_fr(str(question))
            list_words = ""   
            for tok in toks:
                if tok.pos_ == "NOUN" or tok.pos_ == "ADJ" or tok.pos_ == "VERB":
                    list_words += tok.text + "/"
            list_words = list_words[:-1]
            output.write("{}\t{}\t{}\n".format(str(i), str(question), list_words))

def web_scrapping():
    fr_questions = get_content_fr(url_fr)
    en_questions = get_content_en(url_en)

    en_file_path = "en_data.csv"
    fr_file_path = "fr_data.csv"

    make_csv(en_questions, en_file_path, "en")
    make_csv(fr_questions, fr_file_path, "fr")

web_scrapping()

# ------------------------------------------- Algo for selecting words and giving difficulty levels to questions --------------------------------

def get_sentences(size, df):
    selected_sentences = df.loc[:size,["question"]]
    selected_sentences = selected_sentences['question'].tolist() # all possible sentences
    return selected_sentences

def get_words(size, df):
    key_words = df.loc[:size,["key_words"]]
    key_words = key_words["key_words"].to_dict() # all words sent to front end, dict
    return key_words

def vocab_list_to_front_end(key_words):
    # Faire une liste de vocabulaires extraites des questions
    li_try = []
    for key in key_words:
        words_in_one_question = key_words[key].split('/')
        li_try.append(words_in_one_question)
        key_words[key] = words_in_one_question
    li_to_front_vocabs = sum(li_try, []) # list to sent to front end
    return li_to_front_vocabs

# vocab_list vient de front end :
vocab_list = {'player1':['fantasy', 'time', 'cried', 'crush', 'week'], 'player2': ['time', 'gender', 'have', 'crush', 'week']} # from front end

def nb_pers(request):
    nb_pers = json.loads(request.body)
    global players_num
    players_num = nb_pers['nb_pers']

def make_final_result_to_front_end(vocab_list, key_words, selected_sentences):
    known_words = {}
    for v in vocab_list:
        for word in vocab_list[v]:
            if word in known_words:
                known_words[word] += 1
            else:
                known_words[word] = 1

    final_result_to_front = {"difficult":[], "middle":[], "easy":[]}

    for id_phrase in key_words:
        word_size = len(key_words[id_phrase]) # number of key words in a phrase
        level = 0 # this is for calculating the difficulty level of a phrase. level ++, dificulty ++

        word_category_dict = {}
        
        for word in key_words[id_phrase]:
            if word in known_words: # If the user know the word,=
                if (known_words[word] == players_num):
                    category = "green"
                    level -= 1
                else:
                    category = "orange"
            else:
                category = "red"
                level += 1
            word_category_dict[word] = category
        if (level == word_size): # Very difficult
            final_result_to_front["difficult"].append({selected_sentences[id_phrase]: word_category_dict})
        elif (level >= 0 and level < word_size): # middle difficulty
            final_result_to_front["middle"].append({selected_sentences[id_phrase]: word_category_dict})
        else:
            final_result_to_front["easy"].append({selected_sentences[id_phrase]: word_category_dict})

    print(final_result_to_front)
        
def main(mode, question_size):
    size = question_size
    if (mode == "en"):
        df = pd.read_csv("en_data.csv", encoding="utf-8", delimiter="\t")
    else:
        df = pd.read_csv("fr_data.csv", encoding="utf-8", delimiter="\t")
    selected_sentences = get_sentences(size, df)
    key_words = get_words(size, df)

    li_to_front_vocab = vocab_list_to_front_end(key_words)
    # send to front end
    
    # get vocab_list from front-end
    make_final_result_to_front_end(vocab_list, key_words, selected_sentences)
    #send to front end

def send_words(request) : 
    pass

