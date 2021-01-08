import { BowlingFrameScore } from '../types';
import sum from 'lodash/sum';
import cloneDeep from 'lodash/cloneDeep';
import {didNotKnockOverAllPins, gameHasFinished, isSpare, isStrike} from "./gameCheckers";

/*
* Takes an array of BowlingFrameScore and calculates the total for each frame, if not already computed.
* - Does not calculate frame total if a strike is present without future two values to calculate bonus from.
* - Does not calculate frame total if a spare is present without one future value to calculate bonus from.
* - The final frame is calculated without applying bonuses.
*/
const updateScoresAfterRoll = (allScores: BowlingFrameScore[], frameNumber: number) => {
  let newScores = cloneDeep(allScores);
  let previousTotal: number | undefined = 0;
  for (let i = 0; i <= frameNumber; i++) {
    const frameScore = newScores[i];

    if (!frameScore.frameTotal) {
      const newFrameTotal = calculateFrameTotal(frameScore, newScores.slice(i + 1, newScores.length));

      if (newFrameTotal !== undefined && previousTotal !== undefined) {
        frameScore.frameTotal = previousTotal + newFrameTotal;
      }
    }
    previousTotal = frameScore.frameTotal;
  }

  return newScores;
}
// Calculators
const calculateFrameTotal = (currentFrameScore: BowlingFrameScore, futureScores: BowlingFrameScore[]) => {
  const futureRolls = getAllFutureRolls(futureScores);

  if (isStrike(currentFrameScore) && futureRolls.length >= 2) {
    return calculateForStrike(futureRolls);
  }
  if (isSpare(currentFrameScore) && futureRolls.length >= 1) {
    return calculateForSpare(futureRolls);
  }
  if (gameHasFinished(currentFrameScore, 9) || didNotKnockOverAllPins(currentFrameScore)) {
    return sum(currentFrameScore.throws);
  }
}

const calculateForStrike = (futureRolls: number[]) => {
  return 10 + futureRolls[0] + futureRolls[1];
}

const calculateForSpare = (futureRolls: number[]) => {
  return 10 + futureRolls[0];
}

const getAllFutureRolls = (allScores: BowlingFrameScore[]) => {
  return allScores.reduce<number[]>((arr, currentScore) => [...arr, ...currentScore.throws], [])
}

export {
  updateScoresAfterRoll,
}
