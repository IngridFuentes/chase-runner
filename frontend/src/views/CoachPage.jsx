import React from "react";
import AIAssistant from "../components/AIAssistant";

const CoachPage = () => {
  // You can pass user's running data here
  const userRunData = {
    totalRuns: 15,
    totalDistance: 45.2,
    averagePace: "8:30/mile",
    lastRun: {
      distance: 5.2,
      duration: "44:16",
      date: "2025-11-04",
    },
  };

  return (
    <div>
      <h1>Your AI Running Coach</h1>
      <AIAssistant userRunData={userRunData} />
    </div>
  );
};

export default CoachPage;
