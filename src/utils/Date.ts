export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const currentYear = new Date().getFullYear();
    const timeDifference = new Date().getTime() - date.getTime();

    // Convert the time difference to years
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000; // Approximation
    if (timeDifference <= oneYearInMilliseconds) {
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
  