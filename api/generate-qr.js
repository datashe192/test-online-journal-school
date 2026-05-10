import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

// This is the master secret for the Admin account. 
// In a real app, this is generated dynamically and saved to a database per user.
const ADMIN_SECRET = 'JBSWY3DPEHPK3PXP'; 

export default async function handler(req, res) {
  // 1. Configure the Authenticator payload
  let totp = new OTPAuth.TOTP({
    issuer: "OnlineEdu Admin",
    label: "Admin",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(ADMIN_SECRET)
  });

  // 2. Generate the QR Code image (Base64 data URL)
  try {
    const qrDataUrl = await QRCode.toDataURL(totp.toString());
    res.status(200).json({ qr: qrDataUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate QR" });
  }
}
