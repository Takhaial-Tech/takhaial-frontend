import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { backendUrl } from '../config';
import { useLanguage } from '../i18n/LanguageContext';

const chatCopy = {
    en: {
        skip: 'Skip',
        greet: 'Welcome to Takhaial',
        brand: 'Takhaial Tech',
        agentLabel: 'Takhaial AI Agent',
        initialMessage:
            'I am ready. Tell me what is in your imagination and I will help shape it.',
        placeholder: 'Describe what you imagine...',
        send: 'Send',
        thinking: 'Thinking',
        fallback: 'I could not reach the assistant right now. Please try again in a moment.',
        status: 'Online',
    },
    ar: {
        skip: 'تخطي',
        greet: 'اهلاً بك في تخيل',
        brand: 'تخيل تك',
        agentLabel: 'وكيل تخيل الذكي',
        initialMessage: 'أنا جاهز. قوللي اللي في خيالك وأنا هساعدك تحققه.',
        placeholder: 'اكتب اللي في خيالك...',
        send: 'إرسال',
        thinking: 'بيفكر',
        fallback: 'مش قادر أوصل للمساعد حاليا. جرّب تاني بعد لحظات.',
        status: 'متاح',
    },
};

const PHASE_TIMINGS = {
    greet: 1100,
    inputCenter: 2700,
    inputDescend: 3500,
    typing: 4400,
};

const TYPE_SPEED_MS = 28;

const FutureChatbot = () =>
{
    const { direction, language } = useLanguage();
    const copy = chatCopy[language === 'ar' ? 'ar' : 'en'];
    const [phase, setPhase] = useState('assemble');
    const [messages, setMessages] = useState([]);
    const [typedDraft, setTypedDraft] = useState('');
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [hasUserMessages, setHasUserMessages] = useState(false);
    const listRef = useRef(null);

    const goToReady = useCallback(() =>
    {
        setTypedDraft('');
        setPhase('ready');
        setMessages((current) =>
            current.length
                ? current
                : [{
                    role: 'assistant',
                    content: chatCopy[language === 'ar' ? 'ar' : 'en'].initialMessage,
                }]
        );
    }, [language]);

    useEffect(() =>
    {
        if (hasUserMessages)
        {
            setPhase('ready');
            return undefined;
        }

        setPhase('assemble');
        setMessages([]);
        setTypedDraft('');

        const timers = [
            setTimeout(() => setPhase('greet'), PHASE_TIMINGS.greet),
            setTimeout(() => setPhase('inputCenter'), PHASE_TIMINGS.inputCenter),
            setTimeout(() => setPhase('inputDescend'), PHASE_TIMINGS.inputDescend),
            setTimeout(() => setPhase('typing'), PHASE_TIMINGS.typing),
        ];

        return () => timers.forEach(clearTimeout);
    }, [language, hasUserMessages]);

    useEffect(() =>
    {
        if (phase !== 'typing') return undefined;

        const fullText = copy.initialMessage;
        let index = 0;
        setTypedDraft('');

        const interval = setInterval(() =>
        {
            index += 1;
            setTypedDraft(fullText.slice(0, index));

            if (index >= fullText.length)
            {
                clearInterval(interval);
                setTimeout(() =>
                {
                    setMessages([{ role: 'assistant', content: fullText }]);
                    setTypedDraft('');
                    setPhase('ready');
                }, 350);
            }
        }, TYPE_SPEED_MS);

        return () => clearInterval(interval);
    }, [phase, copy.initialMessage]);

    useEffect(() =>
    {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [isSending, messages, typedDraft, phase]);

    const apiMessages = useMemo(() =>
    {
        return messages
            .filter((message) => message.content)
            .slice(-10)
            .map((message) => ({
                role: message.role,
                content: message.content,
            }));
    }, [messages]);

    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        const content = input.trim();
        if (!content || isSending) return;

        const nextMessages = [...messages, { role: 'user', content }];
        setMessages(nextMessages);
        setInput('');
        setIsSending(true);
        setHasUserMessages(true);
        setPhase('ready');

        try
        {
            const response = await fetch(`${backendUrl}chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language,
                    messages: [...apiMessages, { role: 'user', content }],
                }),
            });

            const result = await response.json();

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: 'assistant',
                    content: result?.reply || result?.message || copy.fallback,
                },
            ]);
        } catch (err)
        {
            setMessages((currentMessages) => [
                ...currentMessages,
                { role: 'assistant', content: copy.fallback },
            ]);
        } finally
        {
            setIsSending(false);
        }
    };

    const showSkip = phase !== 'ready';

    return (
        <div className="future-chatbot-shell" data-phase={phase} dir={direction}>
            <div className="future-chatbot-panel">
                <div className="future-chatbot-grid" aria-hidden="true" />
                <div className="future-chatbot-glow" aria-hidden="true" />

                <span className="future-chatbot-corner future-chatbot-corner--tl" aria-hidden="true" />
                <span className="future-chatbot-corner future-chatbot-corner--tr" aria-hidden="true" />
                <span className="future-chatbot-corner future-chatbot-corner--bl" aria-hidden="true" />
                <span className="future-chatbot-corner future-chatbot-corner--br" aria-hidden="true" />

                <svg
                    className="future-chatbot-frame-svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <rect x="0.5" y="0.5" width="99" height="99" rx="2" ry="2" />
                </svg>

                {showSkip && (
                    <button
                        type="button"
                        className="future-chatbot-skip"
                        onClick={goToReady}
                    >
                        {copy.skip}
                    </button>
                )}

                <div className="future-chatbot-orb" aria-hidden="true">
                    <span className="future-chatbot-orb-particle future-chatbot-orb-particle--1" />
                    <span className="future-chatbot-orb-particle future-chatbot-orb-particle--2" />
                    <span className="future-chatbot-orb-particle future-chatbot-orb-particle--3" />
                    <span className="future-chatbot-orb-ring" />
                    <span className="future-chatbot-orb-ring" />
                    <span className="future-chatbot-orb-ring" />
                    <i className="future-chatbot-orb-core" />
                </div>

                <div className="future-chatbot-header">
                    <span className="future-chatbot-kicker">{copy.status}</span>
                    <h2>{copy.agentLabel}</h2>
                </div>

                <div className="future-chatbot-greeting" aria-hidden={phase !== 'greet'}>
                    <h2 className="future-chatbot-greet-text">{copy.greet}</h2>
                    <span className="future-chatbot-greet-brand">{copy.brand}</span>
                </div>

                <div ref={listRef} className="future-chatbot-messages">
                    {phase === 'typing' && (
                        <div className="future-chatbot-message is-assistant is-typing">
                            <span>
                                {typedDraft}
                                <i className="future-chatbot-typing-caret" />
                            </span>
                        </div>
                    )}
                    {phase !== 'typing' && messages.map((message, index) => (
                        <div
                            key={`${message.role}-${index}`}
                            className={`future-chatbot-message ${message.role === 'user' ? 'is-user' : 'is-assistant'}`}
                        >
                            {message.content.split('\n').map((line, lineIndex) => (
                                <span key={lineIndex}>{line}</span>
                            ))}
                        </div>
                    ))}
                    {isSending && (
                        <div className="future-chatbot-message is-assistant is-loading">
                            <span>{copy.thinking}</span>
                            <i />
                            <i />
                            <i />
                        </div>
                    )}
                </div>

                <form className="future-chatbot-input" onSubmit={handleSubmit}>
                    <input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder={copy.placeholder}
                        aria-label={copy.placeholder}
                        onFocus={goToReady}
                    />
                    <button type="submit" disabled={isSending || !input.trim()}>
                        {copy.send}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FutureChatbot;
