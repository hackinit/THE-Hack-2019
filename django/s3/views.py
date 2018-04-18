# -*- coding: utf-8 -*-
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

import boto3
import StringIO

class S3Middleware(APIView):
    parser_classes = (MultiPartParser, FormParser,)

    def put(self, request, filename, format=None):
        try:
            s3 = boto3.resource('s3')
            upload = request.FILES['upload']
            content = ''
            for chunk in upload.chunks():
                content += chunk
            output = StringIO.StringIO()
            output.write(content)
            output.seek(0)
            s3.Bucket('thehack').put_object(Key='upload/{}'.format(filename), Body=output)
            return Response({
                'status': 204,
                'message': 'upload success',
            }, status=204)
        except Exception as e:
            print 'ERROR: {}'.format(e)
            return Response({
                'status': 400,
                'message': 'upload failed',
            }, status=400)
        finally:
            output.close()
