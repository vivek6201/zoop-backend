import OtpGenerator from "otp-generator";
import prisma from "../lib/db";

export const generateOtp = () => {
  return OtpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};

const isOtpExpired = (otpRecord: { expiresAt: Date }): boolean => {
  const currentTime = new Date();
  return currentTime > otpRecord.expiresAt;
};

export const verifyOtp = async (otp: string, email: string) => {
  const otpRecord = await prisma.otp.findFirst({
    where: { otp: otp, userEmail: email },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    return false;
  }

  if (isOtpExpired(otpRecord)) {
    return false;
  }

  return true;
};
