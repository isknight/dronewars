/**
 * Runs the overall simulation
 */
class DronesSimulation {

    constructor(width, height, graphics) {

        this.state = DronesSimulation.STATE_IDLE;
        this.entities = [];

        this.facedSoFar = 0;
        this.currentDroneIndex1 = 0;
        this.currentDroneIndex2 = 0;
        this.generation = 0;
        this.gameOverIn = 0;
        this.gameTime = 0;
        this.reports = [];
        this.world = new World(width, height, game, graphics);
        this.entityCounter = 0;
        this.key = 'zero';
        //build random population
        for (this.entityCounter = 0; this.entityCounter < DroneConfig.ENTITY_POPULATION_COUNT; this.entityCounter++) {
            { //scoping hijinks
                let e1 = new DroneCommander(this.entityCounter, 50, 150, this.world, 'b');
                this.entities.push(e1);
            }
        }
    }


    /**
     * Handles drawing
     */
    render() {

        switch (this.state) {
            case DronesSimulation.STATE_LOADING:
                this.world.graphics.clear();
                break;
            case DronesSimulation.STATE_IDLE:
                this.world.graphics.clear();
                break;
            case DronesSimulation.STATE_CULLING:
                this.world.graphics.clear();
                break;
            case DronesSimulation.STATE_FIGHTING:
                this.world.graphics.clear();
                this.world.render();
        }
    }

    /**
     * Primary calculation loop
     */
    run() {

        this.gameOverIn--;
        this.gameTime++;
        this.world.gameTime = this.gameTime;

        switch (this.state) {
            case DronesSimulation.STATE_IDLE:
                this._startFight();
                break;
            case DronesSimulation.STATE_CULLING:
                this.world.graphics.clear();
                this._cull();
                break;
            case DronesSimulation.STATE_FIGHTING:
                this._fighting();
                break;
        }
    }

    /**
     * culls the lower performers and repopulates the drone commanders and resets the simulation
     * @private
     */
    _cull() {
        this._sortEntitiesForCulling();
        this._handleCullingReporting();
        this._repopulateAfterCulling();
        this._resetSimulation();
    }

    /**
     * handles the state of two drone commanders fighting
     * @private
     */
    _fighting() {
        this.world.graphics.clear();
        this.world.run();

        if (this.state === DronesSimulation.STATE_FIGHTING && this.gameOverIn <= 0) {

            let first = this.entities[this.currentDroneIndex1];
            let second = this.entities[this.currentDroneIndex2];
            this._scoreDrones(first);
            this._scoreDrones(second);

            this._scoreEntities(first, second);
            this._scoreEntities(second, first);

            first.gameTime += this.gameTime;
            second.gameTime += this.gameTime;


            if (first.drones.length === 0) {
                second.score += 50000;
                if (second.drones.length >= DroneConfig.ENTITY_DRONE_COUNT) {
                    second.score += 1000000;
                    second.wins++;
                }

            }

            if (second.drones.length === 0) {
                first.score += 50000;
                if (first.drones.length >= DroneConfig.ENTITY_DRONE_COUNT) {
                    first.score += 1000000;
                    first.wins++;
                }
            }


            this.state = DronesSimulation.STATE_IDLE;
        }
    }


    /**
     * Gets the next two drone commanders to fight
     * @returns {*}
     * @private
     */
    _getNextTwo() {
        let entitiesSelected = false;

        while (!entitiesSelected) {


            this.currentDroneIndex2 = Util.randomInteger(0, this.entities.length - 1);
            this.facedSoFar++;

            if (this.facedSoFar >= DroneConfig.ENTITY_NUMBER_OF_OPPONENTS_TO_FACE) {
                this.currentDroneIndex1++;
                // this.currentDroneIndex2 = 0;
                this.facedSoFar = 0;
            }

            if (this.currentDroneIndex1 >= DroneConfig.ENTITY_POPULATION_COUNT) {
                // this.state = SADSimulation.STATE_CULLING;
                this.currentDroneIndex1 = 0;
                //this.currentDroneIndex2 = 0;
                this.generation++;
                this.state = DronesSimulation.STATE_CULLING;
                return null;

                //    return null;
            }

            if (this.currentDroneIndex1 !== this.currentDroneIndex2) {
                entitiesSelected = true;
            }

        }

        let first = this.entities[this.currentDroneIndex1];
        first.x = this.world.height * .1;
        first.y = this.world.height / 2;
        let drones = [];


        let i = DroneConfig.ENTITY_DRONE_COUNT;
        while (i--) {
            drones.push(new Drone(first.id + '-' + i, first, this.world, 'b'));
        }

        first.type = 'b';

        first.drones = drones;

        let second = this.entities[this.currentDroneIndex2];
        second.x = this.world.height * .9;
        second.y = this.world.height / 2;
        drones = [];


        i = DroneConfig.ENTITY_DRONE_COUNT;
        while (i--) {
            drones.push(new Drone(second.id + '-' + i, second, this.world, 'r'));
        }


        second.drones = drones;
        second.type = 'r';


        return [first, second];
    }




    _scoreEntities(entity1, entity2) {
        entity1.entityScore += entity1.drones.length;// - entity2.drones.length;
    }

    _scoreDrones(entity) {
        entity.score +=
            entity.drones.length * 100;
        entity.score += this.gameTime * 10;
    }


    _sortEntitiesForCulling() {
        switch(DroneConfig.FITNESS_MEASUREMENT) {
            case FitnessFunctions.TYPE_LONG_GAME:
                this.entities.sort(FitnessFunctions.compareGameTime);
                break;
            case FitnessFunctions.TYPE_KILLS:
                this.entities.sort(FitnessFunctions.compareKills);
                break;
            case FitnessFunctions.TYPE_SCORE:
                this.entities.sort(FitnessFunctions.compareEntityScore);
                break;
        }
    }

    /**
     * handles reporting of results of fitness
     * @private
     */
    _handleCullingReporting() {
        let worst = 10000000000;
        let best = 0;
        let total = 0;

        let i = this.entities.length;


        switch (DroneConfig.FITNESS_MEASUREMENT) {
            case FitnessFunctions.TYPE_SCORE:
                while (i--) {
                    total += this.entities[i].wins;
                    if (this.entities[i].wins > best) {
                        best = this.entities[i].wins;
                    }

                    if (this.entities[i].score < worst) {
                        worst = this.entities[i].wins;
                    }
                }
                break;

            case FitnessFunctions.TYPE_LONG_GAME:
                while (i--) {
                    total += this.entities[i].gameTime;
                    if (this.entities[i].gameTime > best) {
                        best = this.entities[i].gameTime;
                    }

                    if (this.entities[i].score < worst) {
                        worst = this.entities[i].gameTime;
                    }
                }
                break;
        }


        let average = total / this.entities.length;

        this.reports.push([worst, average, best]);


        let output = this.generation + ',' + this.entities[0].id + ',' + average + ',' + this.entities[0].wins;

        console.log(output);

        if (this.reports.length > 50) {
            let tempReports = [];

            //let i = this.reports.length;
            for (let i in this.reports) {
                if (i % 2 === 1) {
                    tempReports.push(this.reports[i]);
                }
            }
            this.reports = tempReports;
        }

    }


    /**
     *
     */
    _repopulateAfterCulling() {
        //this could be more efficient, but it doesn't really matter
        //as this only happens once a generation

        let saveSize = this.entities.length * DroneConfig.POPULATION_PERCENTAGE_TO_CULL;

        let saveList = this.entities.slice(0, saveSize);


        while (saveList.length < DroneConfig.ENTITY_POPULATION_COUNT) {
            let randomIndex = Util.randomInteger(0, saveList.length - 1);
            let randomEntity = saveList[randomIndex];
            this.entityCounter++;
            let e1 = new DroneCommander(this.entityCounter, 50, 150, this.world, 'b');
            let network = randomEntity.network;
            network = Object.clone(network, true);
            e1.network = network;
            let m = new Mutator();

            m.mutateNetwork(e1.network);
            saveList.push(e1);
        }

        this.entities = saveList;
    }

    /**
     *
     * @private
     */
    _resetSimulation() {
        //reset all the things
        let i = this.entities.length;
        while (i--) {
            this.entities[i].score = 0;
            this.entities[i].gameTime = 0;
            this.entities[i].entityScore = 0;
            this.entities[i].wins = 0;
        }

        this.state = DronesSimulation.STATE_IDLE;
    }

    _startFight() {


        if (this.world.entities.length > 0) {
            //TODO calculate score
            let first = this.world.entities[0];
            let second = this.world.entities[1];


        }

        for (let i in this.world.entities) {
            this.world.entities[i].kill();
        }

        let participants = this._getNextTwo();
        if (participants) {
            this.world.entities = participants;
            this.world.reset();
            //this.gameOverIn = 60*2;
            this.extendAction();
            this.gameTime = 0;
            this.state = DronesSimulation.STATE_FIGHTING;
        } else {

        }

    }

    _calculateEntityScore(entity) {

    }


    extendAction() {
        this.gameOverIn = 60 * 2;
    }
}

DronesSimulation.STATE_LOADING = -1;
DronesSimulation.STATE_IDLE = 0;
DronesSimulation.STATE_FIGHTING = 1;
DronesSimulation.STATE_CULLING = 2;




