"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getSavedState, computeStatus } from "./transcriptStore";
import { transcriptDataMap } from "./transcriptData";
import TopNavShared from "@/components/TopNav";
import PhoneIcon from "@mui/icons-material/LocalPhoneOutlined";
import VideoIcon from "@mui/icons-material/VideocamOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

// Types
type Status = "unreviewed" | "in-progress" | "reviewed";
type ContactType = "phone" | "video";

interface Transcript {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  contactType: ContactType;
  summaryTitle: string;
  summaryNote: string;
  status: Status;
  taskLabel: string;
}

interface TranscriptGroup {
  date: string;
  transcripts: Transcript[];
}

// Data
const transcriptGroups: TranscriptGroup[] = [
  {
    date: "Thursday, April 2",
    transcripts: [
      {
        id: "1",
        time: "11:00-11:30am",
        patientName: "John Martinez",
        patientId: "#4233",
        contactType: "phone",
        summaryTitle: "Prescription delay causing missed doses for blood pressure ...",
        summaryNote: "Missed medication due to pharmacy delay",
        status: "unreviewed",
        taskLabel: "5 tasks suggested",
      },
      {
        id: "2",
        time: "9:20-9:55am",
        patientName: "Olivia Wilson",
        patientId: "#1245",
        contactType: "video",
        summaryTitle: "Routine check-in, no issues reported",
        summaryNote: "Patient reported no ongoing issues",
        status: "reviewed",
        taskLabel: "0 tasks",
      },
      {
        id: "3",
        time: "8:00-8:30am",
        patientName: "Emily Chen",
        patientId: "#8971",
        contactType: "phone",
        summaryTitle: "Clarified appointment schedule and provider availability",
        summaryNote: "Schedule a follow-up call before 4/18/2026",
        status: "unreviewed",
        taskLabel: "2 tasks suggested",
      },
    ],
  },
  {
    date: "Wednesday, April 1",
    transcripts: [
      {
        id: "4",
        time: "1:45-3:00pm",
        patientName: "Amanda Lee",
        patientId: "#8913",
        contactType: "video",
        summaryTitle: "Addressed billing question, resolved during call",
        summaryNote: "Resolved billing issue caused by bank",
        status: "reviewed",
        taskLabel: "2 tasks completed",
      },
      {
        id: "5",
        time: "11:25-11:55am",
        patientName: "James Anderson",
        patientId: "#4126",
        contactType: "phone",
        summaryTitle: "Reported difficulty scheduling specialist appointment",
        summaryNote: "Needs help scheduling appointment with dermatologist",
        status: "in-progress",
        taskLabel: "1 task in progress",
      },
      {
        id: "6",
        time: "8:00-8:30am",
        patientName: "Sophia Nguen",
        patientId: "#1455",
        contactType: "video",
        summaryTitle: "Follow-up completed, no further action needed",
        summaryNote: "Minor issue resolved during call",
        status: "reviewed",
        taskLabel: "0 tasks",
      },
    ],
  },
];

// Status pill config
const statusConfig: Record<Status, { label: string; bg: string; textColor: string }> = {
  unreviewed: { label: "Unreviewed", bg: "#f1e1e2", textColor: "#a92127" },
  "in-progress": { label: "In Progress", bg: "#e9cc95", textColor: "#101010" },
  reviewed: { label: "Reviewed", bg: "#d4e2dd", textColor: "#285e50" },
};

// StatusPill component
function StatusPill({ status }: { status: Status }) {
  const { label, bg, textColor } = statusConfig[status];
  return (
    <span
      className="inline-flex self-start items-center px-2 py-[2px] rounded-full text-[13px] font-bold leading-[1.5] whitespace-nowrap"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {label}
    </span>
  );
}

// TranscriptRow component
function TranscriptRow({ transcript }: { transcript: Transcript }) {
  return (
    <Link href={`/transcripts/${transcript.id}`} className="flex items-center border-b border-[#dbdbdb] last:border-b-0 bg-white hover:bg-[#fafafa] transition-colors cursor-pointer group">
      {/* Time */}
      <div className="w-[158px] shrink-0 px-4 py-6">
        <span className="text-[15px] font-bold text-[#555] leading-[1.5] whitespace-nowrap">
          {transcript.time}
        </span>
      </div>

      {/* Patient */}
      <div className="w-[196px] shrink-0 px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="shrink-0 text-[#285e50]">
            {transcript.contactType === "phone"
              ? <PhoneIcon sx={{ fontSize: 20, color: "#285e50" }} />
              : <VideoIcon sx={{ fontSize: 20, color: "#285e50" }} />}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold text-[#09090b] leading-[1.5] whitespace-nowrap">
              {transcript.patientName}
            </span>
            <span className="text-[13px] font-normal text-[#747474] leading-[1.5]">
              {transcript.patientId}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex-1 min-w-0 px-4 py-6">
        <p className="text-[15px] font-bold text-[#09090b] leading-[1.4] truncate mb-1">
          {transcript.summaryTitle}
        </p>
        <p className="text-[13px] font-normal text-[#747474] leading-[1.5] truncate">
          {transcript.summaryNote}
        </p>
      </div>

      {/* Status */}
      <div className="w-[200px] shrink-0 px-6 py-6 flex flex-col gap-1">
        <StatusPill status={getLiveStatus(transcript.id).status} />
        <span className="text-[13px] font-normal text-[#747474] leading-[1.5] whitespace-nowrap">
          {getLiveStatus(transcript.id).taskLabel}
        </span>
      </div>

      {/* Arrow */}
      <div className="w-10 shrink-0 flex items-center justify-center pr-6">
        <ChevronRightIcon sx={{ fontSize: 20, color: "#285e50" }} />
      </div>
    </Link>
  );
}

// TranscriptGroup component
function TranscriptGroupSection({ group }: { group: TranscriptGroup }) {
  return (
    <div className="flex gap-8 border-b border-[#dbdbdb]">
      {/* Date label */}
      <div className="w-[200px] shrink-0 pt-8">
        <span className="text-[15px] font-bold text-[#09090b] leading-[1.5] whitespace-nowrap">
          {group.date}
        </span>
      </div>

      {/* Rows */}
      <div className="flex-1 min-w-0">
        {group.transcripts.map((transcript) => (
          <TranscriptRow key={transcript.id} transcript={transcript} />
        ))}
      </div>
    </div>
  );
}

// Page Header
function PageHeader() {
  const tabs = ["All", "This Week", "This Month"];
  return (
    <div className="flex items-start justify-between mb-0 pt-[40px] pb-[24px]">
      <h1
        className="text-[36px] text-[#09090b] leading-[1.5]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
      >
        Transcripts
      </h1>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-[9.6px]">
          <button className="w-12 h-12 border border-[#d9d9d9] rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
            <SearchIcon sx={{ fontSize: 20, color: "#555" }} />
          </button>
          <button className="w-[50px] h-12 border border-[#d9d9d9] rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
            <TuneOutlinedIcon sx={{ fontSize: 20, color: "#555" }} />
          </button>
        </div>

        <div
          className="flex items-center h-12 px-2 py-1 rounded-lg gap-0"
          style={{ backgroundColor: "#f4f8f7" }}
        >
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`px-4 h-full rounded-lg text-[15px] font-bold leading-[1.5] whitespace-nowrap flex items-center ${
                tab === "This Week"
                  ? "bg-white text-[#285e50] shadow-sm"
                  : "text-[#555]"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getLiveStatus(id: string): { status: Status; taskLabel: string } {
  const saved = getSavedState(id);
  const data = transcriptDataMap[id];
  if (!saved || !data) return { status: data ? (data.suggestedActions.length === 0 ? "reviewed" : "unreviewed") : "unreviewed", taskLabel: transcriptGroups.flatMap(g => g.transcripts).find(t => t.id === id)?.taskLabel ?? "" };
  const totalTasks = data.suggestedActions.length;
  const status = computeStatus(totalTasks, saved.approved, saved.completed, saved.dismissed);
  const pendingCount = totalTasks - saved.approved.length - saved.completed.length - saved.dismissed.length;
  const parts = [
    pendingCount > 0 ? `${pendingCount} suggested` : null,
    saved.approved.length > 0 ? `${saved.approved.length} in progress` : null,
    saved.completed.length > 0 ? `${saved.completed.length} completed` : null,
  ].filter(Boolean);
  const taskLabel = parts.length > 0 ? parts.join(" · ") : "0 tasks";
  return { status, taskLabel };
}

export default function TranscriptsPage() {
  const [, forceUpdate] = useState(0);
  useEffect(() => { forceUpdate(n => n + 1); }, []);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <TopNavShared />

      {/* Page header — never scrolls */}
      <div className="px-10 shrink-0">
        <PageHeader />
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-10 min-h-0">
        {transcriptGroups.map((group) => (
          <TranscriptGroupSection key={group.date} group={group} />
        ))}
      </div>

      {/* See More — never scrolls */}
      <div className="shrink-0 flex justify-end px-10 py-4 bg-white border-t border-[#e5e5e5]">
        <button
          className="px-3 py-1.5 text-[15px] font-bold rounded-lg border transition-colors hover:bg-[#f4f8f7]"
          style={{ color: "#285e50", borderColor: "#285e50" }}
        >
          See More
        </button>
      </div>
    </div>
  );
}
