let diceValues;
let heldDice;
let rollsLeft;
let totalScore;
let canScore;
let scoredCategories;

const rollButton = document.getElementById('rollButton');

resetGame();

rollButton.addEventListener('click', rollDice);

function rollDice() {
    if (rollsLeft > 0) {
        for (let i = 0; i < 5; i++) {
            if (!heldDice[i]) {
                diceValues[i] = Math.floor(Math.random() * 6) + 1;
                document.getElementById(`dice${i + 1}`).innerText = diceValues[i];
            }
        }
        rollsLeft--;
        updatePossibleScores(); 
        canScore = true; 
        updateCategoryLabels(); 
    } else {
        alert("No rolls left. Please select a category to score.");
    }
}

function toggleHold(index) {
    if (rollsLeft < 3) { 
        heldDice[index] = !heldDice[index];
        document.getElementById(`dice${index + 1}`).classList.toggle("held");
    } else {
        alert("You need to roll the dice first.");
    }
}

function calculateScore(category) {
    let counts = Array(7).fill(0);
    diceValues.forEach(die => counts[die]++);

    const categoryToNumber = {
        ones: 1,
        twos: 2,
        threes: 3,
        fours: 4,
        fives: 5,
        sixes: 6
    };

    if (category in categoryToNumber) {
        let num = categoryToNumber[category];
        return counts[num] * num;
    }

    switch (category) {
        case 'threeOfKind':
            return counts.some(count => count >= 3) ? sumDice() : 0;
        case 'fourOfKind':
            return counts.some(count => count >= 4) ? sumDice() : 0;
        case 'fullHouse':
            return counts.includes(3) && counts.includes(2) ? 25 : 0;
        case 'smallStraight':
            return isSmallStraight(counts) ? 30 : 0;
        case 'largeStraight':
            return isLargeStraight(counts) ? 40 : 0;
        case 'yahtzee':
            return counts.includes(5) ? 50 : 0;
        case 'chance':
            return sumDice();
        default:
            return 0;
    }
}

function isSmallStraight(counts) {

    let uniqueValues = [];
    for (let i = 1; i <= 6; i++) {
        if (counts[i] > 0) {
            uniqueValues.push(i);
        }
    }


    let consecutive = 1;
    for (let i = 1; i < uniqueValues.length; i++) {
        if (uniqueValues[i] === uniqueValues[i - 1] + 1) {
            consecutive++;
            if (consecutive >= 4) {
                return true;
            }
        } else {
            consecutive = 1;
        }
    }
    return false;
}

function isLargeStraight(counts) {
    
    let uniqueValues = [];
    for (let i = 1; i <= 6; i++) {
        if (counts[i] > 0) {
            uniqueValues.push(i);
        }
    }

 
    let consecutive = 1;
    for (let i = 1; i < uniqueValues.length; i++) {
        if (uniqueValues[i] === uniqueValues[i - 1] + 1) {
            consecutive++;
            if (consecutive >= 5) {
                return true;
            }
        } else {
            consecutive = 1;
        }
    }
    return false;
}

function sumDice() {
    return diceValues.reduce((a, b) => a + b, 0);
}

function scoreCategory(category) {
    if (!canScore) {
        alert("You cannot score right now. Please roll the dice.");
        return;
    }
    if (scoredCategories[category]) {
        alert("This category has already been scored.");
        return;
    }

    let score = calculateScore(category);
    document.getElementById(`${category}Score`).innerText = score;
    totalScore += score;
    document.getElementById("totalScore").innerText = `Total: ${totalScore}`;
    scoredCategories[category] = true;
    canScore = false; 
    updateCategoryLabels(); 

    checkGameOver();
    resetTurn();
}

function resetTurn() {
    rollsLeft = 3;
    heldDice.fill(false);
    for (let i = 0; i < 5; i++) {
        document.getElementById(`dice${i + 1}`).classList.remove("held");
        document.getElementById(`dice${i + 1}`).innerText = ''; 
    }
    clearUnscoredCategories();
}

function clearUnscoredCategories() {
    const categories = Object.keys(scoredCategories);

    categories.forEach(category => {
        if (!scoredCategories[category]) {
            document.getElementById(`${category}Score`).innerText = '';
        }
    });
}

function updatePossibleScores() {
    const categories = Object.keys(scoredCategories);

    categories.forEach(category => {
        if (!scoredCategories[category]) {
            let score = calculateScore(category);
            document.getElementById(`${category}Score`).innerText = score;
        }
    });
}

function checkGameOver() {
    const gameOver = Object.values(scoredCategories).every(value => value === true);
    if (gameOver) {
        alert(`Game Over! Your total score is ${totalScore}.`);
        resetGame(); 
    }
}

function updateCategoryLabels() {
    document.querySelectorAll('.score-section label').forEach((label) => {
        const category = label.getAttribute('data-category');
        if (scoredCategories[category]) {
            label.classList.add('disabled');
        } else if (canScore) {
            label.classList.remove('disabled');
        } else {
            label.classList.add('disabled');
        }
    });
}

function resetGame() {
  
    diceValues = [1, 1, 1, 1, 1];
    heldDice = [false, false, false, false, false];
    rollsLeft = 3;
    totalScore = 0;
    canScore = false;
    scoredCategories = {
        ones: false,
        twos: false,
        threes: false,
        fours: false,
        fives: false,
        sixes: false,
        threeOfKind: false,
        fourOfKind: false,
        fullHouse: false,
        smallStraight: false,
        largeStraight: false,
        yahtzee: false,
        chance: false,
    };


    for (let i = 0; i < 5; i++) {
        document.getElementById(`dice${i + 1}`).classList.remove("held");
        document.getElementById(`dice${i + 1}`).innerText = '';
    }

    const categories = Object.keys(scoredCategories);
    categories.forEach(category => {
        document.getElementById(`${category}Score`).innerText = '';
    });

    document.getElementById("totalScore").innerText = `Total: 0`;

    updateCategoryLabels();
}


for (let i = 0; i < 5; i++) {
    document.getElementById(`dice${i + 1}`).addEventListener("click", () => toggleHold(i));
}


document.querySelectorAll('.score-section label').forEach((label) => {
    const category = label.getAttribute('data-category');
    label.addEventListener('click', () => scoreCategory(category));
});


updateCategoryLabels();
