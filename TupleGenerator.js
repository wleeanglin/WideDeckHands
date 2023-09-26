const suits = ['r', 'e', 's', 'g', 'v', 'b'];

class TupleGenerator {

    static generateAllTuples() {
        const resultMap = {};
        for (let n = 1; n <= suits.length; n++) {
            resultMap[n] = this.generateNTuples(n, 0, []);
        }
        return resultMap;
    }

    static generateNTuples(n, start, current) {
        const result = [];
        if (current.length === n) {
            result.push([...current]);
            return result;
        }

        for (let i = start; i < suits.length; i++) {
            current.push(suits[i]);
            result.push(...this.generateNTuples(n, i + 1, current));
            current.pop();
        }

        return result;
    }
}

module.exports = TupleGenerator;