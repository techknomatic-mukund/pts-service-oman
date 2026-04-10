const config = {
  port: process.env.PORT || 9000,
  msGraphTenantId: process.env.MS_GRAPH_TENANT_ID,
  msGraphClientId: process.env.MS_GRAPH_CLIENT_ID,
  msGraphClientSecret: process.env.MS_GRAPH_CLIENT_SECRET,
  msGraphClientSecretId: process.env.MS_GRAPH_CLIENT_SECRET_ID,
  msGraphSender: process.env.MS_GRAPH_SENDER,
  msGraphReceiver: process.env.MS_GRAPH_RECEIVER || process.env.MS_GRAPH_SENDER,
  msGraphAttachmentPdfPath: process.env.MS_GRAPH_ATTACHMENT_PDF_PATH,
};

module.exports = config;
