/**
 * Represents a single drone in the fleet an entity commands
 */
class Drone {

    constructor(id, entity, world, type, network) {
        this.id = id;

        this.xVelocity = 0;
        this.yVelocity = 0;

        this.hp = DroneConfig.DRONE_MAX_HP;
        this.world = world;

        this.type = type;
        this.entity = entity;

        switch (this.type) {
            case 'r':
                this.color = DroneConfig.RED;
                break;
            case 'b':
                this.color = DroneConfig.BLUE;
                break;
        }

        this.x = Util.randomInteger(entity.x + DroneConfig.DRONE_MAX_SPACING, entity.x - DroneConfig.DRONE_MAX_SPACING);
        this.y = Util.randomInteger(entity.y + DroneConfig.DRONE_MAX_SPACING, entity.y - DroneConfig.DRONE_MAX_SPACING);
        this.xVelocity = 0;
        this.yVelocity = 0;

    }

    /**
     * Runs all processing for this drone
     */
    run() {

        // the neural nets don't need to provide vectoring information every single tick
        if (this.world.gameTime % 3 === 0) {
            this._handleMovingNeuralNet();
        }

        this._calculate();
        this._handleFiring();
        this._handleDeath();
    }

    render() {
        this._render();
        this._renderFiring();
    }


    destroy() {
        let index = this.entity.drones.indexOf(this);
        if (index > -1) {
            this.entity.losses++;
            this.entity.drones.splice(index, 1);
        }
    }


    _handleDeath() {
        if (this.hp <= 0) {
            this.destroy();
            this.world.addEffect(new EffectExplosion(this.x, this.y, this.world.gameTime, this.color, this.xVelocity, this.yVelocity));
        }

    }

    _renderFiring() {
        if (this.closestDrone) {
            Weapon2._fireWeapon({x: (this.x), y: (this.y)}, {
                x: (this.closestDrone.x),
                y: (this.closestDrone.y)
            }, this.world.graphics, this.color);
        }

    }

    _handleFiring() {
        let maxDistance = DroneConfig.DRONE_FIRING_DISTANCE;
        //TODO loop through enemy drones
        let closestDrone = null;
        let closestDistance = 999;

        this.closestDrone = null;

        for (let i in this.world.entities) {
            let e = this.world.entities[i];
            if (e.id !== this.entity.id) {
                for (let k in e.drones) {
                    let drone = e.drones[k];
                    let distance = this._distanceFromDrone(drone);
                    if (distance < maxDistance && distance < closestDistance) {
                        closestDistance = distance;
                        closestDrone = drone;
                        this.closestDrone = closestDrone;
                    }
                }
            }
        }

        if (this.closestDrone) {
            //reset
            experiment.simulation.extendAction();
            closestDrone.hp -= DroneConfig.DRONE_DAMAGE;
            if (closestDrone.hp <= 0) {
                this.entity.kills++;
            }
            this.entity.score++;
        }
    }

    /**
     * handles moving using the neural net
     * @private
     */
    _handleMovingNeuralNet() {

        //get the friendly vector
        let friendlyVector = this._droneVision(this.entity);

        //get the enemy vector
        let enemyVectorTotals = [0, 0];
        let enemyVectorCount = 0;

        let me = this;

        let i = this.world.entities.length;
        while (i--) {
            let entity = this.world.entities[i];
            if (entity.id !== me.entity.id) {
                enemyVectorCount++;
                let enemy = me._droneVision(entity);
                enemyVectorTotals[0] += enemy[0];
                enemyVectorTotals[1] += enemy[1];
            }
        }


        let enemyVector = [(enemyVectorTotals[0] / enemyVectorCount), (enemyVectorTotals[1] / enemyVectorCount)];


        //handle drone hp, converting it to a value between -1 and 1.
        let droneHPInput = 2 * (this.hp / DroneConfig.DRONE_MAX_HP) - 1;

        //handle drone x/y

        let droneXInput = 2 * (this.x / this.world.width) - 1;
        let droneYInput = 2 * (this.y / this.world.height) - 1;

        let mirrorScalar = 1;

        // to half the search space, we mirror the opposite entity so that they always think they're on the same side
        if (this.type === 'r') {
            mirrorScalar = -1;
        }

        //inputs
        let inputs = [
            friendlyVector[0] * mirrorScalar,
            friendlyVector[1],
            enemyVector[0] * mirrorScalar,
            enemyVector[1],
            droneHPInput,
            droneXInput * mirrorScalar,
            droneYInput
        ];

        let results = Network.fire(this.entity.network, inputs);

        let xPositive = (results[0] >= .2);
        let xNegative = (results[0] <= -.2);

        let yPositive = (results[1] >= .01);
        let yNegative = (results[1] <= -.01);

        if (xPositive) {
            this.xVelocity += DroneConfig.DRONE_ACCELERATION * mirrorScalar;
        }

        if (xNegative) {
            this.xVelocity -= DroneConfig.DRONE_ACCELERATION * mirrorScalar;
        }


        if (yPositive) {
            this.yVelocity += DroneConfig.DRONE_ACCELERATION;
        }

        if (yNegative) {
            this.yVelocity -= DroneConfig.DRONE_ACCELERATION;
        }
    }


    _calculate() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;


        let dampener = 1.50;


        if (this.x > this.world.width * .9) {
            this.x = this.world.width * .9;
            this.xVelocity = -this.xVelocity / dampener;
        }

        if (this.x < this.world.width * .1) {
            this.x = this.world.width * .1;
            this.xVelocity = -this.xVelocity / dampener;
        }


        if (this.y > this.world.height * .9) {
            this.y = this.world.height * .9;
            this.yVelocity = -this.yVelocity / dampener;
        }

        if (this.y < this.world.height * .1) {
            this.y = this.world.height * .1;
            this.yVelocity = -this.yVelocity / dampener;
        }


    }

    static angleBetweenPoints(x1, y1, x2, y2) {
        let p1 = {
            x: x1,
            y: y1
        };

        let p2 = {
            x: x2,
            y: y2
        };

        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    _render() {

        let graphics = this.world.graphics;

        graphics.lineStyle(0);

        let alpha = .3;
        let size = 1;


        let deltaX = 0 - this.xVelocity;
        let deltaY = 0 - this.yVelocity;
        let rad = Math.atan2(deltaY, deltaX);

        let angleOfRotation = Drone.angleBetweenPoints(0, 0, this.xVelocity, this.yVelocity);//= rad * (180 / Math.PI);

        let length = 20;

        //TODO fix this mess
        angleOfRotation = (angleOfRotation / 360) * 6.4;


        let offset = (140 / 360) * 6.4;


        let x1 = this.x + Math.cos(offset + angleOfRotation) * length;
        let y1 = this.y + Math.sin(offset + angleOfRotation) * length;

        let x2 = this.x + Math.cos(10 + offset + angleOfRotation) * length;
        let y2 = this.y + Math.sin(10 + offset + angleOfRotation) * length;

        let x3 = this.x + Math.cos(20 + offset + angleOfRotation) * length;
        let y3 = this.y + Math.sin(20 + offset + angleOfRotation) * length;

        graphics.beginFill(this.color);
        graphics.drawPolygon(
            [
                this.x, this.y,
                x1, y1,
                x2, y2,
                x3, y3
            ]
        );

        graphics.endFill();
    }


    _distanceFromDrone(drone) {
        //x1, y1, x2, y2

        let x1 = this.x;
        let y1 = this.y;

        let x2 = drone.x;
        let y2 = drone.y;

        let dx = x1 - x2;
        let dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * represents the vision of the drone for other drones based upon a directional vector
     */
    _droneVision(entity) {

        //create an averaged vector of distance from this drone to this entity's drones
        //ignoring itself of course

        let totalX = 0;
        let totalY = 0;
        let droneCount = 0;

        let me = this;

        let i = entity.drones.length;
        while (i--) {
            let drone = entity.drones[i];
            if (drone.id != this.id) {
                let diffX = me.x - drone.x;
                let diffY = me.y - drone.y;
                totalX += (diffX / me.world.width);
                totalY += (diffY / me.world.height);
                droneCount++;
            }

        }

        return [(totalX / droneCount), (totalY / droneCount)];
    }

}






