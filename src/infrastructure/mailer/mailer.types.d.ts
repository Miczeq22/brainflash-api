export interface SendMailPayload {
  from?: string;
  to: string;
  subject: string;
  payload: object;
  template: string;
}

export interface Mailer {
  sendMail(payload: SendMainPayload): Promise<void>;
}
