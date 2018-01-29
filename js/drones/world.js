/**
 * Basic container for all entities
 */
class World {

    constructor(width, height, game, graphics) {

        /**
         * random
         * genome
         * @type {string}
         */

        this.game = game;
        this.entities = [];
        this.width = width;
        this.height = height;
        this.graphics = graphics;
        this.gameTime = 0;
        this.effects = [];
        this.pools = [];
        this._setupBackground();
        if (DroneConfig.ENABLE_HEALTH_POOLS) {
            this._initPools();
        }
    }

    _initPools() {
        this.pools.push(new Pool('red-pool1', 50, this.height - 50, this, 'b'));
        this.pools.push(new Pool('blue-pool1', this.width - 50, 50, this, 'r'));
        this.pools.push(new Pool('red-pool2', 50, 50, this, 'b'));
        this.pools.push(new Pool('blue-pool2', this.width - 50, this.height - 50, this, 'r'));
    }

    reset() {
        this.effects = [];

        let i = this.pools.length;
        while (i--) {
            this.pools[i].hpReserve = DroneConfig.POOL_MAX_HP_RESERVE;
        }
    }


    render() {

        //draw border
        this.graphics.lineStyle(5, 0xFF0000);
        this.graphics.drawRect(0, 0, this.width, this.height);

        this._renderBackground();

        let graphics = this.graphics;

        let i = this.entities.length;
        while (i--) {
            this.entities[i].render(graphics);
        }

        i = this.pools.length;
        while (i--) {
            this.pools[i].render(graphics);
        }

        this._renderEffects();
    }

    run() {

        let i = this.entities.length;
        while (i--) {
            this.entities[i].run();
        }

        i = this.pools.length;
        while (i--) {
            this.pools[i].run();
        }
    }


    _setupBackground() {

        this.stars = [];

        let i = 50;
        while (i--) {
            let x = Util.randomInteger(0, this.width);
            let y = Util.randomInteger(0, this.height);
            let v = Util.randomInteger(1, 50);
            v = v / 10;
            this.stars.push({x: x, y: y, v: v});
        }
    }

    _renderBackground() {

        let graphics = this.graphics;
        graphics.lineStyle(1, 0xffff00);


        let i = this.stars.length;
        while (i--) {

            let star = this.stars[i];

            graphics.drawCircle(star.x, star.y, 1);

            let diff = this.entities[1].hp - this.entities[0].hp;
            let scalar = diff / DroneConfig.DRONE_MAX_HP;
            star.x += star.v * scalar;

            if (star.x > this.width) {
                star.x = 0;

            }

            if (star.x < 0) {
                star.x = this.width;
            }
        }

    }


    addEffect(effect) {
        this.effects.push(effect);
    }

    /**
     *
     * @private
     */
    _renderEffects() {


        let i = this.effects.length;
        while (i--) {
            this.effects[i].render(this.graphics);
        }

        let junk = [];

        i = this.effects.length;
        while (i--) {
            if (this.effects[i].isComplete(this.gameTime)) {
                junk.push(this.effects[i]);
            }
        }


        this.effects = this.effects.filter(function (el) {
            return !junk.includes(el);
        });


    }



}






