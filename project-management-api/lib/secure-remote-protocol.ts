import * as BigInt from "big-integer";

export function generateSLR(){
    let g = this.getGenerator();

    let v = g
}

export function bigPrime() {
    let q = BigInt.one;
    let N = q.multiply(BigInt(2)).add(BigInt.one);

    // keep incrementing q until it is a Sophie Germain prime, and the number equals 105749 (chosen at
    // random, so the 105749th Sophie Germain prime) keeping the bit length between 26 and 28
    let r = 0;
    while (!q.isProbablePrime() && !N.isProbablePrime() && r < 105749
        && N.bitLength().greaterOrEquals(26) && N.bitLength().lesserOrEquals(28)) q.next();
    console.log(q);
    console.log(N);
    console.log(N.bitLength());
    return N;
}

export function getGenerator(){
    let N = this.bigPrime();

    // algorithm for fast exponentiation mod p
    const fastExpoModP = (x, n, p) => {
        if (n.eq(0)){
            return 1;
        } else if (n.eq(1)) {
            return x
        } else if (n.mod(2).eq(0)) {
            return fastExpoModP(x.pow(2).mod(p), n.divide(2), p);
        } else {
            return x.multiply(fastExpoModP(x.pow(2).mod(p), n.prev().divide(2), p)).mod(p);
        }
    }

    // Sieve of Eratosthenes algorithm to get prime factors of N-1
    let primeFactors = [];
    let booleans = [];
    for (let a = 2; a < N.prev().toJSNumber(); a++) booleans.push(true);
    for (let i = 2; i < Math.sqrt(N.prev().toJSNumber()); i++) {
        if (booleans[i]) {
            for (let m = 0, j = i^2 + m*i; j < N.prev().toJSNumber(); m++){
                booleans[j] = false;
            }
        }
    }
    for (let i = 2; i < N.prev().toJSNumber(); i++) {
        if (booleans[i] && N.prev().isDivisibleBy(i)) primeFactors.push(i);
    }

    // finally an algorithm to find the smallest primitive of N
    let femp = 0;
    const getPrimitiveModP = (p, primes) => {
        let m = p.prev();
        for (let i = 2; i < m.toJSNumber(); i++) {
            for (let q = 1; q <= primes.length; q++) {
                femp = fastExpoModP(i, m.divide(primes[q]), p);
                if (femp === 1){
                    break;
                }
            }
            if (femp > 1){
                return i;
            }
        }
    };

    return getPrimitiveModP(N, primeFactors);
}

export function randomString(){
    let text = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 20; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return text;
}

export function generateSLR_A(password){
    let salt = randomString();
    let N = this.bigPrime();
}