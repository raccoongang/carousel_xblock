function CarouselXBlock(runtime, element) {

  $(document).ready(function() {
    if ($(".slide", element).length > 1){
      var $container = $(".slideshow-container", element);
      var $slides = $(".slide", element);
      var $dots = $(".dot", element);
      var $prev = $(".prev", element);
      var $next = $(".next", element);
  
      var slideIndex = 1;
      var interval = parseInt($container.attr('interval'));
  
      showSlides(slideIndex);
      var myTimer = setInterval(function(){plusSlides(1)}, interval);
  
      $prev.on("click", function(){plusSlides(-1)})
  
      $next.on("click", function(){plusSlides(1)})
  
      $dots.on("click", function() {
        clearInterval(myTimer);
        slideIndex = $(this).data("index");
        showSlides(slideIndex);
        myTimer = setInterval(function(){plusSlides(1)}, interval);
      })
  
      function plusSlides(n){
        slideIndex += n
        showSlides(slideIndex);
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
    }
  });
}
