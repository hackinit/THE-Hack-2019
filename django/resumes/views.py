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

def get_field(record, keys):
    for key in keys:
        if key in record:
            record = record[key]
        else:
            return ''
    return record

def search_resume(identity, group):
    url = 'https://api.thehack.org.cn/s3/prefix/upload/resume/confirmation/{group}/{identity}'.format(group=group, identity=identity)
    try:
        r = requests.get(url).json()
    except:
        return ''

    return 'https://s3.cn-north-1.amazonaws.com.cn/thehack/{}'.format(r['result'])

def get_return_record(record, group, school=None):
    return {
        'name': get_field(record, ['profile', 'name']),
        'email': get_field(record, ['email']),
        'school': get_field(record, ['profile', 'school']) if school is None else school,
        'resume': search_resume(get_field(record, ['_id']), group),
    }

class ResumesAll(APIView):
    def get(self, request, format=None):
        hackinit_raw = get_by_group('hackinit')
        hackshanghai_raw = get_by_group('hackshanghai')
        shanghaitech_raw = get_by_group('shanghaitech')

        hackinit = []
        hackshanghai = []

        for record in hackinit_raw:
            hackinit.append(get_return_record(record), 'hackshanghai')

        for record in hackshanghai_raw:
            hackshanghai.append(get_return_record(record), 'hackshanghai')

        for record in shanghaitech_raw:
            school = u'上海科技大学' if get_field(record, ['email']).endswith('@shanghaitech.edu.cn') else ''
            group = get_field(record, ['profile', 'group'])
            if group == 'I':
                hackinit.append(get_return_record(record, school), 'hackshanghai')
            elif group == 'S':
                hackshanghai.append(get_return_record(record, school), 'hackshanghai')

        return Response({
            'hackinit': hackinit,
            'hackshanghai': hackshanghai,
        })
