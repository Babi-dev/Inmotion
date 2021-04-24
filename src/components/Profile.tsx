import React, { useContext } from 'react';

import { ChallengesContext } from '../contextts/ChallengesContext';

import styles from '../styles/components/Profile.module.css';

export function Profile(){
    const {level} = useContext(ChallengesContext);

    return (
        <div className={styles.profileContainer}>
            <img src="https://github.com/babi-dev.png" alt="Babi"/>

            <div>
                <strong>Babi</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
            </div>
        </div>
    );
}