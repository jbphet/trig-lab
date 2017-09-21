// Copyright 2015-2017, University of Colorado Boulder

/**
 * Node for the spiral in Trig Tour.  The spiral in this sim grows with the angle of the simulation.
 *
 * @author Jesse Greenberg
 * @author Michael Dubson (PhET developer) on 6/2/2015
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );
  var Util = require( 'DOT/Util' );

  //images
  var clockwiseSpiralImage = require( 'mipmap!TRIG_TOUR/clockwise-spiral.png' );
  var counterClockwiseSpiralImage = require( 'mipmap!TRIG_TOUR/counter-clockwise-spiral.png' );

  /**
   * Constructor.
   * @param {TrigTourModel} trigTourModel
   * @param {number} initialRadius - initial radius of the spiral
   * @param {number} spiralAngle - total angle of the spiral shape
   * @param {Object} [options]
   * @constructor
   */
  function TrigTourSpiralNode( trigTourModel, initialRadius, spiralAngle, options ) {
    options = _.extend( {
      stroke: 'black',
      arrowHeadColor: 'black',
      arrowHeadLineWidth: 1,
      lineWidth: 2,
      preventFit: true
    }, options );

    Node.call( this, options );
    var self = this;

    // watch the current radius which points to the end point of the spiral
    this.endPointRadius = initialRadius; // @private
    this.initialRadius = initialRadius; // @private

    // draw an arrow head which will be placed at the outer end of the spiral
    var arrowHeadShape = new Shape();
    var arrowHeadWidth = 7;
    var arrowHeadLength = 12;    //arrow head length
    arrowHeadShape.moveTo( 0, 0 )
      .lineTo( -arrowHeadWidth / 2, arrowHeadLength )
      .lineTo( arrowHeadWidth / 2, arrowHeadLength )
      .close();
    this.angleArcArrowHead = new Path( arrowHeadShape, {
      lineWidth: options.arrowHeadLineWidth,
      fill: options.arrowHeadColor
    } );

    //------------------------------------------------------------------------------------------------------------------
    /**
     * The following code is used to generate the spiral images used in this sim.
     *
     * The spiral path causes the simulation to perform poorly on tablets.  The path is then converted to an image with
     * Node.toImage().  Rendering the image causes a very long load time, so the rendered image was saved under
     * trig-tour/images so that it could be pulled from the image plugin.
     *
     * For more information, see https://github.com/phetsims/trig-tour/issues/62
     */

    // // draw the spiral with gradually increasing radius
    // var arcShape = new Shape();
    // arcShape.moveTo( this.endPointRadius, 0 ); // initial position of the spiral
    // var totalAngle = trigTourModel.getFullAngleInRadians();

    // // if the total angle is less than 0.5 radians, delta should be smaller for smoother lines
    // var deltaAngle = 0.1;
    // if ( Math.abs( totalAngle ) < 0.5 ) {
    //   deltaAngle = 0.02;
    // }

    // // approximate the spiral shape with line segments
    // var angle = 0;
    // if ( spiralAngle > 0 ) {
    //   for ( angle = 0; angle <= spiralAngle; angle += deltaAngle ) {
    //     if ( Math.abs( totalAngle ) < 0.5 ) {
    //       deltaAngle = 0.02;
    //     }
    //     this.endPointRadius += deltaAngle;
    //     arcShape.lineTo( this.endPointRadius * Math.cos( angle ), -this.endPointRadius * Math.sin( angle ) );
    //   }
    // }
    // else {
    //   for ( angle = 0; angle >= spiralAngle; angle -= deltaAngle ) {
    //     if ( Math.abs( totalAngle ) < 0.5 ) {
    //       deltaAngle = 0.02;
    //     }

    //     this.endPointRadius += deltaAngle;
    //     arcShape.lineTo( this.endPointRadius * Math.cos( angle ), -this.endPointRadius * Math.sin( angle ) );
    //   }
    // }

    // // apply the shape to a path, scaling it up for good resolution in the following image conversion
    // var imageScale = 3;
    // var spiralPath = new Path( arcShape, _.extend( { scale: imageScale }, options ) );

    // // convert the path to an image as a performance optimization
    // spiralPath.toImage( function( image, x, y ) {
    //   var spiralImage = new Image( image, { x: -x, y: -y } );
    //   spiralImage.scale( 1 / imageScale, 1 / imageScale, true );
    //   thisNode.children = [ spiralImage, thisNode.angleArcArrowHead ];
    //   console.log( image );
    // } );
    //------------------------------------------------------------------------------------------------------------------

    // apply the correct dimage to the node, generated by the code above
    // the image coordiniates are off after render, normalize and fix with offsets by visual inspection
    var imageScale = 3; // image was scaled by 3 in node.toImage
    var imageOffset = 1.6; // correct for small offset generated by saved image
    var spiralImage;
    var xImageOffset;
    var yImageOffset;
    if( spiralAngle > 0 ) {
      spiralImage = counterClockwiseSpiralImage;
      xImageOffset = -imageOffset;
      yImageOffset = imageOffset;
    }
    else {
      spiralImage = clockwiseSpiralImage;
      xImageOffset = -imageOffset;
      yImageOffset = -imageOffset;
    }
    var spiralImageNode = new Image( spiralImage );
    spiralImageNode.scale( 1 / imageScale, 1 / imageScale, true );

    spiralImageNode.x = -spiralImageNode.width / 2 + xImageOffset;
    spiralImageNode.y = -spiralImageNode.height / 2 + yImageOffset;

    this.children = [ spiralImageNode, self.angleArcArrowHead ];

    // update the position of the arrow node whenever the full model angle changes
    trigTourModel.fullAngleProperty.link( function( fullAngle ) {
      self.updateEndPointRadius( fullAngle );
      self.updateClipArea( fullAngle );
      self.updateArrowHead( fullAngle );
    } );
  }

  trigTour.register( 'TrigTourSpiralNode', TrigTourSpiralNode );

  return inherit( Node, TrigTourSpiralNode, {

    updateArrowHead: function( fullAngle ) {
      // show arrow head on angle arc if angle is > 45 degrees
      this.angleArcArrowHead.visible = Math.abs( fullAngle ) > Util.toRadians( 45 );

      // position the arrow head
      this.angleArcArrowHead.x = this.endPointRadius * Math.cos( fullAngle );
      this.angleArcArrowHead.y = -this.endPointRadius * Math.sin( fullAngle );
      // orient arrow head on angle arc correctly
      if ( fullAngle < 0 ) {
        this.angleArcArrowHead.rotation = Math.PI - fullAngle - ( 6 / this.endPointRadius );
      }
      else {
        this.angleArcArrowHead.rotation = -fullAngle + ( 6 / this.endPointRadius );
      }
    },

    updateEndPointRadius: function( fullAngle ) {
      this.endPointRadius = this.initialRadius;
      var deltaAngle;
      var angle;
      if ( Math.abs( fullAngle ) < 0.5 ) {
        deltaAngle = 0.02;
      }
      else {
        deltaAngle = 0.1;
      }
      if ( fullAngle > 0 ) {
        for ( angle = 0; angle <= fullAngle; angle += deltaAngle ) {
          this.endPointRadius += deltaAngle;
        }
      }
      else {
        for ( angle = 0; angle >= fullAngle; angle -= deltaAngle ) {
          this.endPointRadius += deltaAngle;
        }
      }
    },

    /**
     * The clip area is a single loop of the spiral offset by a small amount to include the largest rotation of the full
     * spiral shape for the given angle.  Updating the clip area shape is a performance enhancement for redrawing
     * the entire spiral shape every frame.
     *
     * @param fullAngle
     */
    updateClipArea: function( fullAngle ) {

      var clipShape = new Shape();

      // We'll build the clip shape with two arc segments. We need to compute the radius on each to be the average of
      // the equivalent spiral's starting and ending radii. We'll start at r0 and end at r1, so by drawing two arcs,
      // we'll have a radius in the middle of rHalf.
      var r0 = this.endPointRadius - 2.5;
      var r1 = r0 + Math.PI * 2;
      var rHalf = ( r0 + r1 ) / 2;

      // The first arc's radius should be the average of its starting radius (r0) and ending radius (rHalf).
      var firstRadius = ( r0 + rHalf ) / 2;

      // The offset of the arc's center from the spiral's center, in the direction of fullAngle, such that our first
      // arc will go from magnitude-angle pairs of (r0,fullAngle) to (rHalf,fullAngle+pi).
      var firstOffset = ( r0 - rHalf ) / 2;

      // The second arc's radius should be the average of its starting radius (rHalf) and ending radius (r1).
      var secondRadius = ( rHalf + r1 ) / 2;

      // The offset of the arc's center from the spiral's center, in the direction of fullAngle, such that our first
      // arc will go from magnitude-angle pairs of (rHalf,fullAngle+pi) to (r1,fullAngle+2pi).
      var secondOffset = ( r1 - rHalf ) / 2;

      // Because the angle is in the mathematical coordinate frame, we need to negate it so that it represents the angle
      // in our graphical coordinate frame, where the Y axis is flipped in direction (thus requiring the opposite angle).
      fullAngle = -fullAngle;

      // Based on the direction of the spiral, we need to modify the angles and whether the arcs are anticlockwise.
      var angle0;
      var angleHalf;
      var angle1;
      var anticlockwise;
      if ( fullAngle < 0 ) {
        angle0 = fullAngle;
        angleHalf = fullAngle + Math.PI;
        angle1 = fullAngle + 2 * Math.PI;
        anticlockwise = true;
      }
      else {
        angle0 = fullAngle + 2 * Math.PI;
        angleHalf = fullAngle + Math.PI;
        angle1 = fullAngle;
        anticlockwise = false;
      }

      clipShape.arc( firstOffset * Math.cos( fullAngle ), firstOffset * Math.sin( fullAngle ),
                     firstRadius, angle0, angleHalf, anticlockwise );
      clipShape.arc( secondOffset * Math.cos( fullAngle ), secondOffset * Math.sin( fullAngle ),
                     secondRadius, angleHalf, angle1, anticlockwise );

      clipShape.close();
      this.clipArea = clipShape;
    }
  } );
} );