import { proxyActivities } from "@temporalio/workflow";
import type * as activites from "../activites/index.js";

const { sendBookedEmailCofirmationActivity  } = proxyActivities<typeof activites>({
  retry: { maximumAttempts: 3 },
  startToCloseTimeout:'5 minutes'
});

export async function sendEmailBookedWorkFlow(input:number) {
  await sendBookedEmailCofirmationActivity(input);
}
