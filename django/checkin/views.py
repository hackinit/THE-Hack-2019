# -*- coding: utf-8 -*-
from rest_framework.views import APIView
from rest_framework.response import Response

import os
import requests

class CheckInInformation(APIView):
    def get(self, request, group, identity, format=None):
        url = 'http://{host}_quill:3000/api/users/{identity}'.format(host=group, identity=identity)
        headers = {'x-access-token': os.environ['{}_JWT'.format(group.upper())]}
        try:
            r = requests.get(url, headers=headers).json()
        except:
            return Response({
                'status': 400,
                'message': 'Bad Request',
            })

        return Response({
            'status': 200,
            'result': {
                'name': r['profile']['name'] if 'name' in r['profile'] else '',
                'age': r['profile']['age'] if 'age' in r['profile'] else '',
                'group': group[4].upper() if group.startswith('hack') else (r['profile']['group'] if 'group' in r['profile'] else ''),
                'shirtSize': r['confirmation']['shirtSize'] if 'shirtSize' in r['confirmation'] else '',
                'idType': r['confirmation']['idType'] if 'idType' in r['confirmation'] else '',
                'idNumber': r['confirmation']['idNumber'] if 'idNumber' in r['confirmation'] else '',
                'dietaryRestrictions': r['confirmation']['dietaryRestrictions'] if 'dietaryRestrictions' in r['confirmation'] else '',
                'knownCondition': r['confirmation']['knownCondition'] if 'knownCondition' in r['confirmation'] else '',
            },
        })

class CheckInConfirm(APIView):
    def post(self, request, group, identity, format=None):
        url = 'http://{host}_quill:3000/api/users/{identity}/checkin'.format(host=group, identity=identity)
        headers = {'x-access-token': os.environ['{}_JWT'.format(group.upper())]}
        try:
            r = requests.post(url, headers=headers)
        except:
            return Response({
                'status': 400,
                'message': 'Bad Request',
            })

        if r.status_code == 200:
            return Response({
                'status': 200,
                'message': 'OK',
            })
        else:
            return Response({
                'status': 400,
                'message': 'Bad Request',
            })
