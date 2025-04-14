from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated] #cannot call this root unless you are authenticated and pass a proper jwt token
    
    def get_queryset(self):
        user = self.request.user #gives us the user that is currently logged in (authenticated)
        return Note.objects.filter(author=user) #returns all notes by the user that is currently logged in
    #Generic views can be left as is, but if you want 'custom functionality' you can override the methods
    #Look below
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)#default serializer will not include author as it is read only
            # SO we need to manually add the author to the serializer
        else:
            print(serializer.errors) #serializer will check all the fields and return any errors that may have occured

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    #make sure that you can only delete notes that user have created
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() #list of all USer objects so that we don't create duplicate users
    serializer_class = UserSerializer
    permission_classes = [AllowAny] #Gives permission to anyone (even non-authenticated users) to create a user