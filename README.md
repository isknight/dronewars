# dronewars

This is a fun toy I built using a non-fully connected recurrent neural network that's built out with a genetic algorithm.

I wanted to see what a neural net could "look like" when it's "thinking". 




Installation/running


Simply use  bower for install:
```
bower install
```

Afterwards opoen dronewars.html in your browser. (I recommend Chrome.)

You should see this:
![alt text](https://github.com/isknight/dronewars/raw/master/screenshots/screenshot1.png "the only winning move is not to play")

js/drone_config.js contains simulation configuration options.

# Simulation Rules
- There is a population of N drones commanders each with K drones.
- For a given simulation each drone faces X opponent drone commanders out of the population N.
- In a given battle:
  - there are optional "health pools" that heal for a limited amount in the corners. 
  - each A.I. controls their fleet--- they automatically shoot if in range of an enemy.
  - if there is no combat for 2 seconds the game ends.
  - drones have limited health, and are gone for the duration of the match if destroyed by opponents
- After each drone commander has faced their opponents, the simulation compares their performance based upon the selected fitness function (the default is extending game time, the other options are in js/fitness_functions.js and changeably by js/drone_config.js)
- The population is sorted by this fitness metric, then the bottom Y% is culled, and repopulated with taking the better performers, copying them and doing random mutations.
  - Randomly adjusting a weight on a synapse
  - Randomly adding a new synapse with a random weight
  - Randomly adding a new Neuron
  - Randomly changing the activation function of a neuron. 
- After the population has been replenished, the scenario starts over again.



# Controls

- Up switches to "training mode" which runs the simulations as fast as your computer can handle.
- Down switches back to "viewing mode"


# On the Neural Net visualization
<img src="https://github.com/isknight/dronewars/raw/master/screenshots/neural_net.png" alt="Drawing" style="width: 200px;" alt="I'm sorry Dave, I'm afraid I can't do that." />

- The nodes on the left are the input neurons
```
        //inputs
        let inputs = [
            friendlyVector[0] * mirrorScalar, // a directional vector giving vision on friendly drones
            friendlyVector[1],
            enemyVector[0] * mirrorScalar,    // a directional vector giving vision on enemy units
            enemyVector[1],
            droneHPInput,                     // health of the given drone
            droneXInput * mirrorScalar,       // X/Y position of the given drone
            droneYInput
        ];
```
- The nodes on the right are the output neurons
    - Controls X/Y thrust
- the floaty ones in the middle are of course the hidden neuron

Using a hyperbolic activation, purple represents a negative signal between -1 and 0, while orange represents a positive signal between 0 and 1. The size of the arc is in relation to the strength of the signal.

