export default function(s: string, each: number) {
  return s.length > each * 2 ? s.slice(0,each) + '...' + s.slice(-each) : s;
}