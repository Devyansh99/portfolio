export type ProjectLink = { label: string; url: string };

export type Project = {
  id: string;
  title: string;
  kicker: string;
  period: string;
  status: "live" | "private" | "in progress" | "academic";
  summary: string;
  what: string;
  does: string[];
  how: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: "sadakvision",
    title: "SadakVision",
    kicker: "Road monitoring with a smartphone",
    period: "Jan 2025 – Present",
    status: "live",
    summary:
      "A product that turns an ordinary smartphone on a car's windshield into a road inspector. It records only when the road gets rough, and shows cities where the worst damage is.",
    what: "SadakVision is a smartphone-based system for finding potholes and other road damage, built for Indian roads.",
    does: [
      "A driver mounts a phone on the windshield and taps once to start. From then on the app runs quietly in the background, with nothing to look at and nothing to tap.",
      "When the car hits something rough, the app saves a short clip of the road from just before the bump, along with the motion data and the GPS location. Everything else is thrown away, so the phone doesn't overheat or fill up with video.",
      "In the cloud, each clip is checked for visible damage and rated for how hard the impact was. The results land on a web dashboard where a city can see damage on a map, filter it by date and severity, and estimate what a repair would cost.",
    ],
    how: "Motion sensors decide when something is worth recording, and a vision model decides what the camera saw. Using both avoids the usual false alarms: a speed bump shakes the phone but isn't a pothole, and a dark patch looks like one but doesn't shake anything.",
    stack: ["YOLOv8", "Prophet", "AWS", "PostgreSQL", "Android", "TypeScript"],
    metrics: [
      { value: "74.2%", label: "mAP@0.5" },
      { value: "86.1%", label: "precision" },
      { value: "82.3%", label: "trigger recall" },
      { value: "70.5%", label: "fewer writes" },
    ],
    links: [
      { label: "sadakvision.com", url: "https://sadakvision.com" },
      {
        label: "github",
        url: "https://github.com/Dynamic-Road-Monitoring-and-Safety-Proj",
      },
      {
        label: "dashboard repo",
        url: "https://github.com/Devyansh99/road-quality-monitoring-dashboard",
      },
    ],
  },
  {
    id: "cognalytix",
    title: "Cognalytix",
    kicker: "Analytics without writing code for every step",
    period: "2026 – Present",
    status: "in progress",
    summary:
      "A workspace for people who don't want to write code for every step. Upload a spreadsheet, explore it, ask questions, train models, and talk to an assistant that knows your data.",
    what: "Cognalytix is a workspace for working with spreadsheet data without writing code for every step.",
    does: [
      "You upload a CSV or Excel file. The original is kept read-only and you work on a copy, so you can always restore it. Cognalytix profiles every column automatically, with missing values and charts.",
      "When you want answers, there is an SQL shell that runs on your data, and a Python notebook for anything SQL can't do. ML Studio lets you pick features and a model, tune it, and see training and test scores side by side, without writing training code.",
      "An assistant, in text or live voice, knows the dataset. It can open pages, run queries and plan multi-step work. Anything risky, like writing data or running code, waits for your approval.",
    ],
    how: "The idea behind it is that nothing happens in a hidden background. Every AI action lands on a real page with the results visible, and each dataset keeps its own chat memory. It is built with React and FastAPI, uses Gemini for the assistant and the voice, and runs on SQLite locally with Postgres planned for deployment.",
    stack: ["React 19", "FastAPI", "SQLite", "Postgres", "Gemini", "Voice"],
    metrics: [],
    links: [],
  },
  {
    id: "acadika",
    title: "Acadika",
    kicker: "An AI learning platform for schools",
    period: "Dec 2025 – May 2026",
    status: "private",
    summary:
      "A school platform with an AI assistant that stays inside the NCERT curriculum. It answers from the textbooks, helps with academic work, and can be driven by voice.",
    what: "Acadika is a platform for schools with an AI assistant that sticks to the curriculum.",
    does: [
      "Students and teachers ask questions and get answers taken from NCERT textbooks, with the source passage and the textbook images shown alongside, so an answer can be checked rather than just trusted.",
      "The assistant can also automate academic workflows and personalise learning, and a voice agent lets people move around the app by speaking.",
      "Schools get admin dashboards for analytics, compliance and user management.",
    ],
    how: "It uses retrieval-augmented generation. Textbook content is indexed in Weaviate and retrieved by meaning, and an agent built with LangChain uses what it finds to answer. The platform itself is a FastAPI and React web app.",
    stack: ["LangChain", "Weaviate", "RAG", "FastAPI", "React"],
    metrics: [],
    links: [{ label: "acadika.com", url: "https://acadika.com" }],
  },
  {
    id: "higan",
    title: "HIGAN",
    kicker: "Handwriting autocomplete",
    period: "Sep 2025 – Dec 2025",
    status: "academic",
    summary:
      "A handwriting autocomplete system. It reads what you have written, predicts the next words, and writes them back in your own handwriting.",
    what: "HIGAN imitates handwriting. Given a sample of someone's writing, it can continue a sentence in the same style.",
    does: [
      "It reads the handwriting you give it, works out what the text says, predicts how the sentence continues, and then draws the continuation in the same style.",
      "It was trained on 657 different writers, and it can imitate a style it did not see during training, from a sample.",
    ],
    how: "Three models work together. An OCR model (a CRNN) reads the text, a language model (GPT-2) predicts what comes next, and a GAN with a transformer generates the handwriting. The generator is trained so that what is written and how it looks stay separate, which is what makes imitating a new style possible. The whole thing runs end to end in about 1.2 seconds.",
    stack: ["PyTorch", "GAN", "Transformers", "CRNN", "GPT-2"],
    metrics: [
      { value: "4.36", label: "FID" },
      { value: "0.65%", label: "CER" },
      { value: "2.48%", label: "WER" },
      { value: "~1.2s", label: "inference" },
    ],
    links: [
      {
        label: "github",
        url: "https://github.com/akshat3144/handwriting_autocomplete_system",
      },
    ],
  },
  {
    id: "adaptivebandit",
    title: "AdaptiveBandit",
    kicker: "Teaching software to handle support chats",
    period: "2026",
    status: "academic",
    summary:
      "Reinforcement learning for customer-service chats. An agent learns when to ask for information, calm a frustrated customer, offer a fix, or hand over to a human.",
    what: "AdaptiveBandit asks how a support agent should decide what to do next in a conversation, and lets software learn the answer.",
    does: [
      "It uses a simulator of multi-turn support chats built on the ABCD dataset of 10,000 customer service dialogues. At each turn the agent picks one of five actions: ask for information, propose a solution, repair the customer's mood, escalate, or close.",
      "The reward reflects real cost: the risk that the customer leaves, weighted by how valuable that customer is. A frustrated customer who is not helped costs more than one who is resolved quickly.",
      "It compares three approaches: contextual bandits, a numerical reinforcement-learning agent, and the same agent with an LLM (a fine-tuned Qwen 2.5 7B) writing the customer's replies.",
    ],
    how: "The trained agent learned to escalate only when frustration is high and fixes have failed, not on fresh conversations, and in evaluation it beat the best rule-based baseline. Training uses PPO with curriculum learning, reward shaping and action masking.",
    stack: ["PyTorch", "Stable-Baselines3", "Gymnasium", "FAISS", "Qwen 2.5"],
    metrics: [
      { value: "+0.56", label: "mean reward" },
      { value: "50.5%", label: "resolution" },
      { value: "+0.47", label: "best baseline" },
    ],
    links: [
      {
        label: "repo",
        url: "https://github.com/asp616848/AdaptiveBandit--Contextual-Bandits-for-Real-Time-Decision-Support-in-Customer-Service",
      },
    ],
  },
  {
    id: "glioblastoma",
    title: "Glioblastoma Survival",
    kicker: "Predicting survival from scans and records",
    period: "Feb 2025 – May 2025",
    status: "academic",
    summary:
      "A model that predicts survival for glioblastoma patients by combining clinical records with brain imaging, even when one of the two is missing.",
    what: "Glioblastoma is an aggressive brain tumour. This project predicts how long a patient is likely to survive.",
    does: [
      "It uses data from 620 patients in the TCGA-GBM collection and combines their clinical information with features taken from brain imaging.",
      "Real medical data is often incomplete, so the pipeline is built to cope with patients who are missing one kind of data.",
      "It also explains itself: SHAP shows which factors drive each prediction, which points toward biomarkers that matter for prognosis.",
    ],
    how: "A stacking classifier combines random forest, XGBoost and SVM models, with a random forest on top. Tumour regions are segmented with CaPTk, features are reduced with LDA, and hyperparameters are tuned with Optuna.",
    stack: ["Scikit-learn", "XGBoost", "Optuna", "SHAP", "CaPTk"],
    metrics: [
      { value: "98%", label: "accuracy" },
      { value: "0.85", label: "C-index" },
      { value: "620", label: "patients" },
    ],
    links: [
      {
        label: "repo",
        url: "https://github.com/Devyansh99/Glioblastoma-ML-model",
      },
    ],
  },
  {
    id: "digital-dorm-war",
    title: "Digital Dorm War II",
    kicker: "A secure campus network",
    period: "Apr 2025",
    status: "academic",
    summary:
      "A secure campus network designed and simulated in Cisco Packet Tracer: three buildings, a firewall with a DMZ, routing, access rules and public servers.",
    what: "A networking course project at Plaksha: restore and secure a campus network that a fictional attacker has disrupted.",
    does: [
      "The campus is split into separate networks, so students, staff and finance do not share one. A firewall guards the edge, with a DMZ for the public web, FTP and mail servers.",
      "Routing protocols link the buildings, with route redistribution where they differ. Access lists limit who can reach what: only the tech team reaches FTP, students cannot reach finance, and the library can send mail only during set hours.",
      "Port security guards against MAC flooding and spoofing, and static NAT exposes the DMZ servers to the outside.",
    ],
    how: "Everything was built and tested in Cisco Packet Tracer for the Computer Networks course.",
    stack: ["Cisco Packet Tracer", "OSPF", "EIGRP", "VLAN", "ACL", "NAT"],
    metrics: [],
    links: [
      {
        label: "repo",
        url: "https://github.com/Devyansh99/digital-dorm-war",
      },
    ],
  },
];
