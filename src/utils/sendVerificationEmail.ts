import { readFile } from "fs/promises";
import path from "path";
import EmailService from "../services/EmailService";

const emailClient = new EmailService();

async function generateEmailHtml(otp: string): Promise<string> {
  const templatePath = path.join(__dirname, "../email-templates/verificationEmail.html");
  let templateContent = await readFile(templatePath, "utf-8");
  templateContent = templateContent.replace("{{OTP}}", otp);
  return templateContent;
}

const sendVerificationEmail = async (otp: string, email: string) => {
  const htmlContent = await generateEmailHtml(otp);
  emailClient.sendEmail(email, "Verification Email", htmlContent);
};

export default sendVerificationEmail;
