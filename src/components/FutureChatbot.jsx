import { useEffect, useMemo, useRef, useState } from 'react';
import { backendUrl } from '../config';
import { useLanguage } from '../i18n/LanguageContext';

const chatCopy = {
    en: {
        agentLabel: 'Takhaial AI Agent',
        welcome: 'Welcome to the future',
        initialMessage: 'Welcome to Takhaial Tech.\nTell us what is in your imagination, and we will turn it into reality.',
        placeholder: 'Tell us what you imagine...',
        send: 'Send',
        thinking: 'Thinking',
        fallback: 'I could not reach the assistant right now. Please try again in a moment.',
        status: 'Online',
    },
    ar: {
        agentLabel: '\u0648\u0643\u064a\u0644 \u062a\u062e\u064a\u0644 \u0627\u0644\u0630\u0643\u064a',
        welcome: '\u0627\u0647\u0644\u0627 \u0628\u0643 \u0641\u064a \u0627\u0644\u0645\u0633\u062a\u0642\u0628\u0644',
        initialMessage: '\u0627\u0647\u0644\u0627 \u0628\u064a\u0643 \u0641\u064a \u062a\u062e\u064a\u0644 \u062a\u0643\n\u0642\u0648\u0644\u0646\u0627 \u0627\u064a\u0647 \u0627\u0644\u0644\u064a \u0641\u064a \u062e\u064a\u0627\u0644\u0643 \u0648\u0627\u062d\u0646\u0627 \u0647\u0646\u062d\u0648\u0644\u0647 \u0644\u062d\u0642\u064a\u0642\u0629',
        placeholder: '\u0627\u0643\u062a\u0628 \u0627\u0644\u0644\u064a \u0641\u064a \u062e\u064a\u0627\u0644\u0643...',
        send: '\u0627\u0631\u0633\u0644',
        thinking: '\u0628\u064a\u0641\u0643\u0631',
        fallback: '\u0645\u0634 \u0642\u0627\u062f\u0631 \u0623\u0648\u0635\u0644 \u0644\u0644\u0645\u0633\u0627\u0639\u062f \u062d\u0627\u0644\u064a\u0627. \u062c\u0631\u0628 \u062a\u0627\u0646\u064a \u0628\u0639\u062f \u0644\u062d\u0638\u0627\u062a.',
        status: '\u0645\u062a\u0627\u062d',
    },
};

const createInitialMessage = (language) => ({
    role: 'assistant',
    content: chatCopy[language === 'ar' ? 'ar' : 'en'].initialMessage,
});

const FutureChatbot = () =>
{
    const { direction, language } = useLanguage();
    const copy = chatCopy[language === 'ar' ? 'ar' : 'en'];
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [hasUserMessages, setHasUserMessages] = useState(false);
    const listRef = useRef(null);

    useEffect(() =>
    {
        if (hasUserMessages) return undefined;

        setMessages([]);
        const timer = setTimeout(() =>
        {
            setMessages([createInitialMessage(language)]);
        }, 2300);

        return () => clearTimeout(timer);
    }, [hasUserMessages, language]);

    useEffect(() =>
    {
        if (!listRef.current) return;

        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [isSending, messages]);

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

        try
        {
            const response = await fetch(`${backendUrl}chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

    return (
        <div className="future-chatbot-shell" dir={direction}>
            <div className="future-chatbot-welcome glitch" data-glitch={copy.welcome}>
                {copy.welcome}
            </div>

            <div className="future-chatbot-panel">
                <div className="future-chatbot-frame" />
                <div className="future-chatbot-header">
                    <div>
                        <span className="future-chatbot-kicker">{copy.status}</span>
                        <h2>{copy.agentLabel}</h2>
                    </div>
                    <div className="future-chatbot-core" aria-hidden="true">
                        <span />
                        <span />
                        <span />
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
                    {isSending &&
                        <div className="future-chatbot-message is-assistant is-loading">
                            <span>{copy.thinking}</span>
                            <i />
                            <i />
                            <i />
                        </div>
                    }
                </div>

                <form className="future-chatbot-input" onSubmit={handleSubmit}>
                    <input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder={copy.placeholder}
                        aria-label={copy.placeholder}
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
