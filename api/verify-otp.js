import * as OTPAuth from 'otpauth';

const ADMIN_SECRET = 'JBSWY3DPEHPK3PXP'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { token } = req.body;

  let totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(ADMIN_SECRET)
  });

  // Verify the code (window: 1 allows for slight time desync)
  let delta = totp.validate({ token: token, window: 1 });

  if (delta !== null) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid Code" });
  }
}
