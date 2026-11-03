export type ProjectLink = { label: string; url: string };

export type Project = {
  id: string;
  title: string;
  kicker: string;
  period: string;
  status: "live" | "private" | "in progress" | "academic";
  summary: string;
  highlights: string[];
  stack: string[];
  metrics: { value: string; label: string }[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: "sadakvision",
    title: "SadakVision",
    kicker: "Sensor–vision fusion for road monitoring",
    period: "Jan 2025 – Present",
    status: "live",
    summary:
      "Smartphone road-damage monitoring that records video only when the accelerometer says a pothole is near, then fuses vision and impact severity in the cloud.",
    highlights: [
      "Prophet-based anomaly trigger on 100 Hz accelerometer, gyroscope, and GPS data, with low / medium / high severity scoring.",
      "AWS backend for sensor-triggered recording: 70.5% fewer phone writes, thermal-throttle time extended from 32 min to 2.5 hrs, vision inference reduced by 89.3%.",
      "Fine-tuned YOLOv8m on a 21K+ image Indian road dataset (7K manually collected and labeled) across potholes, cracks, manholes, and garbage.",
    ],
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
        label: "dashboard repo",
        url: "https://github.com/Devyansh99/road-quality-monitoring-dashboard",
      },
    ],
  },
  {
    id: "cognalytix",
    title: "Cognalytix",
    kicker: "No-code analytics workspace with an AI copilot",
    period: "2026 – Present",
    status: "in progress",
    summary:
      "Upload a CSV or XLSX and look, ask, predict, and talk to your data. Every AI action lands on a real page with visible results, and risky actions wait for approval.",
    highlights: [
      "Look: automatic column profiling, missing values, and charts. The original file stays read-only; you work on a copy.",
      "Ask: an SQL shell plus a Python notebook. Predict: ML Studio with feature and model selection, tuning, and train vs test scores.",
      "Talk: a text and live-voice assistant that knows the dataset, opens pages, runs queries, and plans multi-step work. Per-dataset chat memory.",
    ],
    stack: ["React 19", "FastAPI", "SQLite", "Postgres", "Gemini", "Voice"],
    metrics: [],
    links: [],
  },
  {
    id: "acadika",
    title: "Acadika",
    kicker: "Curriculum-aligned AI learning platform",
    period: "Dec 2025 – May 2026",
    status: "private",
    summary:
      "An agentic AI assistant for schools: personalized learning, academic workflow automation, and in-app voice navigation, grounded in NCERT textbooks.",
    highlights: [
      "Agentic assistant built on LangChain orchestration, with a voice-based navigation agent.",
      "NCERT-focused RAG pipeline on Weaviate with semantic retrieval and source-backed answers, including images from the textbook.",
      "FastAPI + React school SaaS with admin dashboards for analytics, compliance, and user management.",
    ],
    stack: ["LangChain", "Weaviate", "RAG", "FastAPI", "React"],
    metrics: [],
    links: [{ label: "acadika.com", url: "https://acadika.com" }],
  },
  {
    id: "higan",
    title: "HIGAN",
    kicker: "Handwriting imitation and autocomplete",
    period: "Sep 2025 – Dec 2025",
    status: "academic",
    summary:
      "A multi-stage pipeline that reads handwriting, predicts what comes next, and writes it back in the same style, including for writers it has never seen.",
    highlights: [
      "CRNN-based OCR, GPT-2 contextual language modeling, and a transformer-enhanced GAN for style-conditioned text synthesis across 657 writer identities.",
      "Multi-loss training with contrastive style disentanglement, enabling zero-shot style transfer.",
      "Beats IAM benchmarks with FID 4.36, CER 0.65%, WER 2.48%, at about 1.2 s end-to-end inference.",
    ],
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
    kicker: "RL for real-time customer-service decisions",
    period: "2026",
    status: "academic",
    summary:
      "Three RL approaches on a multi-turn support simulator grounded in the ABCD dataset: contextual bandits, numerical PPO, and PPO with an LLM writing customer replies.",
    highlights: [
      "Bandit benchmark of LinUCB, Linear Thompson Sampling, and epsilon-greedy, plus a hybrid with a document-guided policy.",
      "PPO with curriculum learning, potential-based reward shaping, and action masking over a 5-action MDP with a churn-risk reward model.",
      "LLM-augmented variant: fine-tuned Qwen 2.5 7B generates customer utterances that drive the environment's frustration dynamics.",
    ],
    stack: ["PyTorch", "Stable-Baselines3", "Gymnasium", "FAISS", "Qwen 2.5"],
    metrics: [
      { value: "+0.56", label: "mean reward" },
      { value: "50.5%", label: "resolution" },
      { value: "+0.47", label: "best baseline" },
    ],
    links: [
      {
        label: "repo",
        url: "https://github.com/Devyansh99/lab3-contextual-bandit",
      },
    ],
  },
  {
    id: "glioblastoma",
    title: "Glioblastoma Survival",
    kicker: "Multi-view learning on TCGA-GBM",
    period: "Feb 2025 – May 2025",
    status: "academic",
    summary:
      "A multimodal survival prediction system that combines clinical and imaging features and copes with missing modalities.",
    highlights: [
      "Stacking classifier with a random-forest meta-model over RF, XGBoost, and SVM base learners on 620 patients.",
      "LDA dimensionality reduction, Optuna tuning, and SHAP explainability to surface prognostic biomarkers.",
      "Pipeline handles missing modalities with SMOTE, CaPTk tumor segmentation, and feature selection.",
    ],
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
    kicker: "Secure campus network in Cisco Packet Tracer",
    period: "Apr 2025",
    status: "academic",
    summary:
      "Restore and harden a campus network under attack: segmentation, perimeter firewall with a DMZ, dynamic routing, ACLs, NAT, and mail, FTP, and web servers.",
    highlights: [
      "VLAN segmentation across three buildings with trunking and a layer-3 core switch.",
      "Three-interface firewall with a DMZ, static NAT for web, FTP, and mail servers, and route redistribution between routing protocols.",
      "Role-based and time-based ACLs plus port security against MAC flooding and spoofing.",
    ],
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
