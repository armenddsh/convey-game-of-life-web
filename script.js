/*
  - Convey Game Of Life -
*/

const containerElement = document.getElementById("container");
const rows = 10;
const cols = 10;
const probability = 0.9;

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
      const cell_sw = cells.get(`${i - 1}-${j + 1}`);
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

function createRandom(cells) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const id = `${i}-${j}`;
      const cell = cells.get(id);
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

function createRandomTemplate(cells) {
  cells.set("2-3", true);
  cells.set("3-3", true);
  cells.set("4-3", true);
  cells.set("4-2", true);
  cells.set("3-1", true);

  return cells;
}

if (containerElement) {
  let cells = initalize(containerElement);

  cells = createRandomTemplate(cells);
  // cells = createRandom(cells);
  render(cells);
  cells = start(cells);

  render(cells);
  cells = start(cells);

  // setInterval(() => {
  //   cells = start(cells);
  //   render(cells);
  // }, 1000);
}
