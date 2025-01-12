import { format, differenceInWeeks, differenceInMonths } from "date-fns";
import { vi } from "date-fns/locale";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "d MMMM, yyyy", { locale: vi });
};

export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const months = differenceInMonths(end, start);
  const weeks = differenceInWeeks(end, start) % 4;

  return `${months ? `${months} tháng ` : ''}${weeks} tuần`;
};
