# human-detector

# Human Detector App 🧍‍♀️📹

## 📌 Overview

The **Human Detector App** is a real-time AI-powered surveillance and monitoring application built with **React** and **TensorFlow.js**. It uses the **COCO-SSD** deep learning model to detect humans through a live webcam feed, draw bounding boxes, trigger visual and voice alerts, and maintain detection logs with snapshots.

This project demonstrates browser-based AI inference, real-time video processing, and interactive UI behavior without relying on heavy backend systems.

---

## ✨ Key Features

* 🎥 **Live Webcam Human Detection** using COCO-SSD
* 🧍 **Real-time Bounding Boxes** with confidence labels
* 🔊 **Voice Alert System** (plays once per detection session)
* 🚨 **Threat Levels**: Safe / Warning / Danger modes
* 📸 **Automatic Snapshot Capture** when a human is detected
* 📜 **Detection Logs Panel** with timestamped entries
* 📱 **Responsive UI** styled using custom CSS

---

## 🧠 How It Works

1. The webcam feed is accessed using `react-webcam`.
2. The COCO-SSD model is loaded via TensorFlow.js.
3. Every 300ms, the model analyzes video frames.
4. Objects classified as `person` are filtered.
5. Bounding boxes are drawn dynamically using absolute positioning.
6. Alerts, snapshots, and logs are triggered when humans are detected.

---

## 🧩 Core Components

### `HumanDetector.jsx`

* Loads the AI model
* Handles webcam access
* Runs detection loop
* Manages alerts, logs, and UI states

### `BoundingBox.jsx`

* Draws bounding boxes over detected humans
* Displays labels above each detected person
* Uses absolute positioning for precise overlays

---

## 🛠 Tech Stack

* **Frontend:** React, JavaScript
* **AI / ML:** TensorFlow.js, COCO-SSD
* **UI & Styling:** Custom CSS
* **Animations:** Framer Motion
* **Icons:** React Icons
* **Deployment:** Vercel

---



## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/USERNAME/human-detector-app.git

# Navigate into project directory
cd human-detector-app

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🧪 Detection Logic (Simplified)

```js
const predictions = await model.detect(video);
const persons = predictions.filter(p => p.class === 'person');
```

* Detection runs every **300ms**
* Alerts and snapshots trigger **only once per session**
* State resets when no humans are detected

---

## 📸 Screenshots

*Add screenshots showing webcam detection, alerts, and logs here*

---

## 🎯 Learning Outcomes

* Implemented real-time AI inference directly in the browser
* Optimized React state for continuous video processing
* Integrated voice alerts and snapshot capture
* Designed an interactive monitoring dashboard

---

## 📄 License

This project is built for learning, demonstration, and portfolio purposes.

---

