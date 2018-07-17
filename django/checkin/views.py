# -*- coding: utf-8 -*-
from rest_framework.views import APIView
from rest_framework.response import Response

import requests

class CheckInInformation(APIView):
    def get(self, request, group, identity, format=None):
        url = 'http://{host}_quill:3000/users/{identity}'.format(host=group, identity=identity)
        try:
            r = requests.get(url).json()
        except:
            return Response({
                'status': 400,
                'message': 'Bad Request',
            })

        return Response({
            'status': 200,
            'result': {
                'name': r['profile']['name'],
                'age': r['profile']['age'],
                'group': group[4].upper() if group.startswith('hack') else r['profile']['group'],
                'shirtSize': r['confirmation']['shirtSize'],
                'idType': r['confirmation']['idType'],
                'idNumber': r['confirmation']['idNumber'],
                'dietaryRestrictions': r['confirmation']['dietaryRestrictions'],
                'knownCondition': r['confirmation']['knownCondition'],
            },
        })
