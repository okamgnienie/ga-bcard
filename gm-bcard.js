
/**
 * @author Przemyslaw Hardyn • przemyslawhardyn.com
 * Birthday card, powered by genetic algorithm.
 * https://github.com/phardyn/ga-bcard
 */


/** Class representing individual chromosome */
class Chromosome {

  /**
   * @param {string} code
   */
  constructor(code) {
    this.code = code || '';
    this.cost = 10000;
    this.chanceToMutate = 0.5;
  }

  /**
   * @desc Replace current genome with new randomly generated
   *
   * @param {integer} length - target genome length
   */
  random(length) {
    this.code = '';

    while (length--) {
      this.code += String.fromCharCode(Math.floor(Math.random() * 255));
    }
  }

  /**
   * @desc Mutate chromosome with other
   *
   * @param {float} chance - chance to mutate
   */
  mutate(chance) {
    if (Math.random() > chance) return;

    let newGenome = '';
    const index = Math.floor(Math.random() * this.code.length);
    const upOrDown = Math.random() <= this.chanceToMutate ? -1 : 1;
    const newGen = String.fromCharCode(this.code.charCodeAt(index) + upOrDown);

    for (let i = 0; i < this.code.length; i++) {
      if (i === index) newGenome += newGen;
      else newGenome += this.code[i];
    }

    this.code = newGenome;
  }

  /**
   * @desc Mate this chromosome with other
   *
   * @param {Object} chromosome
   *
   * @returns {Array} - two new children
   */
  mate(chromosome) {
    const pivot = Math.round(this.code.length / 2) - 1;

    const child1 = this.code.substr(0, pivot) + chromosome.code.substr(pivot);
    const child2 = chromosome.code.substr(0, pivot) + this.code.substr(pivot);

    return [new Chromosome(child1), new Chromosome(child2)];
  }

  /**
   * @desc Calculate cost for chromosome
   *
   * @param {string} compareTo
   */
  calcCost(compareTo) {
    let total = 0;

    for (let i = 0; i < this.code.length; i++) {
      total
        += (this.code.charCodeAt(i) - compareTo.charCodeAt(i))
        * (this.code.charCodeAt(i) - compareTo.charCodeAt(i));
    }

    this.cost = total;
  }
}


/** Class representing population of chromosomes */
class Population {

  /**
   * @param {string} goal - desired set of genes
   * @param {integer} size - number of entities in population
   * @param {callback} onComplete - run after the desired combination is found
   */
  constructor(goal, size, onComplete) {
    this.goal = goal;

    this.members = [];
    this.generationNumber = 0;

    this.onComplete = onComplete;
    this.display = new Display(document.getElementById('chromosome'));

    while (size--) {
      const chromosome = new Chromosome();
      chromosome.random(this.goal.length);
      this.members.push(chromosome);
    }
  }

  /**
   * @desc Sort members of current generation based on the cost
   */
  sort() {
    this.members.sort((a, b) => a.cost - b.cost);
  }

  /**
   * @desc All the actions performed on the population
   * on every generation. (mating, mutation etc.)
   */
  generation() {
    for (let i = 0; i < this.members.length; i++) {
      this.members[i].calcCost(this.goal);
    }

    this.sort();
    const children = this.members[0].mate(this.members[1]);
    this.members.splice(this.members.length - 2, 2, children[0], children[1]);

    this.display.print(this.members[0].code);

    for (let i = 0; i < this.members.length; i++) {
      this.members[i].mutate(0.5);
      this.members[i].calcCost(this.goal);

      if (this.members[i].code === this.goal) {
        this.sort();
        this.display.print(this.members[0].code);
        this.onComplete(this.generationNumber);
        return;
      }
    }
    this.generationNumber++;
    setTimeout(() => { this.generation(); }, 0.1);
  }
}


/** Class representing birthday card display */
class Display {

  /**
   * @param {Object} target - DOM element to print results to
   */
  constructor(target) {
    this.target = target;
    this.colors = ['#C2DD6A', '#78BBB4', '#F7F3CE', '#F64989'];
  }

  /**
   * @desc Returns color based on the geneCost
   *
   * @param {integer} geneCost
   *
   * @returns {string}
   */
  getColor(geneCost) {
    let color;
    if (geneCost < 100) {
      color = this.colors[0];
    } else if (geneCost < 115 && geneCost > 100) {
      color = this.colors[1];
    } else if (geneCost < 120 && geneCost > 115) {
      color = this.colors[2];
    } else {
      color = this.colors[3];
    }

    return color;
  }

  /**
   * @desc Print painted genome to the DOM element
   *
   * @param {string} code - genome
   */
  print(code) {
    this.target.innerHTML = '';
    let newCode = '<h1>';

    for (let i=0; i<code.length; i++) {
      newCode += (`<span id="${i}" style="color: ${this.getColor(code.charCodeAt(i))}">${code[i]}</span>`);
    }

    this.target.innerHTML = `${newCode}</h1>`;
  }
}

// --- - --- - --- DEMO --- - --- - --- //

window.onload = () => {
  const population = new Population(
    "Wszystkiego najlepszego dla Wikipedii! :)",
    20,
    showInfo
  ).generation();
};

/**
 * @desc Function displaying information after GA found combination.
 *
 * @param {integer} generation
 */
function showInfo(generation) {
  setTimeout(() => {
    document.getElementById('info1').className = 'info';
  }, 1000);

  setTimeout(() => {
    const interval = setInterval(() => {
      document.getElementById('39').innerHTML = ';';
      document.getElementById('40').innerHTML = '>';

      setTimeout(() => {
        document.getElementById('39').innerHTML = ':';
        document.getElementById('40').innerHTML = ')';
      }, 300);
    }, Math.floor(Math.random() * 40 + 30) * 100);
  }, 2000);

  setTimeout(() => {
    document.getElementById('info2').className = 'info';
  }, 3000);

  setTimeout(() => {
    document.getElementById('info3').innerHTML
      = `Łącznie powołano do życia <span style="color: white">${(generation * 20)}</span> stworków, w <span style="color: white">${generation}</span> pokoleniach.`;
  }, 5000);

  setTimeout(() => {
    document.getElementById('info4').className = 'info';
  }, 7000);

  setTimeout(() => {
    document.getElementById('footer').className = 'info';
  }, 8000);
}
