export default function (obj: any) {
  return obj == null ||  (obj && Object.keys(obj).length === 0 && obj.constructor === Object);
}