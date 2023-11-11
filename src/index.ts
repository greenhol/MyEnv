import { Shapes } from './data/shapes/shapes';
import { interval, take, timer } from 'rxjs';
import { Stage } from './stage';
import { Circle } from './data/shapes/circle';
import { Rectangle } from './data/shapes/rectangle';
import { ShapeType } from './data/shapes/shape';
import { getRandomColor, getRandomGray, getRandomRed } from './utils/random';

var sheet = window.document.styleSheets[0];
sheet.insertRule('.shape--invisible { visibility: hidden;}', sheet.cssRules.length);

const stage = new Stage('main');

const myShapes = new Shapes(
    'MyShapes', {
        circles: [
            new Circle(250, 200, 60),
            new Circle(550, 200, 40),
            new Circle(250, 400, 40),
            new Circle(550, 400, 60),
        ],
        rectangles: [
            new Rectangle(50, 50, 300, 200),
            new Rectangle(450, 50, 300, 200),
            new Rectangle(50, 350, 300, 200),
            new Rectangle(450, 350, 300, 200),
        ]
    }
);

const myShapes2 = new Shapes(
    'MyShapes2', {
        circles: [
            new Circle(100, 100, 30),
            new Circle(200, 100, 20),
            new Circle(300, 100, 30),
            new Circle(400, 100, 20),
            new Circle(500, 100, 30),
            new Circle(600, 100, 20),
            new Circle(700, 100, 30),

            new Circle(100, 200, 20),
            new Circle(200, 200, 30),
            new Circle(300, 200, 20),
            new Circle(400, 200, 30),
            new Circle(500, 200, 20),
            new Circle(600, 200, 30),
            new Circle(700, 200, 20),

            new Circle(100, 300, 30),
            new Circle(200, 300, 20),
            new Circle(300, 300, 30),
            new Circle(400, 300, 20),
            new Circle(500, 300, 30),
            new Circle(600, 300, 20),
            new Circle(700, 300, 30),

            new Circle(100, 400, 20),
            new Circle(200, 400, 30),
            new Circle(300, 400, 20),
            new Circle(400, 400, 30),
            new Circle(500, 400, 20),
            new Circle(600, 400, 30),
            new Circle(700, 400, 20),

            new Circle(100, 500, 30),
            new Circle(200, 500, 20),
            new Circle(300, 500, 30),
            new Circle(400, 500, 20),
            new Circle(500, 500, 30),
            new Circle(600, 500, 20),
            new Circle(700, 500, 30),
        ],
        rectangles: [],
    }
);

startInterval();

function startInterval() {

    stage.registerShapes(myShapes, new Set([ShapeType.CIRCLE, ShapeType.RECTANGLE]));
    stage.registerShapes(myShapes2, new Set([ShapeType.CIRCLE]));

    interval(100)
    .pipe(
        take(100)
    )
    .subscribe({
        next: () => {
            myShapes.update((shapes) => {
                shapes.circles.forEach((circle) => {
                    circle.move(Math.round((Math.random() - 0.5) * 4), Math.round((Math.random() - 0.5) * 4), Math.round((Math.random() - 0.5) * 8));
                    circle.style.stroke = getRandomColor();
                    circle.style.fill = getRandomColor();
                    circle.setVisible(Math.round(Math.random()*0.75) == 0);
                });
                shapes.rectangles.forEach((rectangle) => {
                    rectangle.move(Math.round((Math.random() - 0.5) * 8), Math.round((Math.random() - 0.5) * 8));
                    rectangle.style.stroke = getRandomRed();
                    rectangle.style.fill = getRandomRed();
                    rectangle.setVisible(Math.round(Math.random()*0.75) == 0);
                });
            });
            myShapes2.update((shapes) => {
                shapes.circles.forEach((circle) => {
                    circle.move(Math.round((Math.random() - 0.5) * 4), Math.round((Math.random() - 0.5) * 4), Math.round((Math.random() - 0.5) * 8));
                    circle.style.stroke = getRandomGray();
                    circle.style.fill = getRandomGray();
                    circle.setVisible(Math.round(Math.random()*0.75) == 0);
                });
            });
        },
        complete: () => {
            console.log('DONE');
            myShapes.update((shapes) => {
                shapes.circles[0].setPosition(0, 0, 80);
                shapes.circles[0].setVisible(true);
                shapes.circles[1].setPosition(800, 0, 120);
                shapes.circles[1].setVisible(true);
                shapes.circles[2].setPosition(0, 600, 120);
                shapes.circles[2].setVisible(true);
                shapes.circles[3].setPosition(800, 600, 80);
                shapes.circles[3].setVisible(true);
                shapes.rectangles[0].setPosition(50, 50);
                shapes.rectangles[0].setVisible(true);
                shapes.rectangles[1].setPosition(450, 50);
                shapes.rectangles[1].setVisible(true);
                shapes.rectangles[2].setPosition(50, 350);
                shapes.rectangles[2].setVisible(true);
                shapes.rectangles[3].setPosition(450, 350);
                shapes.rectangles[3].setVisible(true);
            });
            stage.unregisterShapes(myShapes2.id);
            timer(5000).subscribe(() => {
                stage.unregisterShapes(myShapes.id);

                timer(5000).subscribe(() => {
                    startInterval();
                });
            });
        }
    });
}
