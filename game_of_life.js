const readline = require('readline');

// Dimensions de la grille
const numRows = 20;
const numCols = 20;

// Fonction pour créer une grille aléatoire
function createGrid() {
    const grid = [];
    for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = Math.random() > 0.7 ? 1 : 0; // 1 = vivante, 0 = morte
        }
    }
    return grid;
}

// Fonction pour afficher la grille dans la console
function displayGrid(grid) {
    console.clear();
    for (const row of grid) {
        console.log(row.map(cell => (cell === 1 ? '■' : '⸱')).join(' '));
    }
}

// Fonction pour compter les voisins vivants d'une cellule
function countNeighbors(grid, row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const r = row + i;
            const c = col + j;
            if (
                r >= 0 && r < numRows &&
                c >= 0 && c < numCols &&
                !(i === 0 && j === 0)
            ) {
                count += grid[r][c];
            }
        }
    }
    return count;
}

// Fonction pour mettre à jour la grille selon les règles de Conway
function updateGrid(grid) {
    const newGrid = [];
    for (let i = 0; i < numRows; i++) {
        newGrid[i] = [];
        for (let j = 0; j < numCols; j++) {
            const neighbors = countNeighbors(grid, i, j);
            if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = 0; // Cellule meurt
            } else if (grid[i][j] === 0 && neighbors === 3) {
                newGrid[i][j] = 1; // Cellule naît
            } else {
                newGrid[i][j] = grid[i][j]; // Cellule reste dans le même état
            }
        }
    }
    return newGrid;
}

// Fonction principale pour exécuter le jeu
function mainLoop(grid, delay) {
    displayGrid(grid);
    grid = updateGrid(grid);
    setTimeout(() => mainLoop(grid, delay), delay);
}

// Initialisation avec demande de délai à l'utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Entrez le délai entre chaque étape (en millisecondes) : ', (answer) => {
    const delay = parseInt(answer, 10);
    if (isNaN(delay) || delay <= 0) {
        console.log("Veuillez entrer un nombre valide supérieur à 0.");
        rl.close();
    } else {
        rl.close();
        const grid = createGrid();
        mainLoop(grid, delay);
    }
});
