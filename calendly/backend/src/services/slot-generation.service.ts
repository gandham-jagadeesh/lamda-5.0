import { DateTime } from "luxon";
import { getRules } from "../services/availability.service.js"
import { getExceptionToandFrom} from "../services/availability.service.js"
import { getAllActiveEvents  } from "../services/eventType.service.js"
import { blockSlot, FindBookedSlotsByHostInRange, findFutureSlotsByEventTypeInRange, upsertSlots } from "../repository/slot.repository.js"
import { findById } from "../services/user.service.js"
import { SLOT_GENERATION_DAYS } from "../config/env.js"
import { windowsForWeekDayRule ,applyExceptionsForDate, splitIntoSlots, overlapsBooked } from "./slot.service.js";

interface window{
  startTime: DateTime
  endTime: DateTime
}

interface regenerateHostSlotsInfo {
  hostId: number,
  to?: string,
  from?: string
}



export async function regenerateHostSlots(slotInfo: regenerateHostSlotsInfo) {

  const host = await findById(slotInfo.hostId);
//convert to and from date into luxon date format
  const from = slotInfo.from ? DateTime.fromISO(slotInfo.from, { zone: 'utc' }).startOf('day') : DateTime.now().startOf('day').toUTC();
 // need to add last date + for how many months we are generating slots put that as .env
  const to = slotInfo.to ? DateTime.fromISO(slotInfo.to, { zone: 'utc' }).endOf('day') : from.plus({ days: SLOT_GENERATION_DAYS }).toUTC();

    const [rules, bookedSlots, exceptions, eventTypes] = await Promise.all([
      getRules(slotInfo.hostId),
      FindBookedSlotsByHostInRange(slotInfo.hostId,from.toJSDate(),to.toJSDate()),
      getExceptionToandFrom(slotInfo.hostId,from.toJSDate(),to.toJSDate()),
      getAllActiveEvents(slotInfo.hostId)
    ]);

  //convert booked slots into timewindows (i.e luxon format)
  const occupiedSlots: window[] = bookedSlots.map((slot) => {
    return {
      startTime: DateTime.fromJSDate(slot.startAt, { zone: 'utc' }),
      endTime: DateTime.fromJSDate(slot.endAt, { zone: 'utc' }),
    }
  });

  // iterate over all the event types that are happening and with in that event iterate every date (30,60 days what ever user has suggested then with in that apply rules exceptions and bookedslots and filter from that and insert new slots and modify slots in db if a new change occur)
  for (let event of eventTypes) {
    const generatedValidSlotKeys = new Set<string>(); // valid slot keys
    for (let cursor = from; cursor <= to; cursor.plus({ days: 1 })) {
      const dateKey = cursor.toISODate();
      const exceptionsOnDate = exceptions.filter((ex) => DateTime.fromJSDate(ex.date, { zone: 'utc' }).toISO() === dateKey); // check whether the current date we had any exceptions or not
      const exceptionsWithTimeZone = exceptionsOnDate.map((ex) => ({
        type: ex.type,
        startTime: ex.startTime,
        endTime: ex.endTime,
        timeZone: ex.timezone
      }));

      // we got all the exceptions for that date itself we need to get all the rules for that date
      let validWindows: window[] = [];
      for (let rule of rules) {
        validWindows.push(...windowsForWeekDayRule(cursor, rule.weekday, rule.startTime, rule.endTime, rule.timezone));
      }
      //apply exceptions on those available windows
      validWindows = applyExceptionsForDate(cursor, validWindows, exceptionsWithTimeZone);
      // check whether any booked slots overlapped with valid window slots
      // //we are checking slot.start > DateTime.utc() because we are filtering slots for future if slot is past we dont care about that slot
      const slots = splitIntoSlots(validWindows, event.durationMinutes, event.bufferBeforeMinutes, event.bufferAfterMinutes).filter((slot) => slot.start > DateTime.utc() && !overlapsBooked(slot, occupiedSlots, event.bufferBeforeMinutes, event.bufferAfterMinutes));

      for (let slot of slots) {
        const startAt = slot.start.toUTC().toJSDate();
        const endAt = slot.end.toUTC().toJSDate();
        const key = `${event.id}|${startAt.toISOString()}|${endAt.toISOString()}`;
        generatedValidSlotKeys.add(key);
        await upsertSlots(host.id,event.id,startAt,endAt);
      }
    }
    const futureSlots = await findFutureSlotsByEventTypeInRange(event.id, from.toJSDate(), to.toJSDate());
    for (let fs of futureSlots) {
      const key = `${event.id}|${fs.startAt.toISOString()}|${fs.endAt.toISOString()}`;
      if (!generatedValidSlotKeys.has(key)) {
        await blockSlot(fs.id);
      }
    }
  }
}
