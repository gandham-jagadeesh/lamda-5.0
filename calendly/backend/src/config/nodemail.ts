import nodemailer from "nodemailer";
import { type Transporter } from "nodemailer";

import { SMTP_PORT, SMTP_HOST, EMAIL_FROM } from "./env.js";

let transporter: Transporter | null = null;

export function getTransporter() {
  if (transporter) {
    return transporter
  };

 let   transporterObject  = nodemailer.createTransport({

    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false

  });

  transporter = transporterObject;

  return transporter;
}


export async function sendEmail(to: string, subject: string, html: string) {
  const exporter = getTransporter();

  await exporter.sendMail({
    from: EMAIL_FROM,
    to: to,
    subject: subject,
    html: html
  });
  console.log(`[nodemailer] Email sent to ${to} with subject ${subject}`);

}
