export const formatDate = (date: string): string => {
    return new Date(date).toISOString().slice(0, 16).replace('T', ' ');
};