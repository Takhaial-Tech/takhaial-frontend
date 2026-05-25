import { useEffect, useMemo, useRef, useState } from 'react';
import { mediaUrl } from '../config';
import { useLanguage } from '../i18n/LanguageContext';

const VIDEO_TYPES = {
    mp4: 'video/mp4',
    m4v: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
    ogg: 'video/ogg',
    ogv: 'video/ogg',
    mkv: 'video/x-matroska',
};

const getExtension = (src = '') =>
{
    const cleanSrc = String(src).split('?')[0].split('#')[0];
    const filename = cleanSrc.split('/').pop() || '';
    const parts = filename.split('.');

    return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const getSourceUrl = (src = '') =>
{
    if (!src) return '';
    if (/^(https?:)?\/\//i.test(src)) return src;
    if (/^(blob|data):/i.test(src)) return src;
    if (String(src).startsWith('/')) return src;

    return `${mediaUrl}${src}`;
};

const isSectionMediaUrl = (sourceUrl = '') =>
    sourceUrl.startsWith(mediaUrl) || sourceUrl.includes('/v1/sections/media/');

const getSourceType = (sourceUrl = '') =>
{
    if (isSectionMediaUrl(sourceUrl)) return 'video/mp4';

    return VIDEO_TYPES[getExtension(sourceUrl)];
};

const canBrowserPlay = (mimeType) =>
{
    if (!mimeType || typeof document === 'undefined') return true;

    const video = document.createElement('video');
    const result = video.canPlayType(mimeType);

    return result === 'probably' || result === 'maybe';
};

const CompatibleVideo = ({
    src,
    title,
    className = '',
    style,
    controls = true,
    autoPlay = false,
    muted = false,
    loop = false,
    preload = 'metadata',
}) =>
{
    const { t } = useLanguage();
    const videoRef = useRef(null);
    const [hasPlaybackError, setHasPlaybackError] = useState(false);
    const sourceUrl = useMemo(() => getSourceUrl(src), [src]);
    const sourceType = useMemo(() => getSourceType(sourceUrl), [sourceUrl]);
    const [isUnsupportedFormat, setIsUnsupportedFormat] = useState(false);

    useEffect(() =>
    {
        setHasPlaybackError(false);
        setIsUnsupportedFormat(sourceType ? !canBrowserPlay(sourceType) : false);
    }, [sourceType, sourceUrl]);

    if (!sourceUrl)
    {
        return null;
    }

    const showFallback = isUnsupportedFormat || hasPlaybackError;

    return (
        <div className="compatible-video-frame">
            {!showFallback && (
                <video
                    ref={videoRef}
                    key={sourceUrl}
                    className={className}
                    style={style}
                    controls={controls}
                    autoPlay={autoPlay}
                    muted={muted}
                    loop={loop}
                    playsInline={true}
                    webkit-playsinline="true"
                    x-webkit-airplay="allow"
                    preload={preload}
                    onError={() => setHasPlaybackError(true)}
                    onLoadedMetadata={() => setHasPlaybackError(false)}
                    onCanPlay={() => setHasPlaybackError(false)}
                >
                    <source src={sourceUrl} {...(sourceType ? { type: sourceType } : {})} />
                    {t('Your browser does not support video playback.')}
                </video>
            )}

            {showFallback && (
                <div className={`compatible-video-fallback ${className}`} style={style}>
                    <h3>
                        {isUnsupportedFormat
                            ? t('This video format is not supported on this browser.')
                            : t('Video cannot be played on this browser.')}
                    </h3>
                    <p>{t('Please try opening the file directly or contact us for an MP4 version.')}</p>
                    <a href={sourceUrl} target="_blank" rel="noreferrer" download={title || true}>
                        {t('Open video file')}
                    </a>
                </div>
            )}
        </div>
    );
};

export default CompatibleVideo;
