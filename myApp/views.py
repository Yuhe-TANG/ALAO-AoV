from django.shortcuts import render

# Create your views here.
langue = "fr"

def home(request):
    return render(request, 'home.html')

def game(request):
    return render(request, 'game.html')