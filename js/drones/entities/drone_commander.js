/**
 *
 */
class DroneCommander {

    constructor(id, x, y, world, type, network) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.world = world;
        this.drones = [];


        if (!network) {
            this.network = Network.createRandomBaseNetworkWithHiddenLayer(7, 2);
            let m = new Mutator();
            let droneCount = Util.randomInteger(DroneConfig.ENTITY_MIN_HIDDEN_NEURON_COUNT, DroneConfig.ENTITY_MAX_HIDDEN_NEURON_COUNT);
            for (let i = 0; i < droneCount; i++) {
                m._randomlyAddNeuron(this.network);
                m.mutateNetwork(this.network);
            }
        }

        this.xVelocity = 0;
        this.yVelocity = 0;
        this.type = type;
        this.lines = [];
        this.wins = 0;
        this.games = 0;
        this.score = 0;
        this.gameTime = 0;
        this.kills = 0;
        this.losses = 0;
        this.entityScore = 0;
        this.hp = DroneConfig.ENTITY_DRONE_COUNT * DroneConfig.DRONE_MAX_HP;


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
     * Runs all processing for this drone commander
     */
    run() {
        let i = this.drones.length;
        while (i--) {
            this.drones[i].run();
        }
    }

    /**
     * handles all the rendering for drone commander (all the drones)
     * @param graphics
     */
    render(graphics) {
        this.hp = 0;
        let hp = 0;
        graphics.lineStyle(1, this.color, 1);

        let i = this.drones.length;
        while (i--) {
            this.drones[i].render();
            hp += this.drones[i].hp;
        }

        this.hp = hp;

    }

    kill() {
        let i = this.drones.length;
        while (i--) {
            this.drones[i].destroy();
        }
    }


}






