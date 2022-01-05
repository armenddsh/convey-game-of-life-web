/*
  - Convey Game Of Life -
*/

// ========= Constants ==========

let interval;
const probability = 0.8;
const containerName = "grid";

const containerElement = document.getElementById(containerName);
const startElement = document.getElementById("start");
const stopElement = document.getElementById("stop");
const resetElement = document.getElementById("reset");
const rowElement = document.getElementById("row");
const colElement = document.getElementById("col");
const intervalElement = document.getElementById("interval");

let drawing = false;
let rows = rowElement.value || 50;
let cols = colElement.value || 50;
let intervalTime = intervalElement.value || 500;

let cells = new Map();
cells = initialize(containerElement);

// ========= Event Listeners ==========

/**
 * Change rows button click
 */
rowElement.addEventListener("change", (event) => {
  if (interval) {
    _clearInterval();
  }

  rows = parseInt(event.target.value);
  clearBox(containerName);
  cells = initialize(containerElement);
});

/**
 * Change columns button click
 */
colElement.addEventListener("change", (event) => {
  if (interval) {
    _clearInterval();
  }

  cols = parseInt(event.target.value);
  clearBox(containerName);
  cells = initialize(containerElement);
});

/**
 * Change interval button click
 */
intervalElement.addEventListener("change", (event) => {
  if (interval) {
    _clearInterval();
  }

  intervalTime = parseInt(event.target.value);
  clearBox(containerName);
  cells = initialize(containerElement);
});

/**
 * Start button click, start game
 */
startElement.addEventListener("click", () => {
  if (!interval) {
    if (containerElement) {
      if (Array.from(cells.values()).filter((f) => f).length === 0) {
        cells = createRandom(cells);
      }
    }
    interval = setInterval(() => {
      render(cells);
      cells = start(cells);
    }, intervalTime);
  }
});

/**
 * Stop button click, stop game
 */
stopElement.addEventListener("click", () => {
  if (interval) {
    _clearInterval();
  }
});

/**
 * Reset button click, reset game
 */
resetElement.addEventListener("click", () => {
  if (interval) {
    _clearInterval();
  }

  cells = reset(cells);
});

// ========= Functions ==========

/**
 * Stop the timer
 */
function _clearInterval() {
  clearInterval(interval);
  interval = null;
}

/**
 * Clear box, clears an element
 * @param {*} elementId
 */
function clearBox(elementId) {
  document.getElementById(elementId).innerHTML = "";
}

/**
 * User leave cells
 * @param {event} event
 */
function pointerup(event) {
  event.preventDefault();
  drawing = false;
}

/**
 * User moves on cell
 * @param {event} event
 */
function pointermove(event) {
  event.preventDefault();
  if (drawing) {
    cells.set(event.target.id, true);
    render(cells);
  }
}

/**
 * User clicks on cell
 * @param {event} event
 */
function pointerdown(event) {
  event.preventDefault();
  cells.set(event.target.id, true);
  drawing = true;
  render(cells);
}

/**
 * Initalize game
 * @param {container} element
 */
function initialize(container) {
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    container.appendChild(row);

    for (let j = 0; j < cols; j++) {
      const id = `${i}-${j}`;
      const cell = document.createElement("span");

      cell.addEventListener("pointerup", pointerup);
      cell.addEventListener("pointermove", pointermove);
      cell.addEventListener("pointerdown", pointerdown);

      cell.classList.add("cell");
      cell.id = id;
      cells.set(id, null);
      row.appendChild(cell);
    }
  }

  return cells;
}

/**
 * Start game
 * @param {*} cells
 * @returns
 */
function start(cells) {
  const nextIterationCells = new Map();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const id = `${i}-${j}`;

      nextIterationCells.set(id, false);

      const cell = cells.get(id);
      const cell_nw = cells.get(`${i - 1}-${j - 1}`);
      const cell_n = cells.get(`${i - 1}-${j}`);
      const cell_ne = cells.get(`${i - 1}-${j + 1}`);
      const cell_e = cells.get(`${i}-${j + 1}`);
      const cell_se = cells.get(`${i + 1}-${j + 1}`);
      const cell_s = cells.get(`${i + 1}-${j}`);
      const cell_sw = cells.get(`${i + 1}-${j - 1}`);
      const cell_w = cells.get(`${i}-${j - 1}`);

      const _cells = [
        cell_nw,
        cell_n,
        cell_ne,
        cell_e,
        cell_se,
        cell_s,
        cell_sw,
        cell_w,
      ];

      const countAlive = _cells.filter((f) => f).length;

      checkRules(cell, countAlive, id, nextIterationCells);
    }
  }

  return nextIterationCells;
}

/**
 * Check rules
 * @param {*} cell
 * @param {*} countAlive
 * @param {*} id
 */
function checkRules(cell, countAlive, id, nextIterationCells ) {
  /*
    Rules:
      A live cell dies if it has fewer than two live neighbors.
      A live cell with more than three live neighbors dies.
      A live cell with two or three live neighbors lives on to the next generation.
      A dead cell will be brought back to live if it has exactly three live neighbors.
  */

  if (cell) {
    if (countAlive < 2 || countAlive > 3) {
      nextIterationCells.set(id, false);
    } else if (countAlive === 2 || countAlive === 3) {
      nextIterationCells.set(id, true);
    }
  } else {
    if (countAlive === 3) {
      nextIterationCells.set(id, true);
    }
  }
}

/**
 * Reset all cells
 * @param {*} cells
 * @returns
 */
function reset(cells) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const id = `${i}-${j}`;
      const el = document.getElementById(id);
      if (el.classList.contains("alive")) {
        el.classList.remove("alive");
      }
      cells.set(id, false);
    }
  }

  return cells;
}

/**
 * Create random cells
 * @param {*} cells
 * @returns
 */
function createRandom(cells) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const id = `${i}-${j}`;
      const randomNumber = Math.random();
      if (randomNumber > probability) {
        const el = document.getElementById(id);
        el.classList.add("alive");
        cells.set(id, true);
      }
    }
  }

  return cells;
}

/**
 * Render cells
 * @param {*} cells
 */
function render(cells) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const id = `${i}-${j}`;
      const cell = cells.get(id);
      const el = document.getElementById(id);
      if (cell) {
        el.classList.add("alive");
      } else {
        el.classList.remove("alive");
      }
    }
  }
}
