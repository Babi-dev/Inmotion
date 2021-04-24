import {createContext, ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import Cookies from 'js-cookie';

import challenges from '../../challenges.json';

import { LevelUpModal } from '../components/LevelUpModal';

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
    closeLevelUpModal: () => void
}

interface ChallengesProviderProps {
    children: ReactNode,
    level: number; 
    currentExperience: number; 
    challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({
    children,
    ...rest
}:ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

    const experienceNextLevel = useMemo(() => {
        return Math.pow((level + 1) * 4, 2);
    }, [level]);

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    },[level, currentExperience, challengesCompleted]);

    const levelUp = useCallback(() => {
        setLevel(level + 1);
        setIsLevelModalOpen(true);
    },[level]);

    const closeLevelUpModal = useCallback(() => {
        setIsLevelModalOpen(false);
    },[]);

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
                completeChallenge,
                closeLevelUpModal
            }}
        >
            {children}
            {isLevelModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );
}