// lib/sos/service.ts

import { SOSStatus, canTransition } from "./status";

export interface SOS {
  id: string;
  userId: string;
  status: SOSStatus;

  timestamps: {
    receivedAt: string;
    acknowledgedAt?: string;
    respondingAt?: string;
    resolvedAt?: string;
    closedAt?: string;
  };

  handledByAdminId?: string;
}

export function applyStatusTransition(
  sos: SOS,
  nextStatus: SOSStatus,
  adminId?: string
): SOS {
  if (!canTransition(sos.status, nextStatus)) {
    throw new Error(
      `Invalid transition: ${sos.status} → ${nextStatus}`
    );
  }

  const now = new Date().toISOString();
  const timestamps = { ...sos.timestamps };

  switch (nextStatus) {
    case "ACKNOWLEDGED":
      timestamps.acknowledgedAt = now;
      break;
    case "RESPONDING":
      timestamps.respondingAt = now;
      break;
    case "RESOLVED":
      timestamps.resolvedAt = now;
      break;
    case "CLOSED":
      timestamps.closedAt = now;
      break;
  }

  return {
    ...sos,
    status: nextStatus,
    timestamps,
    handledByAdminId: adminId ?? sos.handledByAdminId
  };
}
