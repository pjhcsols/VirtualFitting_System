export const removeUndefined = (obj: Record<string, any>) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
};