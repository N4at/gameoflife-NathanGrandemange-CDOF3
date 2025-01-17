const readline = require('readline');

// Initializing the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let gridSize; // Grid size will be determined by the user
let grid; // The grid will be initialized after size is provided

// Function to display the grid
function displayGrid() {
  console.clear();
  for (let row = 0; row < gridSize; row++) {
    let rowString = '';
    for (let col = 0; col < gridSize; col++) {
      rowString += grid[row][col] ? '■' : '⸱';
    }
    console.log(rowString);
  }
}

// Function to count the live neighbors of a cell
function countNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const r = row + i;
      const c = col + j;
      if (
        r >= 0 && r < gridSize &&
        c >= 0 && c < gridSize &&
        !(i === 0 && j === 0)
      ) {
        count += grid[r][c] ? 1 : 0;
      }
    }
  }
  return count;
}

// Function to update the grid based on Conway's rules
function updateGrid() {
  const newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const neighbors = countNeighbors(row, col);
      if (grid[row][col] && (neighbors === 2 || neighbors === 3)) {
        newGrid[row][col] = true; // Live cell stays alive
      } else if (!grid[row][col] && neighbors === 3) {
        newGrid[row][col] = true; // Dead cell becomes alive
      } else {
        newGrid[row][col] = false; // Cell remains dead
      }
    }
  }

  grid = newGrid;
}

// Main function to run the game
function mainLoop(delay) {
  displayGrid();
  updateGrid();
  setTimeout(() => mainLoop(delay), delay);
}

// Function to generate a random grid
function generateRandomGrid() {
  grid = Array.from({ length: gridSize }, () => 
    Array.from({ length: gridSize }, () => Math.random() > 0.7)
  );
}

// Function to ask for cell positions
function askForCell() {
  rl.question('Enter the coordinates of a living cell (row col), or type "rand" for a random generation, or "done" to finish: ', (input) => {
    if (input.toLowerCase() === 'done') {
      rl.question('Enter the delay between each step (in milliseconds): ', (delayInput) => {
        const delay = parseInt(delayInput, 10);
        if (isNaN(delay) || delay <= 0) {
          console.log("Please enter a valid delay greater than 0.");
          rl.close();
        } else {
          console.log('Initial grid setup completed.\n');
          displayGrid();
          mainLoop(delay); // Start the game with the specified delay
        }
      });
      return;
    }

    if (input.toLowerCase() === 'rand') {
      generateRandomGrid(); // Generate a random grid if "rand" is typed
      console.log('Random initial generation completed.\n');
      displayGrid();
      return askForCell(); // Ask again to allow for further inputs or "done"
    }

    const [row, col] = input.split(' ').map(Number);

    // Check if the coordinates are within the bounds of the grid
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      grid[row][col] = true;
      console.log(`Cell at (${row}, ${col}) is now alive.\n`);
      displayGrid(); // Display the grid after each cell initialization
    } else {
      console.log('Invalid coordinates. Please try again.\n');
    }

    // Prompt for the next cell
    askForCell();
  });
}

// Start of the program, asking for grid size
rl.question('Welcome to Conway\'s Game of Life!\nEnter the size of the grid (e.g., 20 for a 20x20 grid): ', (sizeInput) => {
  gridSize = parseInt(sizeInput, 10);

  if (isNaN(gridSize) || gridSize <= 0) {
    console.log('Invalid grid size. Please restart the program and enter a positive number.');
    rl.close();
    return;
  }

  // Initialize the grid with the given size
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  console.log(`Grid of size ${gridSize}x${gridSize} initialized.`);
  console.log('Please enter the coordinates for the first generation.');
  console.log('Type "rand" for a random grid, or "done" when you are finished.\n');

  askForCell();
});
