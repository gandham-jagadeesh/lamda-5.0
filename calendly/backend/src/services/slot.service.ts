import { DateTime, Interval } from "luxon";

export interface TimeWindow{
  startTime: DateTime,
  endTime: DateTime
}

interface Exceptions{
  type: string,
  startTime: string|null,
  endTime: string|null,
  timeZone:string
}

export function parseTimeOnDate(date: DateTime, time: string, timezone: string) {
  const [hour, minute] = time.split(":").map(Number);
  return date.setZone(timezone).set({
    hour: hour,
    minute:minute
  });
}

export function windowsForWeekDayRule(date: DateTime, weekday: number, startTime: string, endTime: string, timezone: string) {
  const localDate  = date.setZone(timezone).startOf('day');
  const luxonWeek = weekday === 7 ? 0 : weekday;
  if (localDate.weekday !== luxonWeek) return [];
  const start = parseTimeOnDate(localDate,startTime,timezone);
  const end = parseTimeOnDate(localDate, endTime, timezone);
  if (!start.isValid || !end.isValid || start >= end) return [];
  return [{ startTime: start, endTime: end }];
}

export function mergeWindows(windows: TimeWindow[]) {
  if (windows.length == 0) return [];
  // sort them by their first startTime and then just use same filter we used in below
  const sortedValues = [...windows].sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());
  const mergedResult = [sortedValues[0]];
  for (let i = 1; i < sortedValues.length; i++){
    const mergeInterval = sortedValues[i];
    const lastMergedInterval = mergedResult[mergedResult.length - 1];
    if (mergeInterval.startTime <= lastMergedInterval.endTime) { // definitely overlapped
      lastMergedInterval.endTime = mergeInterval.endTime > lastMergedInterval.endTime ? mergeInterval.endTime : lastMergedInterval.endTime;
    }
    else {
      mergedResult.push(mergeInterval);
    }
  }
return mergedResult;
}

// apply exceptions to the valid windows (created from the valid rules for that date itself)
export function applyExceptionsForDate(cursor: DateTime, windows: TimeWindow[], exceptions: Exceptions[]) {
  // need to filter the exceptions to luxon time window so to filter
  // types of exceptions :  partial , full , add_available_window
  let validWindows:TimeWindow[] = [...windows];
  for (let ex of exceptions) {
    if (ex.type === "full") { return []; }
    else if (ex.type === "partial" && ex.startTime && ex.endTime) {
      // check for overlapping if no overlap just return valid windows otherwise new valid windows need to be created : need to remove those valid windows
      const start = parseTimeOnDate(cursor, ex.startTime, ex.timeZone);
      const end = parseTimeOnDate(cursor, ex.endTime, ex.timeZone);
      const block = { startTime: start, endTime: end };
      validWindows = subtractFromWindows(validWindows, block);
    }
    else if(ex.type === "add" && ex.startTime && ex.endTime){
      const start = parseTimeOnDate(cursor,ex.startTime,ex.timeZone);
      const end = parseTimeOnDate(cursor, ex.startTime, ex.timeZone);
      validWindows.push({ startTime: start, endTime: end });
    }
  }
  return  mergeWindows(validWindows);
}

export function subtractFromWindows(windows: TimeWindow[], exceptions: TimeWindow) {
  let vw = [];
  for (let window of windows) {
    const interval       = Interval.fromDateTimes(window.startTime, window.endTime);
    const blockInterval = Interval.fromDateTimes(exceptions.startTime, exceptions.endTime);
    if (!interval.overlaps(blockInterval)) {
      vw.push(window);
      continue;
    }
      if (window.startTime < exceptions.startTime) {
        vw.push({ startTime: window.startTime, endTime: exceptions.startTime });
      }
      if (window.endTime > exceptions.endTime) {
        vw.push({ startTime: exceptions.endTime, endTime: window.endTime });
      }
  }
  return vw.filter(w=>w.startTime <  w.endTime);
}

export function splitIntoSlots(windows: TimeWindow[], duration: number, bufferBefore: number, bufferAfter: number) {
  let slots = [];
  for (let w of windows) {
    //iterate from startTime to endTime  with duration of minutes and apply bufferBefore and bufferAfter
    let cursor = w.startTime;
    const totalDuration = duration + bufferBefore + bufferAfter;
    while (cursor.plus({ minutes: totalDuration }) <= w.endTime) {
      const slotStart = cursor.plus({ minutes: bufferBefore });
      const slotEnd = slotStart.plus({ minutes: duration });
      slots.push({ start : slotStart, end : slotEnd });
      cursor = cursor.plus({ minutes: duration });
    }
  }
  return slots;
}
interface Slot{
  start: DateTime,
  end:DateTime
}

export function overlapsBooked(slot: Slot, bookedSlots: TimeWindow[], bufferBefore: number, bufferAfter: number) {
    let paddedStart = slot.start.minus({minutes:bufferBefore})
    let paddedEnd = slot.end.plus({ minutes: bufferAfter });
  return bookedSlots.some((slot) => {
    let interval = Interval.fromDateTimes(paddedStart, paddedEnd);
    let bookedInterval = Interval.fromDateTimes(slot.startTime, slot.endTime);
    return interval.overlaps(bookedInterval);
  });
}
