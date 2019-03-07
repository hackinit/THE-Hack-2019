from django.conf.urls import url
from checkin import views

urlpatterns = [
    url(r'^info/(?P<group>hackinit|hackshanghai|shanghaitech)/(?P<identity>[a-zA-Z0-9]+)$', views.CheckInInformation.as_view()),
    url(r'^confirm/(?P<group>hackinit|hackshanghai|shanghaitech)/(?P<identity>[a-zA-Z0-9]+)$', views.CheckInConfirm.as_view()),
]
