"""TO-DO: Write a description of what this XBlock is."""

import logging
import os
import uuid

import pkg_resources

from django.conf import settings
from django.core.files import File
from django.core.files.storage import default_storage
from webob import Response
from xblock.core import XBlock
from xblock.fields import Boolean, Integer, List, Scope, String
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader
from xblockutils.settings import ThemableXBlockMixin, XBlockWithSettingsMixin

loader = ResourceLoader(__name__)
log = logging.getLogger(__name__)

MEDIA_ROOT = os.path.join(settings.ENV_TOKENS['MEDIA_ROOT'], 'carousel')


class CarouselXBlock(XBlock, XBlockWithSettingsMixin, ThemableXBlockMixin):
    """
    TO-DO: document what your XBlock does.
    """

    icon_class = 'other'

    display_name = String(
        display_name="Display Name",
        default="Carousel",
        scope=Scope.content,
        help="This name appears in the horizontal navigation at the top of the page."
    )

    interval = Integer(
        default=1000,
        scope=Scope.content
    )
    answ = Boolean(
        help="What the student answered??",
        default=False,
        scope=Scope.user_state)

    img_urls = List(scope=Scope.content)

    @XBlock.json_handler
    def answer(self, data, suffix=''):  # pylint: disable=unused-argument
        if data['answerType'] not in ('yes', 'no'):
            log.error('error!')
            return

        if data['answerType'] == 'yes':
            self.answ = True
        else:
            self.answ = False 

        return {'answer': self.answ}

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def studio_view(self, context=None):
        context = {
            'display_name': self.display_name,
            'name_help': "This name appears in the horizontal navigation at the top of the page.",
            'img_urls': self.img_urls,
            'interval': self.interval
        }
        html = loader.render_django_template(
            'templates/carouselxblock_edit.html',
            context=context
        )
        frag = Fragment(html)
        frag.add_javascript(self.resource_string("static/js/src/carouselxblock_edit.js"))
        frag.initialize_js('crouselXBlockInitEdit')
        return frag

    def student_view(self, context=None):
        """
        The primary view of the CarouselXBlock, shown to students
        when viewing courses.
        """
        context = {
            'display_name': self.display_name,
            'img_urls': self.img_urls,
            'interval': self.interval
        }
        html = loader.render_django_template("templates/carouselxblock.html", context=context)
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/carouselxblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/carouselxblock.js"))
        frag.initialize_js('CarouselXBlock')
        return frag

    @XBlock.handler
    def upload_img(self, request, suffix=''):
        img_urls = []
        for img_file in request.params.getall('files'):
            path = self._file_storage_path(img_file.file)
            default_storage.save(path, File(img_file.file))
            img_urls.append(path)
            log.info('"{}" file stored at "{}"'.format(img_file.file, path))
        log.info('img_urls: "{}"'.format(img_urls))
        return Response(json_body={
            'img_urls': img_urls + self.img_urls,
            'media_url': settings.ENV_TOKENS['MEDIA_URL']
        })

    @XBlock.handler
    def save_carouselxblock(self, request, suffix=''):
        """
        The saving handler.
        """
        self.display_name = request.params['display_name']
        self.interval = request.params['interval']

        for path in self.img_urls:
            if default_storage.exists(path):
                log.info('Removing previously uploaded "{}"'.format(path))
                default_storage.delete(path)

        img_urls = []
        log.info('save img_urls: "{}"'.format(request.params.getall('img_urls')))
        for img_url in request.params.getall('img_urls'):
            img_urls.append(img_url)
        self.img_urls = img_urls
        return Response(json_body={'status': 'ok'})

    def _file_storage_path(self, name):
        """
        Get file path of storage.
        """
        path = (
            '{loc.org}/{loc.course}/{loc.block_type}/{loc.block_id}'
            '/{hash}_{ext}'.format(
                loc=self.location,
                ext=name,
                hash=uuid.uuid4().hex

            )
        )
        return path
