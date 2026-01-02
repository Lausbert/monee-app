import useTranslations from '../hooks/useTranslations';

const LaurelBranch = ({ side = 'left', color = '#ffffff' }) => {
    const isRight = side === 'right';

    return (
        <svg
            viewBox="0 0 60 100"
            xmlns="http://www.w3.org/2000/svg"
            className="winner-badge-branch"
            aria-hidden="true"
            focusable="false"
            style={isRight ? { transform: 'scaleX(-1)' } : undefined}
        >
            <g fill={color}>
                <path
                    d="M0 0 C-5 -8 -15 -8 -20 0 C-15 8 -5 8 0 0 Z"
                    transform="translate(44 84) rotate(35) scale(1)"
                    opacity="0.95"
                />
                <path
                    d="M0 0 C-5 -8 -15 -8 -20 0 C-15 8 -5 8 0 0 Z"
                    transform="translate(42 72) rotate(18) scale(0.95)"
                    opacity="0.95"
                />
                <path
                    d="M0 0 C-5 -8 -15 -8 -20 0 C-15 8 -5 8 0 0 Z"
                    transform="translate(40 60) rotate(4) scale(0.9)"
                    opacity="0.95"
                />
                <path
                    d="M0 0 C-5 -8 -15 -8 -20 0 C-15 8 -5 8 0 0 Z"
                    transform="translate(38 48) rotate(-10) scale(0.86)"
                    opacity="0.95"
                />
                <path
                    d="M0 0 C-5 -8 -15 -8 -20 0 C-15 8 -5 8 0 0 Z"
                    transform="translate(37 36) rotate(-26) scale(0.82)"
                    opacity="0.95"
                />
                <path
                    d="M0 0 C-5 -8 -15 -8 -20 0 C-15 8 -5 8 0 0 Z"
                    transform="translate(39 24) rotate(-40) scale(0.78)"
                    opacity="0.95"
                />
                <path
                    d="M0 0 C-5 -8 -15 -8 -20 0 C-15 8 -5 8 0 0 Z"
                    transform="translate(45 12) rotate(-55) scale(0.74)"
                    opacity="0.95"
                />
            </g>

            <path
                d="M44 92 C36 76 34 60 34 44 C34 28 38 14 48 8"
                stroke={color}
                strokeWidth="2.25"
                fill="none"
                strokeLinecap="round"
                opacity="0.55"
            />
        </svg>
    );
};

export default function WinnerBadge({ translations }) {
    const { t } = useTranslations(translations);

    const awardTitle = t('global.award.badge_title');
    const awardSubtitle = t('global.award.badge_subtitle');
    const awardLink = t('global.award.link');

    // Check if we have valid award data
    const showAward =
        awardLink &&
        awardLink !== 'global.award.link';

    if (!showAward) return null;

    // Use translations with fallbacks
    const displayTitle = awardTitle && awardTitle !== 'global.award.badge_title'
        ? awardTitle
        : 'Best Budget & Expense Tracker App 2025';
    const displaySubtitle = awardSubtitle && awardSubtitle !== 'global.award.badge_subtitle'
        ? awardSubtitle
        : 'TheAppNote Award';

    return (
        <a
            href={awardLink}
            target="_blank"
            rel="noopener noreferrer"
            className="winner-badge"
        >
            <div className="winner-badge-inner">
                <LaurelBranch side="left" color="#ffffff" />
                <div className="winner-badge-text">
                    <span className="winner-badge-title">
                        {displayTitle}
                    </span>
                    <span className="winner-badge-subtitle">
                        {displaySubtitle}
                    </span>
                </div>
                <LaurelBranch side="right" color="#ffffff" />
            </div>
        </a>
    );
}
