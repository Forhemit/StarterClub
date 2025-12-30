export const useHRTheme = () => {
    // Hardcoded to 'racetrack' for now, or could come from a global theme context
    const theme = 'racetrack';
    const isRacetrack = theme === 'racetrack';

    const colors = {
        primary: isRacetrack ? '#FF6B35' : '#3B82F6',
        secondary: isRacetrack ? '#00C9B8' : '#10B981',
        accent: isRacetrack ? '#F43F5E' : '#8B5CF6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    };

    return {
        theme,
        isRacetrack,
        colors,
        // Add compatible class maps if needed
        classes: {
            primaryGradient: isRacetrack
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#00C9B8]'
                : 'bg-gradient-to-r from-blue-500 to-emerald-500',
            cardHover: 'hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200'
        }
    };
};
