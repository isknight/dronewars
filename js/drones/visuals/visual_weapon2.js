let Weapon2 = {};

Weapon2._fireWeapon = function (p2, p1, graphics, color) {
    let points = Weapon2._generatePoints(p1, p2, 20);

    if (!color) {
        color = 0xffffff;
    }

    color = 0x66ff55;

    Weapon2._drawLine(p1, p2, points, color, 2, .8, graphics);
    //Weapon2._drawLine(p1, p2, points, color, 6, .3, graphics);
    //Weapon2._drawLine(p1, p2, points, color, 4, .3, graphics);
   // Weapon2._drawLine(p1, p2, points, color, 8, .2, graphics);
    //Weapon2._drawLine(p1, p2, points, 0x00ff00, 4, .6, graphics);
    //Weapon1._drawLine(p1, p2, points, 0xffffff, 9, .4, graphics);
    //Weapon1._drawLine(p1, p2, points, color, 20, .2, graphics);
    // Weapon1._drawLine(p1, p2, points, 0xffffff, 60, .1, graphics);
    //  Weapon1._drawLine(p1, p2, points, color, 40, .1, graphics);
    //Weapon1._drawLine(p1, p2, points, color, 100, .05, graphics);



};


/**
 *
 * @param p1
 * @param p2
 * @returns {Array}
 * @private
 */
Weapon2._generatePoints = function (p1, p2, segments) {
    let points = [];


    let angle = Weapon1._angleBetweenPoints(p1, p2);
    let prevX = p1.x;
    let prevY = p1.y;

    let distance = Weapon1._distanceBetweenPoints({x: prevX, y: prevY}, p2);


    let length = distance / segments;
    // console.log('angle=' + angle);

    //  angle = .162;


    let mutation = 1;

    let giveUp = 100;

    while (distance > length && giveUp >= 0) {
    //for (let i = 0; i <= segments; i++) {
        let randomAngleMutator = Util.randomInteger(0, mutation);
        //  length = Util.randomInteger(1, 10);
        randomAngleMutator -= (mutation / 2);
        randomAngleMutator = randomAngleMutator / 100;
        //andomAngleMutator = 0;

        let x2 = prevX + Math.cos(angle + randomAngleMutator) * length;
        let y2 = prevY + Math.sin(angle + randomAngleMutator) * length;
        prevX = x2;
        prevY = y2;

        angle = Weapon1._angleBetweenPoints({x: x2, y: y2}, p2);
        distance = Weapon1._distanceBetweenPoints({x: prevX, y: prevY}, p2);

        points.push({x: x2, y: y2});
        giveUp--;
    }

    return points;
};


/**
 *
 * @param p1
 * @param p2
 * @param points
 * @private
 */
Weapon2._drawLine = function (p1, p2, points, color, width, opacity, graphics) {

    graphics.moveTo(p1.x, p1.y);


    let segmenter = 0;
    let SEGMENT_DISTANCE = 8;
    let BLACK_SEGMENT_DISTANCE = 5;

    let ticker = 100;
    let tickerOffset = ticker / SEGMENT_DISTANCE;


    let offset = new Date().getTime() % ticker;
    offset = offset / tickerOffset;
    segmenter = offset;

    for (let i in points) {
        let point = points[i];

        if (segmenter < SEGMENT_DISTANCE) {
            graphics.lineStyle(width, 0x000000, 2);
            graphics.lineTo(point.x, point.y);

        } else {
            graphics.lineStyle(width, color, opacity);
            graphics.lineTo(point.x, point.y);

        }

        if (segmenter > SEGMENT_DISTANCE) {
            segmenter = 0;
        }

        segmenter += 1;
    }

    graphics.lineTo(p2.x, p2.y);
};

Weapon2._angleBetweenPoints = function (p1, p2) {
    return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 360 / Math.PI) / 100;
};

Weapon2._distanceBetweenPoints = function (p1, p2) {
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
};







