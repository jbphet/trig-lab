/**
 * Control Panel for Trig Lab sim
 * Created by dubson on 6/4/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var CheckBox = require( 'SUN/CheckBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );


  //strings
  var cosText = new Text( 'cos' );
  var sinText = new Text( 'sin' );
  var tanText = new Text( 'tan' );
  var labelsText =  new Text( 'Labels' );
  var gridText = new Text( 'Grid' );
  var specialAnglesText = new Text( 'Special Angles' );


  /**
   * Constructor for RotorNode which renders rotor as a scenery node.
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function ControlPanelView( properties  ) {

    var controlPanelView = this;
    this.properties = properties;
    //graph: 'cos', // {string} which graph is visible, 'cos'|'sin' |'tan'
    //labelsVisible: false,
    //gridVisible: false,
    //specialAnglesVisible: false

    //this.model = model;

    // Call the super constructor
    //Node.call( controlPanelView, { } );

    //Test code
    var prop1 = new Property( true );
    var prop2 = new Property( false );
    var prop3 = new Property( false );

    //A cluster of 3 radio buttons for displaying either cos, sin or tan
    //properties.graph , properties.graph , properties.graph
    var cosRadioButton = new AquaRadioButton( properties.graphProperty, 'cos', new Text( 'Cos' ));
    var sinRadioButton = new AquaRadioButton( properties.graphProperty, 'sin', new Text( 'Sin' ));
    var tanRadioButton = new AquaRadioButton( properties.graphProperty, 'tan', new Text( 'Tan' ));



    //3 checkboxes: Labels, Grid, Special Angles
    var labelsCheckBox = new CheckBox( labelsText, properties.labelsVisibleProperty );
    var gridCheckBox = new CheckBox( gridText, properties.gridVisibleProperty );
    var specialAnglesCheckBox = new CheckBox( specialAnglesText, properties.specialAnglesVisibleProperty );

    properties.graphProperty.link( function ( isVisible ) {
      console.log( 'properties.graphProperty is '+ isVisible );
    } );

    properties.labelsVisibleProperty.link( function ( isVisible ) {
      console.log( 'labelsVisible is '+ isVisible );
    } );

    //properties.gridVisible
    properties.gridVisibleProperty.link( function ( isVisible ) {
      console.log( 'gridVisible '+ isVisible );
    } );

    //properties.specialAnglesVisible
    properties.specialAnglesVisibleProperty.link( function ( isVisible ) {
      console.log( 'specialAnglesVisible '+ isVisible );
    } );


    // Register for synchronization with model.
    //model.angleProperty.link( function( angle ) {
    //  onTopOfStageGraphic.rotation = angle;
    //} );


    // Adjust touch areas
    var spacing = 20;

    var content = new VBox( {
      children: [
        cosRadioButton,
        sinRadioButton,
        tanRadioButton,
        new HSeparator( 50 ), //maxControlWidth ),
        labelsCheckBox,
        gridCheckBox,
        specialAnglesCheckBox
      ],
      align: 'left',
      spacing: spacing
    } );


    Panel.call( this, content );

  }

  return inherit( Panel, ControlPanelView );
} )