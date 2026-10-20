"use client";
export default function StudyError({ reset }) {
  return (
    <div className="hub-panel hub-failure">
      <h2>Workspace temporarily unavailable</h2>
      <p>
        No successful save is implied. Check the database configuration or
        retry.
      </p>
      <button className="hub-button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
