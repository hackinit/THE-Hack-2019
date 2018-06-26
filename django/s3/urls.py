from django.conf.urls import url
from s3 import views

urlpatterns = [
    url(r'^upload/(?P<filename>.+)$', views.S3UploadMiddleware.as_view()),
    url(r'^status/(?P<token>[0-9a-zA-Z]+)$', views.S3StatusQuery.as_view()),
    url(r'^prefix/(?P<filename>.+)$', views.S3PrefixMiddleware.as_view()),
]
