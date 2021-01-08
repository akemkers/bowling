import { BowlingFrameScore } from "../types";
import styles from './BowlingFrame.module.scss';
import ThrowScore from "./ThrowScore";

interface Props {
  frameScore: BowlingFrameScore
  activeFrame: number;
}

const BowlingFrame = ({ frameScore }: Props) => {

  return (
    <div className={styles.frameWrapper}>
      <p className={styles.frameNumber}>{frameScore.frameNumber + 1}</p>
      <ThrowScore frameScore={frameScore} />
      <h3 className={styles.frameTotal}>
        {frameScore.frameTotal}
      </h3>
    </div>
  )
}

export default BowlingFrame;
