export type Project = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl?: string;
  featured: boolean;
  category: string;
  status: string;
  features: string[];
  challenges: string[];
  whatILearned: string[];
  accent: string;
};

export const profile = {
  name: "Nikhil Raj",
  role: "Computer Science Engineer | AI & Data Science | Builder",
  intro:
    "I build intelligent systems, software products and data-driven applications that turn complex ideas into useful technology.",
  currentStatus: "3rd Year",
  institute: "IIIT Manipur",
  degree: "B.Tech Computer Science and Engineering",
  specialization: "Artificial Intelligence and Data Science",
  about:
    "I am a third-year engineering student focused on building practical AI, data-driven products, and performance-focused software systems. My work balances technical depth with product thinking, and I enjoy turning complex problems into working, scalable systems.",
  currentFocus:
    "I am actively building projects around AI workflows, data pipelines, and production-oriented software with an emphasis on real-world problem solving.",
};

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const skillGroups = [
  {
    title: "Programming",
    items: ["C++", "Python", "JavaScript", "TypeScript"],
  },
  {
    title: "AI / ML / Data Science",
    items: ["NumPy", "Pandas", "Scikit-learn", "PyTorch", "OpenCV", "Matplotlib", "Plotly"],
  },
  {
    title: "Development",
    items: ["React", "Next.js", "Node.js", "REST APIs", "Git", "GitHub"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MySQL", "SQLite"],
  },
  {
    title: "Tools",
    items: ["VS Code", "Git", "GitHub", "CMake", "Linux/Windows development environments"],
  },
];

export const projects: Project[] = [
  {
    title: "Quant-X",
    slug: "quant-x",
    imageUrl: "/images/Nikhil%20Raj%E2%80%99s%20Quant-X%20Portfolio.png",
    shortDescription:
      "Production-oriented C++ trading engine focused on matching and market data workflows.",
    description:
      "A performance-driven system designed around order matching, real-time market behavior, and low-level engineering fundamentals.",
    problem:
      "High-frequency trading and matching systems require accurate order processing with minimal latency and robust data handling.",
    solution:
      "Quant-X models a matching engine and order book using data structures and C++ for scalable, deterministic processing.",
    architecture:
      "A layered architecture with order ingestion, matching logic, market data management, and clean service boundaries designed for system-level clarity.",
    technologies: ["C++", "CMake", "Data Structures", "Order Book", "Matching Engine", "Market Data"],
    githubUrl: "https://github.com/nikh240103026-debug/QuantX",
    liveUrl: "#",
    featured: true,
    category: "Systems / Quant",
    status: "In development",
    features: [
      "Order book simulation",
      "Matching engine workflow",
      "Market data handling",
      "Low-latency software patterns",
    ],
    challenges: [
      "Designing deterministic matching logic",
      "Balancing performance and readability",
      "Reasoning about edge-case trade flow",
    ],
    whatILearned: [
      "Low-level systems thinking",
      "Data-structure driven problem solving",
      "Production-minded performance engineering",
    ],
    accent: "from-cyan-500/25 via-sky-500/10 to-transparent",
  },
  {
    title: "QuantumLearn AI",
    slug: "quantum-learning-ai",
    imageUrl: "/images/Screenshot%202026-10-01%20225953.png",
    shortDescription:
      "AI-powered educational platform for quantum computing concepts and interactive learning.",
    description:
      "An educational experience combining AI explanations, practice workflows, and guided learning around quantum computing concepts.",
    problem:
      "Quantum computing education is often abstract and difficult for learners to engage with in a practical way.",
    solution:
      "The platform uses guided explanations, learning pathways, and practice features to make quantum topics more accessible and interactive.",
    architecture:
      "Content-driven learning system with user interactions, AI explanations, and modular practice flow built for educational clarity.",
    technologies: ["Next.js", "TypeScript", "AI", "Education UX", "Python", "Data Visualization"],
    githubUrl: "[ADD GITHUB URL]",
    liveUrl: "#",
    featured: true,
    category: "AI / Education",
    status: "Prototype",
    features: [
      "Interactive learning modules",
      "AI explanations",
      "Personalized learning flow",
      "Quantum circuit experimentation",
    ],
    challenges: [
      "Simplifying complex quantum explanations",
      "Structuring educational content clearly",
      "Designing useful practice loops",
    ],
    whatILearned: [
      "Product-minded learning design",
      "AI-assisted educational UX",
      "Combining technical depth with usability",
    ],
    accent: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
  },
  {
    title: "Fraud Transaction Detection",
    slug: "fraud-detection",
    imageUrl: "/images/Banking%20Fraud%20Detection%20Showcase.png",
    shortDescription:
      "Machine learning system for identifying suspicious or fraudulent financial transactions.",
    description:
      "A classification-focused project designed to detect anomalous patterns in financial data and surface risk signals early.",
    problem:
      "Financial fraud detection depends on identifying subtle, rare anomalies in large transaction datasets.",
    solution:
      "This project combines data preprocessing, feature engineering, and ML classification to separate legitimate and suspicious behavior.",
    architecture:
      "A structured ML pipeline from data ingestion through feature selection, model training, validation, and insight visualization.",
    technologies: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "ML", "Feature Engineering"],
    githubUrl: "[ADD GITHUB URL]",
    liveUrl: "#",
    featured: true,
    category: "AI / Data Science",
    status: "Research prototype",
    features: [
      "Anomaly detection flow",
      "Feature engineering",
      "Model evaluation",
      "Risk signal visualization",
    ],
    challenges: [
      "Handling imbalanced class data",
      "Choosing meaningful features",
      "Interpreting model behavior",
    ],
    whatILearned: [
      "ML pipeline design",
      "Data quality and model interpretation",
      "Risk-based analytics thinking",
    ],
    accent: "from-rose-500/20 via-red-500/10 to-transparent",
  },
  {
    title: "Customer Segmentation System",
    slug: "customer-segmentation-system",
    shortDescription:
      "Data science project for grouping customers based on behavior and demographic characteristics.",
    description:
      "A segmentation-driven analytics project focused on turning customer data into meaningful clusters and business insights.",
    problem:
      "Businesses need actionable customer groups to target campaigns and improve retention strategies.",
    solution:
      "The project applies clustering and exploratory data analysis to segment users into distinct, interpretable groups.",
    architecture:
      "A data analysis pipeline covering preprocessing, feature scaling, clustering, and result interpretation for decision support.",
    technologies: ["Python", "Pandas", "NumPy", "Scikit-learn", "Plotly", "Data Analysis"],
    githubUrl: "[ADD GITHUB URL]",
    liveUrl: "#",
    featured: false,
    category: "Data Science",
    status: "Completed",
    features: [
      "Customer clustering",
      "Behavioral profiling",
      "Data visualization",
      "Buyer segmentation insight",
    ],
    challenges: [
      "Choosing segmentation strategy",
      "Validating cluster quality",
      "Making output interpretable",
    ],
    whatILearned: [
      "Practical unsupervised learning",
      "Insight-driven analytics",
      "Visualization as communication",
    ],
    accent: "from-amber-500/20 via-yellow-500/10 to-transparent",
  },
  {
    title: "Loan Prediction",
    slug: "loan-prediction",
    shortDescription:
      "Machine learning application for predicting loan approval outcomes based on applicant attributes.",
    description:
      "A supervised learning project designed to predict creditworthiness and provide a structured decision support workflow.",
    problem:
      "Loan approval decisions involve multiple risk factors and require data-driven support to reduce uncertainty.",
    solution:
      "The project builds a classification model using applicant data and evaluates performance for a practical business scenario.",
    architecture:
      "Pipeline-driven ML workflow with cleaning, encoding, model selection, evaluation, and feature importance analysis.",
    technologies: ["Python", "Scikit-learn", "Pandas", "Feature Engineering", "Classification"],
    githubUrl: "[ADD GITHUB URL]",
    liveUrl: "#",
    featured: false,
    category: "Machine Learning",
    status: "Completed",
    features: [
      "Risk classification",
      "Model comparison",
      "Feature analysis",
      "Decision-support output",
    ],
    challenges: [
      "Handling mixed data types",
      "Balancing explainability and accuracy",
      "Understanding model trade-offs",
    ],
    whatILearned: [
      "Model selection for business use cases",
      "Transparent evaluation metrics",
      "Feature importance interpretation",
    ],
    accent: "from-emerald-500/20 via-green-500/10 to-transparent",
  },
  {
    title: "Credit Default Risk",
    slug: "credit-default-risk",
    shortDescription:
      "Risk modeling project focused on evaluating default probability and borrower risk signals.",
    description:
      "A credit risk project centered on building analytical workflows and prediction models for borrower evaluation.",
    problem:
      "Credit risk assessment depends on understanding borrower behavior and risk exposure from historical data.",
    solution:
      "This project focuses on building risk profiles using structured data and classification techniques for practical evaluation.",
    architecture:
      "An analytical pipeline covering preprocessing, modeling, and interpretation for lending risk classification.",
    technologies: ["Python", "Pandas", "Scikit-learn", "Imbalanced Data", "Risk Analytics"],
    githubUrl: "[ADD GITHUB URL]",
    liveUrl: "#",
    featured: false,
    category: "AI / Finance",
    status: "Completed",
    features: [
      "Risk scoring",
      "Classification model",
      "Feature evaluation",
      "Decision insight",
    ],
    challenges: [
      "Dealing with class imbalance",
      "Selecting relevant variables",
      "Model optimization under business constraints",
    ],
    whatILearned: [
      "Finance-oriented data thinking",
      "Modeling under uncertainty",
      "Risk metrics interpretation",
    ],
    accent: "from-indigo-500/20 via-blue-500/10 to-transparent",
  },
  {
    title: "Titanic Survival Predictor",
    slug: "titanic-survival-predictor",
    shortDescription:
      "Classification project for predicting survival outcomes from historical Titanic data.",
    description:
      "A classic data science classification problem used to sharpen feature handling, evaluation, and model interpretation.",
    problem:
      "Historical passenger data contains patterns that reveal survival likelihood, but the relationships are mixed and noisy.",
    solution:
      "The project uses supervised learning and data preprocessing to build a reliable predictive model from the dataset.",
    architecture:
      "A compact data science workflow with cleaning, feature engineering, model training, and performance comparison.",
    technologies: ["Python", "Pandas", "Scikit-learn", "Classification", "Data Cleaning"],
    githubUrl: "[ADD GITHUB URL]",
    liveUrl: "#",
    featured: false,
    category: "Machine Learning",
    status: "Completed",
    features: [
      "Survival probability model",
      "Model comparison",
      "Feature analysis",
      "Clear performance metrics",
    ],
    challenges: [
      "Missing value handling",
      "Feature selection",
      "Comparing model quality",
    ],
    whatILearned: [
      "Core ML fundamentals",
      "Data cleaning discipline",
      "Accessible model evaluation",
    ],
    accent: "from-slate-500/20 via-zinc-500/10 to-transparent",
  },
];

export const experience = [
  {
    period: "1st Year",
    title: "Foundation",
    description:
      "Built my foundation in programming, problem solving, and core computing concepts while developing curiosity in software and AI.",
  },
  {
    period: "2nd Year",
    title: "DSA / Development / AI",
    description:
      "Focused on data structures, software engineering basics, web development, and early AI/data science exploration.",
  },
  {
    period: "3rd Year",
    title: "AI / Data Science / Systems / Product Development",
    description:
      "Working on deeper technical projects across AI, ML, systems thinking, and product-oriented software development.",
  },
];

export const achievements = [
  {
    title: "[ADD YOUR ACHIEVEMENT]",
    organization: "[ADD ORGANIZATION]",
    date: "[ADD DATE]",
    description: "[ADD DESCRIPTION]",
    link: "[ADD LINK]",
  },
  {
    title: "[ADD YOUR ACHIEVEMENT]",
    organization: "[ADD ORGANIZATION]",
    date: "[ADD DATE]",
    description: "[ADD DESCRIPTION]",
    link: "[ADD LINK]",
  },
  {
    title: "[ADD YOUR ACHIEVEMENT]",
    organization: "[ADD ORGANIZATION]",
    date: "[ADD DATE]",
    description: "[ADD DESCRIPTION]",
    link: "[ADD LINK]",
  },
];

export const certifications = [
  {
    title: "[ADD YOUR CERTIFICATION]",
    issuer: "[ADD ISSUER]",
    date: "[ADD DATE]",
    credentialId: "[ADD CREDENTIAL ID]",
    credentialUrl: "[ADD URL]",
    certificateImage: "/images/certificate-placeholder.svg",
  },
  {
    title: "[ADD YOUR CERTIFICATION]",
    issuer: "[ADD ISSUER]",
    date: "[ADD DATE]",
    credentialId: "[ADD CREDENTIAL ID]",
    credentialUrl: "[ADD URL]",
    certificateImage: "/images/certificate-placeholder.svg",
  },
  {
    title: "[ADD YOUR CERTIFICATION]",
    issuer: "[ADD ISSUER]",
    date: "[ADD DATE]",
    credentialId: "[ADD CREDENTIAL ID]",
    credentialUrl: "[ADD URL]",
    certificateImage: "/images/certificate-placeholder.svg",
  },
];

export const suggestedPrompts = [
  "Who is Nikhil?",
  "Show me his projects",
  "What is Quant-X?",
  "What technologies does he use?",
  "How can I contact him?",
];

export const educationCourses = [
  "Data Structures & Algorithms",
  "Design & Analysis of Algorithms",
  "Operating Systems",
  "Computer Networks",
  "Computer Organization",
  "Database Systems",
  "Probability & Statistics",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
];
