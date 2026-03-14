export const getCarbonRating = (co2) => {
  if (co2 <= 20) return { grade: 'A', color: '#22c55e', label: 'Excellent' };
  if (co2 <= 40) return { grade: 'B', color: '#84cc16', label: 'Good' };
  if (co2 <= 70) return { grade: 'C', color: '#f59e0b', label: 'Moderate' };
  if (co2 <= 100) return { grade: 'D', color: '#f97316', label: 'Poor' };
  return { grade: 'F', color: '#ef4444', label: 'Critical' };
};

export const FUEL_PRICE_PER_LITRE = 103;

export const formatTime = (d) =>
  d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

export const formatDate = (d) =>
  d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });