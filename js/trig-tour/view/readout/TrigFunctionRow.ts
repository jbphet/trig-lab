// Copyright 2025, University of Colorado Boulder

/**
 * Live readout of the trig function with its fraction and value.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Node, ReadingBlock } from '../../../../../scenery/js/imports.js';
import trigTour from '../../../trigTour.js';
import TrigTourModel from '../../model/TrigTourModel.js';
import ViewProperties from '../ViewProperties.js';
import LabelFractionValueRow from './LabelFractionValueRow.js';

export default class TrigFunctionRow extends ReadingBlock( Node ) {
  public constructor( model: TrigTourModel, viewProperties: ViewProperties, maxPanelWidth: number ) {

    const sinLabelFractionValueRow = new LabelFractionValueRow( 'sin', model, viewProperties );
    const cosLabelFractionValueRow = new LabelFractionValueRow( 'cos', model, viewProperties );
    const tanLabelFractionValueRow = new LabelFractionValueRow( 'tan', model, viewProperties );

    super( {
      children: [ sinLabelFractionValueRow, cosLabelFractionValueRow, tanLabelFractionValueRow ],
      maxWidth: maxPanelWidth
    } );

    // Synchronize visibility properties with the view
    viewProperties.graphProperty.link( graph => {
      sinLabelFractionValueRow.visible = ( graph === 'sin' );
      cosLabelFractionValueRow.visible = ( graph === 'cos' );
      tanLabelFractionValueRow.visible = ( graph === 'tan' );
    } );

    // voicing
    this.readingBlockNameResponse = 'Trig Function Row';
  }
}

trigTour.register( 'TrigFunctionRow', TrigFunctionRow );