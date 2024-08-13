  import dayjs from "dayjs";
  import duration from "dayjs/plugin/duration";

  dayjs.extend(duration);

  export function formatTime(v) {
    return dayjs(v).format("HH:mm:ss");
  }

  export function formatTimeMs(v) {
    return dayjs(v).format("HH:mm:ss.SSS");
  }
