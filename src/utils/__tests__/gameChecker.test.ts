import range from 'lodash/range';
import {BowlingFrameScore} from "../../types";
import {didNotKnockOverAllPins, gameHasFinished, isSpare, isStrike} from "../gameCheckers";



describe('isStrike', () => {
  it('should return true if it is a strike', () => {
    const strikeFrameScore = createFrameScore([10]);
    expect(isStrike(strikeFrameScore)).toEqual(true);
  })

  it('should return false if it is a spare', () => {
    const spareFrameScore = createFrameScore([9, 1])
    expect(isStrike(spareFrameScore)).toEqual(false)
  })

  it('should return false it is not a strike', () => {
    const notAllPinsKnocked = createFrameScore([2, 2]);
    expect(isStrike(notAllPinsKnocked)).toEqual(false);
  })

  it('should return true if multiple strikes in last round', () => {
    const multipleStrikesInAFrame = createFrameScore([10, 10]);
    expect(isStrike(multipleStrikesInAFrame)).toEqual(true);
  })

  it('should return false if not every throw in last turn is a strike', () => {
    const notAllStrikes = createFrameScore([10, 2]);
    expect(isStrike(notAllStrikes)).toEqual(false);
  })

  it('should return false if no throws yet', () => {
    const unfinishedRound = createFrameScore([]);
    expect(isStrike(unfinishedRound)).toEqual(false);
  })
})

describe('isSpare', () => {
  it('should return true if it is a spare', () => {
    const spareFrameScore = createFrameScore([9, 1])
    expect(isSpare(spareFrameScore)).toEqual(true);
  })

  it('should return false if it is a spare', () => {
    const strikeFrameScore = createFrameScore([10])
    expect(isSpare(strikeFrameScore)).toEqual(false);
  })

  it('should return false it is not a spare', () => {
    const notAllPinsKnocked = createFrameScore([2, 2]);
    expect(isSpare(notAllPinsKnocked)).toEqual(false);
  })
})

describe('didNotKnockOverAllPins', () => {
  it('should return true if not all knocked', () => {
    const eightPinsKnocked = createFrameScore([7, 1])
    expect(didNotKnockOverAllPins(eightPinsKnocked)).toEqual(true);
  })

  it ('should return false if did knock over all pins', () => {
    const strikeFrameScore = createFrameScore([10])
    const spareFrameScore = createFrameScore([9, 1])

    expect(didNotKnockOverAllPins(strikeFrameScore)).toEqual(false);
    expect(didNotKnockOverAllPins(spareFrameScore)).toEqual(false);
  })

  it('should return false if round is not finished yet', () => {
    const nonFinishedRound = createFrameScore(([1]));
    expect(didNotKnockOverAllPins(nonFinishedRound)).toEqual(false);
  })

  it('should return false if it is mulitple strikes in the last round', () => {
    const multipleStrikesInLastRound = createFrameScore([10, 10]);
    expect(didNotKnockOverAllPins(multipleStrikesInLastRound)).toEqual(false);
  })
})

describe('gameHasFinished', () => {
  it('should return false if it has not reached max frames', () => {
    const framesUnderMax = range(0, 9).map((index) => createFrameScore([7, 1], index));

    framesUnderMax.forEach((frame) => {
      expect(gameHasFinished(frame, 9)).toEqual(false);
    })
  })

  it ('should return false if gotten a strike within first two throws in last round', () => {
    const strike = createFrameScore([10], 9);
    expect(gameHasFinished(strike, 9)).toEqual(false);
    const secondStrike = createFrameScore([10, 10], 9);
    expect(gameHasFinished(secondStrike, 9)).toEqual(false);
  })

  it('should return true if gotten all strikes in last round', () => {
    const strike = createFrameScore([10, 10, 10], 9);
    expect(gameHasFinished(strike, 9)).toEqual(true);
  })

  it('should return false if gotten a spare in the last round', () => {
    const spare = createFrameScore([9, 1], 9);
    expect(gameHasFinished(spare, 9)).toEqual(false);
  })

  it('should return true after bonus round for spear has been played', () => {
    const spare = createFrameScore([9, 1, 9], 9);
    expect(gameHasFinished(spare, 9)).toEqual(true);
  })

  it('should return true if no bonus round is obtained', () => {
    const spare = createFrameScore([6, 3], 9);
    expect(gameHasFinished(spare, 9)).toEqual(true);
  })
})



const createFrameScore = (throws: number[], frameNumber = 1): BowlingFrameScore => ({
  throws,
  frameNumber,
})
