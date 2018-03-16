/**
 * Represents a heal pool for the drones
 */
class Pool {


    constructor(id, x, y, world, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.world = world;
        this.type = type;
        this.dronesHealing = [];
        this.hpReserve = DroneConfig.POOL_MAX_HP_RESERVE;


        switch (this.type) {
            case 'r':
                this.color = DroneConfig.RED;
                break;
            case 'b':
                this.color = DroneConfig.BLUE;
                break;
        }

    }


    /**
     * Runs all processing for this drone
     */
    run() {
        this._handleHealing();
    }

    render(graphics) {
        graphics.lineStyle(5, 0xffffff);
        if (this.hpReserve > 0) {
            graphics.beginFill(this.color);
        } else {
            graphics.beginFill(0xffffff);
        }
        graphics.drawCircle(this.x, this.y, 30);
        graphics.endFill();
        this._renderHealing(graphics);
    }

    /**
     *
     * @param graphics
     * @private
     */
    _renderHealing(graphics) {

        let i = this.dronesHealing.length;
        while (i--) {
            let drone = this.dronesHealing[i];
            Weapon1._fireWeapon({x: this.x, y: this.y}, {x: drone.x, y: drone.y}, graphics, 0xffffff);
        }


    }

    /**
     *
     * @private
     */
    _handleHealing() {
        this.dronesHealing = [];

        let maxDistance = DroneConfig.FIRING_DISTANCE;

        this.closestDrone = null;

        for (let i in this.world.entities) {
            let e = this.world.entities[i];
            if (e.type === this.type) {
                for (let k in e.drones) {
                    let drone = e.drones[k];
                    let distance = this._distanceFromDrone(drone);

                    if (distance < maxDistance) {
                        if (drone.hp < DroneConfig.MAX_HP && this.hpReserve >= 0) {

                            drone.hp += 1;
                            this.hpReserve--;
                            this.dronesHealing.push(drone);
                        }
                    }
                }
            }
        }

    }

    _distanceFromDrone(drone) {

        let x1 = this.x;
        let y1 = this.y;

        let x2 = drone.x;
        let y2 = drone.y;

        let dx = x1 - x2;
        let dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);
    }


    /**
     * @deprecated
     */
    kill() {
    }

}





