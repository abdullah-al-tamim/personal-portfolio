export default function WorkPreview({ kind }) {
  return (
    <svg viewBox="0 0 420 180" aria-hidden="true" className="work-preview">
      {kind === "reconciliation" ? (
        <>
          {[60, 260].map((x, i) => (
            <g key={x}>
              <rect x={x} y="30" width="100" height="110" rx="6" />
              <path d={`M${x + 18} 57h64M${x + 18} 77h48M${x + 18} 97h55`} />
              <text x={x + 50} y="124" textAnchor="middle">
                {i ? "116" : "120"}
              </text>
            </g>
          ))}
          <path d="M166 85h88" />
          <circle cx="210" cy="85" r="17" className="preview-accent" />
          <text x="210" y="90" textAnchor="middle" className="preview-alert">
            4
          </text>
          <text x="110" y="165" textAnchor="middle">
            SOURCE
          </text>
          <text x="310" y="165" textAnchor="middle">
            DATABASE
          </text>
        </>
      ) : kind === "architecture" ? (
        <>
          {[42, 90, 138].map((y, i) => (
            <g key={y}>
              <path
                d={`M45 90C100 90 100 ${y} 150 ${y}H260C320 ${y} 320 90 375 90`}
              />
              <rect x="157" y={y - 15} width="94" height="30" rx="4" />
              <text x="204" y={y + 5} textAnchor="middle">
                CHUNK 0{i + 1}
              </text>
            </g>
          ))}
          <circle cx="45" cy="90" r="8" className="preview-accent" />
          <circle cx="375" cy="90" r="8" className="preview-accent" />
        </>
      ) : (
        <>
          {[48, 124, 200].map((x, i) => (
            <g key={x}>
              <rect x={x} y={40 + i * 12} width="60" height="70" rx="4" />
              <path
                d={`M${x + 12} ${60 + i * 12}h35M${x + 12} ${74 + i * 12}h25`}
              />
            </g>
          ))}
          <path d="M268 90h35" />
          <rect x="312" y="51" width="65" height="78" rx="5" />
          <path d="m328 90 11 11 22-27" className="preview-accent" />
          <text x="210" y="165" textAnchor="middle">
            MATCH CONTEXT → SUGGEST A RESOLUTION
          </text>
        </>
      )}
    </svg>
  );
}
