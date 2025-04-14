from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)  #sets time when note is created
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes') #links note to user under a collection of notes,
    #using User.notes.all() will return all notes by that user
    #on_delete=models.CASCADE means that if the user is deleted, all notes by that user will also be deleted
    def __str__(self):
        return self.title