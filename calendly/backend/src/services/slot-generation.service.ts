import { DateTime } from "luxon";
import { getRules } from "../services/availability.service.js"
import { getExceptionToandFrom} from "../services/availability.service.js"
import { getAllEvents } from "../services/eventType.service.js"
import {} from "../"
interface window{
  startTime: DateTime
  endTime: DateTime
}

interface genSlot {
  hostId: number,
  to: string | null,
  from: string | null
}
export function regenerateHostSlots(slotInfo: genSlot) {

  if (slotInfo.from !== undefined && slotInfo.to !== undefined) {
    const [rules, bookedSlots, exceptions, eventTypes] = new Promise.all([getRules(slotInfo.hostId),getExceptionToandFrom(slotInfo.hostId,slotInfo.to,slotInfo.from),getAllEvents(slotInfo.hostId)]);
  }
}
