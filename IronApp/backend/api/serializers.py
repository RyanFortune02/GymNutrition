from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

#Uses an ORM (Object RelationalMapping)- maps python objects to corresponding code that needs to be executed in the database
#JSON eqauals JavaScript Object Notation
#Serializers are used to convert complex data types, such as querysets and model instances, to native Python datatypes that can then be 
#easily rendered into JSON, XML or other content types.

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}  #Want to accept password but not return it
        
    def create(self, validated_data):
        # Create user with only username and password
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=''  # Provide an empty email string
        )
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'author', 'created_at']
        extra_kwargs = {'author': {'read_only': True}} #should be able to read author but not write it (based on account/user)