import { IMailProvider } from "../IMailProvider";
import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'

class EtherealMailProvider implements IMailProvider {
  private client: Transporter
  constructor() {
    this.createClient();
  }

  private async createClient() {
    try {
      const account = await nodemailer.createTestAccount();

      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    } catch (err) {
      console.error(`EtherealMailProvider - Error:\n${err}`);
    }
  }

  async sendMail(
    to: string, 
    subject: string, 
    variables: any, 
    path: string
    ) { 
    if(!this.client) {
      await this.createClient()
    }
    const templateFileContent = fs.readFileSync(path).toString("utf-8")

    const templateParse = handlebars.compile(templateFileContent)

    const templateHTML = templateParse(variables)

    const message = await this.client.sendMail({
      to,
      from: 'Rentx <noreply@rentx.com.br>',
      subject,
      html: templateHTML
    })

    console.log("message sent: %s", message.messageId)
    console.log('preview URL %s', nodemailer.getTestMessageUrl(message))
  }
}

export { EtherealMailProvider }