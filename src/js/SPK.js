
var $           = require('jquery');
var THREE       = require('three');
var noUISlider  = require('nouislider');
var SPKLoader   = require('./SPKLoader.js');
var SPKCache    = require('./SPKCache.js');

var SPK = function () {

  /*************************************************
  /   SPK Global
  *************************************************/
  
  var SPK = this;
  
  /*************************************************
  /   SPK HTMLs
  *************************************************/

  var HTML = { 
    wrapper : "" , 
    canvas : "", 
    sidebar : "",
    sliders : "", 
    meta : ""
  };

  /*************************************************
  /   SPK Vars
  *************************************************/

  var GLOBALS = {
    sliders : [],
    currentKey : ""
  }


  /*************************************************
  /   THREE vars
  *************************************************/

  var renderer, camera, scene;


  /*************************************************
  /   SPK Methods
  *************************************************/
  
  /**
   * Main Init Function
   */
  
  SPK.init = function(wrapper) {

    // get those elements in place, you cunt
    HTML.canvas  = $(wrapper).find("#spk-canvas");
    HTML.sidebar = $(wrapper).find("#spk-sidebar");
    HTML.sliders = $(HTML.sidebar).find("#spk-sliders");
    HTML.meta = $(HTML.sidebar).find("#spk-metadata");

    // load parameters 
    SPK.loadParameters();
    SPK.loadInstance();
  }

  SPK.loadParameters = function(callback) {

    $.getJSON("./testmodel/params.json", function(data) {
      
      var params = data.parameters;
      
      for( var i = 0; i < params.length; i++ ) {
        
        $(HTML.sliders).append($("<div>", {id : "parameter" + i, class : "parameter"}));
        
        $("#parameter"+i).append("<p>" + params[i].name + "</p>");
        
        $("#parameter"+i).append($("<div>", {id: "slider"+i, class: "basic-slider"}));
      
        var myRange = {}, norm = 100 / (params[i].values.length-1);

        for( var j = 0; j < params[i].values.length; j++ ) {

          myRange[ norm * j + "%" ] = params[i].values[j];

        }
        
        myRange["min"] = myRange["0%"]; delete myRange["0%"];
      
        myRange["max"] = myRange["100%"]; delete  myRange["100%"];

        var sliderElem = $("#slider" + i)[0];
        
        var slider = noUISlider.create( sliderElem, {
          start : [0],
          conect : false,
          tooltips : false,
          snap : true,
          range : myRange,
          pips : {
            mode : "values",
            values : params[i].values,
            density : 3
          }
        });

        slider.on("slide", SPK.updateInstances);

        GLOBALS.sliders.push(slider);
      }

    });

  }

  SPK.updateInstances = function () {
    
    var key = "";

    for( var i = 0; i < GLOBALS.sliders.length; i++ ) {

      key += Number( GLOBALS.sliders[i].get() ).toString() + ","; 

    }

    if(GLOBALS.currentKey === key) {
      console.log("No key change needed");
      return;
    }

    // TODO: Implement cache
    // var myInstance = findInstance(key);
    var myInstance = null;

    if(myInstance === null) {

      SPK.loadInstance(key);
    
    } else {

      //SPK.loadCachedInstance(key);

    }

    GLOBALS.currentKey = key;

  }

  SPK.setupEnvironment = function () {

  }

  SPK.loadInstance = function(key) {
 
    SPKLoader.load("./testmodel/4,0,0.8,3,0.4,.json", function (obj) {

      console.log(obj);

    });

  }

  SPK.render = function() {

  }

  SPK.changeInstance = function() {

  }

}

module.exports = new SPK();