function currentTime() {
  let now = new Date();
  let hours = formatUnit(now.getHours());
  let minutes = formatUnit(now.getMinutes());
  let seconds = formatUnit(now.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
  function formatUnit(unit) {
    return unit < 10 ? `0${unit}` : unit;
  }
}
