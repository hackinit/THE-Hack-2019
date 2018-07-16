# -*- coding: utf-8 -*-
from rest_framework.views import APIView
from rest_framework.renderers import BaseRenderer
from rest_framework.response import Response

import io
import qrcode

class PNGRenderer(BaseRenderer):
    media_type = "image/png"
    format = "png"
    charset = None
    render_style = "binary"

    def render(self, data, media_type=None, render_context=None):
        return data

class QRGenerator(APIView):
    renderer_classes = (PNGRenderer,)

    def get(self, request, data, format=None):
        img = qrcode.make(data)
        output = io.BytesIO()
        img.save(output)

        content = output.getvalue()
        return Response(content, content_type="image/png")
