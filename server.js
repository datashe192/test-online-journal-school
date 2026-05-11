const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio("AC3e15ffe1c9b43dfff17ffc15c57104b5", "40afb049558d778cfa409201e9d6de0c");
const serviceSid = "VA7eb5ca2ca94f3f1c29d6acb748cf51a0";

// 1. Send SMS Code
app.post('/start-verify', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const verification = await client.verify.v2.services(serviceSid)
            .verifications.create({ to: phoneNumber, channel: 'sms' });
        res.json({ success: true, sid: verification.sid });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. Check SMS Code
app.post('/check-verify', async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        const check = await client.verify.v2.services(serviceSid)
            .verificationChecks.create({ to: phoneNumber, code: code });
        
        if (check.status === 'approved') {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Incorrect code." });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log('Auth server running on port 3000'));
