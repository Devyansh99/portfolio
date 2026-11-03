export type TimelineEntry = {
  kind: "work" | "education" | "role";
  title: string;
  org: string;
  period: string;
  detail?: string;
  points?: string[];
  summary?: string;
  parts?: { label: string; text: string }[];
};

export const timeline: TimelineEntry[] = [
  {
    kind: "work",
    title: "AI Engineer",
    org: "SadakVision",
    period: "Jan 2025 – Present",
    summary:
      "SadakVision turns an ordinary smartphone on a car dashboard into a road inspector. It records drives, finds potholes, cracks, manholes and garbage, and rates how bad each spot is, so city authorities know what to fix first. I am part of the team building the AI side.",
    parts: [
      {
        label: "Knowing when to record",
        text: "A phone cannot film every drive without overheating and filling its storage. I worked on a trigger that watches the phone's motion sensors (accelerometer, gyroscope and GPS, read 100 times a second) and flags rough stretches of road. It caught 82.3% of 62+ hand-labelled events and rates each one low, medium or high.",
      },
      {
        label: "Cloud backend",
        text: "Video is only recorded when the trigger fires, and the AWS backend handles those recordings. Result: 70.5% fewer writes on the phone, a phone that now runs 2.5 hours before throttling instead of 32 minutes, and 89.3% less work for the vision model.",
      },
      {
        label: "Seeing the damage",
        text: "Trained a YOLOv8m model on 21K+ images of Indian roads, 7K of them labelled by hand, to find potholes, cracks, manholes and garbage. It reaches 86.1% precision and 74.2% mAP@0.5.",
      },
      {
        label: "Written up",
        text: "The system is described in a research paper that is now under review. See the Research tab.",
      },
    ],
  },
  {
    kind: "work",
    title: "AI Intern",
    org: "Kaksha AI",
    period: "Jun 2026 – Jul 2026",
    summary:
      "Two months on Kaksha AI's chat product, working on the analytics and the document side of it.",
    parts: [
      {
        label: "Analytics inside the chat",
        text: "Instead of sending people to a separate report page, charts and AI-written insights appear inline in the chat, along with visual progress tracking. It covers 7 batches and 500+ students.",
      },
      {
        label: "Backend and APIs",
        text: "Designed the database schemas and 20+ analytics APIs behind it: real-time reporting, trend analysis, interactive batch dashboards and test-module analytics.",
      },
      {
        label: "Chat with your documents",
        text: "PDFs and video transcripts can be brought into a chat. Each chat keeps its own context, and answers cite their source by pointing to the relevant lines or keywords.",
      },
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
