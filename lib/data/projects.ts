import { Project, ProjectCategorySlug } from "@/lib/types";

export const projects: Project[] = [
  // ---------- Software Engineering (T-Mobile, 2020–2023) ----------
  {
    slug: "tmo-go-iot-bike-security",
    title: "T-Mo Go — IoT Bike Security & Tracking",
    categories: ["software-engineering"],
    summary:
      "Lead backend developer for a T-Mobile DevEdge hackathon build: a geofenced anti-theft system that flags a bike as stolen the instant it leaves a locked zone, streams live location to a companion iOS app, and fires an automated SMS alert to the rider.",
    stack: [
      "Python",
      "AWS Lambda",
      "DynamoDB",
      "Serverless Framework",
      "Twilio",
      "Bluetooth",
    ],
    tags: ["Full-Stack", "IoT"],
    date: "2022-06-01",
    classified: true,
  },
  {
    slug: "iot-telemetry-health-probe",
    title: "IoT Telemetry Health Probe",
    categories: ["software-engineering"],
    summary:
      "A diagnostic web tool that decodes raw hex-string UDP payloads from field devices into readable telemetry — temperature, battery level, speed, status — and surfaces live service health, cutting down the team's manual testing time.",
    stack: ["JavaScript", "Python", "UDP", "REST"],
    tags: ["Backend", "Developer Tools"],
    date: "2020-11-01",
    classified: true,
  },
  {
    slug: "smart-home-device-control-app",
    title: "Smart Home Device Control App",
    categories: ["software-engineering"],
    summary:
      "React Native front-end for controlling mock smart-home devices — locks, bulbs — over a shared IoT API, with animated on/off interactions and live device state fetched on mount.",
    stack: ["React Native", "JavaScript", "REST API"],
    tags: ["Full-Stack", "Mobile"],
    date: "2021-06-01",
    classified: true,
  },
  {
    slug: "wifi-significant-location-classifier",
    title: "Significant-Location Classifier from Wi-Fi Scans",
    categories: ["software-engineering"],
    summary:
      "Prototyped a way to infer whether a scanned Wi-Fi network corresponds to home, work, or school by clustering visit frequency and time-of-day patterns — aimed at reducing noisy location pings without extra user input.",
    stack: ["Python", "Clustering", "Decision Trees", "Pandas"],
    tags: ["Data", "Machine Learning"],
    date: "2022-08-01",
    classified: true,
  },
  {
    slug: "timeslice-ai-scheduling-app",
    title: "TimeSlice — AI Daily Planning Assistant",
    categories: ["software-engineering"],
    summary:
      "Built overnight at TechTogether Seattle: a mobile app that slices the day into 'time blocks' and uses machine learning to learn routine patterns, suggest Pomodoro-style breaks, and auto-reschedule the rest of the day when a task runs long. Won the 'Planting the Seed for Growth' award.",
    stack: [
      "Python",
      "Flask",
      "SQLAlchemy",
      "FlutterFlow",
      "JavaScript",
      "Figma",
      "Azure",
    ],
    tags: ["AI", "Full-Stack", "Mobile", "Data"],
    date: "2023-05-14",
    links: {
      repo: "https://github.com/madalyg/TimeSlice",
      writeup: "https://devpost.com/software/timeslice",
    },
  },
  {
    slug: "synapse-ai-task-prioritization",
    title: "Synapse — AI-Powered Automatic Task Prioritization",
    categories: ["software-engineering"],
    summary:
      "A web app that bridges daily to-do lists and long-term goals: tasks pulled from Google Calendar/Tasks are auto-scored on urgency and goal-alignment, plotted on a live Eisenhower Matrix, and paired with a Groq-powered AI coach that flags misaligned tasks and suggests schedule adjustments.",
    stack: [
      "React",
      "Groq API",
      "Google Calendar API",
      "Google Tasks API",
      "Vercel",
    ],
    tags: ["AI", "Full-Stack", "Mobile", "Data"],
    date: "2026-04-25",
    links: {
      repo: "https://github.com/madalyg/Synapse3",
      demo: "https://synapse3-topaz.vercel.app",
    },
  },
  {
    slug: "rocket-operation-gnc-sim",
    title: "Rocket Operation GNC Sim",
    categories: ["software-engineering", "computational-physics"],
    summary:
      "Designing a C++ foundation for simulating rocket flight dynamics using custom 3D vector mathematics, including position, gravity, forces, and navigation-related calculations.",
    stack: ["C++", "Vector3D", "Docker"],
    tags: ["Physics Simulation", "Numerical Methods", "GNC"],
    date: "2026-09-01",
    ongoing: true,
    links: {
      repo: "https://github.com/madalyg/rocket_operation_sim",
    },
  },

  {
    slug: "grand-pre-crop-planning-system",
    title:
      "Grand Pré, Les 3 Jardins — Crop Planning & Resource Allocation System",
    categories: ["software-engineering"],
    summary:
      "In rural France I designed a custom Excel-based crop management system for a working farm's greenhouse: a color-coded grid modeling every planting bed by crop category (leaf, root, fruit, aromatic) and status (seeded, planted, completed) to optimize planting schedules, yield tracking, and resource allocation across dozens of concurrent rotations.",
    stack: ["Microsoft Excel", "Conditional Formatting", "Data Modeling"],
    tags: ["Volunteer", "Data", "Systems Design"],
    date: "2022-09-01",
    image: "/projects/grand-pre-crop-plan.jpg",
    imageWidth: 1600,
    imageHeight: 1130,
    links: {
      writeup: "/projects/grand-pre-crop-plan.xlsx",
      writeupLabel: "See the Program",
    },
  },

  // ---------- Computational Physics ----------
  {
    slug: "dr16q-ehvo-quasar-pipeline",
    title: "Extremely High Velocity Quasar Outflow Research Pipeline",
    categories: ["computational-physics"],
    summary:
      "My previous working branch of the UW Bothell quasar research group's collaborative codebase: Python tools for normalizing raw SDSS spectra, flagging absorption troughs, and running cross-correlation, redshift, and variability analyses to isolate extremely high-velocity outflow (EHVO) quasars from the DR16 sample. Using this pipeline I successfully identified the second-fastest outflow in the universe; it is scaled to process thousands of spectra at a time. Note: Most up to date codebase is hosted on a private repository, commits to be merged later.",
    highlights: [
      "Successfully identified the second-fastest outflow in the universe with this automated analysis pipeline.",
      "Scaled the workflow to batch-process thousands of SDSS spectra per run.",
    ],
    stack: [
      "Python",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "SDSS Spectra",
      "Version Control",
      "Software Documentation",
    ],
    tags: ["Astrophysics", "Research Software", "Numerical Methods"],
    date: "2025-11-01",
    ongoing: true,
    links: {
      repo: "https://github.com/paolaUWB/DR16Q/tree/Maddi",
    },
  },
  {
    slug: "monte-carlo-simulations-python",
    title: "Monte Carlo Simulations in Python",
    categories: ["computational-physics"],
    summary:
      "Two Monte Carlo case studies built from first principles: modeling energy deposition in a CERN ATLAS-style calorimeter cell via inverse transform sampling, and simulating a year of stock price paths with geometric Brownian motion.",
    stack: ["Python", "NumPy", "Matplotlib"],
    tags: ["Physics Simulation", "Numerical Methods"],
    date: "2026-02-01",
    image: "/projects/monte-carlo-cover.png",
    imageWidth: 990,
    imageHeight: 724,
    links: {
      writeup: "/projects/monte-carlo-simulations-in-python.pdf",
    },
  },
  {
    slug: "quantum-eraser-superposition",
    title: "Quantum Eraser: Erasing & Restoring Which-Path Information",
    categories: ["computational-physics"],
    summary:
      "Built a polarizer-and-double-slit setup to test at what polarization angle a photon's which-path information is erased, mapping interference-fringe visibility against filter angle to pinpoint the laser's dominant polarization axis.",
    stack: [
      "Optics Bench",
      "High-Energy Laser",
      "Polarizing Filter",
      "Photometer",
    ],
    tags: ["Quantum Mechanics", "Optics"],
    date: "2023-06-01",
    image: "/projects/quantum-eraser-demo.jpg",
    imageWidth: 1600,
    imageHeight: 1257,
  },
  {
    slug: "measuring-plancks-constant-leds",
    title: "Measuring the Fundamental Planck's Constant Using LEDs",
    categories: ["computational-physics"],
    summary:
      "Derived Planck's constant from scratch by measuring the threshold voltage of four LED colors and relating the slope of voltage-vs-frequency to h — landing within 3.7% of the accepted value using a low-cost breadboard circuit.",
    stack: ["Breadboard Circuit", "Multimeter", "Linear Regression"],
    tags: ["Quantum Mechanics", "Experimental Physics"],
    date: "2024-03-14",
    image: "/projects/measuring-plancks-constant-leds-preview.png",
    cardImage: "/projects/measuring-plancks-constant-leds-preview.png",
    imageWidth: 1024,
    imageHeight: 650,
    links: {
      writeup: "/projects/measuring-plancks-constant-leds.pdf",
    },
  },

  // ---------- Electrical Engineering ----------
  {
    slug: "portable-electric-cloud-chamber",
    title: "Portable Electric Cloud Chamber",
    categories: ["electrical-engineering"],
    summary:
      "Designed and built a reusable, dry-ice-free cloud chamber system using eight cascaded Peltier thermoelectric coolers and a closed-loop water cooling system, sustaining the −26°C gradient needed to visualize ionizing radiation tracks including cosmic rays. Collaborated with mechanical engineer Branden Floyd who taught me how to solder, 3D print, and design the cooling system. Invited to present the device to the college's Board of Trustees, made available to students as a public demonstration tool, and awarded Outstanding STEM Project.",
    highlights: [
      "Started from explicit build constraints (budget, team skill, energy usage, and a −26 °C target), then modeled the assembly in Fusion 360: 3D-printed base with channels for coolant hoses, wiring, inset LED strips, and a aligned, sealed glass chamber.",
      "Built a closed-loop water-cooling path (pump, radiators, aluminum blocks) and improved heat transfer with a copper spreader, thermal paste, and insulating foam around the stack and tank seal to cut parasitic heating.",
      "Tested thermal performance after each integration step; when early Peltiers could not hold the required ΔT, iteratively replaced modules, increased supply capacity, and cascaded mixed 12712 / 12709 stages until the chamber held sub −26 °C for extended runs.",
      "Matched drive levels to each cascade tier (13 V on the lower stage, ~9 V on the upper) and planned dedicated power dividers to feed the upper Peltiers at a regulated 9 V instead of an improvised battery hookup—prioritizing safe, repeatable power delivery.",
      "Chose Peltier stacks over compressor refrigeration to reach chamber temperatures without hazardous fluids such as freon. Replaced with a portable, dry-ice-free setup suited for classroom demonstrations.",
      "After misleading Peltier specs surfaced in testing, adopted a stricter parts workflow: verify manufacturer claims (including joule heating), favor third-party–certified hardware when data must be trusted, and re-test after every wiring or cooling change.",
    ],
    stack: ["Fusion 360 CAD", "Peltier TECs", "DC Power Systems", "3D Printing"],
    tags: [
      "Electrical Engineering",
      "Hardware",
      "Wiring",
      "Soldering",
      "Hardware-Electrical Interfacing",
    ],
    date: "2024-03-13",
    image: "/projects/cloud-chamber.jpg",
    imageWidth: 1600,
    imageHeight: 1200,
    links: {
      writeup:
        "https://www.linkedin.com/posts/madalygregory_moving-into-my-last-year-of-undergraduate-ugcPost-7398862499166662656-3Mqc",
    },
  },
  {
    slug: "lifi-optical-data-transmission",
    title: "LiFi: Transmitting Data via Light Waves",
    categories: ["electrical-engineering"],
    summary:
      "Built a laser and phototransistor link that pulses binary-encoded text between two Arduinos over light. Built a two-node optical data transmission circuit using dual Arduino microcontrollers, pulsing a red laser diode at 100ms intervals to encode and transmit binary text data across varied distances in free space. Integrated optical components, specifically a phototransistor in series with a 10kΩ potentiometer to convert incoming laser pulses into voltage signals and analyze serial text output.",
    highlights: [
      "Characterized signal degradation across variable path lengths, across 10 trials from 50cm to 300cm to quantify how beam divergence and ambient optical noise impact text recovery accuracy.",
      "Evaluated physical constraints of low-cost photodetectors, determining that detector surface area, sensor hysteresis, and background light limit accurate data transmission over longer ranges.",
      "Proposed experimental optimizations, including methods to increase SNR through narrow-band filtering, focused photodiode arrays, and short-wavelength UV sources.",
    ],
    stack: [
      "Arduino",
      "Red Laser Diode",
      "Phototransistor",
      "10kΩ Potentiometer",
      "Serial Comms",
    ],
    tags: ["Electrical Engineering", "Optical Communication"],
    date: "2023-11-01",
    image: "/projects/lifi-poster.jpg",
    imageWidth: 1600,
    imageHeight: 1280,
    cardImage: "/projects/life-card.jpg",
  },
  {
    slug: "quantum-rng-photoresistor-circuit",
    title: "Quantum Random Number Generator Circuit",
    categories: ["electrical-engineering"],
    summary:
      "Experimental optics and embedded firmware to harvest random bits from quantum vacuum fluctuations and photon polarization — comparing dual photoresistor paths on an Arduino and mapping optical states to binary output.",
    highlights: [
      "Designed and built an experimental optical setup utilizing an Arduino Uno, 5V red laser diode, beam-splitter cube, and photoresistors to measure quantum vacuum fluctuations and photon polarization states.",
      "Designed custom 3D-printed component mounts in CAD to align and stabilize laser optics and polarization beam-splitters along a precise horizontal axis.",
      "Developed Arduino software to compare real-time photoresistor voltage outputs, convert differential sensor readings into binary data streams, and map quantum optical states to random digit outputs.",
      "Analyzed experimental datasets and failure modes, identifying sensor weakness, temperature dependencies, and ambient optical interference as limits to true randomness in low-cost photoresistors.",
      "Documented design revisions, evaluating a photodiode sensor replacement and laser power attenuation to eliminate detector noise and improve quantum signal isolation.",
    ],
    stack: [
      "Arduino Uno",
      "5V Laser Diode",
      "Beam-Splitter Cube",
      "Photoresistors",
      "CAD",
      "3D-Printed Mounts",
    ],
    tags: ["Electrical Engineering", "Embedded Systems", "Optics"],
    date: "2023-11-29",
    image: "/projects/random-digit-card.jpg",
    imageWidth: 1024,
    imageHeight: 768,
    links: {
      writeup: "/projects/quantum-rng-report.pdf",
    },
  },
];

export function projectInCategory(
  project: Project,
  category: ProjectCategorySlug
) {
  return project.categories.includes(category);
}

export function getProjectHref(
  project: Project,
  category?: ProjectCategorySlug
) {
  const categorySlug = category ?? project.categories[0];
  return `/projects/${categorySlug}/${project.slug}`;
}

export function getProjectsByCategory(category: string) {
  const slug = category as ProjectCategorySlug;
  return projects
    .filter((p) => projectInCategory(p, slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProjectBySlug(category: string, slug: string) {
  const categorySlug = category as ProjectCategorySlug;
  return projects.find(
    (p) => p.slug === slug && projectInCategory(p, categorySlug)
  );
}

export function getAllTags(category?: string) {
  const categorySlug = category as ProjectCategorySlug | undefined;
  const source = categorySlug
    ? projects.filter((p) => projectInCategory(p, categorySlug))
    : projects;
  const tags = new Set<string>();
  source.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
