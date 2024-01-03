import { Stage } from './stage';
import { ShapeType } from './data/shape/shape';
import { CartesianAxes } from './data/world/cartesian-axes';
import { Projector } from './projector';

var sheet = window.document.styleSheets[0];
sheet.insertRule('.shape--invisible { visibility: hidden;}', sheet.cssRules.length);

const stage = new Stage('main');

const myWorld = new CartesianAxes();
const projector = new Projector(myWorld);

stage.registerShapes(projector.shapes, new Set([ShapeType.CIRCLE, ShapeType.RECTANGLE]));