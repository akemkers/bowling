import {BowlingFrameScore} from "../types";
import sum from "lodash/sum";

export const isStrike = (currentFrameScore: BowlingFrameScore): boolean => {
  return currentFrameScore.throws.length > 0 && currentFrameScore.throws.every((score) => score === 10)
}

export const isSpare = (currentFrameScore: BowlingFrameScore): boolean =>
  currentFrameScore.throws.length === 2 && sum(currentFrameScore.throws) === 10;


export const didNotKnockOverAllPins = (currentFrameScore: BowlingFrameScore): boolean =>
  currentFrameScore.throws.length === 2 && (!isSpare(currentFrameScore) && !(isStrike(currentFrameScore)));


export const gameHasFinished = (score: BowlingFrameScore, maxframes: number): boolean => {
  if (score.frameNumber !== maxframes || score.throws.length < 2) {
    return false;
  }

  if (isStrike(score) && score.throws.length <= 2) {
    return false;
  }

  if (isSpare(score) && score.throws.length !== 3) {
    return false;
  }

  return true;
}
