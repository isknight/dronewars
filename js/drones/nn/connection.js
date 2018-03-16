/**
 * Represents a synapse for connecting neurons in the neural net
 */
function Connection(weight, neuron) {
    this.id = UUID.generate();
    this.weight = weight;
    this.neuronId = neuron.id;
}
