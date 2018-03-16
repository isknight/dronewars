/**
 * Container for simulations
 */
class Experiment {

    constructor(type, width, height, graphics) {

        this.width = width;
        this.height = height;
        this.graphics = graphics;

        switch (type) {
            case Experiment.SIMULATION_DRONES:
                this.simulation = new DronesSimulation(width, height, graphics);
                this.hud = new Hud(880, 10, this.simulation);
                break;
        }

    }

    render() {
        this.simulation.render();
        if (this.simulation.world.entities.length === 2) {
            NNVisualizer.drawGraph(this.simulation.world.entities[0], 610, 0, 250, 250, this.graphics);
            NNVisualizer.drawGraph(this.simulation.world.entities[1], 610, 301, 250, 250, this.graphics);
        }
    }

    run() {
        this.simulation.run();
    }


    /**
     * Renders
     */
    postRender() {
        Graph.drawGraph(this.simulation.reports, 950, 450, 200, 100, this.simulation.world.graphics);
        this.hud.render();
    }

}

Experiment.SIMULATION_DRONES = 0;
Experiment.SIMULATION_SAD = 1;