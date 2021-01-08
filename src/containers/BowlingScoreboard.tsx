import React, {useEffect, useState} from 'react';
import range from 'lodash/range';
import BowlingFrame from '../components/BowlingFrame';
import RollInput from "../components/RollInput";
import {BowlingFrameScore} from '../types';
import { gameHasFinished } from "../utils/gameCheckers";
import { updateScoresAfterRoll } from '../utils/scoreCalculator';
import styles from './BowlingScoreboard.module.scss';


interface Props {
  maxFrames: number;
}

const BowlingScoreBoard = ({ maxFrames }: Props) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [finished, setFinished] = useState(false);
  const [scores, setScores] = useState<BowlingFrameScore[]>([]);

  useEffect(() => {
    setScores(initializeNewGame(maxFrames))
  }, [maxFrames]);


  const registerThrow = (roll: number) => {
    scores[currentFrame].throws.push(roll);
    setScores(updateScoresAfterRoll(scores, currentFrame));

    if (currentFrame !== maxFrames && (scores[currentFrame].throws.length === 2 || roll === 10)) {
      setCurrentFrame(currentFrame + 1);
    }
    if (gameHasFinished(scores[currentFrame], maxFrames)) {
      setFinished(true);
    }
  }

  const renderBowlingFrames = () => {
    return scores.map((frameScore: BowlingFrameScore) => (
      <BowlingFrame
        key={frameScore.frameNumber}
        frameScore={frameScore}
        activeFrame={currentFrame}
      />
    ))
  }

  return (
    <div>
      <div className={styles.bowlingGameWrapper}>
        {renderBowlingFrames()}
      </div>
      {finished
        ? <h1 className={styles.finished}>Finished!</h1>
        : <RollInput registerThrow={registerThrow} />
      }
    </div>
  )
}

const initializeNewGame = (maxFrames: number): BowlingFrameScore[] => {
  return range(0, maxFrames + 1).map((i) => ({
    frameNumber: i,
    throws: [],
  }));
}


export default BowlingScoreBoard;
