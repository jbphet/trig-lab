// Copyright 2002-2015, University of Colorado Boulder

/**
 * Color constants used in trig-tour
 *
 * Created by Michael Dubson (PhET developer) on 6/16/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  return {
    BACKGROUND_COLOR: '#fff6cc',
    VIEW_BACKGROUND_COLOR: '#FFF',
    TEXT_COLOR: '#000',
    TEXT_COLOR_GRAY: '#AAA',
    LINE_COLOR: '#000',
    PANEL_COLOR: '#f9f9f9',
    SIN_COLOR: '#008700',  // color-blind green
    COS_COLOR: '#00D',     // normal blue
    TAN_COLOR: PhetColorScheme.RED_COLORBLIND
  };
} );