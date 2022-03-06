export default function formatTime(timeInSec) {
  const minutes = Math.floor(timeInSec / 60) || 0;
  const seconds = Math.round(timeInSec - minutes * 60 || 0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
