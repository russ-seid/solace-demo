"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import CheckIcon from "@mui/icons-material/Check";
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

// Tasks ordered chronologically by their appearance in the transcript
const suggestedActions = [
  "Call CVS pharmacy to confirm receipt or request resend",        // 1 → msg 3
  "Contact doctor's office to verify prescription was sent",       // 2 → msg 7
  "Monitor reported dizziness and escalate if symptoms worsen",    // 3 → msg 11
  "Ensure prescription is fulfilled today",                        // 4 → msg 15
  "Follow up with patient after resolution",                       // 5 → msg 20
];

const taskToMessage: Record<number, number> = { 0: 3, 1: 7, 2: 11, 3: 15, 4: 20 };

// Reverse: message index → task indices that reference it
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

function TaskBadge({ number, active }: { number: number; active: boolean }) {
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors"
      style={{
        backgroundColor: active ? "#285e50" : "white",
        border: "1.5px solid #285e50",
        color: active ? "white" : "#285e50",
      }}
    >
      {number}
    </div>
  );
}

function SuggestedAction({
  text,
  taskNumber,
  isSelected,
  isHighlightedFromTranscript,
  isCreated,
  onSelect,
  onDismiss,
  onCreate,
}: {
  text: string;
  taskNumber: number;
  isSelected: boolean;
  isHighlightedFromTranscript: boolean;
  isCreated: boolean;
  onSelect: () => void;
  onDismiss: () => void;
  onCreate: () => void;
}) {
  return (
    <div
      className="border-b border-[#eee] last:border-0 transition-colors"
      style={{ backgroundColor: isHighlightedFromTranscript && !isSelected ? "#fafafa" : "transparent" }}
    >
      {/* Clickable reference row */}
      <div
        onClick={onSelect}
        className="flex items-start gap-3 pt-4 pb-3 cursor-pointer rounded-lg px-2 -mx-2 transition-colors"
        style={{ backgroundColor: isSelected ? "#fef3dc" : "transparent" }}
      >
        <div className="mt-0.5 shrink-0">
          <TaskBadge number={taskNumber} active={isSelected} />
        </div>
        <p className="text-[14px] font-bold text-[#09090b] leading-[1.4] flex-1">{text}</p>
        {isCreated && <ChevronRightIcon sx={{ fontSize: 16, color: "#285e50" }} />}
      </div>

      {/* Workflow actions */}
      <div className="flex items-center gap-4 pl-8 pb-4">
        {isCreated ? (
          <button className="flex items-center gap-1 text-[13px] font-bold text-[#285e50] hover:underline transition-all">
            View task <ChevronRightIcon sx={{ fontSize: 14, color: "#285e50" }} />
          </button>
        ) : (
          <>
            <button
              onClick={onCreate}
              className="flex items-center gap-1.5 text-[13px] font-bold text-[#285e50] hover:underline transition-all"
            >
              <CheckIcon sx={{ fontSize: 14, color: "#285e50" }} /> Create a task
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1.5 text-[13px] font-bold text-[#e03d3d] hover:underline transition-all"
            >
              <CloseIcon sx={{ fontSize: 14, color: "#e03d3d" }} /> Dismiss
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TranscriptDetailPage() {
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [hoveredTaskIdx, setHoveredTaskIdx] = useState<number | null>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const taskRefs = useRef<(HTMLDivElement | null)[]>([]);

  function handleInsightClick(i: number) {
    const next = selectedInsight === i ? null : i;
    setSelectedInsight(next);
    if (next !== null && insightToMessage[next] !== undefined) {
      messageRefs.current[insightToMessage[next]]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleTaskClick(i: number) {
    const next = selectedTask === i ? null : i;
    setSelectedTask(next);
    if (next !== null && taskToMessage[next] !== undefined) {
      messageRefs.current[taskToMessage[next]]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleTranscriptRowHover(taskBadges: number[]) {
    if (taskBadges.length > 0) {
      setHoveredTaskIdx(taskBadges[0]);
      taskRefs.current[taskBadges[0]]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [created, setCreated] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [marked, setMarked] = useState(false);

  const actioned = created.size + dismissed.size;
  const status =
    actioned === 0 ? "unreviewed"
    : actioned === suggestedActions.length ? "reviewed"
    : "in-progress";

  const statusConfig = {
    unreviewed: { label: "Unreviewed", bg: "#ededed", color: "#525252" },
    "in-progress": { label: "In Progress", bg: "#e9cc95", color: "#101010" },
    reviewed: { label: "Reviewed", bg: "#d4e2dd", color: "#285e50" },
  };

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

      {/* Breadcrumb + Mark as reviewed */}
      <div className="flex items-center justify-between px-10 pt-5 pb-0 shrink-0">
        <nav className="flex items-center gap-2 text-[14px]">
          <Link href="/transcripts" className="text-[#747474] hover:text-[#285e50] transition-colors">
            Transcripts
          </Link>
          <ChevronRightIcon sx={{ fontSize: 16, color: "#747474" }} />
          <span className="text-[#285e50] font-semibold">Transcript Details</span>
        </nav>

        <button
          onClick={() => setMarked((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-[14px] font-bold transition-all"
          style={{
            borderColor: "#285e50",
            color: marked ? "white" : "#285e50",
            backgroundColor: marked ? "#285e50" : "white",
          }}
        >
          <CheckIcon sx={{ fontSize: 16, color: "currentColor" }} /> {marked ? "Reviewed" : "Mark as reviewed"}
        </button>
      </div>

      {/* Main content */}
      <div className="flex gap-8 px-10 pt-8 pb-6 flex-1 overflow-hidden min-h-0">
        {/* ── Left column ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-6 overflow-hidden">

          {/* Meta + Title + Summary card */}
          <div className="border border-[#e5e5e5] rounded-xl p-6 shrink-0">
            <div className="flex items-center gap-5 mb-5">
              <div className="flex items-center gap-1.5 text-[13px] text-[#747474]">
                <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "#747474" }} />
                <span>Thu, Apr 2 | 11:00–11:30am</span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#747474]">
                <LocalPhoneOutlinedIcon sx={{ fontSize: 16, color: "#747474" }} />
                <span>Phone call</span>
              </div>
              <span
                className="inline-flex items-center px-2 py-[2px] rounded-full text-[13px] font-bold whitespace-nowrap"
                style={{ backgroundColor: statusConfig[status].bg, color: statusConfig[status].color }}
              >
                {statusConfig[status].label}
              </span>
              <span className="text-[13px] text-[#747474]">5 tasks suggested</span>
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#285e50]">
                <AutoAwesomeOutlinedIcon sx={{ fontSize: 16, color: "#285e50" }} />
                AI-generated summary
              </span>
            </div>

            <h1
              className="text-[32px] text-[#09090b] leading-[1.2] mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Prescription delay causing missed doses for blood pressure.
            </h1>

            <p className="text-[15px] text-[#09090b] leading-[1.6]">
              John Martinez has not received his prescribed Lisinopril due to a breakdown between his doctor's office and pharmacy. As a result, he has missed all doses for the past week and is experiencing mild dizziness.
            </p>
          </div>

          {/* Call Transcript card */}
          <div className="border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5] shrink-0">
              <div className="flex items-center gap-2">
                <ArticleOutlinedIcon sx={{ fontSize: 18, color: "#285e50" }} />
                <span className="text-[16px] font-bold text-[#09090b]">Call Transcript</span>
              </div>
              <div className="flex items-center gap-2 border border-[#d9d9d9] rounded-lg px-3 py-2 bg-white w-[200px] focus-within:border-[#285e50] transition-colors">
                <input
                  type="text"
                  placeholder="Search transcript"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-[13px] text-[#09090b] placeholder-[#aaa] outline-none bg-transparent"
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

                let bgColor = "transparent";
                if (isInsightHighlighted) bgColor = "#e6f0ed";
                if (isTaskHighlighted) bgColor = "#fef3dc";

                return (
                  <div
                    key={i}
                    ref={(el) => { messageRefs.current[i] = el; }}
                    className="flex gap-3 rounded-lg px-3 py-2 -mx-3 transition-colors"
                    style={{ backgroundColor: bgColor }}
                    onMouseEnter={() => handleTranscriptRowHover(taskBadges)}
                    onMouseLeave={() => setHoveredTaskIdx(null)}
                  >
                    {/* Task badge margin */}
                    <div className="w-5 shrink-0 flex flex-col gap-1 pt-1">
                      {taskBadges.map((taskIdx) => (
                        <TaskBadge key={taskIdx} number={taskIdx + 1} active={selectedTask === taskIdx} />
                      ))}
                    </div>

                    {/* Message content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span
                          className="text-[14px] font-bold"
                          style={{ color: msg.speaker === "advocate" ? "#285e50" : "#1a6b5a" }}
                        >
                          {msg.name}
                        </span>
                        <span className="text-[12px] text-[#aaa]">{msg.timestamp}</span>
                      </div>
                      <p className="text-[14px] text-[#09090b] leading-[1.6]">{msg.text}</p>
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

        {/* ── Right column ── */}
        <div className="w-[340px] shrink-0 flex flex-col gap-4 overflow-hidden">

          {/* Key Insights */}
          <div className="border border-[#e5e5e5] rounded-xl overflow-hidden shrink-0">
            <button
              onClick={() => setInsightsOpen((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#fafafa] transition-colors"
            >
              <div className="flex items-center gap-2">
                <AutoAwesomeOutlinedIcon sx={{ fontSize: 16, color: "#285e50" }} />
                <span className="text-[15px] font-bold text-[#09090b]">Key Insights</span>
              </div>
              <span className={`transition-transform ${insightsOpen ? "" : "-rotate-90"}`}>
                <KeyboardArrowDownIcon sx={{ fontSize: 18, color: "#09090b" }} />
              </span>
            </button>

            {insightsOpen && (
              <div className="px-5 pb-5 flex flex-col gap-2">
                {keyInsights.map((insight, i) => (
                  <div
                    key={i}
                    onClick={() => handleInsightClick(i)}
                    className="px-3 py-2.5 rounded-lg text-[13px] text-[#09090b] leading-[1.5] cursor-pointer transition-colors"
                    style={{
                      backgroundColor: selectedInsight === i ? "#e6f0ed" : "#f5f5f5",
                      border: `1px solid ${selectedInsight === i ? "#285e50" : "#d9d9d9"}`,
                    }}
                  >
                    {insight}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks */}
          {suggestedActions.some((_, i) => !dismissed.has(i)) && (
            <div className={`border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col ${actionsOpen ? "flex-1 min-h-0" : "shrink-0"}`}>
              <button
                onClick={() => setActionsOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#fafafa] transition-colors shrink-0"
              >
                <div className="flex items-center gap-2">
                  <ChecklistOutlinedIcon sx={{ fontSize: 16, color: "#285e50" }} />
                  <span className="text-[15px] font-bold text-[#09090b]">Tasks</span>
                </div>
                <span className={`transition-transform ${actionsOpen ? "" : "-rotate-90"}`}>
                  <KeyboardArrowDownIcon sx={{ fontSize: 18, color: "#09090b" }} />
                </span>
              </button>

              {actionsOpen && (
                <div className="px-5 overflow-y-auto flex-1 min-h-0">
                  {suggestedActions.map((action, i) =>
                    dismissed.has(i) ? null : (
                      <div key={i} ref={(el) => { taskRefs.current[i] = el; }}>
                        <SuggestedAction
                          text={action}
                          taskNumber={i + 1}
                          isSelected={selectedTask === i}
                          isHighlightedFromTranscript={hoveredTaskIdx === i}
                          isCreated={created.has(i)}
                          onSelect={() => handleTaskClick(i)}
                          onCreate={() => setCreated((prev) => new Set([...prev, i]))}
                          onDismiss={() => setDismissed((prev) => new Set([...prev, i]))}
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
