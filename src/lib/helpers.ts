export const getHealthColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
};

export const getHealthLabel = (score: number) => {
    if (score >= 8) return 'صحة ممتازة ✅';
    if (score >= 6) return 'يحتاج متابعة ⚠️';
    return 'خطر 🔴';
};
