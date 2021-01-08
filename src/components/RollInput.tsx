import React from 'react';
import {useForm} from "react-hook-form";
import styles from './RollInput.module.scss';

interface Score {
  score: number;
}

interface Props {
  registerThrow: (roll: number) => void
}


const RollInput = ({ registerThrow }: Props) => {
  const { register, errors, handleSubmit, reset } = useForm<Score>();

  const onSubmit = (data: Score) => {
    registerThrow(data.score);
    reset();
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>

          <label className={styles.label} htmlFor="score">Score</label>
          <input
            type="number"
            id="score"
            name="score"
            className={styles.input}
            ref={register({
              required: "You need to tell me how many pins you knocked!",
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Negative? Come on, you're bad but not THAT bad. "
              },
              max: {
                value: 10,
                message: "You cannot roll higher than 10 in bowling you sneak. "
              },
            })}
          />
        </div>
        <button className={styles.submit} type="submit">Roll</button>
        {errors && <p className={styles.error}>{errors.score?.message}</p>}
      </form>
    </div>
  );
};

export default RollInput;
