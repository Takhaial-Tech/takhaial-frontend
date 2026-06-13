import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { backendUrl } from '../config';
import { useLanguage } from '../i18n/LanguageContext';
import { trackTikTokEvent } from '../helpers/tiktokPixel';

const MAX_CHAT_INPUT_LENGTH = 700;
const EXIT_MS = 260;

const chatCopy = {
    en: {
        agentLabel: 'Takhaial AI',
        status: 'Online',
        tagline: 'Usually replies instantly',
        initialMessage:
            "Hi! I'm Takhaial's AI assistant. Tell me what you're imagining and I'll help turn it into a real project.",
        placeholder: 'Type your message...',
        send: 'Send',
        thinking: 'Typing',
        fallback: 'I could not reach the assistant right now. Please try again in a moment.',
        inputTooLong: `Please keep each message under ${MAX_CHAT_INPUT_LENGTH} characters.`,
        openLabel: 'Open Takhaial AI chat',
        closeLabel: 'Close chat',
    },
    ar: {
        agentLabel: 'مساعد تخيل',
        status: 'متصل',
        tagline: 'عادةً بيرد فورًا',
        initialMessage:
            'أهلاً! أنا مساعد تخيل الذكي. قوللي اللي في خيالك وأنا هساعدك أحوّله لمشروع حقيقي.',
        placeholder: 'اكتب رسالتك...',
        send: 'إرسال',
        thinking: 'بيكتب',
        fallback:
            'مش قادر أوصل للمساعد حاليا. جرب تاني بعد لحظات.',
        inputTooLong: `من فضلك خلي كل رسالة أقل من ${MAX_CHAT_INPUT_LENGTH} حرف.`,
        openLabel: 'افتح شات تخيل الذكي',
        closeLabel: 'اقفل الشات',
    },
};

const isMobileViewport = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

// Standalone by default (renders its own launcher FAB). Pass `open` +
// `onOpenChange` to control it from a parent (e.g. the robot assistant),
// and `showLauncher={false}` to hide the built-in launcher.
const FutureChatbot = ({ open, onOpenChange, showLauncher = true }) =>
{
    const { direction, language } = useLanguage();
    const copy = chatCopy[language === 'ar' ? 'ar' : 'en'];

    const isControlled = typeof open === 'boolean';
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = isControlled ? open : internalOpen;
    const [isMounted, setIsMounted] = useState(false);
    const [show, setShow] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    const listRef = useRef(null);
    const inputRef = useRef(null);
    const scrollLockRef = useRef(null);
    const activeRequestRef = useRef(null);
    const hasTrackedRef = useRef(false);

    const openChat = useCallback(() =>
    {
        setMessages((current) =>
            current.length
                ? current
                : [{ role: 'assistant', content: chatCopy[language === 'ar' ? 'ar' : 'en'].initialMessage }]
        );
        if (isControlled) onOpenChange?.(true);
        else setInternalOpen(true);
    }, [language, isControlled, onOpenChange]);

    const closeChat = useCallback(() =>
    {
        activeRequestRef.current?.abort();
        activeRequestRef.current = null;
        inputRef.current?.blur();
        setIsSending(false);
        if (isControlled) onOpenChange?.(false);
        else setInternalOpen(false);
    }, [isControlled, onOpenChange]);

    // In controlled mode the parent flips `open` directly, so seed the
    // greeting message here instead of relying on openChat().
    useEffect(() =>
    {
        if (!isControlled || !open) return;
        setMessages((current) =>
            current.length
                ? current
                : [{ role: 'assistant', content: chatCopy[language === 'ar' ? 'ar' : 'en'].initialMessage }]
        );
    }, [isControlled, open, language]);

    // Mount/unmount with enter + exit animation (double rAF to flip enter state).
    useEffect(() =>
    {
        if (isOpen)
        {
            setIsMounted(true);
            // Flip to the open state on the next tick so the closed styles paint
            // first and the transition plays. setTimeout is used instead of
            // requestAnimationFrame because rAF can be throttled in background tabs.
            const timer = setTimeout(() => setShow(true), 30);
            return () => clearTimeout(timer);
        }

        setShow(false);
        const timer = setTimeout(() => setIsMounted(false), EXIT_MS);
        return () => clearTimeout(timer);
    }, [isOpen]);

    // Close on Escape.
    useEffect(() =>
    {
        if (!isMounted) return undefined;
        const onKey = (event) =>
        {
            if (event.key === 'Escape') closeChat();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [closeChat, isMounted]);

    useEffect(() => () =>
    {
        activeRequestRef.current?.abort();
        activeRequestRef.current = null;
    }, []);

    // Lock the page behind the sheet on mobile without fixing <body>. Fixed body
    // locks are fragile in iOS Safari once the keyboard and fetch state change.
    // Instead, freeze document overflow and prevent scroll chaining outside the
    // chat's own message list.
    useEffect(() =>
    {
        if (!isMounted) return undefined;

        const root = document.documentElement;
        const viewport = window.visualViewport;
        let frame = 0;

        const syncViewport = () =>
        {
            frame = 0;
            const height = viewport ? viewport.height : window.innerHeight;
            const width = viewport ? viewport.width : window.innerWidth;
            const offsetLeft = viewport ? viewport.offsetLeft : 0;
            const offsetTop = viewport ? viewport.offsetTop : 0;
            root.style.setProperty('--tk-chat-vh', `${height}px`);
            root.style.setProperty('--tk-chat-vw', `${width}px`);
            root.style.setProperty('--tk-chat-vv-top', `${offsetTop}px`);
            root.style.setProperty('--tk-chat-vv-left', `${offsetLeft}px`);
            root.style.setProperty('--takhaial-chat-visual-width', `${width}px`);
            root.style.setProperty('--takhaial-chat-visual-left', `${offsetLeft}px`);
        };

        const scheduleSync = () =>
        {
            if (frame) return;
            frame = requestAnimationFrame(syncViewport);
        };

        syncViewport();
        viewport?.addEventListener('resize', scheduleSync);
        viewport?.addEventListener('scroll', scheduleSync);
        window.addEventListener('resize', scheduleSync);
        window.addEventListener('orientationchange', scheduleSync);

        const lockBody = isMobileViewport();
        let startY = 0;
        let startX = 0;
        let removeScrollIsolation = () => {};

        if (lockBody)
        {
            const body = document.body;
            scrollLockRef.current = {
                rootOverflow: root.style.overflow,
                rootOverscrollBehavior: root.style.overscrollBehavior,
                overflow: body.style.overflow,
                overscrollBehavior: body.style.overscrollBehavior,
            };

            root.classList.add('tk-chat-page-locked');
            body.classList.add('tk-chat-locked');
            root.style.overflow = 'hidden';
            root.style.overscrollBehavior = 'none';
            body.style.overflow = 'hidden';
            body.style.overscrollBehavior = 'none';

            const getElement = (target) => target instanceof Element ? target : null;
            const isInsideWindow = (target) => Boolean(getElement(target)?.closest('.tk-chat-window'));
            const getMessageList = (target) => getElement(target)?.closest('.tk-chat-body');

            const onTouchStart = (event) =>
            {
                const touch = event.touches?.[0];
                startY = touch?.clientY ?? 0;
                startX = touch?.clientX ?? 0;
            };

            const onTouchMove = (event) =>
            {
                const target = event.target;
                if (!isInsideWindow(target))
                {
                    event.preventDefault();
                    return;
                }

                const messageList = getMessageList(target);
                if (!messageList)
                {
                    event.preventDefault();
                    return;
                }

                const touch = event.touches?.[0];
                const currentY = touch?.clientY ?? startY;
                const currentX = touch?.clientX ?? startX;
                const deltaY = currentY - startY;
                const deltaX = currentX - startX;

                if (Math.abs(deltaX) > Math.abs(deltaY))
                {
                    event.preventDefault();
                    return;
                }

                const atTop = messageList.scrollTop <= 0;
                const atBottom =
                    Math.ceil(messageList.scrollTop + messageList.clientHeight) >= messageList.scrollHeight;

                if ((atTop && deltaY > 0) || (atBottom && deltaY < 0))
                {
                    event.preventDefault();
                }
            };

            const onWheel = (event) =>
            {
                const target = event.target;
                if (!isInsideWindow(target))
                {
                    event.preventDefault();
                    return;
                }

                const messageList = getMessageList(target);
                if (!messageList)
                {
                    event.preventDefault();
                    return;
                }

                const atTop = messageList.scrollTop <= 0;
                const atBottom =
                    Math.ceil(messageList.scrollTop + messageList.clientHeight) >= messageList.scrollHeight;

                if ((atTop && event.deltaY < 0) || (atBottom && event.deltaY > 0))
                {
                    event.preventDefault();
                }
            };

            document.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
            document.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
            document.addEventListener('wheel', onWheel, { passive: false, capture: true });

            removeScrollIsolation = () =>
            {
                document.removeEventListener('touchstart', onTouchStart, { capture: true });
                document.removeEventListener('touchmove', onTouchMove, { capture: true });
                document.removeEventListener('wheel', onWheel, { capture: true });
            };
        }

        return () =>
        {
            if (frame) cancelAnimationFrame(frame);
            viewport?.removeEventListener('resize', scheduleSync);
            viewport?.removeEventListener('scroll', scheduleSync);
            window.removeEventListener('resize', scheduleSync);
            window.removeEventListener('orientationchange', scheduleSync);
            root.style.removeProperty('--tk-chat-vh');
            root.style.removeProperty('--tk-chat-vw');
            root.style.removeProperty('--tk-chat-vv-top');
            root.style.removeProperty('--tk-chat-vv-left');
            root.style.removeProperty('--takhaial-chat-visual-width');
            root.style.removeProperty('--takhaial-chat-visual-left');
            removeScrollIsolation();

            const lock = scrollLockRef.current;
            if (lock)
            {
                const body = document.body;
                root.classList.remove('tk-chat-page-locked');
                body.classList.remove('tk-chat-locked');
                root.style.overflow = lock.rootOverflow;
                root.style.overscrollBehavior = lock.rootOverscrollBehavior;
                body.style.overflow = lock.overflow;
                body.style.overscrollBehavior = lock.overscrollBehavior;
                scrollLockRef.current = null;
            }
        };
    }, [isMounted]);

    // Keep the conversation pinned to the newest message.
    useEffect(() =>
    {
        const list = listRef.current;
        if (!list) return;
        list.scrollTop = list.scrollHeight;
    }, [messages, isSending, show]);

    const apiMessages = useMemo(() =>
        messages
            .filter((message) => message.content)
            .slice(-10)
            .map((message) => ({ role: message.role, content: message.content })),
    [messages]);

    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        const content = input.trim();
        if (!content || isSending) return;

        if (content.length > MAX_CHAT_INPUT_LENGTH)
        {
            setMessages((current) => [...current, { role: 'assistant', content: copy.inputTooLong }]);
            return;
        }

        if (!hasTrackedRef.current)
        {
            trackTikTokEvent('Contact', { content_type: 'ai_chat', content_name: 'Takhaial AI Agent' });
            hasTrackedRef.current = true;
        }

        setMessages((current) => [...current, { role: 'user', content }]);
        setInput('');
        setIsSending(true);
        if (isMobileViewport())
        {
            inputRef.current?.blur();
        }

        const controller = new AbortController();
        activeRequestRef.current = controller;
        const timeout = setTimeout(() => controller.abort(), 35000);

        try
        {
            const response = await fetch(`${backendUrl}chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    language,
                    messages: [...apiMessages, { role: 'user', content }],
                }),
            });

            const result = await response.json().catch(() => ({}));
            if (controller.signal.aborted || activeRequestRef.current !== controller) return;

            setMessages((current) => [
                ...current,
                { role: 'assistant', content: result?.reply || result?.message || copy.fallback },
            ]);
        } catch (err)
        {
            if (controller.signal.aborted) return;
            setMessages((current) => [...current, { role: 'assistant', content: copy.fallback }]);
        } finally
        {
            clearTimeout(timeout);
            if (activeRequestRef.current === controller)
            {
                activeRequestRef.current = null;
                setIsSending(false);
            }
        }
    };

    const handleCloseTouch = (event) =>
    {
        event.preventDefault();
        closeChat();
    };

    const sheet = isMounted
        ? createPortal(
            <div
                className="tk-chat-root"
                data-state={show ? 'open' : 'closed'}
                dir={direction}
            >
                <button
                    type="button"
                    className={`tk-chat-scrim${show ? ' is-open' : ''}`}
                    aria-label={copy.closeLabel}
                    onClick={closeChat}
                    onTouchEnd={handleCloseTouch}
                    tabIndex={-1}
                />

                <section
                    className={`tk-chat-window${show ? ' is-open' : ''}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={copy.agentLabel}
                >
                    <header className="tk-chat-head">
                        <span className="tk-chat-avatar" aria-hidden="true">
                            <svg viewBox="0 0 24 24" focusable="false">
                                <path d="M6.5 7.5h11a2.5 2.5 0 0 1 2.5 2.5v4a2.5 2.5 0 0 1-2.5 2.5h-5l-3.6 2.6V16.5H6.5A2.5 2.5 0 0 1 4 14v-4a2.5 2.5 0 0 1 2.5-2.5Z" />
                                <circle cx="9" cy="12" r="1" />
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="15" cy="12" r="1" />
                            </svg>
                        </span>
                        <div className="tk-chat-head-text">
                            <div className="tk-chat-name">
                                {copy.agentLabel}
                                <span className="tk-chat-dot" aria-hidden="true" />
                            </div>
                            <span className="tk-chat-tagline">{copy.tagline}</span>
                        </div>
                        <button
                            type="button"
                            className="tk-chat-close"
                            onClick={closeChat}
                            onTouchEnd={handleCloseTouch}
                            aria-label={copy.closeLabel}
                        >
                            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                                <path d="M7 7l10 10M17 7L7 17" />
                            </svg>
                        </button>
                    </header>

                    <div className="tk-chat-body" ref={listRef}>
                        {messages.map((message, index) => (
                            <div
                                key={`${message.role}-${index}`}
                                className={`tk-chat-msg ${message.role === 'user' ? 'is-user' : 'is-bot'}`}
                            >
                                {message.content.split('\n').map((line, lineIndex) => (
                                    <span key={lineIndex} dir="auto">{line}</span>
                                ))}
                            </div>
                        ))}

                        {isSending && (
                            <div className="tk-chat-msg is-bot is-typing" aria-live="polite">
                                <span className="tk-chat-typing">
                                    <i />
                                    <i />
                                    <i />
                                </span>
                            </div>
                        )}
                    </div>

                    <form className="tk-chat-input" onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder={copy.placeholder}
                            aria-label={copy.placeholder}
                            maxLength={MAX_CHAT_INPUT_LENGTH}
                            enterKeyHint="send"
                            autoComplete="off"
                        />
                        <button type="submit" aria-label={copy.send} disabled={isSending || !input.trim()}>
                            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                                <path d="M4 12l16-7-7 16-2.4-6.6L4 12Z" />
                            </svg>
                        </button>
                    </form>
                </section>
            </div>,
            document.body,
        )
        : null;

    return (
        <>
            {showLauncher && (
                <button
                    type="button"
                    className="tk-chat-launcher"
                    data-open={isOpen ? 'true' : 'false'}
                    onClick={openChat}
                    aria-label={copy.openLabel}
                    aria-expanded={isOpen}
                >
                    <span className="tk-chat-launcher-pulse" aria-hidden="true" />
                    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                        <path d="M6.5 7.5h11a2.5 2.5 0 0 1 2.5 2.5v4a2.5 2.5 0 0 1-2.5 2.5h-5l-3.6 2.6V16.5H6.5A2.5 2.5 0 0 1 4 14v-4a2.5 2.5 0 0 1 2.5-2.5Z" />
                        <circle cx="9" cy="12" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="15" cy="12" r="1" />
                    </svg>
                </button>
            )}
            {sheet}
        </>
    );
};

export default FutureChatbot;
