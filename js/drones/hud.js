/**
 * Simple HUD for simulation metrics
 */
class Hud {

    constructor(x, y, simulation) {
        this.simulation = simulation;
        this.x = x;
        this.y = y;
        this._init();

    }


    _init() {
        this.textGroup = game.add.group();
        this.generation = game.make.text(this.x + 10, this.y, 'generation:', {
            font: "18px Arial",
            fill: "#00ff00"
        });
        this.vs = game.make.text(this.x + 10, this.y + 50, 'vs:', {font: "18px Arial", fill: "#00ff00"});
        this.fps = game.make.text(this.x + 10, this.y + 90, 'fps:', {font: "18px Arial", fill: "#00ff00"});
        this.speed = game.make.text(this.x + 10, this.y + 130, 'speed:', {font: "12px Arial", fill: "#00ff00"});

        this.turbo = game.make.text(this.x - 750, this.y + 250, '', {font: "42px Arial", fill: "#ff0000"});

        this.victory = game.make.text(this.x - 550, this.y + 250, '', {font: "18px Arial", fill: "#ffffff"});
        this.neurons = game.make.text(this.x + 10, this.y + 160, '', {font: "18px Arial", fill: "#ffffff"});


        this.textGroup.add(this.generation);
        this.textGroup.add(this.vs);
        this.textGroup.add(this.fps);
        this.textGroup.add(this.speed);
        this.textGroup.add(this.turbo);
        this.textGroup.add(this.victory);
        this.textGroup.add(this.neurons);
    }


    render() {

        this.generation.text = "generation: " + this.simulation.generation;

        let first = this.simulation.entities[this.simulation.currentDroneIndex1];
        let second = this.simulation.entities[this.simulation.currentDroneIndex2];
        if (first && second && first.network && second.network) {
            this.neurons.text = 'neurons: ' + first.network.neurons.length;

            this.vs.text = first.id + " vs " + second.id;
            this.fps.text = 'fps:' + game.time.fps;
            this.speed.text = 'speed:' + speed;

            this.victory.text = '';

            if (speed > 5) {
                this.turbo.text = "training, rendering disabled";
            } else {
                this.turbo.text = "";
                //TODO fix this crap
                if (first && second) {
                    // if (first && second && second.drones && first.drones && (first.drones.length == 0 && second.drones.length >= DroneConfig.ENTITY_DRONE_COUNT) || (second.drones.length == 0 && first.drones.length >= DroneConfig.ENTITY_DRONE_COUNT)) {
                    //     this.victory.text = 'flawess victory!';
                    //     console.log('Flawless Victory!');
                    // } else if ((first.drones.length == 0 && second.drones.length > 0) || (second.drones.length == 0 && first.drones.length > 0)) {
                    //     this.victory.text = 'victory!';
                    // }
                }

            }
        }


    }


}






