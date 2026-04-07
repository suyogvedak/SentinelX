export type SOSStatus =
  | "RECEIVED"
  | "ACKNOWLEDGED"
  | "RESPONDING"
  | "RESOLVED"
  | "CLOSED";

export const VALID_TRANSITIONS: Record<SOSStatus, SOSStatus[]> = {
  RECEIVED: ["ACKNOWLEDGED"],
  ACKNOWLEDGED: ["RESPONDING"],
  RESPONDING: ["RESOLVED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
};

export function canTransition(
  from: SOSStatus,
  to: SOSStatus
) {
  return VALID_TRANSITIONS[from]?.includes(to);
}
