import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { backendUrl } from '../config';
import { useLanguage } from '../i18n/LanguageContext';
import { trackTikTokEvent } from '../helpers/tiktokPixel';

const MAX_CHAT_INPUT_LENGTH = 700;

const chatCopy = {
    en: {
        skip: 'Skip',
        greet: 'Welcome to Takhaial Tech',
        brand: 'Takhaial Tech',
        agentLabel: 'Takhaial AI Agent',
        initialMessage:
            'Welcome to Takhaial Tech. Tell me what is in your imagination, and I will help turn it into a real project.',
        placeholder: 'Tell me what you want to build...',
        send: 'Send',
        thinking: 'Thinking',
        fallback: 'I could not reach the assistant right now. Please try again in a moment.',
        inputTooLong: `Please keep each message under ${MAX_CHAT_INPUT_LENGTH} characters.`,
        openLabel: 'Open Takhaial AI chat',
        closeLabel: 'Minimize chat',
        status: 'Online',
    },
    ar: {
        skip: '\u062a\u062e\u0637\u064a',
        greet: '\u0623\u0647\u0644\u0627\u064b \u0628\u0643 \u0641\u064a \u062a\u062e\u064a\u0644 \u062a\u0643',
        brand: '\u062a\u062e\u064a\u0644 \u062a\u0643',
        agentLabel: '\u0648\u0643\u064a\u0644 \u062a\u062e\u064a\u0644 \u0627\u0644\u0630\u0643\u064a',
        initialMessage:
            '\u0627\u0647\u0644\u0627 \u0628\u064a\u0643 \u0641\u064a \u062a\u062e\u064a\u0644 \u062a\u0643. \u0642\u0648\u0644\u0646\u0627 \u0627\u064a\u0647 \u0627\u0644\u0644\u064a \u0641\u064a \u062e\u064a\u0627\u0644\u0643 \u0648\u0627\u062d\u0646\u0627 \u0647\u0646\u0633\u0627\u0639\u062f\u0643 \u0646\u062d\u0648\u0644\u0647 \u0644\u0645\u0634\u0631\u0648\u0639 \u062d\u0642\u064a\u0642\u064a.',
        placeholder: '\u0642\u0648\u0644\u0646\u0627 \u0639\u0627\u064a\u0632 \u062a\u0628\u0646\u064a \u0627\u064a\u0647...',
        send: '\u0625\u0631\u0633\u0627\u0644',
        thinking: '\u0628\u064a\u0641\u0643\u0631',
        fallback:
            '\u0645\u0634 \u0642\u0627\u062f\u0631 \u0623\u0648\u0635\u0644 \u0644\u0644\u0645\u0633\u0627\u0639\u062f \u062d\u0627\u0644\u064a\u0627. \u062c\u0631\u0628 \u062a\u0627\u0646\u064a \u0628\u0639\u062f \u0644\u062d\u0638\u0627\u062a.',
        inputTooLong: `\u0645\u0646 \u0641\u0636\u0644\u0643 \u062e\u0644\u064a \u0643\u0644 \u0631\u0633\u0627\u0644\u0629 \u0623\u0642\u0644 \u0645\u0646 ${MAX_CHAT_INPUT_LENGTH} \u062d\u0631\u0641.`,
        openLabel: '\u0627\u0641\u062a\u062d \u0634\u0627\u062a \u062a\u062e\u064a\u0644 \u0627\u0644\u0630\u0643\u064a',
        closeLabel: '\u062a\u0635\u063a\u064a\u0631 \u0627\u0644\u0634\u0627\u062a',
        status: '\u0645\u062a\u0627\u062d',
    },
};

const PHASE_TIMINGS = {
    greet: 850,
    inputCenter: 1950,
    inputDescend: 2600,
    typing: 3300,
};

const TYPE_SPEED_MS = 22;

const isScrollable = (element) => element && element.scrollHeight > element.clientHeight + 1;

const isAtScrollTop = (element) => element.scrollTop <= 0;

const isAtScrollBottom = (element) =>
{
    return element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
};

const FutureChatbot = () =>
{
    const { direction, language } = useLanguage();
    const copy = chatCopy[language === 'ar' ? 'ar' : 'en'];
    const [isOpen, setIsOpen] = useState(false);
    const [phase, setPhase] = useState('closed');
    const [messages, setMessages] = useState([]);
    const [typedDraft, setTypedDraft] = useState('');
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [hasUserMessages, setHasUserMessages] = useState(false);
    const shellRef = useRef(null);
    const listRef = useRef(null);
    const touchYRef = useRef(null);
    const scrollLockRef = useRef(null);
    const hasTrackedChatContactRef = useRef(false);

    const goToReady = useCallback(() =>
    {
        setIsOpen(true);
        setHasUserMessages(true);
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
        if (!isOpen)
        {
            setPhase('closed');
            setTypedDraft('');
            return undefined;
        }

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
    }, [isOpen, language, hasUserMessages]);

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
                }, 260);
            }
        }, TYPE_SPEED_MS);

        return () => clearInterval(interval);
    }, [phase, copy.initialMessage]);

    useEffect(() =>
    {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [isSending, messages, typedDraft, phase]);

    useEffect(() =>
    {
        if (!isOpen) return undefined;

        const root = document.documentElement;
        const body = document.body;
        const viewport = window.visualViewport;
        const lockedScrollY = window.scrollY || root.scrollTop || 0;
        let visualViewportFrame = 0;

        scrollLockRef.current = {
            scrollY: lockedScrollY,
            body: {
                left: body.style.left,
                overflow: body.style.overflow,
                position: body.style.position,
                right: body.style.right,
                top: body.style.top,
                touchAction: body.style.touchAction,
                width: body.style.width,
            },
            root: {
                overflow: root.style.overflow,
                overscrollBehavior: root.style.overscrollBehavior,
            },
        };

        root.classList.add('future-chatbot-page-lock');
        body.classList.add('future-chatbot-body-lock');
        root.style.overflow = 'hidden';
        root.style.overscrollBehavior = 'none';
        body.style.position = 'fixed';
        body.style.top = `-${lockedScrollY}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        body.style.overflow = 'hidden';

        const syncVisualViewport = () =>
        {
            visualViewportFrame = 0;
            const visualHeight = viewport?.height || window.innerHeight;
            const visualWidth = viewport?.width || window.innerWidth;
            const visualOffsetLeft = viewport?.offsetLeft || 0;
            const visualOffsetTop = viewport?.offsetTop || 0;
            const visualScale = viewport?.scale || 1;
            const keyboardOffset = visualScale > 1.05
                ? 0
                : Math.max(0, window.innerHeight - visualHeight - visualOffsetTop);

            root.style.setProperty('--takhaial-chat-visual-height', `${visualHeight}px`);
            root.style.setProperty('--takhaial-chat-visual-width', `${visualWidth}px`);
            root.style.setProperty('--takhaial-chat-visual-left', `${visualOffsetLeft}px`);
            root.style.setProperty('--takhaial-chat-visual-top', `${visualOffsetTop}px`);
            root.style.setProperty('--takhaial-chat-visual-scale', `${visualScale}`);
            root.style.setProperty('--takhaial-chat-keyboard-offset', `${keyboardOffset}px`);
        };

        const scheduleVisualViewportSync = () =>
        {
            if (visualViewportFrame) return;
            visualViewportFrame = requestAnimationFrame(syncVisualViewport);
        };

        const preventDocumentScroll = (event) =>
        {
            const shell = shellRef.current;
            const messages = listRef.current;
            const target = event.target;
            const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
            const isInsideShell = path.length ? path.includes(shell) : shell?.contains(target);
            const isInsideMessages = path.length ? path.includes(messages) : messages?.contains(target);

            if (!isInsideShell)
            {
                event.preventDefault();
                return;
            }

            if (!isInsideMessages)
            {
                event.preventDefault();
                return;
            }

            if (!isScrollable(messages))
            {
                event.preventDefault();
                return;
            }

            const currentY = event.touches?.[0]?.clientY;
            if (typeof currentY !== 'number')
            {
                event.preventDefault();
                return;
            }

            const previousY = touchYRef.current ?? currentY;
            const deltaY = currentY - previousY;

            if ((deltaY > 0 && isAtScrollTop(messages)) || (deltaY < 0 && isAtScrollBottom(messages)))
            {
                touchYRef.current = currentY;
                event.preventDefault();
                return;
            }

            touchYRef.current = currentY;
            event.stopPropagation();
        };

        const rememberTouchY = (event) =>
        {
            touchYRef.current = event.touches?.[0]?.clientY ?? null;
        };

        const preventWheelChaining = (event) =>
        {
            const messages = listRef.current;

            if (!messages?.contains(event.target))
            {
                event.preventDefault();
                return;
            }

            if (!isScrollable(messages))
            {
                event.preventDefault();
                return;
            }

            const scrollingUp = event.deltaY < 0;
            const scrollingDown = event.deltaY > 0;

            if ((scrollingUp && isAtScrollTop(messages)) || (scrollingDown && isAtScrollBottom(messages)))
            {
                event.preventDefault();
            }
        };

        syncVisualViewport();
        scheduleVisualViewportSync();
        viewport?.addEventListener('resize', scheduleVisualViewportSync);
        viewport?.addEventListener('scroll', scheduleVisualViewportSync);
        window.addEventListener('pageshow', scheduleVisualViewportSync);
        window.addEventListener('orientationchange', scheduleVisualViewportSync);
        document.addEventListener('touchstart', rememberTouchY, { passive: true, capture: true });
        document.addEventListener('touchmove', preventDocumentScroll, { passive: false, capture: true });
        document.addEventListener('wheel', preventWheelChaining, { passive: false });

        return () =>
        {
            const lock = scrollLockRef.current;

            root.classList.remove('future-chatbot-page-lock');
            body.classList.remove('future-chatbot-body-lock');
            if (visualViewportFrame) cancelAnimationFrame(visualViewportFrame);
            viewport?.removeEventListener('resize', scheduleVisualViewportSync);
            viewport?.removeEventListener('scroll', scheduleVisualViewportSync);
            window.removeEventListener('pageshow', scheduleVisualViewportSync);
            window.removeEventListener('orientationchange', scheduleVisualViewportSync);
            document.removeEventListener('touchstart', rememberTouchY, { capture: true });
            document.removeEventListener('touchmove', preventDocumentScroll, { capture: true });
            document.removeEventListener('wheel', preventWheelChaining);
            root.style.removeProperty('--takhaial-chat-visual-height');
            root.style.removeProperty('--takhaial-chat-visual-width');
            root.style.removeProperty('--takhaial-chat-visual-left');
            root.style.removeProperty('--takhaial-chat-visual-top');
            root.style.removeProperty('--takhaial-chat-visual-scale');
            root.style.removeProperty('--takhaial-chat-keyboard-offset');

            if (lock)
            {
                root.style.overflow = lock.root.overflow;
                root.style.overscrollBehavior = lock.root.overscrollBehavior;
                body.style.position = lock.body.position;
                body.style.top = lock.body.top;
                body.style.left = lock.body.left;
                body.style.right = lock.body.right;
                body.style.width = lock.body.width;
                body.style.overflow = lock.body.overflow;
                body.style.touchAction = lock.body.touchAction;
                window.scrollTo(0, lock.scrollY);
                scrollLockRef.current = null;
            }
        };
    }, [isOpen]);

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

        if (content.length > MAX_CHAT_INPUT_LENGTH)
        {
            setHasUserMessages(true);
            setPhase('ready');
            setMessages((currentMessages) => [
                ...currentMessages,
                { role: 'assistant', content: copy.inputTooLong },
            ]);
            return;
        }

        if (!hasTrackedChatContactRef.current)
        {
            trackTikTokEvent('Contact', {
                content_type: 'ai_chat',
                content_name: 'Takhaial AI Agent',
            });
            hasTrackedChatContactRef.current = true;
        }

        setMessages((currentMessages) => [...currentMessages, { role: 'user', content }]);
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

    const openChat = useCallback(() =>
    {
        setIsOpen(true);
        setPhase(hasUserMessages || messages.length ? 'ready' : 'assemble');
    }, [hasUserMessages, messages.length]);

    const closeChat = useCallback(() =>
    {
        setIsOpen(false);
        setTypedDraft('');
    }, []);

    const showSkip = isOpen && phase !== 'ready';

    return (
        <div
            ref={shellRef}
            className={`future-chatbot-shell ${isOpen ? 'is-open' : 'is-closed'}`}
            data-phase={phase}
            dir={direction}
        >
            <button
                type="button"
                className="future-chatbot-launcher"
                onClick={openChat}
                aria-label={copy.openLabel}
                aria-expanded={isOpen}
            >
                <span className="future-chatbot-launcher-aura" aria-hidden="true" />
                <span className="future-chatbot-launcher-core" aria-hidden="true">
                    <svg viewBox="0 0 28 28" focusable="false" aria-hidden="true">
                        <path d="M7.2 8.4h13.6a3.2 3.2 0 0 1 3.2 3.2v4.8a3.2 3.2 0 0 1-3.2 3.2h-6.2l-4.5 3.3v-3.3H7.2A3.2 3.2 0 0 1 4 16.4v-4.8a3.2 3.2 0 0 1 3.2-3.2Z" />
                        <path d="M9.5 13.8h.1M14 13.8h.1M18.5 13.8h.1" />
                    </svg>
                </span>
            </button>

            {isOpen && (
            <div className="future-chatbot-popover">
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

                <button
                    type="button"
                    className="future-chatbot-close"
                    onClick={closeChat}
                    aria-label={copy.closeLabel}
                >
                    <span aria-hidden="true" />
                </button>

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

                <div
                    ref={listRef}
                    className="future-chatbot-messages"
                >
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
                                <span key={lineIndex} dir="auto">{line}</span>
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
                        maxLength={MAX_CHAT_INPUT_LENGTH}
                        onFocus={goToReady}
                    />
                    <button type="submit" disabled={isSending || !input.trim()}>
                        {copy.send}
                    </button>
                </form>
                </div>
            </div>
            )}
        </div>
    );
};

export default FutureChatbot;
