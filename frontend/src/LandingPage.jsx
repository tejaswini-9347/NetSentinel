
import "./LandingPage.css";

export default function LandingPage({ onGetStarted }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="net-page" id="home">
      <header className="net-header">
        <a href="#home" className="net-brand">
          <div className="net-logo">
            <span>⬡</span>
            <i />
          </div>
          <div>
            <h2>Net<span>Sentinel</span></h2>
            <small>NETWORK INTRUSION DETECTION</small>
          </div>
        </a>

        <nav className="net-nav">
          <a className="active" href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </nav>

        <button
          className="net-button net-header-button"
          onClick={onGetStarted}
        >
          Open Dashboard <span>→</span>
        </button>
      </header>

      <section className="net-hero">
        <div className="net-copy">
          <div className="net-badge">
            <span>⬡</span>
            SMARTER SECURITY. SAFER NETWORKS.
          </div>

          <h1>
            Detect Threats
            <br />
            Before They <span>Strike.</span>
          </h1>

          <p className="net-description">
            Meet NetSentinel, a machine-learning-powered Network
            Intrusion Detection System that analyzes network
            traffic and classifies potential malicious activity.
          </p>

          <div className="net-actions">
            <button
              className="net-button net-primary"
              onClick={onGetStarted}
            >
              Start Analyzing <span>→</span>
            </button>

            <button
              className="net-button net-outline"
              onClick={() => scrollTo("features")}
            >
              Explore Features
            </button>
          </div>

          <div className="net-benefits">
            <span><i>✓</i> SVM &amp; Decision Tree</span>
            <span><i>✓</i> Traffic Classification</span>
            <span><i>✓</i> Prediction Analytics</span>
          </div>
        </div>

        <div className="net-universe">
          <div className="net-stars" />

          <div className="net-orbit orbit-1">
            <i className="net-node node-1" />
          </div>
          <div className="net-orbit orbit-2">
            <i className="net-node node-2" />
          </div>
          <div className="net-orbit orbit-3">
            <i className="net-node node-3" />
          </div>
          <div className="net-orbit orbit-4">
            <i className="net-node node-4" />
          </div>
          <div className="net-orbit orbit-5">
            <i className="net-node node-5" />
          </div>

          <div className="net-orbit net-tilted tilted-1" />
          <div className="net-orbit net-tilted tilted-2" />

          <div className="net-shield-glow">
            <div className="net-shield">
              <div className="net-shield-inner">
                <span>N</span>
              </div>
            </div>
          </div>

          <div className="net-card net-traffic">
            <small>NETWORK TRAFFIC</small>
            <strong>Monitoring overview</strong>
            <div className="net-wave">
              {Array.from({ length: 25 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${18 + ((i * 19 + 17) % 42)}px`,
                    animationDelay: `${i * 0.045}s`,
                  }}
                />
              ))}
            </div>
            <p>Traffic feature analysis</p>
          </div>

          <div className="net-card net-alert">
            <p><i className="net-dot danger" /> Potential intrusion</p>
            <strong>Review prediction</strong>
            <p><i className="net-dot safe" /> Normal traffic</p>
          </div>

          <div className="net-card net-model">
            <div className="net-model-logo">⬡</div>
            <div>
              <strong>ML Detection Models</strong>
              <p>SVM · Decision Tree</p>
            </div>
          </div>

          <div className="net-particle particle-1" />
          <div className="net-particle particle-2" />
          <div className="net-particle particle-3" />
          <div className="net-particle particle-4" />
          <div className="net-particle particle-5" />
          <div className="net-particle particle-6" />
        </div>

        <div className="net-wave-bottom">
          <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="netWaveGradient">
                <stop offset="0%" stopColor="#00dcca" stopOpacity="0" />
                <stop offset="50%" stopColor="#00f5e0" stopOpacity=".95" />
                <stop offset="100%" stopColor="#00aee8" stopOpacity=".15" />
              </linearGradient>
            </defs>
            {Array.from({ length: 10 }, (_, i) => (
              <path
                key={i}
                d={`M 0 ${75 + i * 8} C 240 ${150 - i * 3}, 390 ${10 + i * 7}, 660 ${70 + i * 6} S 1050 ${145 - i * 5}, 1440 ${35 + i * 8}`}
                fill="none"
                stroke="url(#netWaveGradient)"
                strokeWidth=".8"
                opacity={0.7 - i * 0.045}
              />
            ))}
          </svg>
        </div>
      </section>

      <section className="net-section net-features" id="features">
        <span className="net-section-label">CORE CAPABILITIES</span>
        <h2>Smarter network security</h2>
        <p className="net-section-description">
          Machine learning helps classify network traffic and
          identify records that may indicate suspicious activity.
        </p>

        <div className="net-feature-grid">
          <article>
            <span className="net-feature-number">01</span>
            <h3>Traffic Classification</h3>
            <p>Classify submitted network records as normal or intrusion.</p>
          </article>
          <article>
            <span className="net-feature-number">02</span>
            <h3>ML Detection Models</h3>
            <p>Use SVM and Decision Tree models to predict traffic classes.</p>
          </article>
          <article>
            <span className="net-feature-number">03</span>
            <h3>Prediction Analytics</h3>
            <p>Review model predictions in the NetSentinel dashboard.</p>
          </article>
        </div>
      </section>

      <section className="net-section net-how" id="how-it-works">
        <span className="net-section-label">HOW IT WORKS</span>
        <h2>From network data to prediction</h2>
        <div className="net-feature-grid">
          <article>
            <span className="net-feature-number">01</span>
            <h3>Enter Network Features</h3>
            <p>Provide the feature values for the network record.</p>
          </article>
          <article>
            <span className="net-feature-number">02</span>
            <h3>Run the Model</h3>
            <p>The backend sends the record to the selected trained model.</p>
          </article>
          <article>
            <span className="net-feature-number">03</span>
            <h3>View the Result</h3>
            <p>Inspect the predicted traffic class in the dashboard.</p>
          </article>
        </div>
      </section>

      <section className="net-section net-about" id="about">
        <span className="net-section-label">ABOUT NETSENTINEL</span>
        <h2>Understand network threats with machine learning.</h2>
        <p className="net-section-description">
          NetSentinel is an academic network intrusion classification
          project using the NSL-KDD dataset, SVM and Decision Tree.
          It analyzes submitted records and displays predictions.
        </p>
        <button
          className="net-button net-primary"
          onClick={onGetStarted}
        >
          Open Dashboard <span>→</span>
        </button>
      </section>
    </div>
  );
}
