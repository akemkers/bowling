import React from 'react';
import BowlingScoreBoard from "./containers/BowlingScoreboard";
import Header from './containers/Header';


function App() {
  return (
    <div className={'pageContainer'}>
      <Header header={'AnDyS BoWlOrAmA'}/>
      <BowlingScoreBoard maxFrames={9} />
    </div>
  );
}

export default App;
