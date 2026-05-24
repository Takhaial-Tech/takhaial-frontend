import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { backendUrl } from '../config';
import { useLanguage } from '../i18n/LanguageContext';

const chatCopy = {
    en: {
        skip: 'Skip',
        boot: 'Booting Takhaial agent',
        greet: 'Welcome to Takhaial',
        brand: 'Takhaial Tech',
        tagline: 'We turn your imagination into reality.',
        pillars: ['Artificial Intelligence', 'AR & VR', 'Mobile Apps', 'Cinematic Ads'],
        agentLabel: 'Takhaial AI Agent',
        initialMessage: 'I am ready. Tell me what is in your imagination and I will help shape it.',
        placeholder: 'Describe what you imagine...',
        send: 'Send',
        thinking: 'Thinking',
        fallback: 'I could not reach the assistant right now. Please try again in a moment.',
        status: 'Online',
    },
    ar: {
        skip: 'تخطي',
        boot: 'جاري تشغيل وكيل تخيل',
        greet: 'اهلاً بك في تخيل',
        brand: 'تخيل تك',
        tagline: 'بنحوّل خيالك إلى حقيقة.',
        pillars: [
            'ذكاء اصطناعي',
            'واقع افتراضي ومعزز',
            'تطبيقات موبايل',
            'إعلانات سينمائية',
        ],
        agentLabel: 'وكيل تخيل الذكي',
        initialMessage:
            'أنا جاهز. قوللي اللي في خيالك وأنا هساعدك تحققه.',
        placeholder: 'اكتب اللي في خيالك...',
        send: 'إرسال',
        thinking: 'بيفكر',
        fallback:
            'مش قادر أوصل للمساعد حاليا. جرّب تاني بعد لحظات.',
        status: 'متاح',
    },
};

const PHASE_TIMINGS = {
    greet: 1100,
    intro: 2900,
    ready: 5500,
};

const FutureChatbot = () =>
{
    const { direction, language } = useLanguage();
    const copy = chatCopy[language === 'ar' ? 'ar' : 'en'];
    const [phase, setPhase] = useState('boot');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [hasUserMessages, setHasUserMessages] = useState(false);
    const listRef = useRef(null);

    const goToReady = useCallback(() =>
    {
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

        setPhase('boot');
        setMessages([]);

        const timers = [
            setTimeout(() => setPhase('greet'), PHASE_TIMINGS.greet),
            setTimeout(() => setPhase('intro'), PHASE_TIMINGS.intro),
            setTimeout(() => goToReady(), PHASE_TIMINGS.ready),
        ];

        return () => timers.forEach(clearTimeout);
    }, [language, hasUserMessages, goToReady]);

    useEffect(() =>
    {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [isSending, messages, phase]);

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
                <div className="future-chatbot-frame" aria-hidden="true" />

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
                    <span />
                    <span />
                    <span />
                    <i />
                </div>

                <div className="future-chatbot-stage" data-stage="boot">
                    <span className="future-chatbot-boot-line" />
                    <span className="future-chatbot-boot-line" />
                    <span className="future-chatbot-boot-line" />
                    <span className="future-chatbot-boot-text">{copy.boot}</span>
                </div>

                <div className="future-chatbot-stage" data-stage="greet">
                    <h2 className="future-chatbot-greet">{copy.greet}</h2>
                </div>

                <div className="future-chatbot-stage" data-stage="intro">
                    <span className="future-chatbot-brand">{copy.brand}</span>
                    <p className="future-chatbot-tagline">{copy.tagline}</p>
                    <ul className="future-chatbot-pillars">
                        {copy.pillars.map((pillar) => (
                            <li key={pillar}>{pillar}</li>
                        ))}
                    </ul>
                </div>

                <div className="future-chatbot-stage" data-stage="ready">
                    <div className="future-chatbot-header">
                        <div>
                            <span className="future-chatbot-kicker">{copy.status}</span>
                            <h2>{copy.agentLabel}</h2>
                        </div>
                    </div>

                    <div ref={listRef} className="future-chatbot-messages">
                        {messages.map((message, index) => (
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
        </div>
    );
};

export default FutureChatbot;
