const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(cors());
app.use(express.json());

app.post('/send-notification', async (req, res) => {
    try {
        const { token, title, body, data } = req.body;

        const message = {
            notification: {
                title: title,
                body: body
            },
            data: data,
            token: token
        };

        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
        res.status(200).json({ 
            success: true, 
            message: 'Notification sent successfully' 
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});