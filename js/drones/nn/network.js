/**
 * represents a very basic recurrent neural net
 */
class Network {
    constructor(id) {
        this.id = id;
        this.inputNeurons = [];
        this.hiddenNeurons = [];
        this.outputNeurons = [];
        this.neurons = [];
        this.generation = 0;

        //TODO add bias back in

    }
}



Network.addNeuron = function (network, neuron) {
    switch (neuron.type) {
        case 'i':
            network.inputNeurons.push(neuron);
            break;
        case 'h':
            network.hiddenNeurons.push(neuron);
            break;
        case 'o':
            network.outputNeurons.push(neuron);
            break;
    }


    network.neurons.push(neuron);
    neuron.id = network.neurons.length - 1;
};

Network.fire = function (network, inputArray) {
    //TODO set output for all input neurons all input neurons
    for (let i in network.inputNeurons) {
        let n = network.inputNeurons[i];
        n.output = inputArray[i];
        n.visited = true;
    }

    //TODO calculate output all of the remaining neurons
    let outputs = [];
    for (let i in network.outputNeurons) {
        let n = network.outputNeurons[i];
        outputs.push(Network.processOutputNeuron(n, network));
    }

    // console.log('network=' + network);
    Network.reset(network);
    return outputs;

};


Network.connect = function (weight, hostNeuron, neuron) {
    let connection = new Connection(weight, neuron);
    hostNeuron.connections.push(connection);

};

Network.processOutputNeuron = function (neuron, network) {

    let output = 0;
    //If we haven't visted this, we will caluclate its output
    if (!neuron.visited) {
        neuron.visited = true;
        //we need to add the output of all neurons that connect to this one
        let calculatingOutput = 0;
        for (let i in neuron.connections) {
            let connection = neuron.connections[i];
            if (!connection.fireCount) {
                connection.fireCount = 0;
            }
            connection.fireCount = network.fireCount;
            //let n = NNUtil.getNeuronById(connection.neuronId, network);
            //upgrade
            let n = network.neurons[connection.neuronId];//]connection.getNeuron(network);
            if (n.visited) {
                calculatingOutput += n.output * connection.weight;
            } else {
                calculatingOutput += Network.processOutputNeuron(n, network) * connection.weight;
            }
        }
        neuron.output = calculatingOutput;
        //console.log('output=' + neuron.output);
        output = calculatingOutput;

    } else {
        output = neuron.output;
    }

    switch (neuron.outputType) {
        case Neuron.TYPE_HYPERBOLIC:
            output = Network.tanh(output);
            break;
        case Neuron.TYPE_SIGMOID:
            output = Network.sigmoid(output);
            break;
        case Neuron.TYPE_SIN:
            output = Math.sin(output);
            break;
        case Neuron.TYPE_RAW:
            output = output; // :P
            break;
        default:
            output = Network.tanh(output);
            break;
    }


    if (Math.abs(output) > neuron.maxOutput) {
        neuron.maxOutput = Math.abs(output);
    }

    //if (Math.abs(output) > 1) {
    network.fireCount++;
    //}

    return output;
};

Network.gaussian = function (mean, stdev) {
    let y2;
    let use_last = false;
    return function () {
        let y1;
        if (use_last) {
            y1 = y2;
            use_last = false;
        }
        else {
            let x1, x2, w;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }

        let retval = mean + stdev * y1;
        if (retval > 0)
            return retval;
        return -retval;
    }
};

Network.sigmoid = function (x) {
    return 1 / (1 + Math.pow(Math.E, -x));
};

Network.tanh = function (x) {
    return Math.tanh(x);
};

Network.reset = function (network) {

    let neurons = network.neurons;
    for (let i in neurons) {
        neurons[i].visited = false;
    }

};

Network.createRandomBaseNetworkWithHiddenLayer = function (inputCount, outputCount) {
    let network = new Network(UUID.generate());

    let inputNeurons = [];

    for (let i = 0; i < inputCount; i++) {
        let neuron = new Neuron('i', network.generation);
        inputNeurons.push(neuron);
        Network.addNeuron(network, neuron);
    }

    let outputNeurons = [];

    for (let i = 0; i < outputCount; i++) {
        let neuron = new Neuron('o', network.generation);
        outputNeurons.push(neuron);
        Network.addNeuron(network, neuron);
    }

    let hiddenCount = inputCount / 2;
    let hiddenNeurons = [];

    for (let i = 0; i < hiddenCount; i++) {
        let neuron = new Neuron('h', network.generation);
        hiddenNeurons.push(neuron);
        Network.addNeuron(network, neuron);
    }


    //connect the output neurons to the hidden
    for (let i in outputNeurons) {
        let neuron = outputNeurons[i];
        for (let i in hiddenNeurons) {
            let hiddenNeuron = hiddenNeurons[i];
            let v = Network._randomWeight(100, 0);
            v = v / 100.0;
            Network.connect(v, neuron, hiddenNeuron);
        }
    }

    //connect the hidden neurons to the output
    for (let i in hiddenNeurons) {
        let neuron = hiddenNeurons[i];
        for (let i in inputNeurons) {
            let inputNeuron = inputNeurons[i];
            let v = Network._randomWeight(100, 0);
            v = v / 100.0;
            Network.connect(v, neuron, inputNeuron);
        }
    }


    return network;

};

Network.createRandomBaseNetwork = function (inputCount, outputCount) {
    let network = new Network(UUID.generate());

    let inputNeurons = [];

    for (let i = 0; i < inputCount; i++) {
        let neuron = new Neuron('i', network.generation);
        inputNeurons.push(neuron);
        Network.addNeuron(network, neuron);
    }

    let outputNeurons = [];

    for (let i = 0; i < outputCount; i++) {
        let neuron = new Neuron('o', network.generation);
        outputNeurons.push(neuron);
        Network.addNeuron(network, neuron);
    }

    for (let i in inputNeurons) {
        let neuron = inputNeurons[i];
        for (let i in outputNeurons) {
            let outputNeuron = outputNeurons[i];
            let v = Network._randomWeight(100, 0);
            v = v / 100.0;
            Network.connect(v, outputNeuron, neuron);
        }
    }
    return network;

};

Network._randomWeight = function (max, min) {
    return (Math.random() * (max * 2 - min) + min) - max;
};


Network.resetMaxOutputs = function (network) {
    for (let i in network.hiddenNeurons) {
        network.hiddenNeurons[i].maxOutput = 0;
    }
};

/**
 *
 * @param network
 */
Network.removeUselessNeurons = function (network) {
    //TODO check the max score for all hidden neurons. If it is under a threshold, kill the neuron
    for (let i in network.hiddenNeurons) {
        console.log('max=' + Math.abs(network.hiddenNeurons[i].maxOutput));
        if (Math.abs(network.hiddenNeurons[i].maxOutput) < .003) {
            //console.log('death=' + Math.abs(network.hiddenNeurons[i].maxOutput));
            Network.removeNeuron(i, network.hiddenNeurons[i], network);
        }
    }
};


/**
 * @deprecated
 * @param index
 * @param neuron
 * @param network
 */
Network.removeNeuron = function (index, neuron, network) {
    let neurons = [];

    neuron.type = 'd';
    neuron.connections = [];

    neurons.push.apply(neurons, network.hiddenNeurons);
    neurons.push.apply(neurons, network.outputNeurons);

    for (let i in neurons) {
        let n = neurons[i];
        for (let k in n.connections) {
            let c = n.connections[k];

            if (c.neuronId == neuron.id) {
                n.connections.splice(k, 1);
            }
        }
    }

    //neurons
};