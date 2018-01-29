class EffectExplosion {

    constructor(x, y, gameTime, color, xVelocity, yVelocity) {
        this.color = color;
        this.x = x;
        this.y = y;

        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;

        this.endTime = gameTime + 12;
        this.size = 0;
        this.alphaScalar = 1;
    }


    render(graphics) {
        let points = this._generatePoints(this.x, this.y);


        this.alphaScalar = 1;
        this._drawLine(points, this.color, 8, .3 * this.alphaScalar, graphics);
        this._drawLine(points, this.color, 16, .2 * this.alphaScalar, graphics);
        this._drawLine(points, 0xffffff, 1, 1 * this.alphaScalar, graphics);
        this._drawLine(points, 0xffffff, 4, .5 * this.alphaScalar, graphics);

        this.size += 3;

        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }

    _drawLine(points, color, width, opacity, graphics) {
        graphics.lineStyle(width, color, opacity);

        for (let i in points) {
            let point = points[i];

            if (i == 0) {
                graphics.moveTo(point.x, point.y);
            } else {
                graphics.lineTo(point.x, point.y);
            }
        }

    }

    _generatePoints(x, y) {
        let points = [];

        let angle = 0;
        let step = .1;

        let prevX = x;
        let prevY = y;

        while (angle < Math.PI * 2) {

            let randomLength = Util.randomInteger(0, this.size);

            let x2 = x + Math.cos(angle) * randomLength;
            let y2 = y + Math.sin(angle) * randomLength;

            points.push({x: x2, y: y2});

            angle += step;
            prevX = x2;
            prevY = y2;

        }

        return points;
    }

    isComplete(gameTime) {
        // console.log('gameTime=' + gameTime);
        // console.log('endTime=' + this.endTime);
        return gameTime > this.endTime;
    }

    _randomInteger(max, min) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}
