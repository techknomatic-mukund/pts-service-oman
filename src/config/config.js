const fifteenMinutesMs = 15 * 60 * 1000;

const config = {
  port: process.env.PORT || 9000,
  trustProxy:
    process.env.TRUST_PROXY === "true" || process.env.TRUST_PROXY === "1",
  scheduleConsultationRateLimitWindowMs: Number(
    process.env.SCHEDULE_CONSULTATION_RATE_WINDOW_MS
  ),
  scheduleConsultationRateLimitMax: Number(
    process.env.SCHEDULE_CONSULTATION_RATE_MAX
  ),
  msGraphTenantId: process.env.MS_GRAPH_TENANT_ID,
  msGraphClientId: process.env.MS_GRAPH_CLIENT_ID,
  msGraphClientSecret: process.env.MS_GRAPH_CLIENT_SECRET,
  msGraphClientSecretId: process.env.MS_GRAPH_CLIENT_SECRET_ID,
  msGraphSender: process.env.MS_GRAPH_SENDER,
  msGraphReceiver: process.env.MS_GRAPH_RECEIVER || process.env.MS_GRAPH_SENDER,
  msGraphAttachmentPdfPath: process.env.MS_GRAPH_ATTACHMENT_PDF_PATH,
};

config.scheduleConsultationRateLimitWindowMs = Number.isFinite(
  config.scheduleConsultationRateLimitWindowMs
)
  ? config.scheduleConsultationRateLimitWindowMs
  : fifteenMinutesMs;

config.scheduleConsultationRateLimitMax = Number.isFinite(
  config.scheduleConsultationRateLimitMax
)
  ? config.scheduleConsultationRateLimitMax
  : 5;

module.exports = config;
