# -*- coding: utf-8 -*-
from rest_framework.views import APIView
from rest_framework.response import Response

import os
import requests

def get_by_group(group):
    url = 'http://{host}_quill:3000/api/users'.format(host=group)
    headers = {'x-access-token': os.environ['{}_JWT'.format(group.upper())]}
    try:
        r = requests.get(url, headers=headers).json()
    except:
        return []

    return r

def get_field(record, keys):
    for key in keys:
        if key in record:
            record = record[key]
        else:
            return ''
    return record

def get_return_record(record, group, school=None):
    return {
        'name': get_field(record, ['profile', 'name']),
        'email': get_field(record, ['email']),
        'school': get_field(record, ['profile', 'study', 'school']) if school is None else school,
        'resume': 'https://s3.cn-north-1.amazonaws.com.cn/thehack/{}'.format(get_field(record, ['resumeLink'])),
    }

class ResumesAll(APIView):
    def get(self, request, format=None):
        hackinit_raw = get_by_group('hackinit')
        hackshanghai_raw = get_by_group('hackshanghai')
        shanghaitech_raw = get_by_group('shanghaitech')

        hackinit = []
        hackshanghai = []

        for record in hackinit_raw:
            if get_field(record, ['status', 'confirmed']):
                hackinit.append(get_return_record(record, 'hackshanghai'))

        for record in hackshanghai_raw:
            if get_field(record, ['status', 'confirmed']):
                hackshanghai.append(get_return_record(record, 'hackshanghai'))

        for record in shanghaitech_raw:
            if get_field(record, ['status', 'confirmed']):
                school = u'上海科技大学' if get_field(record, ['email']).endswith('@shanghaitech.edu.cn') else ''
                group = get_field(record, ['profile', 'group'])
                if group == 'I':
                    hackinit.append(get_return_record(record, 'hackshanghai', school))
                elif group == 'S':
                    hackshanghai.append(get_return_record(record, 'hackshanghai', school))

        return Response({
            'hackinit': hackinit,
            'hackshanghai': hackshanghai,
        })
