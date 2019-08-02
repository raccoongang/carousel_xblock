"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

from xblock.core import XBlock
from xblock.fields import Integer, Scope, Boolean, List, String
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader
from xblockutils.settings import XBlockWithSettingsMixin, ThemableXBlockMixin

loader = ResourceLoader(__name__)

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

    img_urls = List(
        default = ["http://bm.img.com.ua/img/prikol/images/large/3/9/315193.jpg",
                    "http://bm.img.com.ua/img/prikol/images/large/3/9/315193.jpg"],
        scope=Scope.content
    )

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

    @XBlock.json_handler
    def save_carouselxblock(self, data, suffix=''):
        """
        The saving handler.
        """
        self.display_name = data['display_name']
        self.img_urls = eval(data['img_urls'])
        self.interval = data['interval']

        return {
            'result': 'success',
        }
