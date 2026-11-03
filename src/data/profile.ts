export const profile = {
  name: "Devyansh Agarwal",
  occupation: "AI Engineer",
  corporation: "SadakVision",
  status: "Building Cognalytix",
  school: "Plaksha University",
  location: "Mohali, India",
  tagline:
    "I build AI systems for messy, real-world data. Lately that means teaching a phone to notice a pothole before it starts recording.",
  bio: [
    {
      label: "The short version",
      text: "I'm Devyansh. I study Computer Science and Artificial Intelligence at Plaksha University in Mohali, and I graduate in 2027. I like problems where the model is only one part, and the data, the device and the people using it matter just as much.",
    },
    {
      label: "SadakVision",
      text: "Since January 2025 I've worked on SadakVision, where a phone's accelerometer decides when to record the road. I built the Prophet-based anomaly trigger and fine-tuned the YOLOv8m detector. We presented the work at INDIS 2026 at IIT Guwahati, and the paper is now under review.",
    },
    {
      label: "Now",
      text: "In June and July 2026 I interned at Kaksha AI, building analytics inside a chat product across 7 batches and 500+ students. Right now I'm building Cognalytix, a workspace where you upload a spreadsheet and then explore it, query it and train models on it.",
    },
  ],
  facts: [
    ["based in", "Mohali, India"],
    ["studying", "CS & AI, Plaksha, 2027"],
    ["focus", "applied ML, RAG, agents, vision"],
    ["cgpa", "8.09 / 10"],
  ],
  email: "devyanshag@gmail.com",
  github: "https://github.com/Devyansh99",
  linkedin: "https://www.linkedin.com/in/devyansh99/",
} as const;
