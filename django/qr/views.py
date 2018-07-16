# -*- coding: utf-8 -*-
from rest_framework.views import APIView
from rest_framework.response import Response

import io
import qrcode

class QRGenerator(APIView):
    def get(self, request, data, format=None):
        img = qrcode.make(data)
        output = io.ByteIO()
        img.save(output)

        content = output.getvalue()
        return Response(content, content_type="image/png")
