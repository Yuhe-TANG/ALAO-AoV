from django.shortcuts import render
from django.utils.translation import gettext_lazy as _

# Create your views here.

def home(request):
    return render(request, 'home.html')

def game(request):
    return render(request, 'game.html')

def lan(request):
    return render(request,"index.html")

def index(request):
    context = {'msg': _("good info")}
    return render(request, 'index.html', context)

