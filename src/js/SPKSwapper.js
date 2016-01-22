
var TWEEN = require('tween.js');

var SPKSwapper = function () {

  var SPKSwapper = this;

  SPKSwapper.swap = function(iin, out) {

    var tweenOut = new TWEEN.Tween( { x: opacity } )
      .to( {x: 0}, 400 )
      .onUpdate( function() {

        for( var i = 0; i < out.length; i++ ) {

          out[i].material.opacity = this.x;

        }

      })
      .onComplete( function() {

        for( var i = 0; i < out.length; i++ ) {

          scene.remove(out[i]);
          out[i].geometry.dispose();
          out[i].material.dispose();

        }

      });

    var tweenIn = new TWEEN.Tween( { x : 0 } )
      .to( { x: maxopacity }, 400 )
      .onUpdate( function() {
        for( var i = 0; i < iin.length; i++ ) {

          iin[i].material.opacity = this.x;

        }
      })
      .onComplete( function() {

      })

    // not sure this is the right way
    var t = []; t.push(tweenOut); t.push(tweenIn);
    
    return t;
  }

}

module.exports = new SPKSwapper();
