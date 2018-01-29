let Graph = {};


Graph.drawGraph = function(points, x, y, width, height, graphics) {


    graphics.lineStyle(1, 0x00ff00);
    graphics.drawRect(x, y, width, height);

    let worstMax = Graph._getMaxPoint(points, 0);
    let averageMax = Graph._getMaxPoint(points, 1);
    let bestMax = Graph._getMaxPoint(points, 2);
    let temp = [];
    temp[0] = [worstMax];
    temp[1] = [averageMax];
    temp[2] = [bestMax];

    let max = Graph._getMaxPoint(temp, 0);


    Graph.graphLine(points, 0, 0xff0000, max, x, y, width, height, graphics);
    Graph.graphLine(points, 1, 0xffffff, max, x, y, width, height, graphics);
    Graph.graphLine(points, 2, 0x00ff00, max, x, y, width, height, graphics);

};

Graph.graphLine = function(points, index, color, max, x, y, width, height, graphics) {

    let offset = width / points.length;


    let pointX = x;
    let pointY = y;


    graphics.lineStyle(2, color, 1);

    for (let i in points) {

        let point = points[i][index];
        //console.log('point=' + point);
        pointY = (y + height) - (point / max) * height;

        if (i == 0) {
            graphics.moveTo(pointX, pointY);
        } else {
            graphics.lineTo(pointX, pointY);
        }

        pointX += offset;
    }


};

/**
 *
 * @param points
 * @returns {number}
 * @private
 */
Graph._getMaxPoint = function(points, index) {

    if (!index) {
        index = 0;
    }

    let maxPoint = -1;
    for (let i in points) {
        let point = points[i][index];

        if (point > maxPoint) {
            maxPoint = point;
        }

    }

    return maxPoint;
};







