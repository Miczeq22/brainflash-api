import { Mailer, SendMailPayload } from './mailer.types';
import { Transporter, createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

export class MailerService implements Mailer {
  private transporter: Transporter;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    this.transporter = createTransport({
      host: process.env.MAILHOG_HOST,
      port: Number(process.env.SMTP_PORT),
    });

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: 'hbs',
          layoutsDir: './src/infrastructure/mailer/templates',
          defaultLayout: 'template',
          partialsDir: './src/infrastructure/mailer/templates/',
        },
        viewPath: './src/infrastructure/mailer/templates',
        extName: '.hbs',
      }),
    );
  }

  public async sendMail({ from, to, payload, subject, template }: SendMailPayload) {
    await this.transporter.sendMail({
      template,
      to,
      subject,
      from: from ?? process.env.SERVICE_MAIL,
      context: payload,
    });
  }
}
