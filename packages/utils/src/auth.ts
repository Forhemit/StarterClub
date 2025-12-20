export type UserRole = 'admin' | 'partner' | 'member';

export const isAdmin = (role?: string): boolean => {
    return role === 'admin';
};

export const hasRole = (role: string | undefined, requiredRole: UserRole): boolean => {
    return role === requiredRole;
};
