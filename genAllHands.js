const TupleGenerator = require('./TupleGenerator');
const fs = require('fs');
const offSuitTuples = require('./offSuitTuples');

const tupleMap = TupleGenerator.generateAllTuples();
const offSuitTupleArray = offSuitTuples.getValidCombinations(5);

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6'];
const rankNames = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven', 'Sixe'];

const suits = ['r', 'e', 's', 'g', 'v', 'b'];

const straights = [];

let handRank = 0;

const stream = fs.createWriteStream('wideDeckHandOrder.txt');
straightFlush(stream);
fiveOfAKind(stream);
fiveFlush(stream);
fourOfAKind(stream);
fullHouse(stream);
fourFlush(stream);
straight(stream); 
threeKind(stream);
twoPair(stream);
onePair(stream); 
highCard(stream);

function straightFlush(stream) {
    for(let i = 0; i < ranks.length - 3; i++) { 
        const strFlushTemplate = [ranks[i], ranks[i + 1], ranks[i + 2], ranks[i + 3], ranks[(i + 4)%ranks.length]];
        straights.push(strFlushTemplate.join(''));
        for(let j = 0; j < suits.length; j++){
            handRank++;
            let strFlush = '';
            for(let k = 0; k < strFlushTemplate.length; k++) {
                strFlush += strFlushTemplate[k] + suits[j];
            }
            stream.write(strFlush + '\t\t' + handRank + '\t\t' + rankNames[i] + ' high straight flush' + '\n');
        }
    }
}

function fiveOfAKind() {
    const fiveTuples = tupleMap[5]; 
    for(let i = 0; i < ranks.length; i++) {
        for(let j = 0; j < fiveTuples.length; j++) {
            handRank++;
            let fiveK = '';
            for(let k = 0; k < fiveTuples[j].length; k++) {
                fiveK += ranks[i] + fiveTuples[j][k];
            }
            stream.write(fiveK + '\t\t' + handRank + '\t\t' + 'Five ' + rankNames[i] + 's' + '\n');
        }
    }
}

function fiveFlush(stream) {
    for(let i = 0; i < ranks.length - 4; i++) {
        for(let j = i + 1; j < ranks.length - 3; j++) {
            for(let k = j + 1; k < ranks.length - 2; k++) {
                for(let l = k + 1; l < ranks.length - 1; l++) {
                    for(let m = l + 1; m < ranks.length; m++) {
                        const flushTemplate = [ranks[i], ranks[j], ranks[k], ranks[l], ranks[m]];
                        //Special case A9876
                        if (!(straights.includes(flushTemplate.join('')) || straights.includes(flushTemplate.join('').substring(1) + ranks[i]))) {
                            for(let n = 0; n < suits.length; n++) {
                                handRank++; 
                                let flush = '';
                                for(let o = 0; o < flushTemplate.length; o++){
                                    flush += flushTemplate[o] + suits[n];
                                }
                                stream.write(flush + '\t\t' + handRank + '\t\t' + rankNames[i] + ' high 5 flush' + '\n');
                            }
                        }
                    }
                }
            }
        }
    }
}

function fourOfAKind(stream) {
    const fourTuples = tupleMap[4]; 
    for(let i = 0; i < ranks.length; i++) {
        for(let j = 0; j < ranks.length; j++) {
            if(j !== i) {
                for(let k = 0; k < fourTuples.length; k++) {
                    for(let l = 0; l < suits.length; l++) {
                        handRank++;
                        let fourK = '';
                        for(let m = 0; m < fourTuples[k].length; m++) {
                            fourK += ranks[i] + fourTuples[k][m];
                        }
                        fourK += ranks[j] + suits[l];
                        stream.write(fourK + '\t\t' + handRank + '\t\t' + 'Four ' + rankNames[i] + 's' + '\n');
                    }
                }
            }
        }
    }
}

function fullHouse(stream) {
    const threeTuples = tupleMap[3];
    const twoTuples = tupleMap[2];
    for(let i = 0; i < ranks.length; i++) {
        for(let j = 0; j < ranks.length; j++) {
            if(i !== j) {
                const fullHouseTemplate = (ranks[i].repeat(3) + ranks[j].repeat(2)).split('');
                for(let l = 0; l < threeTuples.length; l++) {
                    for(let k = 0; k < twoTuples.length; k++) {
                        handRank++;
                        const fullHouse = fullHouseTemplate[0] + threeTuples[l][0] +
                            fullHouseTemplate[1] + threeTuples[l][1] +
                            fullHouseTemplate[2] + threeTuples[l][2] +
                            fullHouseTemplate[3] + twoTuples[k][0] +
                            fullHouseTemplate[4] + twoTuples[k][1];
                        stream.write(fullHouse + '\t\t' + handRank + '\t\t' + rankNames[i] + 's full of ' + rankNames[j] + 's' + '\n');
                    }
                }
            }
        }
    }
}

function fourFlush(stream) {
    for(let i = 0; i < ranks.length - 3; i++) {
        for(let j = i + 1; j < ranks.length - 2; j++) {
            for(let k = j + 1; k < ranks.length - 1; k++) {
                for(let l = k + 1; l < ranks.length; l++) {
                    //Suits trump kicker
                    for(let m = 0; m < suits.length; m++) {
                        //After suit picked cycle through ranks
                        for(let n = 0; n < ranks.length; n++) {
                            //Suit of kicker
                            for(let o = 0; o < suits.length; o++) {
                                //Kicker can't have the same suit
                                if(o != m) {
                                    handRank++;
                                    const fourFlush = ranks[i] + suits[m] +
                                        ranks[j] + suits[m] +
                                        ranks[k] + suits[m] +
                                        ranks[l] + suits[m] +
                                        ranks[n] + suits[o]; 
                                    stream.write(fourFlush + '\t\t' + handRank + '\t\t' + rankNames[i] + ' high 4 flush' + '\n')
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function straight(stream) { 
    for(let i = 0; i < ranks.length - 3; i++) {
        const straightTemplate = [ranks[i], ranks[i + 1], ranks[i + 2], ranks[i + 3], ranks[(i + 4)%ranks.length]];
        for(let j = 0; j < offSuitTupleArray.length; j++) {
            handRank++; 
            let straight = '';
            for(let l = 0; l < straightTemplate.length; l++) {
                straight += straightTemplate[l] + offSuitTupleArray[j][l];
            }
            stream.write(straight + '\t\t' + handRank + '\t\t' + rankNames[i] + ' high straight' + '\n');
        }
    }
}

function threeKind(stream) { 
    threeTuples = tupleMap[3]; 
    for(let i = 0; i < ranks.length; i++) {
        //suit trumps kicker
        for(let j = 0; j < threeTuples.length; j++) {
            for(let k = 0; k < ranks.length - 1; k++) {
                for(let l = 0; l < suits.length; l++) {
                    for(let m = k + 1; m < ranks.length; m++) {
                        for(let n = 0; n < suits.length; n++) {
                            handRank++; 
                            const threeK = ranks[i] + threeTuples[j][0] +
                                ranks[i] + threeTuples[j][1] +
                                ranks[i] + threeTuples[j][2] +
                                ranks[k] + suits[m] +
                                ranks[l] + suits[n];
                                stream.write(threeK + '\t\t' + handRank + '\t\t' + 'Three ' + rankNames[i] + 's' + '\n');
                        }
                    }
                }
            }
        }
    }
}

function twoPair(stream) {
    const twoTuples = tupleMap[2];
    for(let i = 0; i < ranks.length - 1; i++) {
        for(let j = i + 1; j < ranks.length; j++) {
            //First pair suits > second pair suits > kicker
            for(let k = 0; k < twoTuples.length; k++) {
                for(let l = 0; l < twoTuples.length; l++) {
                    for(let m = 0; m < ranks.length; m++) {
                        if(m != i && m != j) {
                            for(let n = 0; n < suits.length; n++) {
                                handRank++;
                                const twoP = ranks[i] + twoTuples[k][0] +
                                    ranks[i] + twoTuples[k][1] +
                                    ranks[j] + twoTuples[l][0] +
                                    ranks[j] + twoTuples[l][1] +
                                    ranks[m] + suits[n];
                                stream.write(twoP + '\t\t' + handRank + '\t\t' + rankNames[i] + 's and ' + rankNames[j] + 's' + '\n');
                            }
                        }
                    }
                }
            }
        }
    }
}

function onePair(stream) {
    twoTuples = tupleMap[2]; 
    for(let i = 0; i < ranks.length; i++){
        for(let j = 0; j < twoTuples.length; j++){
            for(let k = 0; k < ranks.length - 2; k++) {
                for(let m = 0; m < suits.length; m++) {
                    for(let n = k + 1; n < ranks.length - 1; n++) {
                        for(let o = 0; o < suits.length; o++) {
                            for(let p = n + 1; p < ranks.length; p++) {
                                for(let q = 0; q < suits.length; q++) {
                                    if(k != i && n != i && p != i) {
                                        //If the 3 kickers are the same suit we need to ensure that suit isn't in the pair
                                        if(m == o && o == q) {
                                            if(twoTuples[j].includes(suits[m])) {
                                                continue;
                                            }
                                        }
                                        handRank++;
                                        const oneP = ranks[i] + twoTuples[j][0] +
                                            ranks[i] + twoTuples[j][1] +
                                            ranks[k] + suits[m] +
                                            ranks[n] + suits[o] +
                                            ranks[p] + suits[q];
                                        stream.write(oneP + '\t\t' + handRank  + '\t\t' + 'Pair of ' + rankNames[i] + 's' + '\n');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} 

function highCard(stream) {
    for(let i = 0; i < ranks.length - 4; i++) {
        for(let si = 0; si < suits.length; si++) {
            for(let j = i + 1; j < ranks.length - 3; j++) {
                for(let sj = 0; sj < suits.length; sj++) {
                    for(let k = j + 1; k < ranks.length - 2; k++) {
                        for(let sk = 0; sk < suits.length; sk++) {
                            for(let l = k + 1; l < ranks.length - 1; l++) {
                                for(let sl = 0; sl < suits.length; sl++) {
                                    for(let m = l + 1; m < ranks.length; m++) {
                                        for(let sm = 0; sm < suits.length; sm++) {
                                            const highCardTemplate = [ranks[i], ranks[j], ranks[k], ranks[l], ranks[m]];
                                            // Get rid of flushes
                                            if(isFlush(si, sj, sk, sl, sm)) {
                                                continue;
                                            }
                                            if(!(straights.includes(highCardTemplate.join('')) || straights.includes(highCardTemplate.join('').substring(1) + ranks[i]))) {
                                                handRank++;
                                                const highCard = ranks[i] + suits[si] +
                                                    ranks[j] + suits[sj] +
                                                    ranks[k] + suits[sk] +
                                                    ranks[l] + suits[sl] +
                                                    ranks[m] + suits[sm];
                                                stream.write(highCard + '\t\t' + handRank + '\t\t' + rankNames[i] + '-high' + '\n');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function isFlush(s1, s2, s3, s4, s5) {
    const counts = {};

    [s1, s2, s3, s4, s5].forEach(s => {
        counts[s] = (counts[s] || 0) + 1;
    });

    return Object.values(counts).some(count => count >= 4);
}
