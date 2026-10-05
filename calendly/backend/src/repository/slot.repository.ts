import {prisma} from "../config/database.js";



// create slot
export async function create(slot:createSlotDTO){
 const createdSlot = await prisma.slot.create({ data: slot});
 return createdslot;
}

//update slot
export async function update(slot:updateSlotDTO){
 const updatedSlot = await prisma.slot.update({data:slot});
 return updatedSlot;
}

//get slot by id
export async function getById(id:number){
 const slot = await prisma.slot.find({
	 where:{
		 id:id
	 }
 });
 return slot;
}


//get slot by unique index key
