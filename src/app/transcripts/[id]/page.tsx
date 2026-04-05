"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import CloseIcon from "@mui/icons-material/Close";

// ─── Data ────────────────────────────────────────────────────────────────────

const keyInsights = [
  "Prescription for Lisinopril was not received by CVS pharmacy",
  "Patient contacted doctor twice, issue remains unresolved",
  "Patient has missed all doses for ~1 week",
  "Reports dizziness in the past 2 days",
  "No confirmation or notification from pharmacy",
];

const insightToMessage: Record<number, number> = { 0: 3, 1: 7, 2: 9, 3: 11, 4: 14 };

const suggestedActions = [
  "Call CVS pharmacy to confirm receipt or request resend",
  "Contact doctor's office to verify prescription was sent",
  "Monitor reported dizziness and escalate if symptoms worsen",
  "Ensure prescription is fulfilled today",
  "Follow up with patient after resolution",
];

const taskToMessage: Record<number, number> = { 0: 3, 1: 7, 2: 11, 3: 15, 4: 20 };

const messageToTasks: Record<number, number[]> = {};
Object.entries(taskToMessage).forEach(([taskIdx, msgIdx]) => {
  if (!messageToTasks[msgIdx]) messageToTasks[msgIdx] = [];
  messageToTasks[msgIdx].push(Number(taskIdx));
});

interface Message {
  speaker: "advocate" | "patient";
  name: string;
  timestamp: string;
  text: string;
}

const transcript: Message[] = [
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:02", text: "Hi John, this is Sarah calling from Solace. I'm following up on your recent prescription issue. Do you have a few minutes to talk?" },
  { speaker: "patient", name: "John (Patient)", timestamp: "00:15", text: "Yeah, I do. Thanks for calling. I've actually been pretty frustrated with this whole situation." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:28", text: "I'm sorry to hear that. Can you tell me what's been going on?" },
  { speaker: "patient", name: "John (Patient)", timestamp: "01:15", text: "So my doctor prescribed me Lisinopril about a week ago, and I went to the pharmacy to pick it up, but they said they never received anything." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:38", text: "Got it. And which pharmacy was that?" },
  { speaker: "patient", name: "John (Patient)", timestamp: "01:55", text: "CVS on Main Street." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "02:28", text: "Okay. Did you reach out to your doctor's office after that?" },
  { speaker: "patient", name: "John (Patient)", timestamp: "02:51", text: "I called them twice. The first time they said they would resend it. The second time they said it should already be there, but the pharmacy still doesn't have it." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "03:32", text: "That sounds really frustrating. Have you been able to take any doses since then?" },
  { speaker: "patient", name: "John (Patient)", timestamp: "04:02", text: "No, I haven't started at all. That's what worries me." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "04:38", text: "Understandable. This medication is important for managing your blood pressure. Have you noticed any symptoms or changes?" },
  { speaker: "patient", name: "John (Patient)", timestamp: "05:05", text: "I've been feeling a bit dizzy the past couple of days, but I'm not sure if it's related." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "05:58", text: "Thanks for sharing that. We definitely want to make sure you get your medication as soon as possible." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "06:01", text: "Just to confirm, you haven't received any notification from the pharmacy that it's ready?" },
  { speaker: "patient", name: "John (Patient)", timestamp: "07:47", text: "No, nothing." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "08:08", text: "Alright. Here's what I'm going to do. I'll contact both your doctor's office and the pharmacy to figure out where the breakdown is. If needed, I'll request that they send the prescription again or transfer it." },
  { speaker: "patient", name: "John (Patient)", timestamp: "10:47", text: "That would be great. I just don't want to keep chasing them." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "12:14", text: "Totally understand. I'll take that off your plate." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "13:28", text: "Also, given that you're feeling dizzy, I recommend keeping an eye on your symptoms. If it gets worse, you should seek care immediately." },
  { speaker: "patient", name: "John (Patient)", timestamp: "15:55", text: "Okay, I will." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "16:28", text: "I'll follow up with you once I have an update. Is this the best number to reach you?" },
  { speaker: "patient", name: "John (Patient)", timestamp: "17:45", text: "Yes, it is." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "18:02", text: "Great. We'll get this resolved as quickly as possible." },
  { speaker: "patient", name: "John (Patient)", timestamp: "19:35", text: "Thank you, I appreciate it." },
  { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "22:08", text: "Of course. Talk soon." },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TaskBadge({ number }: { number: number }) {
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
      style={{ backgroundColor: "white", border: "1.5px solid #285e50", color: "#285e50" }}
    >
      {number}
    </div>
  );
}

type TaskState = "pending" | "inprogress" | "completed";

function TaskStatusPill({ state }: { state: TaskState }) {
  if (state === "inprogress") {
    return (
      <span
        className="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
        style={{ backgroundColor: "#FFF9EE", color: "#7A5A20" }}
      >
        In Progress
      </span>
    );
  }
  if (state === "completed") {
    return (
      <span
        className="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
        style={{ backgroundColor: "#d4e2dd", color: "#285e50" }}
      >
        Completed
      </span>
    );
  }
  return null;
}

function SuggestedAction({
  text,
  taskNumber,
  taskState,
  isSelected,
  isHighlightedFromTranscript,
  onDismiss,
  onApprove,
  onComplete,
  onViewTask,
}: {
  text: string;
  taskNumber: number;
  taskState: TaskState;
  isSelected: boolean;
  isHighlightedFromTranscript: boolean;
  onDismiss: () => void;
  onApprove: () => void;
  onComplete: () => void;
  onViewTask: () => void;
}) {
  const highlight = isHighlightedFromTranscript || isSelected;

  return (
    <div
      className="py-4 border-b border-[#f0f0f0] last:border-0 transition-colors -mx-5 px-5"
      style={{ backgroundColor: highlight ? "#e9f0ee" : "transparent" }}
    >
      {/* Task text row */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <TaskBadge number={taskNumber} />
        </div>
        <p
          className="text-[13px] font-medium leading-[1.4]"
          style={{
            color: taskState === "completed" ? "#aaa" : "#232323",
            textDecoration: taskState === "completed" ? "line-through" : "none",
          }}
        >
          {text}
        </p>
      </div>

      {/* Action row */}
      {taskState === "pending" && (
        <div className="flex items-center gap-2 mt-3 pl-8">
          <button
            onClick={onApprove}
            className="px-3 py-1 rounded-md text-[12px] font-bold transition-colors cursor-pointer"
            style={{ backgroundColor: "#285e50", color: "white" }}
          >
            Approve
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-1 rounded-md text-[12px] font-bold border transition-colors cursor-pointer"
            style={{ borderColor: "#C84060", color: "#C84060", backgroundColor: "transparent" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {taskState === "inprogress" && (
        <div className="flex items-center justify-between mt-3 pl-8">
          <TaskStatusPill state="inprogress" />
          <button
            onClick={onViewTask}
            className="flex items-center gap-1 px-3 py-1 rounded-md text-[12px] font-bold border transition-colors cursor-pointer"
            style={{ borderColor: "#285e50", color: "#285e50", backgroundColor: "transparent" }}
          >
            View task
            <ChevronRightIcon sx={{ fontSize: 14 }} />
          </button>
        </div>
      )}

      {taskState === "completed" && (
        <div className="mt-3 pl-8">
          <TaskStatusPill state="completed" />
        </div>
      )}

    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TranscriptDetailPage() {
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);
  const [hoveredInsight, setHoveredInsight] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [hoveredTaskIdx, setHoveredTaskIdx] = useState<number | null>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const taskRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Task state — mutually exclusive sets
  const [approved, setApproved] = useState<Set<number>>(new Set());   // in progress
  const [completed, setCompleted] = useState<Set<number>>(new Set()); // done
  const [dismissed, setDismissed] = useState<Set<number>>(new Set()); // hidden

  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(false);

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  const totalTasks = suggestedActions.length;
  const pendingCount = totalTasks - approved.size - completed.size - dismissed.size;
  const allActioned = pendingCount === 0;

  const status =
    approved.size > 0 ? "in-progress"
    : allActioned && totalTasks > 0 ? "reviewed"
    : "unreviewed";

  const statusConfig = {
    unreviewed: { label: "Unreviewed", bg: "#ededed", color: "#525252" },
    "in-progress": { label: "In Progress", bg: "#F5E5C0", color: "#7A5A20" },
    reviewed: { label: "Reviewed", bg: "#d4e2dd", color: "#285e50" },
  };

  function getTaskState(i: number): TaskState {
    if (completed.has(i)) return "completed";
    if (approved.has(i)) return "inprogress";
    return "pending";
  }

  function handleInsightClick(i: number) {
    const next = selectedInsight === i ? null : i;
    setSelectedInsight(next);
    if (next !== null && insightToMessage[next] !== undefined) {
      messageRefs.current[insightToMessage[next]]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleTranscriptRowHover(taskBadges: number[]) {
    if (taskBadges.length > 0) {
      setHoveredTaskIdx(taskBadges[0]);
      taskRefs.current[taskBadges[0]]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  const hasVisibleTasks = totalTasks - dismissed.size > 0;

  const filteredTranscript = searchQuery
    ? transcript.filter(
        (m) =>
          m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transcript;

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col">
      <TopNav />

      {/* Breadcrumb */}
      <div className="px-10 pt-5 pb-0 shrink-0">
        <nav className="flex items-center gap-2 text-[14px]">
          <Link href="/transcripts" className="text-[#747474] hover:text-[#285e50] transition-colors">
            Transcripts
          </Link>
          <ChevronRightIcon sx={{ fontSize: 16, color: "#747474" }} />
          <span className="text-[#285e50] font-semibold">Transcript Details</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex gap-8 px-10 pt-8 pb-6 flex-1 overflow-hidden min-h-0">
        {/* ── Left column ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-8 overflow-hidden">

          {/* Summary card */}
          <div className="border border-[#e5e5e5] rounded-xl overflow-hidden shrink-0">
            {/* Facts row */}
            <div className="flex items-center gap-5 px-6 py-3 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-1.5 text-[13px] text-[#747474]">
                <CalendarTodayOutlinedIcon sx={{ fontSize: 15, color: "#aaa" }} />
                <span>Thu, Apr 2 · 11:00–11:30am</span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#747474]">
                <LocalPhoneOutlinedIcon sx={{ fontSize: 15, color: "#aaa" }} />
                <span>Phone call</span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#747474]">
                <PersonOutlinedIcon sx={{ fontSize: 15, color: "#aaa" }} />
                <span>John Martinez</span>
              </div>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-bold whitespace-nowrap"
                style={{ backgroundColor: statusConfig[status].bg, color: statusConfig[status].color }}
              >
                {statusConfig[status].label}
              </span>
              <button
                onClick={() => setSummaryOpen((v) => !v)}
                className="ml-auto flex items-center gap-1 text-[12px] text-[#747474] hover:text-[#285e50] transition-colors cursor-pointer"
              >
                {summaryOpen ? "Hide summary" : "Show summary"}
                <span className={`transition-transform ${summaryOpen ? "" : "-rotate-180"}`}>
                  <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                </span>
              </button>
            </div>

            {/* AI zone */}
            {summaryOpen && (
              <div className="px-6 pt-5 pb-5" style={{ backgroundColor: "#f4f8f7" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <AutoAwesomeOutlinedIcon sx={{ fontSize: 13, color: "#285e50" }} />
                    <span className="text-[11px] font-bold text-[#285e50] uppercase tracking-widest">AI Summary</span>
                  </div>
                  <span className="text-[12px] text-[#747474]">AI-generated · Review the tasks on the right.</span>
                </div>
                <h1
                  className="text-[28px] text-[#232323] leading-[1.2] mb-3"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                >
                  Prescription delay causing missed doses for blood pressure.
                </h1>
                <p className="text-[15px] text-[#555] leading-[1.7] mb-4">
                  John Martinez has not received his prescribed Lisinopril due to a breakdown between his doctor's office and pharmacy. As a result, he has missed all doses for the past week and is experiencing mild dizziness.
                </p>
                {/* Key Insights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {keyInsights.map((insight, i) => (
                    <button
                      key={i}
                      onClick={() => handleInsightClick(i)}
                      onMouseEnter={() => setHoveredInsight(i)}
                      onMouseLeave={() => setHoveredInsight(null)}
                      title="Highlight in transcript"
                      className="px-3 py-1.5 rounded-lg text-[13px] text-[#232323] leading-[1.5] text-left cursor-pointer transition-all"
                      style={{
                        backgroundColor: selectedInsight === i ? "#c9dfd9" : hoveredInsight === i ? "#e9f0ee" : "white",
                        border: `1px solid ${selectedInsight === i || hoveredInsight === i ? "#285e50" : "#d9d9d9"}`,
                        boxShadow: hoveredInsight === i && selectedInsight !== i ? "0 1px 4px rgba(40,94,80,0.15)" : "none",
                      }}
                    >
                      {insight}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Call Transcript card */}
          <div className="border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5] shrink-0">
              <div className="flex items-center gap-2">
                <ArticleOutlinedIcon sx={{ fontSize: 18, color: "#285e50" }} />
                <span className="text-[16px] font-bold text-[#232323]">Call Transcript</span>
              </div>
              <div className="flex items-center gap-2 border border-[#d9d9d9] rounded-lg px-3 py-2 bg-white w-[200px] focus-within:border-[#285e50] transition-colors">
                <input
                  type="text"
                  placeholder="Search transcript"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-[13px] text-[#232323] placeholder-[#aaa] outline-none bg-transparent"
                />
                <SearchOutlinedIcon sx={{ fontSize: 18, color: "#747474" }} />
              </div>
            </div>

            {/* Messages */}
            <div className="px-6 py-4 flex flex-col gap-5 flex-1 overflow-y-auto min-h-0">
              {filteredTranscript.map((msg, i) => {
                const isInsightHighlighted = selectedInsight !== null && insightToMessage[selectedInsight] === i;
                const isTaskHighlighted = selectedTask !== null && taskToMessage[selectedTask] === i;
                const taskBadges = messageToTasks[i] ?? [];

                // Unified green for both insight and task highlights
                const bgColor =
                  isInsightHighlighted || isTaskHighlighted ? "#e9f0ee"
                  : taskBadges.length > 0 && hoveredTaskIdx === taskBadges[0] ? "#f4f8f7"
                  : "transparent";

                return (
                  <div
                    key={i}
                    ref={(el) => { messageRefs.current[i] = el; }}
                    className="flex gap-3 rounded-lg px-3 py-2 -mx-3 transition-colors"
                    style={{ backgroundColor: bgColor }}
                    onMouseEnter={() => handleTranscriptRowHover(taskBadges)}
                    onMouseLeave={() => setHoveredTaskIdx(null)}
                  >
                    <div className="w-5 shrink-0 flex flex-col gap-1 pt-1">
                      {taskBadges.map((taskIdx) => (
                        <TaskBadge key={taskIdx} number={taskIdx + 1} />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span
                          className="text-[14px] font-bold"
                          style={{ color: msg.speaker === "advocate" ? "#285e50" : "#525252" }}
                        >
                          {msg.name}
                        </span>
                        <span className="text-[12px] text-[#aaa]">{msg.timestamp}</span>
                      </div>
                      <p className="text-[14px] text-[#232323] leading-[1.6]">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              {filteredTranscript.length === 0 && (
                <p className="text-[14px] text-[#747474] py-4">No results for "{searchQuery}"</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column — Tasks only ── */}
        <div className="w-[320px] shrink-0 self-start border border-[#e5e5e5] rounded-xl overflow-hidden">

          {/* Tasks header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
            <div className="flex items-center gap-2">
              <ChecklistOutlinedIcon sx={{ fontSize: 18, color: "#285e50" }} />
              <span className="text-[16px] font-bold text-[#232323]">Tasks</span>
              {pendingCount > 0 && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ backgroundColor: "#f4f8f7", color: "#285e50" }}
                >
                  <AutoAwesomeOutlinedIcon sx={{ fontSize: 10 }} />
                  AI suggested
                </span>
              )}
            </div>
            <span className="text-[12px] text-[#747474]">
              {approved.size + completed.size + dismissed.size}/{totalTasks}
            </span>
          </div>

          {/* Task list */}
          <div className="px-5">
            {hasVisibleTasks ? (
              suggestedActions.map((action, i) => {
                if (dismissed.has(i)) return null;
                const state = getTaskState(i);
                return (
                  <div
                    key={i}
                    ref={(el) => { taskRefs.current[i] = el; }}
                    onMouseEnter={() => {
                      setSelectedTask(i);
                      if (taskToMessage[i] !== undefined) {
                        messageRefs.current[taskToMessage[i]]?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    onMouseLeave={() => setSelectedTask(null)}
                  >
                    <SuggestedAction
                      text={action}
                      taskNumber={i + 1}
                      taskState={state}
                      isSelected={selectedTask === i}
                      isHighlightedFromTranscript={hoveredTaskIdx === i}
                      onApprove={() => setApproved((prev) => new Set([...prev, i]))}
                      onDismiss={() => setDismissed((prev) => new Set([...prev, i]))}
                      onComplete={() => {
                        setCompleted((prev) => new Set([...prev, i]));
                        setApproved((prev) => { const s = new Set(prev); s.delete(i); return s; });
                      }}
                      onViewTask={showToast}
                    />
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                <ChecklistOutlinedIcon sx={{ fontSize: 28, color: "#ccc" }} />
                <p className="text-[13px] font-bold text-[#232323]">All tasks dismissed</p>
                <p className="text-[12px] text-[#747474] leading-[1.5]">Add a task manually if needed.</p>
              </div>
            )}
            {/* Add task */}
            <button
              className="w-full mt-4 mb-5 py-2.5 rounded-lg text-[13px] font-semibold text-[#285e50] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              style={{ border: "1.5px dashed #b6d4cc" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f4f8f7"; (e.currentTarget as HTMLElement).style.borderColor = "#285e50"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "#b6d4cc"; }}
            >
              + Add a task manually
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        className="fixed bottom-6 left-1/2 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium shadow-lg transition-all duration-300"
        style={{
          backgroundColor: "#232323",
          color: "white",
          opacity: toast ? 1 : 0,
          pointerEvents: toast ? "auto" : "none",
          transform: `translateX(-50%) translateY(${toast ? "0px" : "8px"})`,
        }}
      >
        Tasks flow is not available in this prototype.
      </div>
    </div>
  );
}
