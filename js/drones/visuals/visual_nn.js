let NNVisualizer = {};


NNVisualizer.drawGraph = function(entity, x, y, width, height, graphics) {

    let nn = entity.network;
    if (nn) {
        graphics.lineStyle(1, 0x5555ff);
        graphics.drawRect(x, y, width, height);

        let inputVerticalSpacing = height / nn.inputNeurons.length;
        let outputVerticalSpacing = height / nn.outputNeurons.length;
        let hiddenVerticalSpacing = height / nn.hiddenNeurons.length;

        let yy = inputVerticalSpacing / 2;

        for (let i in nn.inputNeurons) {
            let inputNeuron = nn.inputNeurons[i];

            inputNeuron.x = x + 10;
            inputNeuron.y = y + yy;
            graphics.drawCircle(inputNeuron.x, inputNeuron.y, 10);
            yy += inputVerticalSpacing;
        }


        graphics.lineStyle(1, 0xffffff);
        yy = outputVerticalSpacing / 2;
        for (let i in nn.outputNeurons) {
            let outputNeuron = nn.outputNeurons[i];

            outputNeuron.x = x + width - 10;
            outputNeuron.y = y + yy;
            graphics.drawCircle(outputNeuron.x, outputNeuron.y, 10);
            yy += outputVerticalSpacing;
        }

        let maxGeneration = NNVisualizer.findMaxGeneration(nn);


        let padding = .2*width;
        let xStep = (width - (padding*2)) / maxGeneration;

        yy = hiddenVerticalSpacing / 2;


        //Handle hidden neurons
        graphics.lineStyle(1, 0xff0000);
        for (let i in nn.hiddenNeurons) {

            let hiddenNeuron = nn.hiddenNeurons[i];

            hiddenNeuron.x = x + padding + xStep*hiddenNeuron.generation;
            hiddenNeuron.y = y + (width/2) * NNVisualizer.getThresholdSum(hiddenNeuron) + width / 2;
            graphics.drawCircle(hiddenNeuron.x, hiddenNeuron.y, 5);
        }

        //draw lines
        let neurons = nn.neurons;
        for (let i in neurons) {
            let neuron = neurons[i];

            for (let k in neuron.connections) {
                let connectedNeuron = nn.neurons[neuron.connections[k].neuronId];


                    let scale = Math.abs(connectedNeuron.output);
                    Synapse._fireWeapon(neuron, connectedNeuron, graphics, 0xffffff, scale, connectedNeuron.output);

            }
        }

    }
    graphics.lineStyle(2, 0xffffff, 1);
};


NNVisualizer.findMaxGeneration = function(network) {
    let currentMax = 0;
    for (let i in network.hiddenNeurons) {
        let neuron = network.hiddenNeurons[i];
        if (neuron.generation > currentMax) {
            currentMax = neuron.generation;
        }
    }

    return currentMax;
};

NNVisualizer.getThresholdSum = function(neuron) {
    let thresholdSum = 0;
    for (let i in neuron.connections) {
        let connection = neuron.connections[i];
        thresholdSum += connection.weight;
    }

    thresholdSum = Math.tanh(thresholdSum);

    return thresholdSum;
};




