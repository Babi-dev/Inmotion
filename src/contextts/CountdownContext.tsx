import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ChallengesContext } from "./ChallengesContext";

interface CountdownontextData {
    minutes: number;
    seconds: number;
    isActive: boolean;
    hasFinished: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode
}

let countdownTimeout: NodeJS.Timeout;


export const CountdownContext = createContext({} as CountdownontextData);

export function CountdownProvider({children}:CountdownProviderProps) {
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(0.1 * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = useMemo(() => {
        return Math.floor(time / 60)
    }, [time]);

    const seconds = useMemo(() => {
        return Math.floor(time % 60)
    }, [time]);

    const startCountdown = useCallback(() => {
        setIsActive(true);
    },[]);

    const resetCountdown = useCallback(() => {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setHasFinished(false);
        setTime(0.1 * 60);
    },[]);

    useEffect(() => {
        if(isActive && time > 0){
            countdownTimeout = setTimeout(() => {
                setTime(time - 1)
            }, 1000);
        } else if(isActive && time === 0){
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    },[isActive, time]);
    return (
        <CountdownContext.Provider
            value={{
                minutes,
                seconds,
                isActive,
                hasFinished,
                startCountdown,
                resetCountdown
            }}
        >
            {children}
        </CountdownContext.Provider>
    );
}
