import React from 'react';
import styles from './Header.module.scss';

interface Props {
  header: string;
}

const Header = ({ header }: Props) => {
  return (
    <div className={styles.wrapper}>
      <h1> { header } </h1>
    </div>
  );
};

export default Header;
