const Mailjet = require("node-mailjet");
const Instance = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || "",
  process.env.MAILJET_SECRET_KEY || ""
);
const EmailService = {
  sendEmail: async function (recipient, subject, textPart, html) {
    try {
      const result = await Instance.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "gulshan.gupta@omlogic.co.in",
              Name: "Gensis",
            },
            To: [
              {
                Email: recipient,
              },
            ],
            Subject:subject,
            TextPart: textPart,
            HTMLPart: html,
          },
        ],
      });
    } catch (e) {
      throw new Error(e.message);
    }
  },
};

module.exports = EmailService;
