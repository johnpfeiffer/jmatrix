export function combineDateAndTime(date: string, time: string): string | undefined {
  if (!date) {
    return undefined;
  }

  const localDateTime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
  return new Date(localDateTime).toISOString();
}

export function splitIsoForInputs(iso?: string): { date: string; time: string } {
  if (!iso) {
    return { date: "", time: "" };
  }

  const date = new Date(iso);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
  };
}
