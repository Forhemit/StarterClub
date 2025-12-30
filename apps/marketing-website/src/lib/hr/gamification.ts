export interface GamificationRule {
    action: string;
    points: number;
    badge?: string;
    streakRequirement?: number;
    multiplier?: number;
}

export class HRGamificationEngine {
    private userPoints: Map<string, number> = new Map();
    private userBadges: Map<string, Set<string>> = new Map();
    private userStreaks: Map<string, Map<string, number>> = new Map();
    private rules: GamificationRule[];

    constructor() {
        this.rules = [
            { action: 'employee_onboarded', points: 200, badge: 'recruiter' },
            { action: 'interview_completed', points: 50, badge: 'interviewer' },
            { action: 'offer_sent', points: 100, badge: 'closer' },
            { action: 'document_signed', points: 25, streakRequirement: 5 },
            { action: 'training_completed', points: 75, badge: 'trainer' },
            { action: 'review_submitted', points: 60, multiplier: 1.5 },
            { action: 'goal_achieved', points: 150, badge: 'achiever' },
            { action: 'team_recognition', points: 100, badge: 'team_player' }
        ];
    }

    async processAction(userId: string, action: string, metadata?: any) {
        const rule = this.rules.find(r => r.action === action);
        if (!rule) return;

        let points = rule.points;

        // Apply streak multiplier
        const streak = this.getStreak(userId, action);
        if (streak >= (rule.streakRequirement || 3)) {
            points *= (rule.multiplier || 1.2);
        }

        // Update points
        const currentPoints = this.userPoints.get(userId) || 0;
        this.userPoints.set(userId, currentPoints + points);

        // Award badge if eligible
        if (rule.badge) {
            const badges = this.userBadges.get(userId) || new Set();
            badges.add(rule.badge);
            this.userBadges.set(userId, badges);
        }

        // Update streak
        this.updateStreak(userId, action);

        // Check for level up
        const newLevel = this.calculateLevel(currentPoints + points);

        return {
            points,
            totalPoints: currentPoints + points,
            badge: rule.badge,
            streak,
            level: newLevel,
            rewards: this.getRewardsForLevel(newLevel)
        };
    }

    private getStreak(userId: string, action: string): number {
        const userStreaks = this.userStreaks.get(userId);
        if (!userStreaks) return 0;
        return userStreaks.get(action) || 0;
    }

    private updateStreak(userId: string, action: string) {
        let userStreaks = this.userStreaks.get(userId);
        if (!userStreaks) {
            userStreaks = new Map();
            this.userStreaks.set(userId, userStreaks);
        }

        const currentStreak = userStreaks.get(action) || 0;
        userStreaks.set(action, currentStreak + 1);
    }

    private calculateLevel(points: number): number {
        return Math.floor(points / 1000) + 1;
    }

    private getRewardsForLevel(level: number): string[] {
        const rewards = [
            'Unlock advanced reports',
            'Get priority support',
            'Access to analytics dashboard',
            'Custom workflow templates',
            'AI-powered insights'
        ];
        return rewards.slice(0, Math.min(level, rewards.length));
    }

    getLeaderboard(limit: number = 10) {
        return Array.from(this.userPoints.entries())
            .map(([userId, points]) => ({
                userId,
                points,
                badges: Array.from(this.userBadges.get(userId) || []),
                level: this.calculateLevel(points)
            }))
            .sort((a, b) => b.points - a.points)
            .slice(0, limit);
    }
}

// Singleton instance
export const hrGamification = new HRGamificationEngine();
