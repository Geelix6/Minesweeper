import { Minesweeper } from "./minesweeper.js";

const gameField = document.querySelector(".game-field");
const minesweeper = new Minesweeper(gameField);
const count = document.querySelector(".amount-mines");
count.textContent = minesweeper.bombsOnField;

document.addEventListener("click", startGame, { once: true });
document.addEventListener("contextmenu", (event) => event.preventDefault());

function startGame(event) {
  minesweeper.setBombs(event.target);
  minesweeper.setNumberHints();

  gameField.addEventListener("click", openNewCell);
  gameField.addEventListener("contextmenu", setMineFlag);

  event.target.isOpenedCell = true;
  event.target.setAttribute("data-status", "opened");

  if (!event.target.bombsNear) {
    minesweeper.openAllCellsNear(event.target);
    return;
  }
  event.target.textContent = event.target.bombsNear;
}

function openNewCell(event) {
  if (event.target.isOpenedCell) return;
  if (event.target.hasMineFlag) return;
  if (event.target.hasQuestionFlag) return;
  if (event.target.hasBomb) {
    alert("Бууум!, вы проиграли(");
    minesweeper.showBombs();
    gameField.removeEventListener("click", openNewCell);
    gameField.removeEventListener("contextmenu", setMineFlag);
    return;
  }

  event.target.isOpenedCell = true;
  event.target.setAttribute("data-status", "opened");

  if (!event.target.bombsNear) {
    minesweeper.openAllCellsNear(event.target);
    return;
  }
  event.target.textContent = event.target.bombsNear;
}

function setMineFlag(event) {
  if (event.target.isOpenedCell) return;

  const count = document.querySelector(".amount-mines");

  if (event.target.hasMineFlag) {
    event.target.hasMineFlag = false;
    event.target.textContent = "?";
    minesweeper.remainingMineFlags++;
    count.textContent = parseInt(count.textContent) + 1;
    event.target.hasQuestionFlag = true;
    return;
  }

  if (event.target.hasQuestionFlag) {
    event.target.hasQuestionFlag = false;
    event.target.textContent = "";
    return;
  }

  event.target.hasMineFlag = true;
  event.target.textContent = "⚐";
  minesweeper.remainingMineFlags--;
  count.textContent--;

  if (!minesweeper.remainingMineFlags) {
    if (minesweeper.checkForWin()) {
      gameField.removeEventListener("click", openNewCell);
      gameField.removeEventListener("contextmenu", setMineFlag);
      alert("Поздравляем, вы нашли все бомбы и победили!");
    } else {
      count.textContent = "0 (Некоторые флаги не соответствуют бомбам)";
    }
  }
}
