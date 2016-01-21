
var $           = require('jquery');
var THREE       = require('three');
var OrbitCtrls  = require('three-orbit-controls')(THREE);
var noUISlider  = require('nouislider');
var SPKLoader   = require('./SPKLoader.js');
var SPKCache    = require('./SPKCache.js');
var SPKMaker    = require('./SPKObjectMaker.js');

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

  var VIEWER = {
    renderer : null,
    camera : null,
    scene : null, 
    controls : null,
    sunlight : null,
    raycaster : null
  }
  

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

    // make the scene + renderer
    // not sure if it's a logical place to put it
    
    VIEWER.scene = new THREE.Scene();

    VIEWER.renderer = new THREE.WebGLRenderer( { antialias : true, alpha : true } );

    VIEWER.renderer.setClearColor( 0xFFFFFF ); 

    VIEWER.renderer.setPixelRatio( window.devicePixelRatio );
    
    VIEWER.renderer.setSize( $(HTML.canvas).width(), $(HTML.canvas).height() ); 

    VIEWER.renderer.shadowMap.enabled = true;
    
    $(HTML.canvas).append( VIEWER.renderer.domElement );

    VIEWER.renderer.setSize( $(HTML.canvas).width(), $(HTML.canvas).height() ); 

    VIEWER.camera = new THREE.PerspectiveCamera( 40, $(HTML.canvas).width() * 1 / $(HTML.canvas).height(), 200 );

    VIEWER.camera.position.z = -200; VIEWER.camera.position.y = 200;
    
    VIEWER.controls = new OrbitCtrls( VIEWER.camera, VIEWER.renderer.domElement );

    // load parameters 
    
    SPK.loadParameters();

    SPK.loadStaticInstance();
    //SPK.loadInstance();

    SPK.testGeo();
    
    SPK.render();
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
    
    SPKLoader.load( "./testmodel/" + key + ".json", function (obj) {
      console.log(obj);
      for( var i = 0; i < obj.geometries.length; i++ ) {

        SPKMaker.make( obj.geometries[i], key, function( obj ) { 
          // TODO : Add to scene
          VIEWER.scene.add(obj);
          // TODO : Add to cache
        });

      }

    });

  }

  SPK.loadStaticInstance = function() {

    SPKLoader.load( "./testmodel/static.json", function( obj ) {

      for( var i = 0; i < obj.geometries.length; i++ ) {

        SPKMaker.make(obj.geometries[i], "static", function( obj ) { 
          
          // TODO : Add to scene
          // TODO : Make unremovable
          
          obj.removable = false;
          
          VIEWER.scene.add(obj);
        
        });

      }

    });

  }

  SPK.render = function() {

    requestAnimationFrame( SPK.render );
    
    VIEWER.renderer.render(VIEWER.scene, VIEWER.camera);
    
  }

  SPK.testGeo = function() {

    var sphere = new THREE.Mesh( new THREE.IcosahedronGeometry( 50, 7 ), new THREE.MeshNormalMaterial( ) );
    sphere.material.opacity = 0.3;
    sphere.material.transparent = true;
    VIEWER.scene.add( sphere );

  }

  SPK.changeInstance = function() {

  }

}

module.exports = new SPK();