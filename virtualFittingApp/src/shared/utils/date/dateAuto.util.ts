export function formatDateAuto(input: string) {
  const d = input.replace(/\D/g, "").slice(0, 8);   
  if (d.length <= 4) return d;                     
  if (d.length <= 6) return `${d.slice(0,4)}-${d.slice(4,6)}`;      
  return `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;     
}         
