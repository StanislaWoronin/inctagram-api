import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailAdapters {
  constructor(private configService: ConfigService) {}

  async sendEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const transport = await nodemailer.createTransport({
      service: this.configService.get('SERVICE_NAME'),
      auth: {
        user: this.configService.get('EMAIL_ADDRESS'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });

    await transport.sendMail({
      from: 'MyBack-End <buckstabu030194@gmail.com>',
      to: email,
      subject: subject,
      html: message,
    });

    return;
  }
}
