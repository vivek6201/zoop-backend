import { Resend } from "resend";

class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_KEY);
  }

  async sendEmail(email: string, subject: string, content: string) {
    const { data, error } = await this.resend.emails.send({
      from: "Zoop <onboarding@codershub.live>",
      to: [email],
      subject,
      html: content,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  }
}

export default EmailService;
