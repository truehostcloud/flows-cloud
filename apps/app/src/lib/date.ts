import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

extend(relativeTime);

export const timeFromNow = (date: string): string => dayjs(date).fromNow();

export const isIsoDate = (date: string): boolean => {
  const parsed = Date.parse(date);
  if (isNaN(parsed)) return false;
  return new Date(parsed).toISOString() === date;
};

export const formatDate = (date: string | Date): string => dayjs(date).format("YYYY-MM-DD");
