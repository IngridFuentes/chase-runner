import React from "react";
import styles from "../styles/StateDetailsPanel.module.css";

const StateDetailsPanel = ({ isOpen, onClose, stateData }) => {
  if (!stateData) return null;

  //   console.log(stateData, "state data");

  // Calculate race type breakdown
  const raceTypeBreakdown = stateData.runs.reduce((acc, run) => {
    const type = run.race_type || run.raceType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const totalRuns = stateData.runs.length;

  // Calculate percentages for progress bar
  const raceTypePercentages = Object.entries(raceTypeBreakdown).map(
    ([type, count]) => ({
      type,
      count,
      percentage: (count / totalRuns) * 100,
    })
  );

  // Race type colors matching your existing colors
  const raceTypeColors = {
    "5K": "#0000FF",
    "10K": "#FFA500",
    Full: "#008000",
    Half: "#800080",
    Ultra: "#EC0003",
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      {/* Left Panel */}
      <div className={`${styles.leftPanel} ${isOpen ? styles.active : ""}`}>
        {/* Header */}
        <div className={styles.panelHeader}>
          <h2>
            <span className={styles.stateEmoji}>📍</span>
            {stateData.name}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Content */}
        <div className={styles.panelContent}>
          {/* Total Runs Count */}
          <div className={styles.totalRunsBox}>
            <div className={styles.totalRunsNumber}>{totalRuns}</div>
            <div className={styles.totalRunsLabel}>
              Total Runs in {stateData.name}
            </div>
          </div>

          {/* Race Type Breakdown - Progress Bar */}
          <div className={styles.progressSection}>
            <h3 className={styles.sectionTitle}>Race Type Breakdown</h3>

            {/* Stacked Progress Bar */}
            <div className={styles.progressBar}>
              {raceTypePercentages.map((item, index) => (
                <div
                  key={item.type}
                  className={styles.progressSegment}
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: raceTypeColors[item.type] || "#ccc",
                  }}
                  title={`${item.type}: ${
                    item.count
                  } runs (${item.percentage.toFixed(0)}%)`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className={styles.progressLegend}>
              {raceTypePercentages.map((item) => (
                <div key={item.type} className={styles.legendItem}>
                  <div
                    className={styles.legendColor}
                    style={{ backgroundColor: raceTypeColors[item.type] }}
                  />
                  <span className={styles.legendText}>
                    {item.type}: {item.count} ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Runs List */}
          <div className={styles.runsSection}>
            <h3 className={styles.sectionTitle}>All Runs</h3>
            <div className={styles.runsList}>
              {stateData.runs.map((run) => (
                <div
                  key={run.id}
                  className={styles.runItem}
                  style={{
                    borderLeftColor:
                      raceTypeColors[run.race_type || run.raceType],
                  }}
                >
                  <div className={styles.runInfo}>
                    <div className={styles.runHeader}>
                      <div className={styles.runType}>
                        {run.race_type || run.raceType}
                      </div>
                      {run.city && (
                        <div className={styles.runCity}>📍 {run.city}</div>
                      )}
                    </div>
                    <div className={styles.runDescription}>
                      {run.description}
                    </div>
                    {run.date && (
                      <div className={styles.runDate}>
                        📅{" "}
                        {new Date(run.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                    {run.distance && (
                      <div className={styles.runDistance}>
                        🏃 {run.distance} miles
                      </div>
                    )}
                  </div>
                  <div
                    className={styles.runColorDot}
                    style={{ backgroundColor: run.color }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StateDetailsPanel;
