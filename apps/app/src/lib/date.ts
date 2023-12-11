import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

extend(relativeTime);

export const timeFromNow = (date: string): string => dayjs(date).fromNow();
