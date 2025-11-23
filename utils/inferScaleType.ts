/**
 * Infer the appropriate scale type based on sample data values
 */
export function inferScaleType(values: any[]): 'time' | 'linear' | 'point' {
  if (!values || values.length === 0) return 'point';
  
  // Sample a few values to check type
  const sampleSize = Math.min(10, values.length);
  const samples = values.slice(0, sampleSize);
  
  // Check if all samples are valid dates
  const areDates = samples.every(val => {
    if (val instanceof Date) return true;
    if (typeof val === 'number') return false; // Numbers are not dates
    if (typeof val !== 'string') return false;
    
    // Try to parse as date
    const date = new Date(val);
    return !isNaN(date.getTime()) && 
           // Check if it looks like a date string (has dashes, slashes, or year)
           (/\d{4}/.test(val) || /[-\/]/.test(val));
  });
  
  if (areDates) return 'time';
  
  // Check if all samples are numbers
  const areNumbers = samples.every(val => {
    if (typeof val === 'number') return true;
    if (typeof val !== 'string') return false;
    // Check if string is a valid number
    return !isNaN(Number(val)) && val.trim() !== '';
  });
  
  if (areNumbers) return 'linear';
  
  // Default to point scale for categorical data
  return 'point';
}
