const getTikTokPixelId = () =>
{
    return process.env.REACT_APP_TIKTOK_PIXEL_ID || window.__TAKHAIAL_TIKTOK_PIXEL_ID__ || '';
};

const cleanPayload = (payload = {}) =>
{
    return Object.entries(payload).reduce((result, [key, value]) =>
    {
        if (value === undefined || value === null || value === '') return result;
        result[key] = value;
        return result;
    }, {});
};

export const initTikTokPixel = () =>
{
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;

    const pixelId = getTikTokPixelId();
    if (!pixelId) return false;

    if (window.ttq?.__takhaialLoadedPixelId === pixelId) return true;

    window.TiktokAnalyticsObject = 'ttq';
    const ttq = window.ttq = window.ttq || [];

    if (!ttq.methods)
    {
        ttq.methods = [
            'page',
            'track',
            'identify',
            'instances',
            'debug',
            'on',
            'off',
            'once',
            'ready',
            'alias',
            'group',
            'enableCookie',
            'disableCookie',
            'holdConsent',
            'revokeConsent',
            'grantConsent',
        ];

        ttq.setAndDefer = (target, methodName) =>
        {
            target[methodName] = (...args) =>
            {
                target.push([methodName, ...args]);
            };
        };

        ttq.methods.forEach((methodName) => ttq.setAndDefer(ttq, methodName));

        ttq.instance = (id) =>
        {
            const instance = ttq._i[id] || [];
            ttq.methods.forEach((methodName) => ttq.setAndDefer(instance, methodName));
            return instance;
        };
    }

    ttq._i = ttq._i || {};
    ttq._t = ttq._t || {};
    ttq._o = ttq._o || {};

    ttq.load = ttq.load || ((id, options = {}) =>
    {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${id}&lib=ttq`;

        ttq._i[id] = ttq._i[id] || [];
        ttq._i[id]._u = script.src;
        ttq._t[id] = Date.now();
        ttq._o[id] = options;

        const firstScript = document.getElementsByTagName('script')[0];

        if (firstScript?.parentNode)
        {
            firstScript.parentNode.insertBefore(script, firstScript);
            return;
        }

        document.head.appendChild(script);
    });

    ttq.load(pixelId);
    ttq.__takhaialLoadedPixelId = pixelId;
    return true;
};

export const trackTikTokPageView = () =>
{
    if (!initTikTokPixel()) return;
    window.ttq.page();
};

export const trackTikTokEvent = (eventName, payload = {}) =>
{
    if (!eventName || !initTikTokPixel()) return;
    window.ttq.track(eventName, cleanPayload(payload));
};
