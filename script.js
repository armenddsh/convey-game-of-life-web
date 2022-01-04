/*
  - Convey Game Of Life -
*/
let interval;

const containerElement = document.getElementById("container");
const startElement = document.getElementById("start");
const stopElement = document.getElementById("stop");
const resetElement = document.getElementById("reset");

const rows = 50;
const cols = 50;
const probability = 0.8;
const intervalTime = 1000;
let cells = initalize(containerElement);

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

stopElement.addEventListener("click", () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
});

resetElement.addEventListener("click", () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  cells = reset(cells);
});

function initalize(container) {
  const cells = new Map();

  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    container.appendChild(row);

    for (let j = 0; j < cols; j++) {
      const id = `${i}-${j}`;
      const cell = document.createElement("span");
      cell.classList.add("cell");
      cell.id = id;
      cells.set(id, null);
      row.appendChild(cell);
    }
  }

  return cells;
}

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

      /*
        Rules:
          A live cell dies if it has fewer than two live neighbors.
          A live cell with more than three live neighbors dies.
          A live cell with two or three live neighbors lives on to the next generation.
          A dead cell will be brought back to live if it has exactly three live neighbors.
      */
      if (cell) {
        // live cell
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
  }

  return nextIterationCells;
}

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

function render(cells) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const id = `${i}-${j}`;
      const cell = cells.get(id);
      console.log(id, cell);
      const el = document.getElementById(id);
      if (cell) {
        el.classList.add("alive");
      } else {
        el.classList.remove("alive");
      }
    }
  }
}
