import React, { useContext, useMemo } from 'react';

import { ChallengesContext } from '../contextts/ChallengesContext';

import styles from '../styles/components/ExperienceBar.module.css';

export function ExperienceBar(){
  const { currentExperience, experienceNextLevel} = useContext(ChallengesContext);

  const percentNextLevel = useMemo(() => {
    return Math.round(currentExperience * 100) / experienceNextLevel
  },[currentExperience, experienceNextLevel]);

  return (
      <header className={styles.experienceBar}>
          <span>0 px</span>
          <div>
            <div style={{width: `${percentNextLevel}%`}} />
            {currentExperience > 0 && (
              <span 
              className={styles.currentExperience}
              style={{left: `${percentNextLevel}%`}}
              >
                {currentExperience} xp
              </span>
            )}
          </div>
          <span>{experienceNextLevel} px</span>
      </header>
  );
}