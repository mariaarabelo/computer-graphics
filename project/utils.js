/**
 * @param {Number} min - lower limit of random number
 * @param {Number} max - upper limit of random number
 * @returns A random floating point number from min to max
 */
export function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min; 
}

/**
 * @param {Array} arr - array to shuffle
 * @param {Number} N - number of elements to be returned
 * @returns An array with N shuffled elements of the array arr
 */
export function shuffleN(arr, N) {
    let end_itr = arr.length;

    // Invalid elements to shuffle from array that was given
    if (N > end_itr)
        return [];
    
    for (let i = 0; i < N; i++) {
        const el = arr[end_itr - 1];
        const rand_itr = Math.floor(Math.random() * end_itr)

        arr[end_itr - 1] = arr[rand_itr];
        arr[rand_itr] = el;
        end_itr--;  
    }

    return arr.slice(end_itr);
}

/**
 * @param {Number} angle - Angle in degrees
 * @returns The provided angle in radians
 */
export function toRadians(angle) {
    return angle * Math.PI / 180;
}

/**
 * @param {Array} vec - Vector with 3 elements
 * @returns The magnitude of the provided vector
 */
export function getVec3Mag(vec) {
    return Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2) + Math.pow(vec[2], 2));
}

/**
 * @param {Array} vec - Vector with 2 elements
 * @returns The magnitude of the provided vector
 */
export function getVec2Mag(vec) {
    return Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
}

/**
 * @param {Number} actual - Value that will be tested, that is the one that was computed
 * @param {Number} expected - Value that we are expecting
 * @param {Number} tolerance - Accepted difference between the actual and expected values 
 * @returns True if the actual and expected values are close enough, regarding the tolerance, false otherwise 
 */
export function compareFloats(actual, expected, tolerance) {
    return actual-tolerance <= expected && expected <= actual+tolerance;
}

/**
 * @param {Array} vec - Vector with 3 elements
 * @returns The normalized vector
 */
export function normalizeVec3(vec) {
    const magnitude = getVec3Mag(vec);

    return [vec[0] / magnitude, vec[1] / magnitude, vec[2] / magnitude];
}

/**
 * @param {Array} vec - Vector with 2 elements
 * @returns The normalized vector
 */
export function normalizeVec2(vec) {
    const magnitude = getVec2Mag(vec);

    return [vec[0] / magnitude, vec[1] / magnitude];
}

/**
 * @param {Array} p1 - Vector with 2 elements. It represents a point in the x0z plane
 * @param {Array} p2 - Vector with 2 elements. It represents a point in the x0z plane
 * @returns The vector that starts in p1 and ends in p2
 */
export function getXZVector(p1, p2) {
    return normalizeVec2([p2[0] - p1[0], p2[1] - p1[1]]);
}

/**
 * @param {Array} p1 - Vector with 3 elements. It represents a point in the 3d space
 * @param {Array} p2 - Vector with 3 elements. It represents a point in the 3d space
 * @returns The cartesian distance between the points p1 and p2
 */
export function getDist(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[2] - p1[2], 2))
}