/**
 * houses fitness functions for the entities to be sorted by
 */
let FitnessFunctions = {};


FitnessFunctions.TYPE_SCORE = 0;
FitnessFunctions.TYPE_LONG_GAME = 1;
FitnessFunctions.TYPE_KILLS = 3;

/**
 * Used to sort entities by their score
 */
FitnessFunctions.compareEntityScore = function(a, b) {

    let aEntityScore = a.entityScore;
    let bEntityScore = b.entityScore;


    if (aEntityScore < bEntityScore)
        return 1;
    if (aEntityScore > bEntityScore)
        return -1;
    if (aEntityScore === bEntityScore) {

        let aNeuronCount = a.network.neurons.length;
        let bNeuronCount = a.network.neurons.length;

        if (aNeuronCount < bNeuronCount) {
            return -1;
        } else if (aNeuronCount > bNeuronCount) {
            return 1;
        }

        return 0;
    }

    return 0;
};


/**
 * Used to sort entities by those with the most game time (long games)
 * on a tie it goes with the entity that has the fewest neurons.
 */
FitnessFunctions.compareGameTime = function(a, b) {

    let aGameTime = Math.floor(a.gameTime / 1000);
    let bGameTime = Math.floor(b.gameTime / 1000);


    if (aGameTime < bGameTime)
        return 1;
    if (aGameTime > bGameTime)
        return -1;
    if (aGameTime === bGameTime) {

        let aNeuronCount = a.network.neurons.length;
        let bNeuronCount = a.network.neurons.length;

        if (aNeuronCount < bNeuronCount) {
            return -1;
        } else if (aNeuronCount > bNeuronCount) {
            return 1;
        }

        return 0;
    }

    return 0;
};

FitnessFunctions.compareWins = function(a, b) {
    if (a.wins < b.wins)
        return 1;
    if (a.wins > b.wins)
        return -1;
    if (a.wins === b.wins) {
        return 0;
    }

    return 0;
};

FitnessFunctions.compareKills = function(a, b) {
    if (a.kills < b.kills)
        return 1;
    if (a.kills > b.kills)
        return -1;
    if (a.kills === b.kills) {
        return 0;
    }

    return 0;
};