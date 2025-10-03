import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return null;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
};

export const formatDateTime = (date) => {
  if (!date) return null;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
};

export const isOverdue = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date() && !isToday(dateObj);
};
