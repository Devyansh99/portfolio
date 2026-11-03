export type TimelineEntry = {
  kind: "work" | "education" | "role";
  title: string;
  org: string;
  period: string;
  detail?: string;
  points?: string[];
};

export const timeline: TimelineEntry[] = [
  {
    kind: "work",
    title: "AI Engineer",
    org: "SadakVision",
    period: "Jan 2025 – Present",
    points: [
      "Part of the team building SadakVision, a smartphone product that finds road damage and rates how severe it is, for city authorities.",
      "Worked on the sensing side: deciding when a drive is worth recording, so phones save only the rough moments. That cut phone writes by 70.5% and kept devices from overheating.",
      "Also contributed to the cloud pipeline that processes each recording and trained the model that spots damage in the video.",
    ],
  },
  {
    kind: "work",
    title: "AI Intern",
    org: "Kaksha AI",
    period: "Jun 2026 – Jul 2026",
    points: [
      "Built chat-native inline analytics with AI-generated insights and visual progress tracking across 7 batches and 500+ students.",
      "Designed backend schemas and 20+ analytics APIs for real-time reporting, trend analysis, and interactive batch dashboards, including test-module analytics.",
      "Integrated PDF and video transcript ingestion into chat with persistent per-chat context and source-cited answers that point to relevant lines or keywords.",
    ],
  },
  {
    kind: "role",
    title: "Events Head",
    org: "Geek Room, Plaksha",
    period: "Sep 2024 – Sep 2025",
    points: [
      "Planned and ran technical events for the wider student community.",
      "Oversaw Plaksha's largest nationwide hackathon with 100+ students.",
      "Led and mentored volunteers to design interactive workshops.",
    ],
  },
  {
    kind: "role",
    title: "Organising Committee Member",
    org: "Fitoor X Prayas",
    period: "Oct 2024 – Nov 2024",
    detail:
      "Managed logistics and scheduling for the Code Breakers event with 80+ participants.",
  },
  {
    kind: "education",
    title: "BTech, Computer Science and Artificial Intelligence",
    org: "Plaksha University, Mohali",
    period: "2023 – 2027",
    detail: "CGPA 8.09 / 10",
  },
  {
    kind: "education",
    title: "ICSE, Class 12",
    org: "St. Vincent's Convent School, Balasore",
    period: "2023",
    detail: "93%. School Topper and Student of the Year.",
  },
  {
    kind: "education",
    title: "ICSE, Class 10",
    org: "St. Vincent's Convent School, Balasore",
    period: "2021",
    detail: "93%",
  },
];

export const achievements = [
  "SP DUTT Award, Best ILGC Project",
  "School Topper and Student of the Year, Class 12 (ICSE)",
  "Machine Learning Specialization, Stanford & DeepLearning.AI",
  "Deep Learning Specialization, DeepLearning.AI",
] as const;
