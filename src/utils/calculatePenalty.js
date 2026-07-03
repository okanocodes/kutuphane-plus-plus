export const calculatePenalty = (dueDateString, returnDateString = null) => {
  if (!dueDateString) return 0;
  try {
    const due = new Date(dueDateString);
    const end = returnDateString ? new Date(returnDateString) : new Date();
    
    // Normalize times to midnight to calculate strict date difference
    due.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    if (end <= due) return 0;
    
    const diffTime = Math.abs(end - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const DAILY_FINE = 5.0; // 5 TL per day gecikme cezası
    return diffDays * DAILY_FINE;
  } catch {
    return 0;
  }
};

export default calculatePenalty;
