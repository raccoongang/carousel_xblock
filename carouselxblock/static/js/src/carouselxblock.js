var slideIndex = 1;
var  interval = 500;

$( document ).ready(function() {
  showSlides(slideIndex);
  myTimer = setInterval(function(){plusSlides(1)}, interval);
  }
)

function plusSlides(n){
  clearInterval(myTimer);
  if (n < 0){
    showSlides(slideIndex -= 1);
  } else {
    showSlides(slideIndex += 1); 
  }
  if (n === -1){
    myTimer = setInterval(function(){plusSlides(n + 2)}, interval);
  } else {
    myTimer = setInterval(function(){plusSlides(n + 1)}, interval);
  }
}

function currentSlide(n){
  clearInterval(myTimer);
  myTimer = setInterval(function(){plusSlides(n + 1)}, interval);
  showSlides(slideIndex = n);
}

function showSlides(n){
  interval = $(".slideshow-container").attr('interval');
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  $('.slideshow-container').stop()
  $('.slideshow-container').animate(
    {
      height: $('.slideshow-container').width() * $(slides[slideIndex-1]).height() / $(slides[slideIndex-1]).width()
    },
    interval / 5
  );
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}