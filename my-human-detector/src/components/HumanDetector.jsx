import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import BoundingBox from "./BoundingBox";
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";

const HumanDetector = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [detections, setDetections] = useState([]);
  const [alert, setAlert] = useState(false);
  const [humanCount, setHumanCount] = useState(0);
  const [logs, setLogs] = useState([]);

  // NEW: To prevent repeated alerts
  const [alertPlayed, setAlertPlayed] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  useEffect(() => {
    cocoSsd.load().then((loadedModel) => {
      setModel(loadedModel);
      console.log("Model Loaded!");
    });
  }, []);

  // FEMALE VOICE ALERT (Plays ONLY once)
  const playVoiceAlert = () => {
    const voice = new SpeechSynthesisUtterance("Warning! Human detected");
    voice.pitch = 1.2;
    voice.rate = 1;
    voice.volume = 1;
    voice.lang = "en-US";

    speechSynthesis.speak(voice);
  };

  const detect = async () => {
    if (
      model &&
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const predictions = await model.detect(video);
      const persons = predictions.filter((p) => p.class === "person");

      setDetections(persons);
      setHumanCount(persons.length);

      if (persons.length > 0) {
        setAlert(true);

        // VOICE ALERT only ONCE
        if (!alertPlayed) {
          playVoiceAlert();
          setAlertPlayed(true);
        }

        // SNAPSHOT only ONCE per detection session
        if (!photoTaken) {
          const imageSrc = webcamRef.current.getScreenshot();
          setPhotoTaken(true);

          // Add snapshot in logs
          setLogs((prev) => [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              message:
                persons.length > 1
                  ? `Danger! ${persons.length} humans detected`
                  : "Human detected!",
              image: imageSrc,
            },
          ]);
        }
      } else {
        // No human → reset states
        setAlert(false);
        setAlertPlayed(false);
        setPhotoTaken(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      detect();
    }, 300); // runs every 300 ms

    return () => clearInterval(interval);
  });

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "#ff006a", marginBottom: "20px" }}>
        AI Human Detection System
      </h1>

      {/* HUMAN COUNT */}
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#ff006a",
        }}
      >
        👥 Humans Detected: {humanCount}
      </div>

      {/* SAFE MODE */}
      {humanCount === 0 && (
        <div
          style={{
            padding: "10px",
            fontSize: "20px",
            background: "#4CAF50",
            color: "white",
            borderRadius: "10px",
            width: "260px",
            margin: "0 auto 20px",
            fontWeight: "bold",
          }}
        >
          🟢 SAFE — No Human Detected
        </div>
      )}

      {/* NORMAL MODE (1 human) */}
      {humanCount === 1 && (
        <div
          style={{
            padding: "10px",
            fontSize: "20px",
            background: "orange",
            color: "white",
            borderRadius: "10px",
            width: "260px",
            margin: "0 auto 20px",
            fontWeight: "bold",
          }}
        >
          🟠 Human Detected
        </div>
      )}

      {/* DANGER MODE */}
      {humanCount > 1 && (
        <div
          style={{
            padding: "10px",
            fontSize: "20px",
            background: "#d00000",
            color: "white",
            borderRadius: "10px",
            width: "330px",
            margin: "0 auto 20px",
            fontWeight: "bold",
          }}
        >
          ⚠️ DANGER — Multiple Humans Detected!
        </div>
      )}

      {/* WEBCAM + BOUNDING BOX */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{
            width: 640,
            height: 480,
            borderRadius: "10px",
            border: "3px solid #ff006a",
          }}
        />

        {detections.map((det, index) => {
          const [x, y, width, height] = det.bbox;
          return (
            <BoundingBox
              key={index}
              box={{
                left: x,
                top: y,
                width: width,
                height: height,
              }}
              label={det.class}
            />
          );
        })}
      </div>

      {/* ALERT MESSAGE */}
      {alert && humanCount > 0 && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#ff006a",
            color: "white",
            borderRadius: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaBell size={24} />
          <span>Human Detected!</span>
        </motion.div>
      )}

      {/* LOGS SECTION */}
      <div
        style={{
          marginTop: "30px",
          width: "550px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "left",
          background: "#ffe6f0",
          padding: "15px",
          borderRadius: "10px",
          height: "250px",
          overflowY: "scroll",
        }}
      >
        <h3 style={{ color: "#ff006a" }}>Detection Logs</h3>

        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <p>
              <b>{log.time}</b> — {log.message}
            </p>
            {log.image && (
              <img
                src={log.image}
                alt="snapshot"
                style={{
                  width: "120px",
                  borderRadius: "8px",
                  border: "2px solid #ff006a",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HumanDetector;
