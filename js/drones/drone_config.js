// handles config for the simulation
const DroneConfig = {};

DroneConfig.ENTITY_POPULATION_COUNT = 30;
DroneConfig.ENTITY_NUMBER_OF_OPPONENTS_TO_FACE = DroneConfig.ENTITY_POPULATION_COUNT / 2;
DroneConfig.ENTITY_DRONE_COUNT = 10;
DroneConfig.ENTITY_MIN_HIDDEN_NEURON_COUNT = 5;
DroneConfig.ENTITY_MAX_HIDDEN_NEURON_COUNT = 20;
DroneConfig.POPULATION_PERCENTAGE_TO_CULL = .3;
DroneConfig.FITNESS_MEASUREMENT = FitnessFunctions.TYPE_LONG_GAME;

DroneConfig.DRONE_MAX_HP = 100;
DroneConfig.DRONE_DAMAGE = 1;

DroneConfig.RED = 0xff7777;
DroneConfig.BLUE = 0x7777ff;
DroneConfig.DRONE_MAX_SPACING = 50;
DroneConfig.DRONE_ACCELERATION = 3;
DroneConfig.DRONE_FIRING_DISTANCE = 200;

DroneConfig.POOL_RED = 0xff7777;
DroneConfig.POOL_BLUE = 0x7777ff;
DroneConfig.POOL_FIRING_DISTANCE = 100;
DroneConfig.POOL_MAX_HP_RESERVE = 200;
DroneConfig.ENABLE_HEALTH_POOLS = true;