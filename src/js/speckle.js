/** 
 * 
 * @type {[type]}
 */

var $     = require('jquery');
var THREE = require('three');

var SPK = function () {

  /*************************************************
  /   SPK Global
  *************************************************/
  
  var SPK = this;
  
  /*************************************************
  /   SPK HTMLs
  *************************************************/

  var canvas, sidebar;

  /*************************************************
  /   SPK Methods
  *************************************************/
  
  SPK.init = function(modelname) {

    canvas  = $("#spk-canvas");
    sidebar = $("#spk-sidebar");
  }

  SPK.load = function() {

  }

  SPK.changeInstance = function() {

  }

}

module.exports = new SPK();