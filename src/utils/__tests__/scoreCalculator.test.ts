import { updateScoresAfterRoll } from '../scoreCalculator';
import {BowlingFrameScore} from "../../types";
import range from 'lodash/range';

let previousScores: BowlingFrameScore[];

const resetBoard = () => {
  return [
    { frameNumber: 0, throws: [] },
    { frameNumber: 1, throws: [] },
    { frameNumber: 2, throws: [] },
    { frameNumber: 3, throws: [] },
    { frameNumber: 4, throws: [] },
    { frameNumber: 5, throws: [] },
    { frameNumber: 6, throws: [] },
    { frameNumber: 7, throws: [] },
    { frameNumber: 8, throws: [] },
    { frameNumber: 9, throws: [] },

  ]
}

const setPopulatedScoreBoard = () => {
  return [
    { frameNumber: 0, throws: [10] },
    { frameNumber: 1, throws: [0, 10] },
    { frameNumber: 2, throws: [5, 5] },
    { frameNumber: 3, throws: [10] },
    { frameNumber: 4, throws: [1, 1] },
    { frameNumber: 5, throws: [10] },
    { frameNumber: 6, throws: [0,0] },
    { frameNumber: 7, throws: [10] },
    { frameNumber: 8, throws: [5, 4] },
    { frameNumber: 9, throws: [1, 9, 4] },
  ]
}

beforeEach(() => {
  previousScores = resetBoard();
})

// Without spears and strikes
describe(`scoreCalculator with no spares and strikes`, () => {

  it(`should calculate correct scores after first round`, () => {
    previousScores[0].throws = [1, 3];
    const newScores = updateScoresAfterRoll(previousScores, 0);

    expect(newScores[0].frameTotal).toEqual(4);
  })

  it('should calculate correct scores after 2 rounds', () => {
    previousScores[0].throws = [2, 4];
    previousScores[0].frameTotal = 6;
    previousScores[1].throws = [3, 1];

    const newScores = updateScoresAfterRoll(previousScores, 1);

    expect(newScores[0].frameTotal).toEqual(6);
    expect(newScores[1].frameTotal).toEqual(10);
  })

  it('should calculate intermediate results correctly', () => {
    previousScores[0].throws = [1,3];
    const newScores = updateScoresAfterRoll(previousScores, 0);
    expect(newScores[0].frameTotal).toEqual(4);

    newScores[1].throws = [2,5];
    const newScores2 = updateScoresAfterRoll(newScores, 1);
    expect(newScores2[1].frameTotal).toEqual(11);

    newScores2[2].throws = [4,5];
    const newScores3 = updateScoresAfterRoll(newScores2, 2);
    expect(newScores3[2].frameTotal).toEqual(20);

    newScores3[3].throws = [1,2];
    const newScores4 = updateScoresAfterRoll(newScores3, 3);
    expect(newScores4[3].frameTotal).toEqual(23);
  })

  it('should not compute total if frame is not finished', () => {
    previousScores[0].throws = [1];
    const newScores = updateScoresAfterRoll(previousScores, 0);
    expect(newScores[0].frameTotal).toEqual(undefined);

    newScores[0].throws = [1, 7];
    const newScores2 = updateScoresAfterRoll(newScores, 0);
    expect(newScores2[0].frameTotal).toEqual(8);
  })
})

// Spears
describe('scoreCalculator with rolling spears', () => {
  it('should compute bonus points if rolling a spare after next roll is completed', () => {
    previousScores[0].throws = [9, 1];
    const newScores = updateScoresAfterRoll(previousScores, 0);
    expect(newScores[0].frameTotal).toEqual(undefined);

    newScores[1].throws = [2];
    const newScores2 = updateScoresAfterRoll(newScores, 1);
    expect(newScores2[0].frameTotal).toEqual(12);
  })

  it('should compute bonus points with mulitple spears in a row',() => {
    previousScores[0].throws = [0,10];
    const newScores = updateScoresAfterRoll(previousScores, 0);
    expect(newScores[0].frameTotal).toEqual(undefined);

    newScores[1].throws = [8, 2];
    const newScores2 = updateScoresAfterRoll(newScores, 1);
    expect(newScores2[0].frameTotal).toEqual(18);
    expect(newScores2[1].frameTotal).toEqual(undefined);

    newScores2[2].throws = [6, 4];
    const newScores3 = updateScoresAfterRoll(newScores2, 2);
    expect(newScores3[0].frameTotal).toEqual(18);
    expect(newScores3[1].frameTotal).toEqual(34);
    expect(newScores3[2].frameTotal).toEqual(undefined);

    newScores3[3].throws = [10];
    const newScores4 = updateScoresAfterRoll(newScores3, 3);
    expect(newScores4[0].frameTotal).toEqual(18);
    expect(newScores4[1].frameTotal).toEqual(34);
    expect(newScores4[2].frameTotal).toEqual(54);
    expect(newScores4[3].frameTotal).toEqual(undefined);
  })

  it('should not compute bonus points if a spear is completed in the last frame', () => {
    previousScores = setPopulatedScoreBoard();
    previousScores[9].throws = [1, 9, 10];

    const newScores = updateScoresAfterRoll(previousScores, 9);

    expect(newScores[9].frameTotal).toEqual(127)
  })
})

// Strikes
describe('scoreCalculator with rolling strikes', () => {
  it('should not calculate frame total before the next two rolls are completed', () => {
    previousScores[0].throws = [10];
    const newScores = updateScoresAfterRoll(previousScores, 0);
    expect(newScores[0].frameTotal).toEqual(undefined);

    newScores[1].throws = [5];
    const newScores2 = updateScoresAfterRoll(newScores, 1);
    expect(newScores2[0].frameTotal).toEqual(undefined);
    expect(newScores2[1].frameTotal).toEqual(undefined);

    newScores2[1].throws = [5, 4];
    const newScores3 = updateScoresAfterRoll(newScores2, 3);
    expect(newScores3[0].frameTotal).toEqual(19);
    expect(newScores3[1].frameTotal).toEqual(28);
  })

  it('should compute bonus points with mulitple strikes in a row', () => {
     previousScores[0].throws = [10];
     previousScores[1].throws = [10];
     previousScores[2].throws = [10];
     previousScores[3].throws = [10];
     previousScores[4].throws = [4, 6];
     const newScores = updateScoresAfterRoll(previousScores, 3);
     expect(newScores[0].frameTotal).toEqual(30);
     expect(newScores[1].frameTotal).toEqual(60);
     expect(newScores[2].frameTotal).toEqual(84);
     expect(newScores[3].frameTotal).toEqual(104);
     expect(newScores[4].frameTotal).toEqual(undefined);
  })

  it('should not compute bonuspoints when strikes are rolled in final frame', () => {
    previousScores = setPopulatedScoreBoard();
    previousScores[9].throws = [10, 10, 10];

    const newScores = updateScoresAfterRoll(previousScores, 9);

    expect(newScores[9].frameTotal).toEqual(137);
  })
})

describe('scoreCalculator when computing a full game', () => {
  it('should score both spares and strikes correctly', () => {
    const hrstart = process.hrtime();

    previousScores = setPopulatedScoreBoard()
    const newScores = updateScoresAfterRoll(previousScores, 9);

    expect(newScores[0].frameTotal).toEqual(20)
    expect(newScores[1].frameTotal).toEqual(35)
    expect(newScores[2].frameTotal).toEqual(55)
    expect(newScores[3].frameTotal).toEqual(67)
    expect(newScores[4].frameTotal).toEqual(69)
    expect(newScores[5].frameTotal).toEqual(79)
    expect(newScores[6].frameTotal).toEqual(79)
    expect(newScores[7].frameTotal).toEqual(98)
    expect(newScores[8].frameTotal).toEqual(107)
    expect(newScores[9].frameTotal).toEqual(121)

    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  })

  it('should sum to 300 if all strikes', () => {
    const scores = range(0, 9).map((index) => ({frameNumber: index, throws: [10]}));
    scores.push({frameNumber: 9, throws: [10, 10, 10]})

    const newScores = updateScoresAfterRoll(scores, 9);

    expect(newScores[9].frameTotal).toEqual(300);
  })

})

