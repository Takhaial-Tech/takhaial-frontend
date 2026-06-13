import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import FutureChatbot from './FutureChatbot';
import { useLanguage } from '../i18n/LanguageContext';

// Keep three.js out of the main bundle; the robot loads as its own chunk.
const RobotStage = lazy(() => import('./RobotStage'));

const robotCopy = {
    en: {
        robotIdleLabel: 'Tap the robot to say hi',
        robotReadyLabel: 'Open Takhaial AI chat',
    },
    ar: {
        robotIdleLabel: 'دوس على الروبوت عشان يسلم عليك',
        robotReadyLabel: 'افتح شات تخيل الذكي',
    },
};

// Robot assistant flow:
//   idle loop (+ tap hint) → tap → 'start' greeting plays once
//   → the chat opens by itself (no second tap) while the robot loops
//   'idle moving' → closing the chat plays 'Chat closing' once
//   → back to the plain idle loop.
const RobotAssistant = () =>
{
    const { language } = useLanguage();
    const copy = robotCopy[language === 'ar' ? 'ar' : 'en'];

    const [phase, setPhase] = useState('idle');
    const [chatOpen, setChatOpen] = useState(false);
    const [robotReady, setRobotReady] = useState(false);
    const [robotFailed, setRobotFailed] = useState(false);
    const [hintSeen, setHintSeen] = useState(false);
    const anchorRef = useRef(null);

    // Mobile: if the user scrolls hard away mid-greeting (the robot fully
    // leaves the viewport), the robot backs off — it plays the closing clip
    // and the chat never opens. A light scroll that keeps any part of the
    // robot visible does not cancel. Opening requires staying up at the hero.
    useEffect(() =>
    {
        if (phase !== 'greeting') return undefined;
        if (!window.matchMedia('(max-width: 767px)').matches) return undefined;

        const cancelIfRobotGone = () =>
        {
            const rect = anchorRef.current?.getBoundingClientRect();
            if (rect && rect.bottom <= 0)
            {
                setPhase('closing');
            }
        };

        cancelIfRobotGone();
        window.addEventListener('scroll', cancelIfRobotGone, { passive: true });
        return () => window.removeEventListener('scroll', cancelIfRobotGone);
    }, [phase]);

    const handleRobotActivate = useCallback(() =>
    {
        setHintSeen(true);
        setPhase((current) => (current === 'idle' ? 'greeting' : current));
        if (phase === 'ready') setChatOpen(true);
    }, [phase]);

    const handlePhaseEnd = useCallback((endedPhase) =>
    {
        if (endedPhase === 'greeting')
        {
            // The greeting hands straight over to the chat — no second tap.
            setPhase('ready');
            setChatOpen(true);
        }
        if (endedPhase === 'closing') setPhase('idle');
    }, []);

    const handleChatOpenChange = useCallback((nextOpen) =>
    {
        setChatOpen(nextOpen);
        if (!nextOpen) setPhase((current) => (current === 'ready' ? 'closing' : current));
    }, []);

    const handleRobotError = useCallback((error) =>
    {
        console.error('Robot assistant failed, falling back to the classic launcher.', error);
        setRobotFailed(true);
    }, []);

    // No WebGL / failed GLB: keep the old, reliable launcher experience.
    if (robotFailed) return <FutureChatbot />;

    const showHint = robotReady && !chatOpen && phase === 'idle' && !hintSeen;

    return (
        <>
            <div ref={anchorRef} className="tk-robot-anchor" data-phase={phase} data-ready={robotReady ? 'true' : 'false'}>
                <button
                    type="button"
                    className="tk-robot-stage"
                    onClick={handleRobotActivate}
                    aria-label={phase === 'ready' ? copy.robotReadyLabel : copy.robotIdleLabel}
                >
                    <Suspense fallback={null}>
                        <RobotStage
                            phase={phase}
                            onPhaseEnd={handlePhaseEnd}
                            onReady={() => setRobotReady(true)}
                            onError={handleRobotError}
                        />
                    </Suspense>
                </button>

                {showHint && (
                    <span className="tk-robot-hint" aria-hidden="true">
                        <span className="tk-robot-hint-ripple" />
                        <svg viewBox="0 0 24 24" focusable="false">
                            <path d="M9.8 12.6V5.4a1.6 1.6 0 0 1 3.2 0v5.2l4.6 1c.9.2 1.6 1 1.6 2v1.6c0 .3 0 .5-.1.8l-1 3.4a2 2 0 0 1-1.9 1.4h-4.5a2 2 0 0 1-1.5-.7l-3.6-4.2a1.5 1.5 0 0 1 2.1-2.1l1.1 1Z" />
                        </svg>
                    </span>
                )}
            </div>

            <FutureChatbot open={chatOpen} onOpenChange={handleChatOpenChange} showLauncher={false} />
        </>
    );
};

export default RobotAssistant;
