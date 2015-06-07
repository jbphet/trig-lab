/**
 * Unit Circle View
 * Created by Dubson on 6/2/2015.
 */
define( function( require ) {
    'use strict';

    // modules
    var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
    var Bounds2 = require( 'DOT/Bounds2' );
    var Circle = require( 'SCENERY/nodes/Circle' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var Shape = require( 'KITE/Shape' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    var Text = require( 'SCENERY/nodes/Text' );
    var Vector2 = require( 'DOT/Vector2' );

    //strings
    var xStr = 'x';
    var yStr = 'y';
    var oneStr = '1';
    var thetaStr = 'theta';   //Need Greek symbol

    /**
     * View of the unit circle with grabbable radial arm, called the rotor arm
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */

    function UnitCircleView( model  ) {

        var unitCircleView = this;
        this.model = model;

        // Call the super constructor
        Node.call( unitCircleView );

        //Draw Unit Circle
        var radius = 150; //radius of unit circle in pixels
        var circleGraphic = new Circle( radius, { stroke:'#000', lineWidth: 3 } );    //provides parent node and origin for rotorGraphic
        unitCircleView.addChild( circleGraphic );

        //Draw 'special angle' locations on unit circle
        //special angles are at 0, 30, 45, 60, 90, 120, 135, 150, 180, -30, ...
        this.specialAnglesNode = new Node();
        var anglesArray = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, -30, -45, -60, -90, -120, -135, -150 ];
        var xPos, yPos; //x and y coordinates of special angle on unit circle
        for (var i = 0; i < anglesArray.length; i++ ){
            xPos = radius*Math.cos( anglesArray[i]*Math.PI/180 );
            yPos = radius*Math.sin( anglesArray[i]*Math.PI/180 );
            this.specialAnglesNode.addChild( new Circle( 5, { stroke:'#000', lineWidth: 1, x: xPos, y: yPos }));
        }
        this.addChild( this.specialAnglesNode );

        //Draw x-, y-axes
        var yAxis = new ArrowNode( 0, 1.2*radius, 0, -1.2*radius, { tailWidth: 2 });//function ArrowNode( tailX, tailY, tipX, tipY, options ) {
        var xAxis = new ArrowNode( -1.2*radius, 0, 1.2*radius, 0, { tailWidth: 2 });//function ArrowNode( tailX, tailY, tipX, tipY, options ) {
        circleGraphic.addChild( yAxis );
        circleGraphic.addChild( xAxis );
        //Draw x-, y-axis labels
        var fontInfo = { font: '25px sans-serif' };
        var xText = new Text( xStr, fontInfo );
        var yText = new Text( yStr, fontInfo );
        xAxis.addChild( xText );
        yAxis.addChild( yText );
        //xText.translation = new Vector2( 1.2*radius - 5 - xText.width, xText.height );
        //yText.translation = new Vector2( -yText.width - 10, -1.2*radius - 10 + yText.height );
        xText.right = 1.2*radius - 3;
        xText.top = 0;
        yText.right = -8;
        yText.top = -1.2*radius - 2;


        //Draw Grid
        var r = radius;
        var gridShape = new Shape();
        gridShape.moveTo( -r, -r );
        gridShape.lineTo( r, -r ).lineTo( r, r ).lineTo( -r, r ).lineTo( -r, -r );
        gridShape.moveTo( -r, -r/2 ).lineTo( r, -r/2 ).moveTo( -r, r/2 ).lineTo( r, r/2 );
        gridShape.moveTo( -r/2, -r ).lineTo( -r/2, r ).moveTo( r/2, -r ).lineTo( r/2, r );
        this.grid = new Path( gridShape, { lineWidth: 2, stroke: '#888' });
        circleGraphic.addChild( this.grid );
        this.grid.visible = false;

        //draw vertical (sine) line on rotor triangle
        var vLine = new Line( 0, 0, 0, -radius, {lineWidth: 3, stroke: '#090'} );
        circleGraphic.addChild( vLine );

        //draw horizontal (cosine) line on rotor triangle
        var hLine = new Line( 0, 0, radius, 0, {lineWidth: 6, stroke: '#00f'} );
        circleGraphic.addChild( hLine );

        //Draw rotor arm
        var rotorWidth = 10
        var rotorGraphic = new Node();                  //Rectangle( 0, -rotorWidth/2, radius, rotorWidth, { fill: '#090', cursor: 'pointer' } );
        rotorGraphic.addChild( new Line( 0,0, radius, 0, { lineWidth: 3, stroke: '#000'} ) );
        rotorGraphic.addChild( new Circle( 7, { stroke: '#000', fill: "red", x: radius, y: 0, cursor: 'pointer' } )) ;
        var hitBound = 30;
        rotorGraphic.mouseArea = new Bounds2( radius - hitBound, -hitBound, radius + hitBound, hitBound ) ; //Bounds2( minX, minY, maxX, maxY )
        circleGraphic.addChild( rotorGraphic );
        //var mouseDownPosition = new Vector2( 0, 0 );   //just for testing

        ////draw horizontal (cosine) arrow
        //var hArrowShape = new Shape();
        //var w1 = 6;
        //var w2 = 8;
        //var hL = 25;
        //hArrowShape.moveTo( 0, w1/2 ).lineTo( 0, -w1/2 ).lineTo( radius- hL, -w1/2 ).lineTo( radius - hL, -w2 );
        //hArrowShape.lineTo( radius, 0 ).lineTo( radius - hL, w2 ).lineTo( radius - hL, w1/2 ).lineTo( 0, w1/2 );
        //var hArrow = new Path( hArrowShape, { fill: '#009'} );
        //circleGraphic.addChild( hArrow );



        var mouseDownPosition = new Vector2( 0, 0 );
        // When dragging, move the sample element
        rotorGraphic.addInputListener( new SimpleDragHandler(
                {
                    // When dragging across it in a mobile device, pick it up
                    allowTouchSnag: true,

                    start: function (e){
                        console.log( 'mouse down' );
                        mouseDownPosition = e.pointer.point;
                        console.log( mouseDownPosition );
                    },

                    drag: function(e){
                        //console.log('drag event follows: ');
                        var v1 =  rotorGraphic.globalToParentPoint( e.pointer.point );   //returns Vector2
                        var angle = -v1.angle();  //model angle is negative of xy coords angle
                        //console.log( 'angle is ' + angle );
                        model.setAngle( angle );
                    }
                } ) );

        //draw angle arc on unit circle
        var r = 0.3*radius;   //arc radius
        var arcShape = new Shape();
        //arcShape.moveTo( r, 0 );
        var angleArcPath = new Path( arcShape, { stroke: '#000', lineWidth: 2} );
        circleGraphic.addChild( angleArcPath );
        var drawAngleArc = function(){
            var arcShape = new Shape();  //This seems wasteful. But there is now Shape.clear() function
            r = 0.3*radius;
            arcShape.moveTo( r, 0 );
            var totalAngle = model.getAngleInRadians();
            if( totalAngle >0 ){
                for( var ang = 0; ang <= totalAngle; ang += 0.02 ){
                    //console.log( 'angle is '+ang );
                    r -= 0.02;
                    arcShape.lineTo( r*Math.cos( ang ), -r*Math.sin( ang ) )
                }
            }else{
                for( ang = 0; ang >= totalAngle; ang -= 0.02 ){
                    //console.log( 'angle is '+ang );
                    r -= 0.02;
                    arcShape.lineTo( r*Math.cos( ang ), -r*Math.sin( ang ) )
                }
            }

            //console.log( 'drawAngleArc called. Angle = '+ model.getAngleInDegrees() );
            angleArcPath.setShape( arcShape );
        };

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            rotorGraphic.rotation = -angle;  //model angle is negative of xy coords angle
            var cos = Math.cos( angle );
            var sin = Math.sin( angle );
            //hArrow.setScaleMagnitude( cos, 1 ) ;
            vLine.x = radius*cos;
            vLine.setPoint2( 0, -radius*sin  );
            hLine.setPoint2( radius*cos, 0 );
            drawAngleArc();
        } );

    }

    return inherit( Node, UnitCircleView );
} );