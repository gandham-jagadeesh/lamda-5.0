import { DateTime } from "luxon";
import { getRules } from "../services/availability.service.js"
import { getExceptionToandFrom} from "../services/availability.service.js"
import { getAllActiveEvents  } from "../services/eventType.service.js"
import { FindBookedSlotsByHostInRange } from "../repository/slot.repository.js"
import { findById } from "../services/user.service.js"
import { SLOT_GENERATION_DAYS } from "../config/env.js"

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
      let validRuleWidows: window[] = [];
      for (let rule of rules) {
        validRuleWidows.push()
      }
    }
  }
}
