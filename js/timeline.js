(function ($) {
  $(function () {

    systole();

    clock();
    setInterval(function(){   
      clockCanvas.width = 60;   
      clockCanvas.height = 60;  
      clock();  
    },1000);

    /* menuJS BEGIN */
    $('.burger_menu').click(function () {
      $(this).toggleClass('toggle_burger');
      setTimeout(function () {
          $('.home').toggleClass('toggle_home');
      }, 100);
      setTimeout(function () {
          $('.gallery').toggleClass('toggle_gallery');
      }, 200);
      setTimeout(function () {
          $('.github').toggleClass('toggle_github');
      }, 300);
      setTimeout(function () {
          $('.mail').toggleClass('toggle_mail');
      }, 400);
    });

    var $multiple_menus = '.home, .gallery, .github, .mail';
    $('i.icon_close').click(function () {
      $('.burger_menu').addClass('toggle_burger');
      $(this).parent().fadeOut('slow');
      setTimeout(function () {
          $('.circle_background').removeClass('scale');
          $('i.icon-home, i.icon-gallery, i.icon-github, i.icon-mail').fadeIn('slow');
      }, 400);
      setTimeout(function () {
          $($multiple_menus).css({ 'z-index': '4' }).removeClass('hide freeze');
      }, 700);
      $('.circle_background').css({ 'z-index': '2' });
    });

    $('.home').click(function () {
      window.location.href="home.html";
    });

    $('.gallery').click(function () {
      window.location.href="http://eatingmiao.tumblr.com";
    });

    $('.github').click(function () {
      window.location.href="http://github.com/eatingmiao/index";
    });

    $('.mail').click(function () {
      var w = document.body.clientWidth;
      var h = document.body.clientHeight;
      var l = (w-320)*100/2/w;
      var t = (h-280)*100/2/h;
      $(".contact").css({"bottom":160,"right":160,"display":"block","width":0,"height":0});  
      $(".contact").animate({bottom:t+"%",right:l+"%",width:"320px",height:"280px"},"fast");
      $(".back").css("display","block");
    });

    $(".back, .icon-cancel").bind('click',function () {
      $(".back").css("display","none");
      $(".contact").fadeOut("fast");
    });

  }); 

  /* clockJS BEGIN */
  var clockCanvas = document.getElementById("clock"); 
  function clock(){  
      var date = new Date();  
      var d = date.getSeconds();  
      var m = date.getMinutes();  
      var h = date.getHours();
      var c = clockCanvas.getContext("2d");

      c.beginPath();
      c.lineWidth = 4;
      c.strokeStyle= "#FEA900";
      c.arc(30,30,28,0,2*Math.PI);      
      c.translate(30,30);  
      c.closePath();  
      c.stroke();  
        
      c.beginPath();  
      c.lineWidth = 2;    
      c.rotate(Math.PI/6/300*(m*60+d));  
      c.moveTo(0,0);  
      c.lineTo(0,-22);  
      c.rotate(-Math.PI/6/300*(m*60+d));       
      c.rotate(Math.PI/6/3600*(h*3600+m*60+d));  
      c.moveTo(0,0);  
      c.lineTo(0,-18);  
      c.rotate(-Math.PI/6/3600*(h*3600+m*60+d));       
      c.closePath();  
      c.stroke();  
        
      c.beginPath();    
      c.rotate(Math.PI/6/5*d);  
      c.lineWidth = 1; 
      c.fillStyle = "#FEA900";
      c.moveTo(0,0);  
      c.lineTo(0,-23);  
      c.rotate(-Math.PI/6/5*d);  
      c.moveTo(0,0); 
      c.arc(0,0,2,0,2*Math.PI);    
      c.closePath();  
      c.fill();  
      c.stroke();    
  }

  /* timelineJS BEGIN */
  function systole() {
    if (!$(".history").length) {
      return;
    }
    var $warpEle = $(".history-date"),
      $targetA = $warpEle.find("h2 a, ul li dl dt i"),
      parentH,
      eleTop = [];
    parentH = $warpEle.parent().height();
    $warpEle.parent().css({
      "height":60
    });
    setTimeout(function () {

      $warpEle.find("ul").children(":not('h2:first')").each(function (idx) {
        eleTop.push($(this).position().top);
        $(this).css({
          "margin-top":-eleTop[idx]
        }).children().hide();
      }).animate({
          "margin-top":0
        }, 1600).children().fadeIn();
      $warpEle.parent().animate({
        "height":parentH
      }, 2600);

      $warpEle.find("ul").children(":not('h2:first')").addClass("bounceInDown").css({
        "-webkit-animation-duration":"2s",
        "-webkit-animation-delay":"0",
        "-webkit-animation-timing-function":"ease",
        "-webkit-animation-fill-mode":"both"
      }).end().children("h2").css({
          "position":"relative"
        });
    }, 600);

    $targetA.click(function () {
      $(this).parent().css({
        "position":"relative"
      });
      $(this).parent().siblings().slideToggle();
      $warpEle.parent().removeAttr("style");
      return false;
    });
  };

})(jQuery);