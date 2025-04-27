import React, { Fragment } from "react";

function ProgressBar({ step, total }) {
  const pct = Math.round((step / (total - 1)) * 100);
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <Fragment key={i}>
            <div className={`flex-1 flex items-center`}>
              <div className={`
                mx-auto w-8 h-8 flex items-center justify-center rounded-full border-2
                ${i < step ? "bg-[var(--primary-color-blue)] text-white" 
                 : i === step ? "border-[var(--primary-color-teal)] text-[var(--primary-color-teal)]"
                 : "border-gray-300 text-gray-400"}`}
              >
                {i < step ? "✓" : i + 1}
              </div>
            </div>
            {i < total - 1 && (
              <div className={`flex-1 h-1 bg-${i < step ? "[var(--primary-color-blue)]" : "gray-300"} mx-2`} />
            )}
          </Fragment>
        ))}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className="h-2 rounded-full bg-[var(--primary-color-teal)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;