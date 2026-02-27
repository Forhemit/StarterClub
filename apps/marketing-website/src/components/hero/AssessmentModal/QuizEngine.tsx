"use client";

import { useState, useCallback, useEffect } from "react";
import {
    AssessmentState,
    AssessmentStep,
    ResultType,
    QUESTIONS,
    RESULTS,
    STORAGE_KEY,
} from "./types";

interface UseQuizEngineProps {
    onComplete?: (result: ResultType, score: number) => void;
}

interface UseQuizEngineReturn {
    state: AssessmentState;
    currentQuestion: typeof QUESTIONS[0] | null;
    progress: number;
    result: typeof RESULTS[ResultType] | null;
    handleStart: () => void;
    handleAnswer: (answer: 'YES' | 'NO') => void;
    handleReset: () => void;
    canProceed: boolean;
}

const initialState: AssessmentState = {
    step: 'intro',
    score: 0,
    answers: [null, null, null],
};

export function useQuizEngine({ onComplete }: UseQuizEngineProps = {}): UseQuizEngineReturn {
    const [state, setState] = useState<AssessmentState>(initialState);

    // Load saved progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.answers && parsed.answers.some((a: string | null) => a !== null)) {
                    // Restore partial progress
                    setState({
                        ...initialState,
                        answers: parsed.answers,
                        score: parsed.answers.filter((a: string | null) => a === 'YES').length,
                    });
                }
            } catch {
                // Invalid saved data, ignore
            }
        }
    }, []);

    // Save progress to localStorage whenever answers change
    useEffect(() => {
        if (state.answers.some(a => a !== null)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                answers: state.answers,
                timestamp: Date.now(),
            }));
        }
    }, [state.answers]);

    const handleStart = useCallback(() => {
        setState({
            step: 'question',
            questionId: 1,
            score: 0,
            answers: [null, null, null],
        });
    }, []);

    const handleAnswer = useCallback((answer: 'YES' | 'NO') => {
        if (state.step !== 'question' || !state.questionId) return;

        const questionIndex = state.questionId - 1;
        const newAnswers = [...state.answers];
        newAnswers[questionIndex] = answer;

        const newScore = newAnswers.filter(a => a === 'YES').length;

        // Save immediately
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            answers: newAnswers,
            timestamp: Date.now(),
        }));

        // Fire analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'question_answered', {
                question_id: state.questionId,
                answer: answer,
            });
        }

        // Move to next question or calculating
        if (state.questionId < 3) {
            setState({
                ...state,
                questionId: (state.questionId + 1) as 1 | 2 | 3,
                answers: newAnswers,
                score: newScore,
            });
        } else {
            // Show calculating screen briefly
            setState({
                step: 'calculating',
                score: newScore,
                answers: newAnswers,
            });

            // Then show results
            setTimeout(() => {
                const resultType = calculateResultType(newScore);
                setState({
                    step: 'verdict',
                    score: newScore,
                    answers: newAnswers,
                });

                // Fire completion event
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'assessment_completed', {
                        result: resultType,
                        score: newScore,
                    });
                }

                onComplete?.(resultType, newScore);
            }, 2000);
        }
    }, [state, onComplete]);

    const handleReset = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setState(initialState);
    }, []);

    const calculateResultType = (score: number): ResultType => {
        if (score === 0) return 'straw';
        if (score <= 2) return 'wood';
        return 'brick';
    };

    const currentQuestion = state.step === 'question' && state.questionId
        ? QUESTIONS[state.questionId - 1]
        : null;

    const progress = state.step === 'intro' ? 0
        : state.step === 'verdict' ? 100
        : ((state.questionId || 1) - 1) / 3 * 100;

    const result = state.step === 'verdict'
        ? RESULTS[calculateResultType(state.score)]
        : null;

    const canProceed = state.step === 'question' && state.questionId !== undefined;

    return {
        state,
        currentQuestion,
        progress,
        result,
        handleStart,
        handleAnswer,
        handleReset,
        canProceed,
    };
}
