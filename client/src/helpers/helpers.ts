export const numberToTime = (e: number) => {
  const h = Math.floor(e % 3600 / 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(e % 60)
    .toString()
    .padStart(2, "0");

  return `${h}:${m}`;
};
