const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const SibApiV3Sdk = require('sib-api-v3-sdk'); // Import SendinBlue SDK

const app = express();
const port = 4000; // Change this to your desired port

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


// Set your SendinBlue API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

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
