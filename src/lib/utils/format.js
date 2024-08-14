import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function formatTime(v) {
  return dayjs(v).format("HH:mm:ss");
}

export function formatTimeMs(v) {
  return dayjs(v).format("HH:mm:ss.SSS");
}

export function formatDuration(v){
  const d = dayjs.duration(v)
  if (d.days() > 0) {
    return d.format("D [days] HH:mm:ss");
  }
  return d.format("HH:mm:ss");
}