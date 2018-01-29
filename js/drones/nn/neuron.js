class Neuron {
    constructor(type, generation) {
        if (!generation) {
            generation = 0;
        }

        this.generation = generation;
        this.type = type;
        this.outputType = Util.randomInteger(0, Neuron.OUTPUT_TYPES.length - 1);
        this.auto = 0;
        this.connections = [];
        this.output = 0;
        this.visited = false;
    }
}


Neuron.TYPE_HYPERBOLIC = 0;
Neuron.TYPE_SIGMOID = 1;
Neuron.TYPE_SIN = 2;
Neuron.TYPE_RAW = 3;
Neuron.TYPE_RANDOM = 4;

Neuron.OUTPUT_TYPES = [
    Neuron.TYPE_HYPERBOLIC,
    Neuron.TYPE_SIN,
    Neuron.TYPE_RAW,
    Neuron.TYPE_RANDOM
];

