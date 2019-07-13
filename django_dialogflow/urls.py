from django.conf.urls import url
from django.contrib import admin
from .views import chat_view, index_view, chart_view

urlpatterns = [
    url(r'^chat$', chat_view, name='chat'),
    # url(r'^$', index_view, name='index'),
    # url(r'^admin/', admin.site.urls),
    url(r'^config_schedule_drug', index_view, name='index'),
    url(r'^chart', chart_view, name='index'),
]
