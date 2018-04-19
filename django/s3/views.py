# -*- coding: utf-8 -*-
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

import redis
import random

ALPHABET = [chr(ord('0') + i) for i in range(10)] \
    + [chr(ord('a') + i) for i in range(26)] \
    + [chr(ord('A') + i) for i in range(26)]

REDIS_HOST = 'redis'

class S3Middleware(APIView):
    parser_classes = (MultiPartParser, FormParser,)

    def put(self, request, filename, format=None):
        content = self.__extract_file(request)

        db_filename = redis.StrictRedis(host=REDIS_HOST, port=6379, db=0)
        db_content = redis.StrictRedis(host=REDIS_HOST, port=6379, db=1)
        db_queue = redis.StrictRedis(host=REDIS_HOST, port=6379, db=2)
        db_status = redis.StrictRedis(host=REDIS_HOST, port=6379, db=3)

        random.shuffle(ALPHABET)
        token = ''.join(ALPHABET[:8])
        db_filename.set(token, filename)
        db_content.set(token, content)

        db_queue.publish('upload-channel', token)
        db_status.set(token, 'pending')

        return Response({
            'token': token,
            'status': 200,
        })

    def __extract_file(self, request):
        upload = request.FILES['upload']
        content = ''
        for chunk in upload.chunks():
            content += chunk
        return content

class S3StatusQuery(APIView):
    def get(self, request, token, format=None):
        db_status = redis.StrictRedis(host=REDIS_HOST, port=6379, db=3)
        status = db_status.get(token)
        return Response({
            'result': 'null' if status is None else status,
            'status': 200,
        })
