export class Minesweeper {
  constructor(gameField) {
    this.cells = [...gameField.querySelectorAll("div")];
    this.cellsGrouppedByRow = this.groupCellsByRow();
    this.bombsOnField = 20;
    this.remainingMineFlags = this.bombsOnField;
  }

  groupCellsByRow() {
    const grouppedCells = [];
    for (let i = 0; i < 10; i++) {
      grouppedCells.push([]);
      for (let j = 0; j < 10; j++) {
        grouppedCells[i].push(this.cells[i * 10 + j]);
      }
    }
    return grouppedCells;
  }

  setBombs(except) {
    const bombCantBePlaced = [except];
    for (let i = 0; i < this.bombsOnField; i++) {
      let randomIndex = Math.floor(Math.random() * this.cells.length);
      while (bombCantBePlaced.includes(this.cells[randomIndex])) {
        randomIndex = Math.floor(Math.random() * this.cells.length);
      }

      this.cells[randomIndex].hasBomb = true;
      bombCantBePlaced.push(this.cells[randomIndex]);
    }
  }

  setNumberHints() {
    for (let i = 0; i < this.cellsGrouppedByRow.length; i++) {
      for (let j = 0; j < this.cellsGrouppedByRow[i].length; j++) {
        const cell = this.cellsGrouppedByRow[i][j];
        if (cell.hasBomb) continue;
        let bombsNear = 0;

        if (this.cellsGrouppedByRow[i - 1]?.[j - 1]?.hasBomb) bombsNear++;
        if (this.cellsGrouppedByRow[i - 1]?.[j]?.hasBomb) bombsNear++;
        if (this.cellsGrouppedByRow[i - 1]?.[j + 1]?.hasBomb) bombsNear++;

        if (this.cellsGrouppedByRow[i]?.[j - 1]?.hasBomb) bombsNear++;
        if (this.cellsGrouppedByRow[i]?.[j + 1]?.hasBomb) bombsNear++;

        if (this.cellsGrouppedByRow[i + 1]?.[j - 1]?.hasBomb) bombsNear++;
        if (this.cellsGrouppedByRow[i + 1]?.[j]?.hasBomb) bombsNear++;
        if (this.cellsGrouppedByRow[i + 1]?.[j + 1]?.hasBomb) bombsNear++;

        cell.bombsNear = bombsNear;
      }
    }
  }

  openAllCellsNear(cell) {
    const cellX = this.cells.indexOf(cell) % 10;
    const cellY = Math.floor(this.cells.indexOf(cell) / 10);

    this.forcedOpen(this.cellsGrouppedByRow[cellY - 1]?.[cellX - 1]);
    this.forcedOpen(this.cellsGrouppedByRow[cellY - 1]?.[cellX]);
    this.forcedOpen(this.cellsGrouppedByRow[cellY - 1]?.[cellX + 1]);

    this.forcedOpen(this.cellsGrouppedByRow[cellY]?.[cellX - 1]);
    this.forcedOpen(this.cellsGrouppedByRow[cellY]?.[cellX + 1]);

    this.forcedOpen(this.cellsGrouppedByRow[cellY + 1]?.[cellX - 1]);
    this.forcedOpen(this.cellsGrouppedByRow[cellY + 1]?.[cellX]);
    this.forcedOpen(this.cellsGrouppedByRow[cellY + 1]?.[cellX + 1]);
  }

  forcedOpen(cell) {
    if (!cell) return;
    if (cell.hasBomb) return;
    if (cell.isOpenedCell) return;

    cell.isOpenedCell = true;
    cell.setAttribute("data-status", "opened");
    if (!cell.bombsNear) {
      this.openAllCellsNear(cell);
      return;
    }

    cell.textContent = cell.bombsNear;
  }

  showBombs() {
    for (const cell of this.cells) {
      if (cell.hasBomb) cell.textContent = "💣";
    }
  }

  checkForWin() {
    for (const cell of this.cells) {
      if (cell.hasBomb && !cell.hasMineFlag) return false;
    }
    return true;
  }
}
