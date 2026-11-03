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
  plain: [
    {
      label: "The problem",
      text: "India has the world's largest road network, and potholes damage vehicles and cause accidents. Checking roads by hand is slow, and survey vehicles with laser scanners cost around $10,000 each. Phones are everywhere, but running a camera and a vision model all the time overheats them.",
    },
    {
      label: "The idea",
      text: "Don't watch the road all the time. Let the phone's motion sensors decide when something is worth looking at. A rolling video buffer sits in memory, and only when the sensors flag a bump is the footage from just before it saved as a short clip.",
    },
    {
      label: "What it gives",
      text: "Phones write far less data and stay cool for hours instead of minutes. Each saved clip is checked for visible damage and paired with how hard the impact was, which gives a geo-tagged report that neither a camera nor a motion sensor could produce alone.",
    },
  ],
  pipeline: [
    {
      step: "Phone sensors",
      text: "Accelerometer and gyroscope are sampled 100 times a second while a rolling video buffer runs in memory.",
    },
    {
      step: "Trigger",
      text: "A model flags readings that fall outside what is normal for that road and speed.",
    },
    {
      step: "7-second clip",
      text: "Only then is the video from just before the bump saved, with the sensor data and GPS location.",
    },
    {
      step: "Cloud",
      text: "The clip uploads to AWS, where frames are pulled out and checked for damage.",
    },
    {
      step: "Fusion",
      text: "The vision result and the impact severity are combined into one geo-tagged report.",
    },
    {
      step: "Dashboard",
      text: "A map where a city can see, filter and prioritise repairs.",
    },
  ],
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
  links: [{ label: "sadakvision.com", url: "https://sadakvision.com" }],
} as const;
