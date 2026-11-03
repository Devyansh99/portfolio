export const skillGroups = [
  {
    command: "languages --db",
    items: ["Python", "C++", "SQL", "TypeScript"],
  },
  {
    command: "ai --ml",
    items: [
      "Machine Learning",
      "Deep Learning",
      "Transformers",
      "RAG",
      "LLMs",
      "AI Agents",
      "Reinforcement Learning",
      "Data Analysis",
    ],
  },
  {
    command: "frameworks --tools",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "LangChain",
      "LangGraph",
      "FastAPI",
      "Docker",
      "AWS",
      "Git",
    ],
  },
  {
    command: "web --apis",
    items: ["React", "TypeScript", "REST APIs"],
  },
] as const;
