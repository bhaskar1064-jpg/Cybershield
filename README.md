# CyberShield Hub - ESPM Dashboard

**CyberShield Hub** is a production-grade, highly responsive unified **Enterprise Security Posture Management (ESPM)** web application. It is designed explicitly to monitor, detect, and remediate the core technical failures behind three historic cyber scandals:

1. **Change Healthcare Breach** (Credential abuse / Missing MFA)
2. **National Public Data Leak** (Unencrypted, public-facing database endpoints)
3. **Canvas / Instructure Exposure** (Weak API onboarding & validation checks)

---

## 🚀 Tech Stack & Architecture

- **Frontend**: React.js (Vite), TypeScript, Tailwind CSS v4
- **Icons**: Lucide React
- **Scoring Engine**: Breach Vulnerability Index (BVI) dynamically calculating real-time posture risk from 0% (Secure) to 100% (Critical Danger)
- **Styling Theme**: Slate-900 dark theme with glowing emerald (safe), amber (warning), and rose (threat) accents

---

## 🛠️ Key Features

### 1. Executive Security Overview
- **Global Metric Gauge**: A dynamic SVG radial gauge demonstrating the calculated BVI score.
- **System status banner**: Instantly alerts users to active threat vectors or switches to green Zero-Trust status once all remediations are patched.
- **Global Threat Visualizer Map**: Renders an interactive world map visualizer tracking real-time attack stream paths from global attacker nodes (`RU`, `CN`, `BR`) to the USA Gateway.
- **Perimeter Scanner Log**: A live terminal console outputting recurring security scan heartbeats.

### 2. Identity Access Auditor
- **MFA Auditor**: Lists external portals (Citrix Gateway, Active Directory, Remote Desktops) checking for MFA enforcement.
- **Remediation Trigger**: "Enforce Global MFA Policy" instantly applies FIDO2/MFA tokens to all nodes, reducing credentials risk.
- **Dark Web Leak Scanner**: Interactive domain scanner checking employee email credentials against 10B+ exposed dump catalogs. Shows active security status (Compromised vs. Blocked by MFA).

### 3. Cloud & Data Guardian
- **Topology Map**: Graphical representation of data nodes (AWS S3, MongoDB, PostgreSQL) and their connections to the WAN.
- **Firewall & Encryption Toggles**: Tracks public subnet access and AES-256 storage encryption states.
- **Remediation Patching**: Instantly isolates database nodes into private VPC zones and turns on storage volume encryption.

### 4. API Verification Guard
- **API Settings Config**: Allows toggling strict OAuth validation, domain checks (blocking non-academic signups like Gmail), and API rate-limiting.
- **Multi-Model REST Penetration Simulator**: Runs custom attack vectors (IDOR/BOLA, DDoS signup loops, SQL Evasion Injection) displaying raw HTTP header payloads and server response logs.

---

## 💻 Local Setup & Development

To run the dashboard locally, make sure you have [Node.js](https://nodejs.org/) installed, then execute:

```bash
# Clone the repository (if downloaded from GitHub)
cd cybershield-hub

# Install dependencies
npm install

# Run the local development server
npm run dev
```

The application will launch on your local host (usually `http://localhost:5173`).
