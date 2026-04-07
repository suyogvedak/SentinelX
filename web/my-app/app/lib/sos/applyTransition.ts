import { SOSStatus, canTransition } from "./status";

export function applyStatusTransition(
  sos: any,
  nextStatus: SOSStatus,
  adminId: string
) {
  if (!canTransition(sos.status, nextStatus)) {
    throw new Error(
      `Invalid transition ${sos.status} → ${nextStatus}`
    );
  }

  const now = new Date();

  const timestamps: any = { ...sos.timestamps };

  if (nextStatus === "ACKNOWLEDGED")
    timestamps.acknowledgedAt = now;
  if (nextStatus === "RESPONDING")
    timestamps.respondingAt = now;
  if (nextStatus === "RESOLVED")
    timestamps.resolvedAt = now;
  if (nextStatus === "CLOSED")
    timestamps.closedAt = now;

  return {
    ...sos,
    status: nextStatus,
    timestamps,
    handledByAdminId: adminId,
  };
}
