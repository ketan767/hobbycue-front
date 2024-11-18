export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const currentYear = new Date().getFullYear();
  
    if (date.getFullYear() === currentYear) {
      // Format for same year
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} ${month}, ${hours}:${minutes}`;
    } else {
      // Format for different year
      const day = date.getDate().toString();
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
  }
  