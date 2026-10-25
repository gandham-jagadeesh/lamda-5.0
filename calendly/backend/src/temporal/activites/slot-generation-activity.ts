import { regenerateHostSlots as slotGen, regenerateHostSlotsInput } from "../../services/slot-generation.service.js";


export async function slotGenActivity(input:regenerateHostSlotsInput) {
  await slotGen(input);
}
