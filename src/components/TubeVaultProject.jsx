export default function TubeVaultProject() {
  return (
    <article className="tubevault-project" id="tubevault">
      <div className="tubevault-copy">
        <p className="micro">PERSONAL SOFTWARE / IN DEVELOPMENT</p>
        <h3>
          TubeVault<span className="accent">.</span>
        </h3>
        <p className="tubevault-tagline">Your footage. An organised flow.</p>
        <p>
          A Windows video archive that discovers files, skips duplicates, and
          manages resumable YouTube uploads through a React dashboard.
        </p>
        <div className="tubevault-tags">
          <span>Python</span>
          <span>React</span>
          <span>SQLite</span>
          <span>YouTube API</span>
        </div>
        <a
          className="text-link"
          href="https://github.com/abdullah-al-tamim/TubeVault"
          target="_blank"
          rel="noreferrer"
        >
          Explore TubeVault <span aria-hidden="true">↗</span>
        </a>
        <details className="research-details">
          <summary>Inside the system</summary>
          <p>
            SHA-256 duplicate detection, a persistent queue, resumable uploads,
            scheduled workers, and iPhone imports. Originals remain untouched
            and uploads default to private.
          </p>
          <p>
            In development: real-channel uploads and long-running recovery still
            need validation.
          </p>
        </details>
      </div>
      <figure className="tubevault-visual">
        <div className="vault-window" aria-hidden="true">
          <div className="vault-toolbar">
            <strong>▣ TubeVault</strong>
            <span>ILLUSTRATIVE QUEUE</span>
          </div>
          <div className="vault-flow">
            <span>01 Discover</span>
            <span>02 Deduplicate</span>
            <span>03 Upload</span>
          </div>
          <div className="vault-row">
            <span className="vault-thumb">▷</span>
            <div>
              <strong>Coastline.mp4</strong>
              <small>Resumable upload</small>
              <div className="vault-track">
                <i />
              </div>
            </div>
            <span className="vault-badge">Uploading</span>
          </div>
          <div className="vault-row">
            <span className="vault-thumb">▷</span>
            <div>
              <strong>City walk.mp4</strong>
              <small>Already in the archive</small>
            </div>
            <span className="vault-badge muted">Duplicate skipped</span>
          </div>
          <div className="vault-row">
            <span className="vault-thumb">▷</span>
            <div>
              <strong>Weekend.mp4</strong>
              <small>Ready for its turn</small>
              <div className="vault-track second">
                <i />
              </div>
            </div>
            <span className="vault-badge">Queued</span>
          </div>
          <div className="vault-bottom">
            <span>● Originals preserved</span>
            <span>Private by default ↗</span>
          </div>
        </div>
        <figcaption>
          Workflow illustration with sample files, not a live upload.
        </figcaption>
      </figure>
    </article>
  );
}
