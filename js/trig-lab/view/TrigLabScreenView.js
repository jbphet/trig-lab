// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */
define( function ( require ) {
    'use strict';

    // modules
    var ControlPanel = require( 'TRIG_LAB/trig-lab/view/ControlPanel' );
    var inherit = require( 'PHET_CORE/inherit' );
    var ScreenView = require( 'JOIST/ScreenView' );
    var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
    var UnitCircleView = require( 'TRIG_LAB/trig-lab/view/UnitCircleView' );
    var ReadoutDisplay = require( 'TRIG_LAB/trig-lab/view/ReadoutDisplay' );
    var GraphView = require( 'TRIG_LAB/trig-lab/view/GraphView' );
    var ViewProperties = require( 'TRIG_LAB/trig-lab/view/ViewProperties' );

    /**
     * @param {TrigLabModel} trigLabModel
     * @constructor
     */
    function TrigLabScreenView( trigLabModel ) {

        ScreenView.call( this );
        var trigLabScreenView = this;
        this.labelsVisible = false;  //set by Control Panel

        // Create and add the Reset All Button in the bottom right, which resets the model
        var resetAllButton = new ResetAllButton( {
            listener: function () {
                trigLabModel.reset();
            },
            right: this.layoutBounds.maxX - 10,
            bottom: this.layoutBounds.maxY - 10
        } );
        this.addChild( resetAllButton );

        var viewProperties = new ViewProperties();
        var unitCircleView = new UnitCircleView( trigLabModel );
        var readoutDisplay = new ReadoutDisplay( trigLabModel, viewProperties );
        var graphView = new GraphView( trigLabModel, 0.25*this.layoutBounds.height, 0.8*this.layoutBounds.width );
        var controlPanel = new ControlPanel( viewProperties );
        this.addChild( unitCircleView );
        //this.addChild( readOutView );
        this.addChild( readoutDisplay );
        this.addChild( graphView );
        this.addChild( controlPanel );

        //Layout children Views
        unitCircleView.x = this.layoutBounds.centerX;
        unitCircleView.top = this.layoutBounds.top + 20;
        //readOutView.left = this.layoutBounds.left + 30 ;
        //readOutView.top = 30;
        readoutDisplay.left = this.layoutBounds.left + 30 ;
        readoutDisplay.top = 30;
        graphView.x = this.layoutBounds.centerX;
        graphView.y = this.layoutBounds.bottom - graphView.axesNode.bottom - 15;
        controlPanel.right = this.layoutBounds.right - 30;
        controlPanel.top = this.layoutBounds.top + 30;
        //console.log( 'layoutBounds = '+this.layoutBounds );

        viewProperties.graphProperty.link( function( graph ) {
            graphView.trigFunction = graph;
            graphView.cosPath.visible = ( graph === 'cos' );
            graphView.sinPath.visible = ( graph === 'sin' );
            graphView.tanPath.visible = ( graph === 'tan' );
            graphView.sinThetaLabel.visible = ( graph === 'sin' );
            graphView.cosThetaLabel.visible = ( graph === 'cos' );
            graphView.tanThetaLabel.visible = ( graph === 'tan' );
            graphView.setIndicatorLine();
            readoutDisplay.readoutNode.setTrigRowVisibility( graph );
        } );

        viewProperties.labelsVisibleProperty.link( function( isVisible ){
            trigLabScreenView.labelsVisible = isVisible;
            unitCircleView.setLabelVisibility( isVisible );
            if( isVisible ){
                graphView.tickMarkLabelsInRadians.visible = readoutDisplay.readoutNode.radiansDisplayed;
                graphView.tickMarkLabelsInDegrees.visible = !readoutDisplay.readoutNode.radiansDisplayed;
            }else{
                graphView.tickMarkLabelsInRadians.visible = false;
                graphView.tickMarkLabelsInDegrees.visible = false;
            }
        });

        viewProperties.gridVisibleProperty.link( function( isVisible ){
            unitCircleView.grid.visible = isVisible;
        });

        viewProperties.angleUnitsProperty.link ( function( units ){
            readoutDisplay.readoutNode.radiansDisplayed = ( units === 'radians');
            readoutDisplay.readoutNode.setUnits( units );
            if( trigLabScreenView.labelsVisible ){
                graphView.tickMarkLabelsInRadians.visible = ( units === 'radians');
                graphView.tickMarkLabelsInDegrees.visible = !( units === 'radians');
            }

            //readOutView.setUnits( units );
        });

        viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ){
            unitCircleView.specialAnglesNode.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.specialAnglesOnly = specialAnglesVisible;
            trigLabModel.specialAnglesMode = specialAnglesVisible;
            //select correct readouts for visibility
            readoutDisplay.readoutNode.sinReadoutFraction.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.cosReadoutFraction.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.tanReadoutFraction.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.sinReadoutText.visible = !specialAnglesVisible;
            readoutDisplay.readoutNode.cosReadoutText.visible = !specialAnglesVisible;
            readoutDisplay.readoutNode.tanReadoutText.visible = !specialAnglesVisible;

            if( specialAnglesVisible ){
                var currentSmallAngle = trigLabModel.getSmallAngleInRadians();
                trigLabModel.setSpecialAngle( currentSmallAngle );
                readoutDisplay.readoutNode.setAngleReadoutPrecision( 0 );     //integer display of special angles: 0, 30, 45, etc
            }else{
                readoutDisplay.readoutNode.setAngleReadoutPrecision( 1 );     //1 decimal place precision for continuous angles.setAngleReadoutPrecision( 1 );     //1 decimal place precision for continuous angles
            }
        });

    }

    return inherit( ScreenView, TrigLabScreenView, {} );
} );