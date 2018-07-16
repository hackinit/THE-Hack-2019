from django.conf.urls import url
from qr import views

urlpatterns = [
    url(r'^generate/(?P<data>.+)$', views.QRGenerator.as_view()),
]
