import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    if (isToday(dateObj)) {
      return format(dateObj, 'h:mm a')
    } else if (isYesterday(dateObj)) {
      return 'Yesterday'
    } else {
      return formatDistanceToNow(dateObj, { addSuffix: true })
    }
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return ''
  }
}

export const formatTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'h:mm a')
  } catch (error) {
    console.error('Error formatting time:', error)
    return ''
  }
}

export const formatDateTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'MMM dd, yyyy h:mm a')
  } catch (error) {
    console.error('Error formatting date time:', error)
    return ''
  }
}