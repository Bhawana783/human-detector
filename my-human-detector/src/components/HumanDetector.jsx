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
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    cocoSsd.load().then((loadedModel) => {
      setModel(loadedModel);
      console.log("Model Loaded!");
    });
  }, []);

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

      if (persons.length > 0) {
        setAlert(true);

        setLogs((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            message: "Human detected!",
          },
        ]);

        // Play alert sound
        const audio = new Audio(
          "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7c4e8d8e1b.mp3?filename=warning-110376.mp3"
        );
        audio.play();
      } else {
        setAlert(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      detect();
    }, 300); // every 300 ms

    return () => clearInterval(interval);
  });

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "#ff006a", marginBottom: "20px" }}>
        AI Human Detection System
      </h1>

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

      {alert && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
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

      {/* Logs */}
      <div
        style={{
          marginTop: "30px",
          width: "500px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "left",
          background: "#ffe6f0",
          padding: "15px",
          borderRadius: "10px",
          height: "200px",
          overflowY: "scroll",
        }}
      >
        <h3 style={{ color: "#ff006a" }}>Detection Logs</h3>
        {logs.map((log, index) => (
          <p key={index}>
            <b>{log.time}</b> — {log.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default HumanDetector;
