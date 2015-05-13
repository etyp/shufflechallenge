/**
 * Shuffle an array
 * Taken from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param array
 * @returns {Array} An efficiently and fairly shuffled array.
 */
function shuffler(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Unfair shuffle to test against
unfair = function(array) {
	return array;
};



// ================================
// First
// ================================
/**
 * I'm visual - I started with
 * a mundane console.log and passed
 * in _.shuffle so I could stare for
 * a few minutes and think.
 */
isShuffleFair = function(shuffleFunction, array) {
	var iterations = 100;

	// 
	for (var i = 0; i < iterations; i++) {
		console.log('Before:', array);
		console.log('After:', shuffleFunction(array));
		console.log('------');
	};


	// return isFair;
};

// ================================
// Second
// ================================
/**
 * Some reading on randomization... : http://en.wikipedia.org/wiki/Markov_chain
 * and the 7 states of randomness: http://en.wikipedia.org/wiki/Seven_states_of_randomness
 * followed by: http://en.wikipedia.org/wiki/Standard_score
 * Status: I think I may be overcomplicating it, but will try to go on
 * a spike anyway to see if I can pick up on any trends.
 *
 * Afterword: Looking back, this is where I got the idea to lay things
 * out in steps. I intially tried using a getCountSet() fn
 * disjointed from the main iteration loop just to keep my
 * thoughts straight and code from stinking too much (not that
 * this is anything near clean :) )
 */
isShuffleFair = function(shuffleFunction, array) {
	var iterations = 100;


	// 1. Generate all shuffles and create a
	// count set (matrix) for each

	// Store shuffles from each iter
	var allShuffles = [];
	// Counts
	var countsByIteration = [];
	for (var i = 0; i < iterations; i++) {
		// Create count set
		countsByIteration.push(createCountSet(array.length));
		// Add shuffle result
		allShuffles.push(shuffleFunction(array));
	};

	var countsMatrix = [];
	for (i = 0; i < arrayLength; i++) {
		countsMatrix[i] = Array(arrayLength);

		for (j = 0; j < arrayLength; j++) {
			countsMatrix[i][j] = 0;
		}
	}



	console.log(countsByIteration);

	// 2. Find all instances where x occurred
	// and add to countsByIteration

	for (var i = 0; i < allShuffles.length; i++) {

		for (var j = 0; j < array.length; j++) {
			if (array[j] === allShuffles[i][j]) {
				// They're equal
				console.log('They equal:', array[j]);
				// Increment count at this matrix
				console.log(countsByIteration[i][j]);
				countsByIteration[i][j] ++;
			}
		};
	};

	// console.log(countsByIteration);

	// SO: After N runs, will std be less than 1?


	// return isFair;
};

function createCountSet(arrLength) {
	var counts = [];
	// Track counts per iteration
	for (var i = 0; i < arrLength; i++) {
		counts[i] = [];
		for (var j = 0; j < arrLength; j++) {
			// Start count at 0
			counts[i][j] = 0;
		};
	};
	return counts;
}



// ================================
// Third
// ================================
/**
 * Afterword: By this point I think I dedicated
 * myself to the idea that I would need to figure out
 * the frequency probability of each occurence and measure
 * against a standard deviation of 1 (since this is a normal
 * distribution ?).
 */
isShuffleFair = function(shuffleFunction, array) {
	var iterations = 100;


	// 1. Set up structures for counting
	// Nx in each iteration when we shuffle
	var countsByIteration = [];
	var eachNx = [];
	for (i = 0; i < array.length; i++) {
		countsByIteration[i] = Array(array.length);
		eachNx[i] = Array(array.length);

		for (j = 0; j < array.length; j++) {
			countsByIteration[i][j] = 0;
			eachNx[i][j] = 0;
		}
	}

	// 2. Shuffle once per iteration,
	// find all instances where Nx occurs
	// and add to countsByIteration at it's respective
	// matrix index
	var newIdx;
	var shuffledArray;
	for (var i = 0; i < iterations; i++) {

		shuffledArray = shuffleFunction(array);

		// Same as before
		for (j = 0; j < array.length; j++) {
			// Items are 1:1 so just find new index
			newIdx = shuffledArray.indexOf(array[j]);
			// increment count at this position (Nx)
			countsByIteration[j][newIdx] += 1;
		}
	};

	// console.log(countsByIteration);

	// 3. Get P(x) = Nx / N for each
	// http://en.wikipedia.org/wiki/Frequentist_probability
	var sumNx = 0;
	for (i = 0; i < array.length; i++) {
		for (j = 0; j < array.length; j++) {
			eachNx[i][j] = countsByIteration[i][j] / (iterations * array.length); // Multiply by array.length to account for total runs
			sumNx += eachNx[i][j];

		}
	}


	// SO: After N runs, will std be less than 1?
	var totalPopulation = Math.pow(array.length, 2);
	var meanX = sumNx / totalPopulation;
	// std population sigma = sqrt(sum(Nx - meanX)^2)
	// Calculate (Nx - meanX)^2
	var stdSum = 0;
	var diff;
	for (i = 0; i < array.length; i++) {
		for (j = 0; j < array.length; j++) {
			console.log('Nx:', eachNx[i][j]);
			console.log('minus MeanX:', meanX);

			diff = eachNx[i][j] - meanX;
			console.log('equals:', diff);
			console.log('--------');
			stdSum += Math.pow(diff, 2);

		}
	}
	var std = Math.sqrt(stdSum / totalPopulation);
	console.log(std);



	return std <= 1;
};

// dont need if im building in single iteration (N) loop
// function createCountSet(arrLength) {
// 	var counts = [];
// 	// Track counts per iteration
// 	for (var i = 0; i < arrLength; i++) {
// 		counts[i] = [];
// 		for (var j = 0; j < arrLength; j++) {
// 			// Start count at 0
// 			counts[i][j] = 0;
// 		};
// 	};
// 	return counts;
// }








// ================================
// Fourth and Final
// ================================
/**
 * Afterword: So here we are.
 * My final attempt before going crazy over the
 * time limit (started ~2.5 hrs ago). I'll probably
 * need to brush up on my stats skills after this haha.
 *
 * At this point, I tried adjusting the iterations on
 * each call (gt 100), but somewhere along the way I
 * added something that dramatically hurt the performance
 * of the function. This is probably where focusing
 * on abstraction (and maybe a simple test) might have helped.
 *
 */
isShuffleFair = function(shuffleFunction, array, iterations) {
	// Default to 100
	if (typeof iterations !== 'number') iterations = 100;

	// 1. Set up structures for counting
	// each occurrence where an item is swapped
	var countsByIteration = [];
	for (i = 0; i < array.length; i++) {
		countsByIteration[i] = Array(array.length);
		for (j = 0; j < array.length; j++) {
			countsByIteration[i][j] = 0;
		}
	}
	// Clone countsByIteration - eachNx is used to calc
	// probability and eventually standard dev
	var eachNx = countsByIteration.slice(0);


	// 2. Shuffle once per iteration,
	// find all instances where Nx occurs
	// and add to countsByIteration at it's respective
	// matrix index
	var newIdx;
	var shuffledArray;
	for (var i = 0; i < iterations; i++) {

		shuffledArray = shuffleFunction(array);

		// Same as before
		for (j = 0; j < array.length; j++) {
			// Items are 1:1 so just find new index
			newIdx = shuffledArray.indexOf(array[j]);
			// increment count at this position (Nx)
			countsByIteration[j][newIdx] += 1;
		}
	};


	// 3. Get P(x) = Nx / N for each
	// http://en.wikipedia.org/wiki/Frequentist_probability
	var sumNx = 0;
	for (i = 0; i < array.length; i++) {
		for (j = 0; j < array.length; j++) {
			eachNx[i][j] = (countsByIteration[i][j] / (iterations * array.length)) * 100; // Multiply by array.length to account for total runs
			sumNx += eachNx[i][j];

		}
	}



	var totalPopulation = Math.pow(array.length, 2);
	var meanX = sumNx / totalPopulation;

	// Standard deviation:
	// std population sigma = sqrt(sum(Nx - meanX)^2)
	// Calculate (Nx - meanX)^2
	var stdSum = 0;
	var diff;
	for (i = 0; i < array.length; i++) {
		for (j = 0; j < array.length; j++) {

			diff = eachNx[i][j] - meanX;
			stdSum += Math.pow(diff, 2);

		}
	}
	var std = Math.sqrt(stdSum / totalPopulation);


	// Standard deviation of less than 1 fits the threshold
	// http://en.wikipedia.org/wiki/Standard_deviation
	return std <= 1;
};

