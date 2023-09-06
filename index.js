const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const SibApiV3Sdk = require('sib-api-v3-sdk'); // Import SendinBlue SDK

const app = express();
const port = 4000; // Change this to your desired port

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Set your SendinBlue API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;

    // Send email using SendinBlue
    const sendinBlue = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = { email: email, name: name };
    sendSmtpEmail.to = [{ email: 'adhamot233@gmail.com' }]; // Recipient's email address
    sendSmtpEmail.subject = 'New Contact Form Submission';
    sendSmtpEmail.textContent = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

    sendinBlue.sendTransacEmail(sendSmtpEmail)
        .then(response => {
            console.log(response);
            res.status(200).json({ message: 'Form submitted successfully' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error sending email' });
        });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
