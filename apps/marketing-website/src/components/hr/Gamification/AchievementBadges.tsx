"use client";

import { useHRTheme } from "@/themes/hrTheme";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AchievementBadgesProps {
    badges: string[];
    theme?: string;
}

export function AchievementBadges({ badges }: AchievementBadgesProps) {
    const { isRacetrack } = useHRTheme();

    if (!badges.length) return null;

    return (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/20 rounded-lg">
            <TooltipProvider>
                {badges.map((badge, idx) => (
                    <Tooltip key={idx}>
                        <TooltipTrigger>
                            <Badge
                                variant={isRacetrack ? "default" : "secondary"}
                                className={`text-lg p-2 ${isRacetrack ? 'bg-gradient-to-r from-orange-400 to-teal-400 border-none' : ''}`}
                            >
                                {getBadgeEmoji(badge)}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="capitalize">{badge.replace('-', ' ')}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
        </div>
    );
}

function getBadgeEmoji(badge: string) {
    if (badge.includes('first')) return '🥇';
    if (badge.includes('paper')) return '📝';
    if (badge.includes('tech')) return '💻';
    if (badge.includes('learn')) return '🧠';
    if (badge.includes('team')) return '🤝';
    return '🏆';
}
