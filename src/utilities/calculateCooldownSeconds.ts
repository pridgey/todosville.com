export type CooldownUnit =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "months"
  | "years";

// Function that will get a number, and a unit of time, and return the number of seconds that represents.
export const calculateCooldownSeconds = (
  number: number,
  unit: CooldownUnit
) => {
  switch (unit) {
    case "seconds":
      return number;
    case "minutes":
      return number * 60;
    case "hours":
      return number * 60 * 60;
    case "days":
      return number * 60 * 60 * 24;
    case "weeks":
      return number * 60 * 60 * 24 * 7;
    case "months":
      return number * 60 * 60 * 24 * 30;
    case "years":
      const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      };

      const daysInYear = isLeapYear(new Date().getFullYear()) ? 366 : 365;
      return number * 60 * 60 * 24 * daysInYear;
    default:
      return number;
  }
};
