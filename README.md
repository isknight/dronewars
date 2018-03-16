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


# Neural Net visualization
![alt text](https://github.com/isknight/dronewars/raw/master/screenshots/neural_net.png "I'm sorry, Dave")

- The nodes on the left are the input neurons
- The nodes on the right are the output neurons
- the floaty ones in the middle are of course the hidden neuron

Using a hyperbolic activation, purple represents a negative signal between -1 and 0, while orange represents a positive signal between 0 and 1. The size of the arc is in relation to the strength of the signal.

