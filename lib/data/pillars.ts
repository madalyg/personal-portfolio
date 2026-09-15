export interface Pillar {
  index: string;
  title: string;
  description: string;
  skills: string[];
  icon: "code" | "atom" | "cpu";
}

export const pillars: Pillar[] = [
  {
    index: "01",
    title: "Software Engineering & Embedded Systems",
    description:
      "Over two years building consumer-facing and internal software on the Internet-of-Things team at T-Mobile: the full lifecycle, from architecture and algorithm design to CI/CD deployment.",
    skills: [
      "Python / Java / TypeScript / C++",
      "AWS · PostgreSQL · Node.js · Flask",
      "Data Engineering · API Development",
      "React Native · Cross-Platform Apps",
      "Git / GitHub / Jira Workflows",
      "AI & Machine Learning Integration"
    ],
    icon: "code",
  },
  {
    index: "02",
    title: "Computational Physics",
    description:
      "Physics research applying machine learning and numerical methods to astrophysics and optical sensor data, from supermassive black holes to orbital mechanics.",
    skills: [
      "Monte Carlo Analysis",
      "Signal Processing (FFT, Denoising)",
      "Convolutional Autoencoders",
      "NumPy / SciPy / Pandas",
      "Machine Learning (PyTorch, Scikit-learn, TensorFlow)",
    ],
    icon: "atom",
  },
  {
    index: "03",
    title: "Electrical & Hardware Systems",
    description:
      "Hands-on hardware design, from a custom designed cloud chamber to laser optics experiments — combining circuits, sensors, and data into complete physical systems.",
    skills: [
      "Electrical / Hardware Interfacing",
      "Microcontrollers",
      "Optical Sensors",
      "CAD (Fusion 360) · 3D Printing",
      "Laser Optics Experiments",
      "End-to-End System Design",
    ],
    icon: "cpu",
  },
];
