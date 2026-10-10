// turns "2024-05-01T10:00:00Z" into "1/5/2024"
export const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "NA");

// how many days ago something was created
export const daysAgo = (date) => {
  const diff = new Date() - new Date(date);
  const days = Math.floor(diff / (1000 * 24 * 60 * 60));
  return days === 0 ? "Today" : `${days} days ago`;
};
