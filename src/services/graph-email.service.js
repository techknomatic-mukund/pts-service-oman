const path = require("path");
const fs = require("fs/promises");
const config = require("../config/config");

const getRequiredGraphConfig = () => {
  const required = {
    MS_GRAPH_TENANT_ID: config.msGraphTenantId,
    MS_GRAPH_CLIENT_ID: config.msGraphClientId,
    MS_GRAPH_CLIENT_SECRET: config.msGraphClientSecret,
    MS_GRAPH_SENDER: config.msGraphSender,
    MS_GRAPH_RECEIVER: config.msGraphReceiver,
    MS_GRAPH_ATTACHMENT_PDF_PATH: config.msGraphAttachmentPdfPath,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing Microsoft Graph configuration: ${missing.join(", ")}`
    );
  }

  return required;
};

const getGraphAccessToken = async () => {
  const graphConfig = getRequiredGraphConfig();
  const tokenUrl = `https://login.microsoftonline.com/${graphConfig.MS_GRAPH_TENANT_ID}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: graphConfig.MS_GRAPH_CLIENT_ID,
    client_secret: graphConfig.MS_GRAPH_CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to get Graph token: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return data.access_token;
};

const sendGraphMail = async ({ accessToken, toAddress, subject, body, attachments = [] }) => {
  const graphConfig = getRequiredGraphConfig();
  const sendMailUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
    graphConfig.MS_GRAPH_SENDER
  )}/sendMail`;

  const mailPayload = {
    message: {
      subject,
      body: {
        contentType: "Text",
        content: body,
      },
      toRecipients: [
        {
          emailAddress: {
            address: toAddress,
          },
        },
      ],
      attachments,
    },
    saveToSentItems: true,
  };

  const response = await fetch(sendMailUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mailPayload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to send Graph email: ${response.status} ${errorBody}`);
  }
};

const getPdfAttachment = async () => {
  const graphConfig = getRequiredGraphConfig();
  const pdfPathOrUrl = graphConfig.MS_GRAPH_ATTACHMENT_PDF_PATH.trim();
  let fileBuffer;
  let fileName = "attachment.pdf";

  if (/^https?:\/\//i.test(pdfPathOrUrl)) {
    const response = await fetch(pdfPathOrUrl);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to download PDF attachment: ${response.status} ${errorBody}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    fileBuffer = Buffer.from(arrayBuffer);
  } else {
    fileBuffer = await fs.readFile(pdfPathOrUrl);
    fileName = path.basename(pdfPathOrUrl);
  }

  return {
    "@odata.type": "#microsoft.graph.fileAttachment",
    name: fileName,
    contentType: "application/pdf",
    contentBytes: fileBuffer.toString("base64"),
  };
};

const sendScheduleConsultationMail = async (payload) => {
  const graphConfig = getRequiredGraphConfig();
  const accessToken = await getGraphAccessToken();

  const emailBody = [
    "New Schedule Consultation request received:",
    "",
    `Name: ${payload.name || ""}`,
    `Company: ${payload.company || ""}`,
    `Email: ${payload.email || ""}`,
    `Message: ${payload.message || ""}`,
  ].join("\n");

  await sendGraphMail({
    accessToken,
    toAddress: graphConfig.MS_GRAPH_RECEIVER,
    subject: "New Schedule Consultation Request",
    body: emailBody,
  });

  if (!payload.email) {
    throw new Error("Missing payload.email for customer acknowledgement mail");
  }

  const pdfAttachment = await getPdfAttachment();
  const customerBody = [
    `Hi ${payload.name || "there"},`,
    "",
    "Thank you for scheduling a consultation with us.",
    "Please find the attached PDF document.",
    "",
    "Best regards,",
    "PTS Team",
  ].join("\n");

  await sendGraphMail({
    accessToken,
    toAddress: payload.email,
    subject: "Your Schedule Consultation Request",
    body: customerBody,
    attachments: [pdfAttachment],
  });

  return {
    success: true,
    sentTo: {
      receiver: graphConfig.MS_GRAPH_RECEIVER,
      customer: payload.email,
    },
  };
};

module.exports = {
  sendScheduleConsultationMail,
};
