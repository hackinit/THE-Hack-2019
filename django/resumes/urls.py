from django.conf.urls import url
from resumes import views

urlpatterns = [
    url(r'^all$', views.ResumesAll.as_view()),
]
