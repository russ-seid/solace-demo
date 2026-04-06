"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import { transcriptDataMap } from "../transcriptData";
import { getSavedState, saveState } from "../transcriptStore";
import AnnotationHud from "@/components/AnnotationHud";
import AnnotationPin from "@/components/AnnotationPin";
import { useAnnotations } from "@/contexts/AnnotationContext";

// ─── Annotations ──────────────────────────────────────────────────────────────

const DETAIL_ANNOTATIONS = [
  {
    number: 1,
    label: "AI summary card",
    text: "AI-generated summary surfaces the call title, narrative summary, and key insight chips. Labeled 'AI-generated' to set clear expectations and encourage verification against the full transcript.",
  },
  {
    number: 2,
    label: "Key insight chips",
    text: "Clicking any insight chip scrolls the transcript and highlights the exact passage it was derived from, grounding AI outputs in the real conversation.",
  },
  {
    number: 3,
    label: "Numbered transcript markers",
    text: "Each AI-suggested task is numbered and a matching marker appears inline in the transcript at the moment that generated it, creating a permanent, passive connection between action and source.",
  },
  {
    number: 4,
    label: "Approve / Dismiss",
    text: "Advocates consciously approve or dismiss each AI suggestion before tasks enter the platform workflow, keeping humans in control of AI outputs.",
  },
  {
    number: 5,
    label: "+ Add a task manually",
    text: "For advocates who identify action items the AI missed, ensuring the system supports all working styles.",
  },
  {
    number: 6,
    label: "Tasks counter",
    text: "Updates in real time as tasks are approved, giving advocates a clear sense of completion progress.",
  },
  {
    number: 7,
    label: "View task button",
    text: "Links directly into the existing platform task flow, keeping the experience grounded in tools advocates already know.",
  },
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
  showApproveAnnotation,
  showViewTaskAnnotation,
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
  showApproveAnnotation?: boolean;
  showViewTaskAnnotation?: boolean;
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
          {showApproveAnnotation && (
            <AnnotationPin number={4} text={DETAIL_ANNOTATIONS[3].text} />
          )}
        </div>
      )}

      {taskState === "inprogress" && (
        <div className="flex items-center justify-between mt-3 pl-8">
          <TaskStatusPill state="inprogress" />
          <div className="flex items-center gap-1.5">
            <button
              onClick={onViewTask}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-[12px] font-bold border transition-colors cursor-pointer"
              style={{ borderColor: "#285e50", color: "#285e50", backgroundColor: "transparent" }}
            >
              View task
              <ChevronRightIcon sx={{ fontSize: 14 }} />
            </button>
            {showViewTaskAnnotation && (
              <AnnotationPin number={7} text={DETAIL_ANNOTATIONS[6].text} />
            )}
          </div>
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
  const { id } = useParams<{ id: string }>();
  const data = transcriptDataMap[id];

  const [summaryOpen, setSummaryOpen] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);
  const [hoveredInsight, setHoveredInsight] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [hoveredTaskIdx, setHoveredTaskIdx] = useState<number | null>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const taskRefs = useRef<(HTMLDivElement | null)[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userScrollingRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const scrollGuardTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saved = getSavedState(id);
  const [approved, setApproved] = useState<Set<number>>(new Set(saved?.approved ?? data?.initialApproved ?? []));
  const [completed, setCompleted] = useState<Set<number>>(new Set(saved?.completed ?? data?.initialCompleted ?? []));
  const [dismissed, setDismissed] = useState<Set<number>>(new Set(saved?.dismissed ?? data?.initialDismissed ?? []));

  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(false);
  const { enabled: showAnnotations } = useAnnotations();

  useEffect(() => {
    saveState(id, { approved: [...approved], completed: [...completed], dismissed: [...dismissed] });
  }, [id, approved, completed, dismissed]);

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-[15px] text-[#747474]">Transcript not found.</p>
      </div>
    );
  }

  // Derive messageToTasks from data
  const messageToTasks: Record<number, number[]> = {};
  Object.entries(data.taskToMessage).forEach(([taskIdx, msgIdx]) => {
    if (!messageToTasks[msgIdx]) messageToTasks[msgIdx] = [];
    messageToTasks[msgIdx].push(Number(taskIdx));
  });
  const firstBadgedMsgIdx = data.transcript.findIndex((_, idx) =>
    (messageToTasks[idx] ?? []).filter((t) => !dismissed.has(t)).length > 0
  );

  const totalTasks = data.suggestedActions.length;
  const pendingCount = totalTasks - approved.size - completed.size - dismissed.size;
  const allActioned = pendingCount === 0;

  const status =
    approved.size > 0 ? "in-progress"
    : totalTasks === 0 || allActioned ? "reviewed"
    : "unreviewed";

  const statusConfig = {
    unreviewed: { label: "Unreviewed", bg: "#f1e1e2", color: "#a92127" },
    "in-progress": { label: "In Progress", bg: "#e9cc95", color: "#101010" },
    reviewed: { label: "Reviewed", bg: "#d4e2dd", color: "#285e50" },
  };

  function getTaskState(i: number): TaskState {
    if (completed.has(i)) return "completed";
    if (approved.has(i)) return "inprogress";
    return "pending";
  }

  const firstPendingIdx = data.suggestedActions.findIndex((_, i) => !dismissed.has(i) && getTaskState(i) === "pending");
  const firstInProgressIdx = data.suggestedActions.findIndex((_, i) => !dismissed.has(i) && getTaskState(i) === "inprogress");

  function scrollMessageIntoView(msgIndex: number, block: "center" | "nearest" = "center", respectUserScroll = false) {
    if (respectUserScroll && userScrollingRef.current) return;
    const container = messagesContainerRef.current;
    const el = messageRefs.current[msgIndex];
    if (!container || !el) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const elScrollTop = container.scrollTop + (elRect.top - containerRect.top);
    programmaticScrollRef.current = true;
    setTimeout(() => { programmaticScrollRef.current = false; }, 600);

    if (block === "center") {
      container.scrollTo({ top: elScrollTop - container.clientHeight / 2 + elRect.height / 2, behavior: "smooth" });
    } else {
      if (elRect.top < containerRect.top) {
        container.scrollTo({ top: elScrollTop - 16, behavior: "smooth" });
      } else if (elRect.bottom > containerRect.bottom) {
        container.scrollTo({ top: elScrollTop - container.clientHeight + elRect.height + 16, behavior: "smooth" });
      }
    }
  }

  function handleUserScroll() {
    if (programmaticScrollRef.current) return;
    userScrollingRef.current = true;
    if (scrollGuardTimer.current) clearTimeout(scrollGuardTimer.current);
    scrollGuardTimer.current = setTimeout(() => { userScrollingRef.current = false; }, 1000);
  }

  function handleInsightClick(i: number) {
    const next = selectedInsight === i ? null : i;
    setSelectedInsight(next);
    if (next !== null && data.insightToMessage[next] !== undefined) {
      scrollMessageIntoView(data.insightToMessage[next], "center");
    }
  }

  function handleTranscriptRowHover(taskBadges: number[]) {
    if (taskBadges.length > 0) {
      setHoveredTaskIdx(taskBadges[0]);
      scrollMessageIntoView(data.taskToMessage[taskBadges[0]], "nearest", true);
    }
  }

  const hasVisibleTasks = totalTasks - dismissed.size > 0;

  // Map original task index → sequential display number (skipping dismissed)
  const taskDisplayNumber: Record<number, number> = {};
  let displayNum = 0;
  data.suggestedActions.forEach((_, i) => {
    if (!dismissed.has(i)) taskDisplayNumber[i] = ++displayNum;
  });

  const filteredTranscript = searchQuery
    ? data.transcript.filter(
        (m) =>
          m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data.transcript;

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
                <span>{data.date} · {data.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#747474]">
                {data.contactType === "phone"
                  ? <LocalPhoneOutlinedIcon sx={{ fontSize: 15, color: "#aaa" }} />
                  : <VideocamOutlinedIcon sx={{ fontSize: 15, color: "#aaa" }} />}
                <span>{data.contactType === "phone" ? "Phone call" : "Video call"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#747474]">
                <PersonOutlinedIcon sx={{ fontSize: 15, color: "#aaa" }} />
                <span>{data.patientName}</span>
              </div>
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
                    {showAnnotations && <AnnotationPin number={1} text={DETAIL_ANNOTATIONS[0].text} />}
                  </div>
                  {totalTasks > 0 && (
                    <span className="text-[12px] text-[#747474]">AI-generated · Review the tasks on the right.</span>
                  )}
                </div>
                <h1
                  className="text-[28px] text-[#232323] leading-[1.2] mb-3"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                >
                  {data.summaryTitle}
                </h1>
                <p className="text-[15px] text-[#555] leading-[1.7] mb-4">
                  {data.summaryBody}
                </p>
                {/* Key Insights */}
                {data.keyInsights.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    {data.keyInsights.map((insight, i) => (
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
                    {showAnnotations && <AnnotationPin number={2} text={DETAIL_ANNOTATIONS[1].text} />}
                  </div>
                )}
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
            <div ref={messagesContainerRef} onScroll={handleUserScroll} className="px-6 py-4 flex flex-col gap-5 flex-1 overflow-y-auto min-h-0">
              {filteredTranscript.map((msg, i) => {
                const originalIndex = data.transcript.indexOf(msg);
                const isInsightHighlighted = selectedInsight !== null && data.insightToMessage[selectedInsight] === originalIndex;
                const isTaskHighlighted = selectedTask !== null && data.taskToMessage[selectedTask] === originalIndex;
                const taskBadges = messageToTasks[originalIndex] ?? [];

                const bgColor =
                  isInsightHighlighted || isTaskHighlighted ? "#e9f0ee"
                  : taskBadges.length > 0 && hoveredTaskIdx === taskBadges[0] ? "#f4f8f7"
                  : "transparent";

                return (
                  <div
                    key={originalIndex}
                    ref={(el) => { messageRefs.current[originalIndex] = el; }}
                    className="flex gap-3 rounded-lg px-3 py-2 -mx-3 transition-colors"
                    style={{ backgroundColor: bgColor }}
                    onMouseEnter={() => handleTranscriptRowHover(taskBadges)}
                    onMouseLeave={() => setHoveredTaskIdx(null)}
                  >
                    <div className="w-5 shrink-0 flex flex-col gap-1 pt-1">
                      {taskBadges.filter((taskIdx) => !dismissed.has(taskIdx)).map((taskIdx) => (
                        <TaskBadge key={taskIdx} number={taskDisplayNumber[taskIdx]} />
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
                    {showAnnotations && originalIndex === firstBadgedMsgIdx && (
                      <div className="shrink-0 self-center">
                        <AnnotationPin number={3} text={DETAIL_ANNOTATIONS[2].text} />
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredTranscript.length === 0 && (
                <p className="text-[14px] text-[#747474] py-4">No results for &quot;{searchQuery}&quot;</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column — Tasks ── */}
        <div className="w-[320px] shrink-0 flex flex-col border border-[#e5e5e5] rounded-xl overflow-hidden">

          {/* Tasks header */}
          <div className="px-6 py-4 border-b border-[#e5e5e5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChecklistOutlinedIcon sx={{ fontSize: 18, color: "#285e50" }} />
                <span className="text-[16px] font-bold text-[#232323]">Tasks</span>
              </div>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-bold whitespace-nowrap"
                style={{ backgroundColor: statusConfig[status].bg, color: statusConfig[status].color }}
              >
                {statusConfig[status].label}
              </span>
            </div>
            {totalTasks > 0 && (pendingCount > 0 || approved.size > 0 || completed.size > 0) && (
              <div className="flex items-center gap-2 mt-1 pl-7">
                {pendingCount > 0 && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: "#f4f8f7", color: "#285e50" }}
                  >
                    <AutoAwesomeOutlinedIcon sx={{ fontSize: 10 }} />
                    {pendingCount} AI suggested
                  </span>
                )}
                {approved.size > 0 && (
                  <span className="text-[12px] text-[#747474]">{approved.size} in progress</span>
                )}
                {completed.size > 0 && (
                  <span className="text-[12px] text-[#747474]">{completed.size} completed</span>
                )}
                {showAnnotations && <AnnotationPin number={6} text={DETAIL_ANNOTATIONS[5].text} />}
              </div>
            )}
          </div>

          {/* Task list */}
          <div className="px-5 overflow-y-auto flex-1 min-h-0">
            {totalTasks === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                <ChecklistOutlinedIcon sx={{ fontSize: 28, color: "#ccc" }} />
                <p className="text-[13px] font-bold text-[#232323]">No tasks</p>
                <p className="text-[12px] text-[#747474] leading-[1.5]">No action required for this call.</p>
              </div>
            ) : hasVisibleTasks ? (
              data.suggestedActions.map((action, i) => {
                if (dismissed.has(i)) return null;
                const state = getTaskState(i);
                return (
                  <div
                    key={i}
                    ref={(el) => { taskRefs.current[i] = el; }}
                    onMouseEnter={() => {
                      setSelectedTask(i);
                      if (data.taskToMessage[i] !== undefined) {
                        scrollMessageIntoView(data.taskToMessage[i], "center", true);
                      }
                    }}
                    onMouseLeave={() => setSelectedTask(null)}
                  >
                    <SuggestedAction
                      text={action}
                      taskNumber={taskDisplayNumber[i]}
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
                      showApproveAnnotation={showAnnotations && i === firstPendingIdx}
                      showViewTaskAnnotation={showAnnotations && i === firstInProgressIdx}
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
          </div>

          {/* Add task — always visible at bottom */}
          <div className="px-5 py-4 border-t border-[#f0f0f0] shrink-0 flex items-center gap-2">
            <button
              className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold text-[#285e50] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              style={{ border: "1.5px dashed #b6d4cc" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f4f8f7"; (e.currentTarget as HTMLElement).style.borderColor = "#285e50"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "#b6d4cc"; }}
            >
              + Add a task manually
            </button>
            {showAnnotations && <AnnotationPin number={5} text={DETAIL_ANNOTATIONS[4].text} />}
          </div>
        </div>
      </div>

      <AnnotationHud annotations={DETAIL_ANNOTATIONS.filter(({ number }) => {
        if (number === 4) return firstPendingIdx !== -1;
        if (number === 6) return totalTasks > 0 && (pendingCount > 0 || approved.size > 0 || completed.size > 0);
        if (number === 7) return firstInProgressIdx !== -1;
        return true;
      }).map(({ number, label }) => ({ number, label }))} />

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
