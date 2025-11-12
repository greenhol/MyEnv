import { select, Selection } from 'd3';
import { Circle } from './data/shape/circle';
import { Path } from './data/shape/path';
import { Shape, ShapeType } from './data/shape/shape';
import { Collection, Shapes } from './data/shape/shapes';
import { SerialSubscriptions } from './utils/serial-subscriptions';

export class Stage {

    private _width: number;
    private _height: number;
    // private svgg: Selection<SVGSVGElement, unknown, HTMLElement, any>;
    private _svgg: Selection<SVGGElement, unknown, HTMLElement, any>;

    private _subscriptions = new SerialSubscriptions();
    private _created: Set<string> = new Set();

    constructor(divId: string) {

        const elem = document.getElementById(divId);
        this._width = elem?.clientWidth ? elem.clientWidth : 0;
        this._height = elem?.clientHeight ? elem.clientHeight : 0;

        this._svgg = select(`#${divId}`)
            .append('svg')
            .attr('width', this._width)
            .attr('height', this._height)
            .append('g')
            .attr('transform', 'translate(.5, .5)');
    }

    registerShapes(shapes: Shapes, drawOrder: Set<ShapeType>) {
        this._subscriptions.set(shapes.id, shapes.collection$.subscribe((update) => {
            this._created.has(shapes.id)
                ? this.updateShapes(shapes.id, update)
                : this.createShapes(shapes.id, update, drawOrder);
        }));
    }

    unregisterShapes(id: string) {
        this.removeShapes(id);
        this._subscriptions.unsubscribe(id);
        this._created.delete(id);
    }

    private createShapes(id: string, collection: Collection, drawOrder: Set<ShapeType>) {
        console.log('#createShapes', { id, collection });
        drawOrder.forEach((type: ShapeType) => {
            switch (type) {
                case ShapeType.CIRCLE:
                    this.createCircles(id, collection.circles);
                    break;
                case ShapeType.PATH:
                    this.createPaths(id, collection.paths);
                    break;
            }
        });
        this._created.add(id);
    }

    private updateShapes(id: string, collection: Collection) {
        // console.trace('#updateShapes', id);
        this.updateCircles(id, collection.circles);
        this.updatePaths(id, collection.paths);
        this._created.add(id);
    }

    private createCircles(id: string, circles: Array<Shape>) {
        console.log('#createCircles', { id: id, length: circles.length });
        const type = ShapeType.CIRCLE;
        this._svgg.selectAll(`${type}.${id}`)
            .data(circles as Array<Circle>)
            .enter()
            .append(type)
            .attr('id', (d: Circle) => d.id)
            .classed(id, true)
            .style('stroke-width', (d: Circle) => d.style.strokeWidth)
            .style('stroke', (d: Circle) => d.style.stroke)
            .style('stroke-opacity', (d: Circle) => d.style.strokeOpacity)
            .style('fill', (d: Circle) => d.style.fill)
            .style('fill-opacity', (d: Circle) => d.style.fillOpacity)
            .attr('cx', (d: Circle) => d.attr.cx)
            .attr('cy', (d: Circle) => d.attr.cy)
            .attr('r', (d: Circle) => d.attr.r);

        this._created.add(id);
    }

    private updateCircles(id: string, circles: Array<Shape>) {
        const type = ShapeType.CIRCLE;
        this._svgg.selectAll(`${type}.${id}`)
            .data(circles as Array<Circle>)
            .classed('shape--invisible', (d: Shape) => !d.isVisible)
            .style('stroke-width', (d: Circle) => d.style.strokeWidth)
            .style('stroke', (d: Circle) => d.style.stroke)
            .style('stroke-opacity', (d: Circle) => d.style.strokeOpacity)
            .style('fill', (d: Circle) => d.style.fill)
            .style('fill-opacity', (d: Circle) => d.style.fillOpacity)
            .attr('cx', (d: Circle) => d.attr.cx)
            .attr('cy', (d: Circle) => d.attr.cy)
            .attr('r', (d: Circle) => d.attr.r);
    }

    private createPaths(id: string, paths: Array<Shape>) {
        console.log('#createPaths', { id: id, length: paths.length });
        const type = ShapeType.PATH;
        this._svgg.selectAll(`${type}.${id}`)
            .data(paths as Array<Path>)
            .enter()
            .append(type)
            .attr('id', (d: Path) => d.id)
            .classed(id, true)
            .style('fill', 'none')
            .style('stroke-width', (d: Path) => d.style.strokeWidth)
            .style('stroke', (d: Path) => d.style.stroke)
            .style('stroke-opacity', (d: Path) => d.style.strokeOpacity)
            .attr('d', (d: Path) => d.attr.d);

        this._created.add(id);
    }

    private updatePaths(id: string, paths: Array<Shape>) {
        const type = ShapeType.PATH;
        this._svgg.selectAll(`${type}.${id}`)
            .data(paths as Array<Path>)
            .classed('shape--invisible', (d: Shape) => !d.isVisible)
            .style('stroke-width', (d: Path) => d.style.strokeWidth)
            .style('stroke', (d: Path) => d.style.stroke)
            .style('stroke-opacity', (d: Path) => d.style.strokeOpacity)
            .attr('d', (d: Path) => d.attr.d);
    }

    private removeShapes(id: string) {
        this._svgg.selectAll(`.${id}`).remove();
    }
}