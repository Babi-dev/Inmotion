import {createContext, ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import challenges from '../../challenges.json';

interface Challenge {
    type: 'boddy' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number; 
    experienceNextLevel: number;
    currentExperience: number; 
    challengesCompleted: number;
    activeChallenge: Challenge,
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({children}:ChallengesProviderProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceNextLevel = useMemo(() => {
        return Math.pow((level + 1) * 4, 2);
    }, [level]);

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    const levelUp = useCallback(() => {
        setLevel(level + 1);
    },[level]);

    const startNewChallenge = useCallback(() => {
        const radonChallengesIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[radonChallengesIndex];

        setActiveChallenge(challenge);

        if(Notification.permission === 'granted'){
            new Audio('/notification.mp3').play();
            new Notification('Novo desafio', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    },[challenges]);

    const resetChallenge = useCallback(() => {
        setActiveChallenge(null);
    },[]);

    const completeChallenge = useCallback(() => {
        if(!activeChallenge){
            return;
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceNextLevel){
            finalExperience = finalExperience - experienceNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }, [activeChallenge, currentExperience, challengesCompleted]);

    return (
        <ChallengesContext.Provider 
            value={{
                level, 
                experienceNextLevel,
                currentExperience, 
                challengesCompleted,
                activeChallenge,
                levelUp,
                startNewChallenge,
                resetChallenge,
                completeChallenge
            }}
        >
            {children}
        </ChallengesContext.Provider>
    );
}