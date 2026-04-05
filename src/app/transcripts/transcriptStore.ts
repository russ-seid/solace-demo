// In-memory store — persists across client navigation, clears on page refresh

export interface SavedTranscriptState {
  approved: number[];
  completed: number[];
  dismissed: number[];
}

const store: Record<string, SavedTranscriptState> = {};

export function getSavedState(id: string): SavedTranscriptState | null {
  return store[id] ?? null;
}

export function saveState(id: string, state: SavedTranscriptState) {
  store[id] = { ...state };
}

export function computeStatus(
  totalTasks: number,
  approved: number[],
  completed: number[],
  dismissed: number[]
): "unreviewed" | "in-progress" | "reviewed" {
  if (approved.length > 0) return "in-progress";
  const allActioned = totalTasks - approved.length - completed.length - dismissed.length === 0;
  if (totalTasks === 0 || allActioned) return "reviewed";
  return "unreviewed";
}
