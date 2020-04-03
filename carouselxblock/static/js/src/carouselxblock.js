function CarouselXBlock(runtime, element) {

  $(document).ready(function() {
    var $container = $(".slideshow-container", element);
    var $slides = $(".mySlides", element);
    var $dots = $(".dot", element);
    var $prev = $(".prev", element);
    var $next = $(".next", element);

    var slideIndex = 1;
    var interval = $container.attr('interval');

    var firstSlide = $slides[0];
    var initialContainerHeigth = $container.width() * $(firstSlide[0]).height() / $(firstSlide[0]).width();
    console.log(initialContainerHeigth);
    $container.height(initialContainerHeigth);
    showSlides(slideIndex);
    var myTimer = setInterval(function(){plusSlides(1)}, interval);

    $prev.on("click", function(){plusSlides(-1)})

    $next.on("click", function(){plusSlides(1)})

    $dots.on("click", function() {
      clearInterval(myTimer);
      slideIndex = $(this).data("index");
      myTimer = setInterval(function(){plusSlides(slideIndex + 1)}, interval);
      showSlides(slideIndex);
    })

    function plusSlides(n){
      if (n < 0){
        showSlides(slideIndex -= 1);
      } else {
        showSlides(slideIndex += 1);
      }
    }

    function showSlides(n){
      if (n > $slides.length) {
        slideIndex = 1
      } else if (n < 1) {
        slideIndex = $slides.length
      }
      $slides.css("display", "none")
      $dots.removeClass("active");
      $container.stop()
      $container.animate(
        {
          height: $container.width() * $($slides[slideIndex-1]).height() / $($slides[slideIndex-1]).width()
        },
        interval / 5
      );
      $slides[slideIndex-1].style.display = "block";
      $dots[slideIndex-1].className += " active";
    }
  });
}
