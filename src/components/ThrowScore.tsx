import range from 'lodash/range';
import {isStrike, isSpare} from "../bowlingGame/gameCheckers";
import {BowlingFrameScore} from "../types";
import {MAX_FRAMES} from "../constants";
import styles from './ThrowScore.module.scss';


interface Props {
  frameScore: BowlingFrameScore;
}

const ThrowScore = ({ frameScore }: Props) => {

  const getScoreIcon = (throwNumber: number) => {
    if (frameScore.frameNumber === MAX_FRAMES) {
      if (frameScore.throws[throwNumber] === 10) {
        return 'X'
      }
      if (frameScore.throws.length > 1 && frameScore.throws[0] + frameScore.throws[1] === 10 && throwNumber === 1) {
        return '/';
      }
      if (throwNumber >= frameScore.throws.length) {
        return "";
      }

      return String(frameScore.throws[throwNumber]);
    }

    if (isStrike(frameScore)) {
      return throwNumber === 1 ? 'X' : '';
    }
    if (throwNumber >= frameScore.throws.length) {
      return "";
    }
    if (frameScore.throws[throwNumber] === 0) {
      return '-';
    }
    if (isSpare(frameScore) && (throwNumber === 1)) {
      return '/';
    }

    return String(frameScore.throws[throwNumber]);
  }

  const numberOfThrowsInFrame = () => frameScore.frameNumber === MAX_FRAMES ? 3 : 2;

  return (
    <div className={styles.throwScoreWrapper}>

      {range(0, numberOfThrowsInFrame()).map((throwNumber) =>
         <span
           className={`${styles.throwScore} ${throwNumber !== 0 ? styles.throwScoreLast : ''}`}
           key={'throw-' + throwNumber}
         >
           {getScoreIcon(throwNumber)}
         </span>
      )}

    </div>
  )
}

export default ThrowScore;
