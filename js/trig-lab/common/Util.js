/**
 * Color constants
 * Created by Dubson on 6/16/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var Bounds2 = require( 'DOT/Bounds2' );

    return {
        // layout bounds used throughout the simulation for laying out the screens
        LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 464 ),
        BACKGROUND_COLOR: '#99ff66', //'#FFFF99', //'#FFECB3',  //'#EFE', //
        VIEW_BACKGROUND_COLOR: '#FFF', //'#EFE', //'#FFD',//'#FEC',
        TEXT_COLOR: '#000',
        TEXT_COLOR_GRAY: '#AAA',
        LINE_COLOR: '#000',
        PANEL_COLOR: '#EEE', //'#FFD9B3',  //
        SIN_COLOR: '#0C0',
        COS_COLOR: '#00D',
        TAN_COLOR: '#F00'
    };
} );