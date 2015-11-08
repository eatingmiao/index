;(function ($) {

  /* home's initialization */
  $(function () {
    $("body").starfield({
      starDensity: 0.5,
      mouseScale: 0.5,
      seedMovement: false
    }); 
    $("#header_banner ul li:eq(4)").bind('click',function(){
      var b_w = document.body.clientWidth;
      var b_h = document.body.clientHeight;
      var c_l = (b_w-320)*100/2/b_w +"%";
      var c_t = (b_h-280)*100/2/b_h +"%";
      $(".contact").css({"top":c_t,"left":c_l}); 
      $(".back").css("display","block");
      $(".contact").fadeIn("slow");
    });
    $(".back, .icon-cancel").bind('click',function(){
      $(".back").css("display","none");
      $(".contact").fadeOut("fast");
    });
  });

  /* starfieldJS BEGIN */
  /* Copyright (c) 2015 popAD, LLC dba Rocket Wagon Labs <lukel99@gmail.com> */
  var COORDINATE_LENGTH = 5000;

  var Star = function (x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  };

  Star.prototype.mapXYToCanvasCoordinates = function (canvasWidth, canvasHeight) {
    var canvasX = Math.round((this.x / COORDINATE_LENGTH) * canvasWidth);
    var canvasY = Math.round((this.y / COORDINATE_LENGTH) * canvasHeight);
    return {
      x: canvasX,
      y: canvasY
    }
  };

  var StarFactory = {

    getRandomStar: function () {
      var x = Math.floor(Math.random() * (COORDINATE_LENGTH + 1));
      var y = Math.floor(Math.random() * (COORDINATE_LENGTH + 1));
      var size = this._getWeightedRandomSize();
      var color = this._getWeightedRandomColor();
      var tintedColor = this._applyRandomShade(color);
      return new Star(x, y, size, this._getRGBColorString(tintedColor));
    },

    _getWeightedRandomSize: function () {
      var list = [1, 1.5, 2];
      var weight = [0.8, 0.15, 0.05];
      return this._getWeightedRandom(list, weight);
    },

    _getWeightedRandomColor: function () {
      var list = [
        {'r': 255, 'g': 189, 'b': 111},
        {'r': 255, 'g': 221, 'b': 180},
        {'r': 255, 'g': 244, 'b': 232},
        {'r': 251, 'g': 248, 'b': 255},
        {'r': 202, 'g': 216, 'b': 255},
        {'r': 170, 'g': 191, 'b': 255},
        {'r': 155, 'g': 176, 'b': 255}
      ];
      var weight = [0.05, 0.05, 0.05, 0.7, 0.05, 0.05, 0.05];
      return this._getWeightedRandom(list, weight);
    },

    _getRandomShade: function () {
      var list = [0.4, 0.6, 1];
      var weight = [0.5, 0.3, 0.2];
      return this._getWeightedRandom(list, weight);
    },

    _applyRandomShade: function (color) {
      var shade = this._getRandomShade();
      if (shade !== 1) { // skip processing full brightness stars
        color['r'] = Math.floor(color['r'] * shade);
        color['g'] = Math.floor(color['g'] * shade);
        color['b'] = Math.floor(color['b'] * shade);
      }
      return color;
    },

    _getRGBColorString: function (color) {
      return 'rgb(' + color['r'] + ',' + color['g'] + ',' + color['b'] + ')';
    },

    // http://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability/
    _getWeightedRandom: function (list, weight) {

      var rand = function (min, max) {
        return Math.random() * (max - min) + min;
      };

      var total_weight = weight.reduce(function (prev, cur) {
        return prev + cur;
      });

      var random_num = rand(0, total_weight);
      var weight_sum = 0;

      for (var i = 0; i < list.length; i++) {
        weight_sum += weight[i];
        weight_sum = +weight_sum.toFixed(2);

        if (random_num <= weight_sum) {
          return list[i];
        }
      }
    }
  };

  var Starfield = [];

  $.fn.starfield = function (options) {

    var settings = $.extend({
      starDensity: 1.0,
      mouseScale: 1.0,
      seedMovement: true
    }, options);

    $this = $(this);

    var width = $this.width();
    var height = $this.height();

    var totalPixels = width * height;
    var starRatio = 0.002 * settings.starDensity;
    var numStars = Math.floor(totalPixels * starRatio);

    if(settings.seedMovement){
      var deltaX = 5;
      var deltaY = 5;
    } else {
      var deltaX = 0;
      var deltaY = 0;
    }

    var canvas = $('<canvas id="rocketwagon-canvas">')
      .css({position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'})
      .attr({width: $this.width(), height: $this.height()})
      .prependTo($this);

    for (var i = 0; i < numStars; i++) {
      Starfield.push(StarFactory.getRandomStar());
    }

    // ANIMATION HANDLER
    var recalcMovement = function () {
      $.each(Starfield, function (key, star) {
        var newX = star.x - deltaX;
        var newY = star.y - deltaY;

        if (newX < 0) { newX += COORDINATE_LENGTH }
        if (newY < 0) { newY += COORDINATE_LENGTH }
        if (newX > COORDINATE_LENGTH) {newX -= COORDINATE_LENGTH}
        if (newY > COORDINATE_LENGTH) {newY -= COORDINATE_LENGTH}

        star.x = newX;
        star.y = newY;
      });
    };

    var draw = function () {
      //get raw DOM element
      var canvas = document.getElementById('rocketwagon-canvas');
      var width = canvas.width;
      var height = canvas.height;

      canvas.setAttribute("width", width.toString());
      canvas.setAttribute("height", height.toString());

      if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        // clear canvas
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, width, height);

        // iterate stars and draw them
        $.each(Starfield, function (index, star) {
          var coords = star.mapXYToCanvasCoordinates(width, height);

          ctx.fillStyle = star.color;
          ctx.fillRect(coords.x, coords.y, star.size, star.size);
        });
      }
    };

    // EVENT HANDLERS
    $this.mousemove(
      function (e) {
        var $this = $(this);

        var offset = $this.offset();

        var centerX = width / 2;
        var centerY = height / 2;

        var distanceX = ((e.pageX - offset.left) - centerX);
        var distanceY = ((e.pageY - offset.top) - centerY);

        deltaX = Math.round(settings.mouseScale * (distanceX / 40));
        deltaY = Math.round(settings.mouseScale * (distanceY / 40));
      }
    );

    (function animloop() {
      requestAnimationFrame(animloop);
      recalcMovement();
      draw();
    })();

    return this;
  };

}(jQuery));