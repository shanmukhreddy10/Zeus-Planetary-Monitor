⚡ Zeus — Planetary Monitor
A real-time planetary hazard surveillance and climate telemetry web application that monitors earthquakes, tsunamis, cyclones, volcanic eruptions, and macro-climate trends worldwide. Built with vanilla web standards and deployed on Microsoft Azure using an enterprise cloud architecture featuring automated CI/CD, DNS zone management, key vaults, and live client observability.

🌐 Live Demos
Azure Production Deployment: [https://purple-sand-07f347e00.3.azurestaticapps.net](https://purple-sand-07f347e00.3.azurestaticapps.net)

GitHub Pages Backup: https://shanmukhreddy10.github.io/Zeus-Planetary-Monitor/

🏛️ Cloud Architecture (Microsoft Azure)
Zeus is hosted using a multi-resource, edge-distributed Azure architecture designed for zero backend overhead, continuous integration, and deep operational observability:

                               ┌──► [ Azure DNS Zones ] (Custom CNAME Routing)
                               │
[ Developer ]                  ├──► [ Azure Key Vault ] (Zero-Trust Secret Governance)
     │                         │
     ▼ (Git Push)              │
[ GitHub Actions CI/CD ] ──────┼──► [ Azure Static Web Apps ] (Global Edge Hosting)
                               │
                               └──► [ Azure Application Insights ] (Live Telemetry & RUM)
Deployed Azure Services
Azure Static Web Apps (Edge Hosting & CI/CD): Serves client assets across global edge nodes with automated GitHub Actions deployments and free SSL/TLS termination.

Azure DNS Zone (DNS & Routing): Manages Layer-7 routing resolution and maps custom CNAME records (alerts) to the Static Web App edge origin.

Azure Key Vault (Security Governance): Stores configuration parameters and third-party API keys securely away from public source code.

Application Insights (Observability): Streams Real User Monitoring (RUM) metrics, tracking page load performance, exceptions, and live external API latencies.

✨ Features
Live Multi-Hazard Feed: Ingests and aggregates real-time event telemetry across 5 disaster categories:

Earthquakes: Real-time seismic activity from the USGS Earthquake Hazards API.

Tsunamis: Automated warning indicators parsed from seismic telemetry.

Cyclones & Severe Storms: Active atmospheric depression tracking from NASA EONET.

Volcanic Eruptions: Global volcanic activity and ash plume alerts from NASA EONET.

Floods: Large-scale flood and inundation advisories from NASA EONET.

On-Demand Country Quick Search: A responsive, real-time search engine on the home dashboard that filters active hazards by country or territory. Displays zero clutter until a search is queried.

Global Rescue Directory: Direct access to emergency, civil defense, police, and medical telephone numbers across 150+ countries.

Safety Protocols & Precautions: Interactive modal outlining official evacuation and survival instructions for earthquakes, tsunamis, cyclones, volcanoes, and floods.

Citizen Account Management: Dedicated profile screen displaying registered user credentials, country, emergency contact information, and password update verification.

🛠️ Tech Stack
Frontend: Vanilla HTML5, CSS3 (Modern Flexbox & Grid), JavaScript (ES6+ Fetch, Async/Await)

Cloud Infrastructure: Microsoft Azure (Static Web Apps, DNS Zones, Key Vault, Application Insights)

CI/CD: GitHub Actions

Data Sources & APIs:

USGS Earthquake Hazards Program

NASA Earth Observatory Natural Event Tracker (EONET)

Open-Meteo Planetary API

📂 Project Structure
Plaintext
Zeus-Planetary-Monitor/
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-*.yml   # Azure Static Web Apps CI/CD pipeline
├── index.html                            # Main application markup & modals
├── style.css                             # Cyber-surveillance dashboard styling
├── app.js                                # Real-time feed ingestion & routing logic
└── README.md                             # Project documentation
