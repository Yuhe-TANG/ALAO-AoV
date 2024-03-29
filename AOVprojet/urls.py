"""AOVprojet URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
#from django.urls import re_path as url
from myApp import views
from django.conf.urls.i18n import i18n_patterns
from django.views.static import serve
from AOVprojet import settings
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path("admin/", admin.site.urls),
    path('', views.home),
    path('jeu/', views.game),
    path('game/', views.game),
    path('i18n/', include('django.conf.urls.i18n')),
    # url(r'^i18n/',include('django.conf.urls.i18n')),
    path('game/send_nb_lang', csrf_exempt(views.nb_lang)),
    path('game/get_words', views.send_words),
    path('game/send_dict_envoyer', csrf_exempt(views.send_phrases)),
]
urlpatterns += i18n_patterns(
    path('', views.home),
    path('jeu/', views.game),
    path('game/', views.game),
    path('game/send_nb_lang', csrf_exempt(views.nb_lang)),
    path('game/get_words', views.send_words),
    path('game/send_dict_envoyer', csrf_exempt(views.send_phrases)),
)
