import { Rectangle } from './data/shapes/rectangle';
import { Shapes, Collection } from './data/shapes/shapes';
import { Subscription } from 'rxjs';
import { select, Selection } from 'd3';
import { Circle } from './data/shapes/circle';
import { Shape, ShapeType } from './data/shapes/shape';

export class Stage {
    
    private width: number;
    private height: number;
    // private svgg: Selection<SVGSVGElement, unknown, HTMLElement, any>;
    private svgg: Selection<SVGGElement, unknown, HTMLElement, any>;

    private subscriptions = new Map<string, Subscription>();
    private created: Set<string> = new Set();

    constructor(divId: string) {

        const elem = document.getElementById(divId);
        this.width = elem?.clientWidth ? elem.clientWidth : 0;
        this.height = elem?.clientHeight ? elem.clientHeight : 0;

        this.svgg = select(`#${divId}`)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
                .append('g')
                .attr('transform', 'translate(.5, .5)');
    }

    registerShapes(shapes: Shapes, drawOrder: Set<ShapeType>) {
        this.subscriptions.set(shapes.id, shapes.collection$.subscribe((update) => {
            this.created.has(shapes.id)
                ? this.updateShapes(shapes.id, update)
                : this.createShapes(shapes.id, update, drawOrder);
        }));
    }

    unregisterShapes(id: string) {
        this.removeShapes(id);
        if (this.subscriptions.has(id)) {
            this.subscriptions.get(id)?.unsubscribe();
            this.subscriptions.delete(id);
        }
        this.created.delete(id);
    }

    private createShapes(id: string, collection: Collection, drawOrder: Set<ShapeType>) {
        console.log('#createShapes', { id, collection });
        drawOrder.forEach((type: ShapeType) => {
            switch (type) {
                case ShapeType.CIRCLE:
                    this.createCircles(id, collection.circles);
                    break;
                case ShapeType.RECTANGLE:
                    this.createRectangles(id, collection.rectangles);
                    break;
            }
        });
        this.created.add(id);
    }

    private updateShapes(id: string, collection: Collection) {
        // console.trace('#updateShapes', id);
        this.updateCircles(id, collection.circles);
        this.updateRectangles(id, collection.rectangles);
        this.created.add(id);
    }

    private createCircles(id: string, circles: Array<Shape>) {
        console.log('#createCircles', { id: id, length: circles.length });
        const type = ShapeType.CIRCLE;
        this.svgg.selectAll(`${type}.${id}`)
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
        
        this.created.add(id);
    }

    private updateCircles(id: string, circles: Array<Shape>) {
        const type = ShapeType.CIRCLE;
        this.svgg.selectAll(`${type}.${id}`)
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
    
    private createRectangles(id: string, rectangles: Array<Shape>) {
        console.log('#createRectangles', { id: id, length: rectangles.length });
        const type = ShapeType.RECTANGLE;
        this.svgg.selectAll(`${type}.${id}`)
            .data(rectangles as Array<Rectangle>)
            .enter()
            .append(type)
            .attr('id', (d: Shape) => d.id)
            .classed(id, true)
            .style('stroke-width', (d: Rectangle) => d.style.strokeWidth)
            .style('stroke', (d: Rectangle) => d.style.stroke)
            .style('stroke-opacity', (d: Rectangle) => d.style.strokeOpacity)      
            .style('fill', (d: Rectangle) => d.style.fill)
            .style('fill-opacity', (d: Rectangle) => d.style.fillOpacity)
            .attr('x', (d: Rectangle) => d.attr.x)
            .attr('y', (d: Rectangle) => d.attr.y)
            .attr('width', (d: Rectangle) => d.attr.w)
            .attr('height', (d: Rectangle) => d.attr.h);
        
        this.created.add(id);
    }

    private updateRectangles(id: string, rectangles: Array<Shape>) {
        const type = ShapeType.RECTANGLE;
        this.svgg.selectAll(`${type}.${id}`)
            .data(rectangles as Array<Rectangle>)
            .classed('shape--invisible', (d: Shape) => !d.isVisible)
            .style('stroke-width', (d: Rectangle) => d.style.strokeWidth)
            .style('stroke', (d: Rectangle) => d.style.stroke)
            .style('stroke-opacity', (d: Rectangle) => d.style.strokeOpacity)      
            .style('fill', (d: Rectangle) => d.style.fill)
            .style('fill-opacity', (d: Rectangle) => d.style.fillOpacity)
            .attr('x', (d: Rectangle) => d.attr.x)
            .attr('y', (d: Rectangle) => d.attr.y)
            .attr('width', (d: Rectangle) => d.attr.w)
            .attr('height', (d: Rectangle) => d.attr.h);
    }

    private removeShapes(id: string) {
        this.svgg.selectAll(`.${id}`).remove();
    }
}