export const paper = {
  title:
    "SadakVision: sensor–vision fusion for scalable smartphone road monitoring",
  authors: [
    "Abhijeet Shashwat",
    "Avishkar Rawal",
    "Devyansh Agarwal",
    "Raghav Sarna",
    "Shreyansh Singh",
  ],
  affiliation: "Sochera AI Pvt. Ltd., Plaksha University, Punjab, India",
  status: "Under Review",
  venue:
    "Presented at INDIS 2026, Department of Design, IIT Guwahati (28–30 Sept 2026). Under review for Taylor & Francis proceedings.",
  abstract:
    "Rapid growth of road networks in India is increasing the safety and economic risks of road-surface deterioration. Most existing methods rely on costly vision inference over continuous video, or on inertial sensors that cannot see. We present SadakVision, a road-monitoring system that fuses targeted video capture with smartphone inertial sensors. A circular buffer is written to disk only when a sensor model flags an anomaly, producing a 7-second smart clip and cutting device writes by 70.5% while avoiding thermal throttling. We annotated 7,139 Indian road images to fine-tune a YOLOv8 detector, and combine its output with a sensor-based impact severity score. The app, backend, and dashboard are available at sadakvision.com.",
  keywords: [
    "road damage detection",
    "sensor–vision fusion",
    "smartphone sensing",
    "YOLOv8",
    "pothole detection",
    "trigger-based recording",
    "deep learning",
  ],
  contributions: [
    "Trigger-based circular-buffer recording that cuts writes and thermal load on phones.",
    "A perception pipeline that pairs visual damage detection with accelerometer and gyroscope severity.",
    "An annotated dataset of Indian road images collected across Chandigarh and Punjab.",
    "A production AWS system with an Android app and a municipal web dashboard.",
  ],
  links: [{ label: "sadakvision.com", url: "https://sadakvision.com" }],
} as const;
