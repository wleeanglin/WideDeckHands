const suits = ['r', 'e', 's', 'g', 'v', 'b'];

function combinations(arr, n) {
    let result = [];
    let f = function(prefix, arr) {
        if (prefix.length === n) {
            result.push(prefix);
        } else {
            for (let i = 0; i < arr.length; i++) {
                f(prefix.concat(arr[i]), arr);
            }
        }
    }
    f([], arr);
    return result;
}

function isValidCombination(comb) {
    for (let suit of suits) {
        let count = comb.filter(s => s === suit).length;
        if (count >= 4) {
            return false;
        }
    }
    return true;
}

function compareCombinations(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return suits.indexOf(a[i]) - suits.indexOf(b[i]);
        }
    }
    return 0;
}

//Given a intenger n, generate all combinations of size n from best to worst
function getValidCombinations(n) {
    let allCombinations = combinations(suits, n);
    let validCombinations = allCombinations.filter(isValidCombination);
    validCombinations.sort(compareCombinations);
    return validCombinations;
}

module.exports = {
    suits,
    combinations,
    isValidCombination,
    compareCombinations,
    getValidCombinations
};