// ─── Types ───────────────────────────────────────────────────────────────────

export interface TranscriptMessage {
  speaker: "advocate" | "patient";
  name: string;
  timestamp: string;
  text: string;
}

export interface TranscriptPageData {
  id: string;
  patientName: string;
  patientId: string;
  contactType: "phone" | "video";
  date: string;
  time: string;
  summaryTitle: string;
  summaryBody: string;
  keyInsights: string[];
  insightToMessage: Record<number, number>;
  suggestedActions: string[];
  taskToMessage: Record<number, number>;
  transcript: TranscriptMessage[];
  initialApproved: number[];
  initialCompleted: number[];
  initialDismissed: number[];
}

// ─── Patient data ─────────────────────────────────────────────────────────────

const data: TranscriptPageData[] = [
  // ── 1. John Martinez ────────────────────────────────────────────────────────
  {
    id: "1",
    patientName: "John Martinez",
    patientId: "#4233",
    contactType: "phone",
    date: "Thu, Apr 2",
    time: "11:00–11:30am",
    summaryTitle: "Prescription delay causing missed doses for blood pressure.",
    summaryBody:
      "John Martinez has not received his prescribed Lisinopril due to a breakdown between his doctor's office and CVS pharmacy. As a result, he has missed all doses for the past week and is experiencing mild dizziness.",
    keyInsights: [
      "Prescription for Lisinopril was not received by CVS pharmacy",
      "Patient contacted doctor twice, issue remains unresolved",
      "Patient has missed all doses for ~1 week",
      "Reports dizziness in the past 2 days",
      "No confirmation or notification from pharmacy",
    ],
    insightToMessage: { 0: 3, 1: 7, 2: 9, 3: 11, 4: 14 },
    suggestedActions: [
      "Call CVS pharmacy to confirm receipt or request resend",
      "Contact doctor's office to verify prescription was sent",
      "Monitor reported dizziness and escalate if symptoms worsen",
      "Ensure prescription is fulfilled today",
      "Follow up with patient after resolution",
    ],
    taskToMessage: { 0: 3, 1: 7, 2: 11, 3: 15, 4: 20 },
    transcript: [
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:02", text: "Hi John, this is Sarah calling from Solace. I'm following up on your recent prescription issue. Do you have a few minutes to talk?" },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "00:15", text: "Yeah, I do. Thanks for calling. I've actually been pretty frustrated with this whole situation." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:28", text: "I'm sorry to hear that. Can you tell me what's been going on?" },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "01:15", text: "So my doctor prescribed me Lisinopril about a week ago, and I went to the pharmacy to pick it up, but they said they never received anything." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:38", text: "Got it. And which pharmacy was that?" },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "01:55", text: "CVS on Main Street." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "02:28", text: "Okay. Did you reach out to your doctor's office after that?" },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "02:51", text: "I called them twice. The first time they said they would resend it. The second time they said it should already be there, but the pharmacy still doesn't have it." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "03:32", text: "That sounds really frustrating. Have you been able to take any doses since then?" },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "04:02", text: "No, I haven't started at all. That's what worries me." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "04:38", text: "Understandable. This medication is important for managing your blood pressure. Have you noticed any symptoms or changes?" },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "05:05", text: "I've been feeling a bit dizzy the past couple of days, but I'm not sure if it's related." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "05:58", text: "Thanks for sharing that. We definitely want to make sure you get your medication as soon as possible." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "06:01", text: "Just to confirm, you haven't received any notification from the pharmacy that it's ready?" },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "07:47", text: "No, nothing." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "08:08", text: "Alright. Here's what I'm going to do. I'll contact both your doctor's office and the pharmacy to figure out where the breakdown is. If needed, I'll request that they send the prescription again or transfer it." },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "10:47", text: "That would be great. I just don't want to keep chasing them." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "12:14", text: "Totally understand. I'll take that off your plate." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "13:28", text: "Also, given that you're feeling dizzy, I recommend keeping an eye on your symptoms. If it gets worse, you should seek care immediately." },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "15:55", text: "Okay, I will." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "16:28", text: "I'll follow up with you once I have an update. Is this the best number to reach you?" },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "17:45", text: "Yes, it is." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "18:02", text: "Great. We'll get this resolved as quickly as possible." },
      { speaker: "patient",  name: "John (Patient)",   timestamp: "19:35", text: "Thank you, I appreciate it." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "22:08", text: "Of course. Talk soon." },
    ],
    initialApproved: [],
    initialCompleted: [],
    initialDismissed: [],
  },

  // ── 2. Olivia Wilson ─────────────────────────────────────────────────────────
  {
    id: "2",
    patientName: "Olivia Wilson",
    patientId: "#1245",
    contactType: "video",
    date: "Thu, Apr 2",
    time: "9:20–9:55am",
    summaryTitle: "Routine check-in — patient is stable with no active concerns.",
    summaryBody:
      "Olivia Wilson is doing well. She is keeping up with her medications and has no new symptoms or concerns. Her upcoming appointment with Dr. Patel on April 15 is confirmed.",
    keyInsights: [],
    insightToMessage: {},
    suggestedActions: [],
    taskToMessage: {},
    transcript: [
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:03", text: "Hi Olivia, this is Sarah calling from Solace for your routine check-in. Is now a good time?" },
      { speaker: "patient",  name: "Olivia (Patient)", timestamp: "00:11", text: "Yes, of course! Hi Sarah." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:18", text: "Great. How have you been feeling lately? Any new symptoms or concerns since we last spoke?" },
      { speaker: "patient",  name: "Olivia (Patient)", timestamp: "00:30", text: "I've been doing really well, actually. No issues at all." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:40", text: "That's wonderful to hear. Are you keeping up with your current medications?" },
      { speaker: "patient",  name: "Olivia (Patient)", timestamp: "00:49", text: "Yes, I take them every morning without fail. No problems." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:02", text: "Perfect. And you have your next appointment with Dr. Patel scheduled for April 15 — does that still work for you?" },
      { speaker: "patient",  name: "Olivia (Patient)", timestamp: "01:14", text: "Yes, that works great. I already have it on my calendar." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:22", text: "Wonderful. Is there anything else on your mind — any questions about your care plan or anything we can help with?" },
      { speaker: "patient",  name: "Olivia (Patient)", timestamp: "01:34", text: "No, I think everything is in good shape. I feel like things are really under control right now." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:44", text: "That's great to hear, Olivia. Well, it sounds like everything is on track. Don't hesitate to reach out if anything comes up before your appointment." },
      { speaker: "patient",  name: "Olivia (Patient)", timestamp: "01:55", text: "Will do. Thanks for checking in, Sarah. I always appreciate it." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "02:02", text: "Of course. Have a wonderful day!" },
    ],
    initialApproved: [],
    initialCompleted: [],
    initialDismissed: [],
  },

  // ── 3. Emily Chen ────────────────────────────────────────────────────────────
  {
    id: "3",
    patientName: "Emily Chen",
    patientId: "#8971",
    contactType: "phone",
    date: "Thu, Apr 2",
    time: "8:00–8:30am",
    summaryTitle: "Patient has a scheduling conflict and questions about specialist referral.",
    summaryBody:
      "Emily Chen has a conflict with her April 18 appointment due to a new job schedule. She also asked about coordinating a specialist referral with a rheumatologist recommended by her GP.",
    keyInsights: [
      "Appointment on April 18 conflicts with patient's new work schedule",
      "Patient inquired about a referral to a rheumatologist",
    ],
    insightToMessage: { 0: 3, 1: 7 },
    suggestedActions: [
      "Check provider availability for alternative dates around April 18",
      "Schedule follow-up call with Emily before April 18 to confirm new appointment",
    ],
    taskToMessage: { 0: 4, 1: 7 },
    transcript: [
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:04", text: "Hi Emily, this is Sarah calling from Solace. I'm reaching out about your upcoming appointment. Do you have a few minutes?" },
      { speaker: "patient",  name: "Emily (Patient)",  timestamp: "00:14", text: "Oh good, I was actually hoping someone would call. I have some questions." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:20", text: "Of course, happy to help. What's on your mind?" },
      { speaker: "patient",  name: "Emily (Patient)",  timestamp: "00:28", text: "I got a reminder about my appointment on April 18, but I just started a new job and that date is really hard for me. Is there any flexibility to move it?" },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:45", text: "Absolutely, let's look into that. Can you tell me roughly what times or dates would work better for you?" },
      { speaker: "patient",  name: "Emily (Patient)",  timestamp: "00:57", text: "Anything after 3pm that week, or really any time the following week would work." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:10", text: "Got it. I'll check provider availability and get back to you. We'll find something that works." },
      { speaker: "patient",  name: "Emily (Patient)",  timestamp: "01:22", text: "Thank you. Also, my GP mentioned I might need a referral to a rheumatologist — something about joint pain I've been having. Is that something you can help coordinate?" },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:38", text: "Definitely. I'll note that and we can discuss the referral on our follow-up call once we have the appointment rescheduled." },
      { speaker: "patient",  name: "Emily (Patient)",  timestamp: "01:50", text: "That would be great. The joint pain has been going on for a few weeks so I'd like to get it looked at." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "02:00", text: "Understood. We'll make sure both of those are taken care of. I'll be in touch before the 18th." },
      { speaker: "patient",  name: "Emily (Patient)",  timestamp: "02:10", text: "Perfect. Thank you so much, Sarah." },
    ],
    initialApproved: [],
    initialCompleted: [],
    initialDismissed: [],
  },

  // ── 4. Amanda Lee ────────────────────────────────────────────────────────────
  {
    id: "4",
    patientName: "Amanda Lee",
    patientId: "#8913",
    contactType: "video",
    date: "Wed, Apr 1",
    time: "1:45–3:00pm",
    summaryTitle: "Billing dispute resolved — charge traced to a bank processing error.",
    summaryBody:
      "Amanda Lee received an unexpected bill of $340 for a visit that should have been fully covered by insurance. The charge was traced to a bank payment processing error and a billing correction was submitted during the call.",
    keyInsights: [
      "Unexpected $340 bill received for a fully covered visit",
      "Bank payment processing error identified as root cause",
    ],
    insightToMessage: { 0: 1, 1: 5 },
    suggestedActions: [
      "Verify insurance coverage and confirm charge should be $0",
      "Submit billing correction to the finance team",
    ],
    taskToMessage: { 0: 3, 1: 7 },
    transcript: [
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:05", text: "Hi Amanda, this is Sarah from Solace. I understand you reached out about a billing concern — thanks for making time for this call." },
      { speaker: "patient",  name: "Amanda (Patient)", timestamp: "00:18", text: "Yes, thank you for calling back. I received a bill last week for $340 that I was not expecting at all." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:28", text: "I understand how frustrating that can be. Let me look into this. Can you give me the invoice number listed on the bill?" },
      { speaker: "patient",  name: "Amanda (Patient)", timestamp: "00:39", text: "Sure, it's INV-2026-04821. And I already checked my insurance portal — the visit is listed as fully covered. I shouldn't owe anything." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:58", text: "You're right — I'm pulling up your account now and the claim does show as covered on our end. Let me dig into why this balance appeared..." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:20", text: "I see it now. The payment was actually processed correctly by your insurer, but there was a bank processing error on our end — the payment was returned and the balance was incorrectly re-applied to your account." },
      { speaker: "patient",  name: "Amanda (Patient)", timestamp: "01:35", text: "Oh wow, so it was a bank error? That's a relief — I was worried there was some issue with my insurance." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:45", text: "Not at all. Your insurance is perfectly fine. I'm submitting a billing correction to our finance team right now to clear this charge. You should not owe anything." },
      { speaker: "patient",  name: "Amanda (Patient)", timestamp: "02:00", text: "That's wonderful. Will I get some kind of confirmation?" },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "02:09", text: "Yes — you'll receive an updated statement within 3 to 5 business days showing a zero balance. If you don't see it by next week, please don't hesitate to reach out." },
      { speaker: "patient",  name: "Amanda (Patient)", timestamp: "02:22", text: "Perfect. Thank you so much for sorting this out so quickly. I was really stressed about it." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "02:30", text: "Of course, Amanda. That's exactly what we're here for. Have a great rest of your day." },
    ],
    initialApproved: [],
    initialCompleted: [0, 1],
    initialDismissed: [],
  },

  // ── 5. James Anderson ────────────────────────────────────────────────────────
  {
    id: "5",
    patientName: "James Anderson",
    patientId: "#4126",
    contactType: "phone",
    date: "Wed, Apr 1",
    time: "11:25–11:55am",
    summaryTitle: "Patient unable to reach dermatology clinic after GP referral in March.",
    summaryBody:
      "James Anderson was referred to Riverside Dermatology by his GP over three weeks ago but has been unable to get a response despite multiple calls and portal messages. An advocate is now following up on his behalf.",
    keyInsights: [
      "GP referral to Riverside Dermatology issued in early March, still unscheduled",
      "Patient made 4–5 unanswered calls and portal messages to the clinic",
    ],
    insightToMessage: { 0: 3, 1: 4 },
    suggestedActions: [
      "Contact Riverside Dermatology on Maple Ave to schedule appointment on patient's behalf",
    ],
    taskToMessage: { 0: 5 },
    transcript: [
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:04", text: "Hi James, this is Sarah calling from Solace. How are you doing today?" },
      { speaker: "patient",  name: "James (Patient)",  timestamp: "00:12", text: "Honestly, a bit frustrated. I've been trying to get an appointment with a dermatologist for weeks and I just can't make it happen." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:22", text: "I'm sorry to hear that. Can you tell me more about what's been going on?" },
      { speaker: "patient",  name: "James (Patient)",  timestamp: "00:34", text: "My GP referred me back in early March — she said it was important to get seen soon. It's been over three weeks." },
      { speaker: "patient",  name: "James (Patient)",  timestamp: "00:45", text: "I've called Riverside Dermatology at least four or five times. Left voicemails, sent a message through their patient portal. Nothing." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:00", text: "That's unacceptable — you shouldn't have to chase this down yourself. I'm going to reach out to Riverside directly on your behalf and get this scheduled." },
      { speaker: "patient",  name: "James (Patient)",  timestamp: "01:12", text: "That would be amazing. I genuinely don't know what else to do on my end." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:20", text: "You don't need to do anything more. I'll handle it from here. Can I confirm it's Riverside Dermatology on Maple Avenue?" },
      { speaker: "patient",  name: "James (Patient)",  timestamp: "01:28", text: "Yes, exactly. That's the one my GP referred me to." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:36", text: "Perfect. I'll reach out to them today and follow up with you as soon as I have a confirmed appointment time — expect to hear from me within 24 to 48 hours." },
      { speaker: "patient",  name: "James (Patient)",  timestamp: "01:48", text: "That's great. Thank you so much. I really appreciate someone actually taking action on this." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:55", text: "Absolutely, James. That's what we're here for. Talk soon." },
    ],
    initialApproved: [0],
    initialCompleted: [],
    initialDismissed: [],
  },

  // ── 6. Sophia Nguen ──────────────────────────────────────────────────────────
  {
    id: "6",
    patientName: "Sophia Nguen",
    patientId: "#1455",
    contactType: "video",
    date: "Wed, Apr 1",
    time: "8:00–8:30am",
    summaryTitle: "Follow-up confirmed — prior prescription issue fully resolved.",
    summaryBody:
      "Sophia Nguen confirmed that the prescription issue from her previous call has been fully resolved. She received her medication and is feeling well with no new concerns.",
    keyInsights: [],
    insightToMessage: {},
    suggestedActions: [],
    taskToMessage: {},
    transcript: [
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:03", text: "Hi Sophia, this is Sarah from Solace. I'm calling to follow up on the prescription issue we helped resolve last week. How are you doing?" },
      { speaker: "patient",  name: "Sophia (Patient)", timestamp: "00:14", text: "Hi Sarah! I'm doing really well, actually. Everything worked out great." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:22", text: "So glad to hear it. You were able to pick up the medication?" },
      { speaker: "patient",  name: "Sophia (Patient)", timestamp: "00:30", text: "Yes, I picked it up on Friday. No issues at all." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:38", text: "That's great news. Any side effects or anything unusual since starting the medication?" },
      { speaker: "patient",  name: "Sophia (Patient)", timestamp: "00:47", text: "None at all. I feel completely normal. If anything, I feel better than before." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "00:56", text: "That's exactly what we like to hear. Is there anything else on your mind — anything you'd like to flag or ask about?" },
      { speaker: "patient",  name: "Sophia (Patient)", timestamp: "01:06", text: "No, I think we're all set. Everything is under control." },
      { speaker: "advocate", name: "Sarah (Advocate)", timestamp: "01:13", text: "Wonderful. Don't hesitate to reach out if anything comes up. Take care, Sophia." },
      { speaker: "patient",  name: "Sophia (Patient)", timestamp: "01:20", text: "Thank you so much for everything, Sarah. I really appreciate all the help." },
    ],
    initialApproved: [],
    initialCompleted: [],
    initialDismissed: [],
  },
];

export const transcriptDataMap: Record<string, TranscriptPageData> = Object.fromEntries(
  data.map((d) => [d.id, d])
);
