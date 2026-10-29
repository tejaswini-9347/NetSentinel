import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./LandingPage";
const API_URL = "https://netsentinel-api-dd0c.onrender.com";
const defaultFeatures = {
  duration: 0,
  protocol_type: "tcp",
  service: "http",
  flag: "SF",
  src_bytes: 181,
  dst_bytes: 5450,
  land: 0,
  wrong_fragment: 0,
  urgent: 0,
  hot: 0,
  num_failed_logins: 0,
  logged_in: 1,
  num_compromised: 0,
  root_shell: 0,
  su_attempted: 0,
  num_root: 0,
  num_file_creations: 0,
  num_shells: 0,
  num_access_files: 0,
  num_outbound_cmds: 0,
  is_host_login: 0,
  is_guest_login: 0,
  count: 1,
  srv_count: 1,
  serror_rate: 0,
  srv_serror_rate: 0,
  rerror_rate: 0,
  srv_rerror_rate: 0,
  same_srv_rate: 1,
  diff_srv_rate: 0,
  srv_diff_host_rate: 0,
  dst_host_count: 1,
  dst_host_srv_count: 1,
  dst_host_same_srv_rate: 1,
  dst_host_diff_srv_rate: 0,
  dst_host_same_src_port_rate: 1,
  dst_host_srv_diff_host_rate: 0,
  dst_host_serror_rate: 0,
  dst_host_srv_serror_rate: 0,
  dst_host_rerror_rate: 0,
  dst_host_srv_rerror_rate: 0,
};
const numericFields = [
  ["duration", "Duration (seconds)"],
  ["src_bytes", "Source bytes"],
  ["dst_bytes", "Destination bytes"],
  ["count", "Connection count"],
  ["srv_count", "Service count"],
  ["dst_host_count", "Destination host count"],
  ["dst_host_srv_count", "Destination host service count"],
];
const rateFields = [
  ["serror_rate", "Connection error rate"],
  ["rerror_rate", "Rejected connection rate"],
  ["same_srv_rate", "Same service rate"],
  ["diff_srv_rate", "Different service rate"],
];
const modelResults = [
  {
    name: "SVM",
    accuracy: "75.31%",
    precision: "92%",
    recall: "62%",
    f1: "74%",
  },
  {
    name: "Decision Tree",
    accuracy: "79.08%",
    precision: "96%",
    recall: "66%",
    f1: "78%",
  },
];
const tabs = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "traffic", label: "Traffic Analysis", icon: "⌁" },
  { id: "history", label: "Detection History", icon: "◷" },
  { id: "analytics", label: "Analytics", icon: "▥" },
  { id: "alerts", label: "Alert Center", icon: "⚠" },
  { id: "reports", label: "Reports", icon: "⇩" },
  { id: "models", label: "ML Models", icon: "⬡" },
  { id: "devices", label: "Live Device Detection", icon: "⌘" },
];
function ModelComparison() {
  return (
    <section className="panel comparison-panel">
      <div className="panel-heading">
        <div>
          <div className="eyebrow">TEST DATASET RESULTS</div>
          <h2>Model Performance Comparison</h2>
          <p>Evaluation on 22,544 NSL-KDD test records.</p>
        </div>
      </div>
      <div className="table-responsive">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>ML Model</th>
              <th>Accuracy</th>
              <th>Intrusion Precision</th>
              <th>Intrusion Recall</th>
              <th>Intrusion F1-score</th>
            </tr>
          </thead>
          <tbody>
            {modelResults.map((item) => (
              <tr key={item.name}>
                <td><strong>{item.name}</strong></td>
                <td>{item.accuracy}</td>
                <td>{item.precision}</td>
                <td>{item.recall}</td>
                <td>{item.f1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="comparison-summary">
        Decision Tree achieved 79.08% accuracy, compared with 75.31% for SVM.
        These are dataset evaluation results, not live monitoring statistics.
      </p>
    </section>
  );
}
function ConfusionMatrices() {
  const matrices = [
    { name: "SVM", values: [[8977, 734], [4833, 8000]] },
    { name: "Decision Tree", values: [[9326, 385], [4331, 8502]] },
  ];
  return (
    <section className="panel comparison-panel">
      <div className="panel-heading">
        <div>
          <div className="eyebrow">CLASSIFICATION EVALUATION</div>
          <h2>Confusion Matrices</h2>
          <p>Rows show actual classes; columns show predicted classes.</p>
        </div>
      </div>
      <div className="confusion-grid">
        {matrices.map((matrix) => (
          <article className="confusion-card" key={matrix.name}>
            <h3>{matrix.name}</h3>
            <div className="table-responsive">
              <table className="comparison-table confusion-table">
                <thead>
                  <tr>
                    <th>Actual class</th>
                    <th>Normal</th>
                    <th>Intrusion</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.values.map((row, ri) => (
                    <tr key={ri}>
                      <th>{ri === 0 ? "Normal" : "Intrusion"}</th>
                      {row.map((value, ci) => (
                        <td
                          key={ci}
                          className={ri === ci ? "matrix-correct" : "matrix-incorrect"}
                        >
                          {value.toLocaleString("en-IN")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
      <p className="matrix-disclaimer">
        Saved test-evaluation results; not real-time network monitoring.
      </p>
    </section>
  );
}
const trafficChartData = [
  { time: "00:00", normal: 56, intrusion: 3 },
  { time: "01:00", normal: 61, intrusion: 8 },
  { time: "02:00", normal: 72, intrusion: 6 },
  { time: "03:00", normal: 80, intrusion: 11 },
  { time: "04:00", normal: 70, intrusion: 8 },
  { time: "05:00", normal: 68, intrusion: 4 },
  { time: "06:00", normal: 86, intrusion: 11 },
  { time: "07:00", normal: 70, intrusion: 14 },
  { time: "08:00", normal: 72, intrusion: 7 },
  { time: "09:00", normal: 74, intrusion: 6 },
  { time: "10:00", normal: 58, intrusion: 4 },
  { time: "11:00", normal: 56, intrusion: 3 },
  { time: "12:00", normal: 50, intrusion: 6 },
  { time: "13:00", normal: 57, intrusion: 2 },
  { time: "14:00", normal: 52, intrusion: 2 },
  { time: "15:00", normal: 54, intrusion: 5 },
  { time: "16:00", normal: 50, intrusion: 3 },
  { time: "17:00", normal: 45, intrusion: 2 },
  { time: "18:00", normal: 46, intrusion: 2 },
  { time: "19:00", normal: 57, intrusion: 2 },
  { time: "20:00", normal: 56, intrusion: 8 },
  { time: "21:00", normal: 61, intrusion: 6 },
  { time: "22:00", normal: 77, intrusion: 9 },
  { time: "23:00", normal: 85, intrusion: 12 },
];
function TrafficChart() {
  return (
    <section className="panel traffic-chart-panel">
      <div className="panel-heading">
        <div>
          <h2>Traffic over the last 24 hours</h2>
          <p>Illustrative normal and intrusion classification counts.</p>
        </div>
        <span className="sample-badge">SAMPLE DATA</span>
      </div>
      <div className="traffic-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trafficChartData}
            margin={{ top: 10, right: 12, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#29434c"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="#91a5b2"
              tick={{ fill: "#91a5b2", fontSize: 11 }}
              interval={3}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#91a5b2"
              tick={{ fill: "#91a5b2", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#102730",
                border: "1px solid #31515c",
                borderRadius: "8px",
                color: "#edf4ff",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="normal"
              name="Normal"
              stroke="#43d8c7"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="intrusion"
              name="Intrusion"
              stroke="#ff706b"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [model, setModel] = useState("decision_tree");
  const [features, setFeatures] = useState({ ...defaultFeatures });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [devicesError, setDevicesError] = useState(""); 
  const [bluetoothResults, setBluetoothResults] = useState([]);
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [externalScanLoading, setExternalScanLoading] = useState(false);
  const [externalScanError, setExternalScanError] = useState("");
  const [externalScanTime, setExternalScanTime] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showModelOptions, setShowModelOptions] = useState(false);
  const [devicePrediction, setDevicePrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [apiOnline, setApiOnline] = useState(null);
  const [checkingApi, setCheckingApi] = useState(false);
  const [detectionHistory, setDetectionHistory] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("netsentinel-history") || "[]"
      );
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(
      "netsentinel-history",
      JSON.stringify(detectionHistory)
    );
  }, [detectionHistory]);
  const totalPredictions = detectionHistory.length;
  const intrusionCount = detectionHistory.filter(
    (item) => Number(item.prediction) === 1
  ).length;
  const normalCount = totalPredictions - intrusionCount;
  const intrusionRate = totalPredictions
    ? ((intrusionCount / totalPredictions) * 100).toFixed(1)
    : "0.0";
  const svmCount = detectionHistory.filter(
    (item) => item.model === "svm"
  ).length;
  const treeCount = detectionHistory.filter(
    (item) => item.model === "decision_tree"
  ).length;
  useEffect(() => {
    checkAPI();
  }, []);
  async function checkAPI() {
    setCheckingApi(true);
    try {
      const response = await fetch(`${API_URL}/health`);
      if (!response.ok) throw new Error("API unavailable");
      setApiOnline(true);
    } catch {
      setApiOnline(false);
    } finally {
      setCheckingApi(false);
    }
  }
 async function scanDevices() {
  setDevicesLoading(true);
  setDevicesError("");

  try {
    const response = await fetch(`${API_URL}/devices`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail ?? data)
      );
    }

    setDevices(data.devices || []);
  } catch (err) {
    setDevicesError(
      `Could not load devices. Confirm that FastAPI is running. ${err.message}`
    );
  } finally {
    setDevicesLoading(false);
  }
}

async function scanExternalDevices() {
  setExternalScanLoading(true);
  setExternalScanError("");

  try {
    const [bluetoothResponse, wifiResponse] = await Promise.all([
      fetch(`${API_URL}/devices/bluetooth`),
      fetch(`${API_URL}/devices/wifi-networks`),
    ]);

    if (!bluetoothResponse.ok || !wifiResponse.ok) {
      throw new Error("A device discovery request failed.");
    }

    const [bluetoothData, wifiData] = await Promise.all([
      bluetoothResponse.json(),
      wifiResponse.json(),
    ]);

    setBluetoothResults(bluetoothData.devices || []);
    setWifiNetworks(wifiData.networks || []);

    const errors = [
      bluetoothData.error && `Bluetooth: ${bluetoothData.error}`,
      wifiData.error && `Wi-Fi: ${wifiData.error}`,
    ].filter(Boolean);

    if (errors.length > 0) {
      setExternalScanError(errors.join(" | "));
    }

    setExternalScanTime(new Date().toLocaleTimeString());
  } catch (error) {
    setExternalScanError(
      error.message || "Unable to scan Bluetooth and Wi-Fi."
    );
  } finally {
    setExternalScanLoading(false);
  }
}

async function predictSelectedDevice(modelName) {
  if (!selectedDevice) {
    setPredictionError("Please select a device first.");
    return;
  }

  setPredictionLoading(true);
  setPredictionError("");
  setDevicePrediction(null);

  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        features: defaultFeatures,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Prediction request failed.");
    }

    setDevicePrediction({
      deviceName: selectedDevice.name,
      model: modelName,
      prediction: data.prediction,
      message: data.message,
      source: "Sample traffic features",
    });
  } catch (error) {
    setPredictionError(error.message || "Could not predict traffic.");
  } finally {
    setPredictionLoading(false);
  }
}

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, features }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail ?? data)
        );
      }
      setResult(data);
      setApiOnline(true);
      const historyEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        model: data.model || model,
        prediction: Number(data.prediction),
        label: data.label,
        message: data.message,
      };
      setDetectionHistory((previous) =>
        [historyEntry, ...previous].slice(0, 500)
      );
    } catch (err) {
      setError(
        `Could not get a prediction. Confirm that FastAPI is running at ${API_URL}. ${err.message}`
      );
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }
  function updateFeature(name, value) {
    setFeatures((previous) => ({ ...previous, [name]: value }));
  }
  function resetForm() {
    setFeatures({ ...defaultFeatures });
    setResult(null);
    setError("");
  }
  function exportCSV() {
    const columns = ["Timestamp", "Model", "Prediction", "Label", "Message"];
    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = detectionHistory.map((item) => [
      new Date(item.timestamp).toLocaleString(),
      item.model === "svm" ? "SVM" : "Decision Tree",
      item.prediction,
      item.label,
      item.message,
    ]);
    const csv = [
      columns.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "netsentinel-detection-history.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function clearHistory() {
    if (window.confirm("Delete all saved predictions from this browser?")) {
      setDetectionHistory([]);
    }
  }
  // LANDING PAGE: keep this conditional before the dashboard return.
  if (showLanding) {
    return (
      <LandingPage
        onGetStarted={() => {
          setShowLanding(false);
          setActiveTab("Dashboard");
        }}
      />
    );
  }
  // DASHBOARD
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">N</div>
          <div>
            <h2>NetSentinel</h2>
            <span>SECURITY ANALYTICS</span>
          </div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="navigation" aria-label="Main navigation">
          
{tabs.map((tab) => (
  <button
    key={tab.id}
    type="button"
    className={`nav-item ${activeTab === tab.label ? "active" : ""}`}
    onClick={() => setActiveTab(tab.label)}
    aria-current={activeTab === tab.label ? "page" : undefined}
  >
    <span className="nav-icon">{tab.icon}</span>
    <span className="nav-copy">
      <strong>{tab.label}</strong>
      <small>
        {{
          dashboard: "Security overview",
          traffic: "Analyze a connection",
          history: "Saved predictions",
          analytics: "Prediction statistics",
          alerts: "Intrusion warnings",
          reports: "Export reports",
          models: "Model comparison",
        }[tab.id]}
      </small>
    </span>
    <span className="nav-arrow">›</span>
  </button>
))}

        </nav>
        <div className="sidebar-card">
          <div className="sidebar-card-icon">◈</div>
          <strong>Detection engine</strong>
          <p>NSL-KDD machine-learning demo</p>
          <span className={`mini-status ${apiOnline ? "good" : apiOnline === false ? "bad" : ""}`}>
            <i />
            {apiOnline ? "API CONNECTED" : apiOnline === false ? "API OFFLINE" : "CHECKING API"}
          </span>
        </div>
        <div className="sidebar-bottom">
          <span className="status-dot" />
          <div>
            <strong>Local environment</strong>
            <small>Academic project demo</small>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              SECURITY <span>/</span> {activeTab.toUpperCase()}
            </div>
            <h1>
              {activeTab === "Dashboard"
                ? "Network Intrusion Detection"
                : activeTab}
            </h1>
            <p>
  {activeTab === "Dashboard"
    ? "Security overview based on recorded machine-learning predictions."
    : activeTab === "Traffic Analysis"
      ? "Configure a sample connection and inspect the model classification."
      : activeTab === "Detection History"
        ? "Review previously recorded prediction results."
        : activeTab === "Analytics"
          ? "Explore traffic classifications and model usage statistics."
          : activeTab === "Alert Center"
            ? "Review alerts generated by intrusion predictions."
            : activeTab === "Reports"
              ? "Export prediction history and prepare a printable report."
              : activeTab === "Live Device Detection"
                ? "Discover devices visible in your local network's ARP cache."
                : "Explore the classifiers trained for this project."}
</p>
          </div>
          <button
            className="outline-button"
            onClick={checkAPI}
            disabled={checkingApi}
          >
            {checkingApi ? "Checking…" : "↻ Check API"}
          </button>
        </header>
        <section className={`status-banner ${apiOnline ? "status-online" : apiOnline === false ? "status-offline" : ""}`}>
          <div className="status-left">
            <span className="pulse-dot" />
            <div>
              <strong>Detection system</strong>
              <p>
                {apiOnline
                  ? "Backend connected successfully"
                  : apiOnline === false
                    ? "Backend connection unavailable — start FastAPI to predict"
                    : "Checking the backend connection…"}
              </p>
            </div>
          </div>
          <span className={`connection-badge ${apiOnline ? "online" : ""}`}>
            {apiOnline ? "CONNECTED" : apiOnline === false ? "OFFLINE" : "CHECKING"}
          </span>
        </section>
        {activeTab === "Dashboard" && (
          <>
            <section className="stats-grid">
              <article className="stat-card">
                <div className="stat-top">
                  <span className="stat-heading">ML MODELS</span>
                  <span className="stat-icon">⬡</span>
                </div>
                <div className="stat-number">02</div>
                <div className="stat-description">Trained classifiers available</div>
                <div className="stat-foot">Decision Tree + SVM</div>
              </article>
              <article className="stat-card">
                <div className="stat-top">
                  <span className="stat-heading">TOTAL PREDICTIONS</span>
                  <span className="stat-icon">⌘</span>
                </div>
                <div className="stat-number">{totalPredictions}</div>
                <div className="stat-description">Saved in this browser</div>
                <div className="stat-foot">Local prediction history</div>
              </article>
              <article className="stat-card">
                <div className="stat-top">
                  <span className="stat-heading">INTRUSION PREDICTIONS</span>
                  <span className="stat-icon">⚠</span>
                </div>
                <div className="stat-number danger-text">{intrusionCount}</div>
                <div className="stat-description">Predictions classified as intrusion</div>
                <div className="stat-foot">Not verified incidents</div>
              </article>
            </section>
            <TrafficChart />
            <section className="dashboard-bottom-grid">
              <article className="panel quick-panel">
                <div className="eyebrow">QUICK ACTION</div>
                <h2>Analyze a traffic record</h2>
                <p>Submit sample features and view the classification.</p>
                <button className="primary-button" onClick={() => setActiveTab("Traffic Analysis")}>
                  Open Traffic Analysis →
                </button>
              </article>
              <article className="panel overview-panel">
                <div className="eyebrow">PROJECT PIPELINE</div>
                <h2>How it works</h2>
                {[
                  ["01", "Input features", "41 NSL-KDD attributes"],
                  ["02", "ML classification", "Decision Tree or SVM"],
                  ["03", "Prediction output", "Normal or Intrusion label"],
                ].map(([number, title, description]) => (
                  <div className="pipeline-step" key={number}>
                    <span>{number}</span>
                    <div><strong>{title}</strong><small>{description}</small></div>
                  </div>
                ))}
              </article>
            </section>
          </>
        )}
        {activeTab === "Traffic Analysis" && (
          <section className="content-grid">
            <section className="panel form-panel">
              <div className="panel-heading">
                <div>
                  <div className="eyebrow">CLASSIFICATION ENGINE</div>
                  <h2>Analyze traffic</h2>
                  <p>Configure a sample connection record.</p>
                </div>
                <span className="panel-icon">⌘</span>
              </div>
              <form onSubmit={handleSubmit}>
                <label className="field-label" htmlFor="model">Machine learning model</label>
                <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
                  <option value="decision_tree">Decision Tree</option>
                  <option value="svm">Support Vector Machine (SVM)</option>
                </select>
                <div className="section-title">CONNECTION DETAILS</div>
                <div className="field-grid">
                  <div>
                    <label className="field-label" htmlFor="protocol">Protocol</label>
                    <select id="protocol" value={features.protocol_type} onChange={(e) => updateFeature("protocol_type", e.target.value)}>
                      <option value="tcp">TCP</option>
                      <option value="udp">UDP</option>
                      <option value="icmp">ICMP</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="service">Service</label>
                    <select id="service" value={features.service} onChange={(e) => updateFeature("service", e.target.value)}>
                      {["http", "private", "domain_u", "smtp", "ftp", "ftp_data", "other", "ecr_i"].map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="flag">Connection flag</label>
                    <select id="flag" value={features.flag} onChange={(e) => updateFeature("flag", e.target.value)}>
                      {["SF", "S0", "REJ", "RSTR", "RSTO", "SH", "S1", "S2", "S3", "OTH"].map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  {numericFields.map(([name, label]) => (
                    <div key={name}>
                      <label className="field-label" htmlFor={name}>{label}</label>
                      <input
                        id={name}
                        type="number"
                        min="0"
                        step="any"
                        value={features[name]}
                        onChange={(e) => updateFeature(name, Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
                <div className="section-title">TRAFFIC BEHAVIOUR</div>
                <div className="field-grid">
                  {rateFields.map(([name, label]) => (
                    <div key={name}>
                      <label className="field-label" htmlFor={name}>{label}</label>
                      <input
                        id={name}
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={features[name]}
                        onChange={(e) => updateFeature(name, Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
                <div className="form-note">
                  <span>ⓘ</span>
                  <p>Some NSL-KDD attributes retain default demonstration values. This is not live packet monitoring.</p>
                </div>
                <div className="form-actions">
                  <button type="button" className="outline-button" onClick={resetForm}>Reset values</button>
                  <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? "Analyzing…" : "Run detection →"}
                  </button>
                </div>
              </form>
            </section>
            <section className="panel result-panel">
              <div className="panel-heading">
                <div>
                  <div className="eyebrow">ANALYSIS OUTPUT</div>
                  <h2>Detection result</h2>
                  <p>Prediction returned by your trained model.</p>
                </div>
              </div>
              {!result && !loading && !error && (
                <div className="empty-result">
                  <div className="empty-icon">⌁</div>
                  <h3>Awaiting analysis</h3>
                  <p>Submit the traffic record to view the classification.</p>
                  <div className="empty-divider" />
                  <div className="mini-row"><span>Selected model</span><strong>{model === "svm" ? "SVM" : "Decision Tree"}</strong></div>
                  <div className="mini-row"><span>Feature count</span><strong>41 attributes</strong></div>
                </div>
              )}
              {loading && (
                <div className="empty-result">
                  <div className="loading-spinner" />
                  <h3>Analyzing traffic</h3>
                  <p>Sending features to the prediction API…</p>
                </div>
              )}
              {error && (
                <div className="error-box">
                  <h3>Prediction error</h3>
                  <p>{error}</p>
                  <button className="outline-button" onClick={checkAPI}>Check connection</button>
                </div>
              )}
              {result && (
                <div className="prediction-result">
                  <div className={`result-symbol ${Number(result.prediction) === 1 ? "danger" : "safe"}`}>
                    {Number(result.prediction) === 1 ? "!" : "✓"}
                  </div>
                  <div className="result-caption">CLASSIFICATION</div>
                  <h3 className={Number(result.prediction) === 1 ? "danger-text" : "safe-text"}>{result.label}</h3>
                  <p className="result-message">{result.message}</p>
                  <div className="result-details">
                    <div className="mini-row"><span>Model used</span><strong>{result.model === "svm" ? "SVM" : "Decision Tree"}</strong></div>
                    <div className="mini-row"><span>Prediction code</span><strong>{result.prediction}</strong></div>
                    <div className="mini-row"><span>Features submitted</span><strong>41 / 41</strong></div>
                  </div>
                  <p className="disclaimer">This is a model prediction, not a confirmed security incident.</p>
                </div>
              )}
              <div className="model-info">
                <div className="model-info-icon">◈</div>
                <div>
                  <strong>NSL-KDD classification</strong>
                  <p>Results depend on the trained model and submitted feature values.</p>
                </div>
              </div>
            </section>
          </section>
        )}
        {activeTab === "Detection History" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">RECORDED CLASSIFICATIONS</div>
                <h2>Detection History</h2>
                <p>Successful predictions saved in this browser.</p>
              </div>
              <span className="panel-icon">◷</span>
            </div>
            <div className="history-summary">
              <div><span>Total predictions</span><strong>{totalPredictions}</strong></div>
              <div><span>Intrusions predicted</span><strong className="danger-text">{intrusionCount}</strong></div>
              <div><span>Normal predicted</span><strong className="safe-text">{normalCount}</strong></div>
            </div>
            <div className="feature-toolbar">
              <button className="outline-button" onClick={exportCSV} disabled={!totalPredictions}>↓ Export CSV</button>
              <button className="outline-button" onClick={clearHistory} disabled={!totalPredictions}>Clear history</button>
            </div>
            {!totalPredictions ? (
              <div className="empty-feature">
                <h3>No predictions recorded yet</h3>
                <p>Run a prediction to start building your history.</p>
                <button className="primary-button" onClick={() => setActiveTab("Traffic Analysis")}>Analyze traffic →</button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="comparison-table feature-table">
                  <thead><tr><th>Date and time</th><th>Model</th><th>Classification</th><th>Status</th></tr></thead>
                  <tbody>
                    {detectionHistory.map((item) => (
                      <tr key={item.id}>
                        <td>{new Date(item.timestamp).toLocaleString()}</td>
                        <td>{item.model === "svm" ? "SVM" : "Decision Tree"}</td>
                        <td>{item.label}</td>
                        <td><span className={`result-pill ${Number(item.prediction) === 1 ? "alert-pill" : "normal-pill"}`}>{Number(item.prediction) === 1 ? "Intrusion" : "Normal"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        {activeTab === "Analytics" && (
          <>
            <section className="stats-grid analytics-stats">
              <article className="stat-card"><div className="stat-heading">TOTAL PREDICTIONS</div><div className="stat-number">{totalPredictions}</div><div className="stat-description">Recorded in this browser</div></article>
              <article className="stat-card"><div className="stat-heading">INTRUSION PREDICTIONS</div><div className="stat-number danger-text">{intrusionCount}</div><div className="stat-description">Classified as intrusion</div></article>
              <article className="stat-card"><div className="stat-heading">INTRUSION RATE</div><div className="stat-number">{intrusionRate}%</div><div className="stat-description">Of saved predictions</div></article>
            </section>
            <section className="content-grid analytics-grid">
              <article className="panel">
                <div className="eyebrow">CLASSIFICATION BREAKDOWN</div>
                <h2>Normal vs Intrusion</h2>
                {[["Normal", normalCount, "normal-fill"], ["Intrusion", intrusionCount, "intrusion-fill"]].map(([label, count, cls]) => (
                  <div className="chart-row" key={label}>
                    <div className="chart-label"><span>{label}</span><strong>{count}</strong></div>
                    <div className="bar-track"><div className={`bar-fill ${cls}`} style={{ width: `${totalPredictions ? count / totalPredictions * 100 : 0}%` }} /></div>
                  </div>
                ))}
                {!totalPredictions && <p className="empty-hint">Run predictions to populate these charts.</p>}
              </article>
              <article className="panel">
                <div className="eyebrow">MODEL USAGE</div>
                <h2>Selected classifiers</h2>
                {[["Decision Tree", treeCount, "normal-fill"], ["SVM", svmCount, "model-fill"]].map(([label, count, cls]) => (
                  <div className="chart-row" key={label}>
                    <div className="chart-label"><span>{label}</span><strong>{count}</strong></div>
                    <div className="bar-track"><div className={`bar-fill ${cls}`} style={{ width: `${totalPredictions ? count / totalPredictions * 100 : 0}%` }} /></div>
                  </div>
                ))}
              </article>
            </section>
            <p className="matrix-disclaimer">These analytics summarize saved browser predictions, not live network activity.</p>
          </>
        )}
        {activeTab === "Alert Center" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">MODEL-GENERATED WARNINGS</div>
                <h2>Threat Alert Center</h2>
                <p>Intrusion predictions require further investigation.</p>
              </div>
              <span className="panel-icon">⚠</span>
            </div>
            <div className="alert-summary"><strong>{intrusionCount}</strong><span>intrusion predictions recorded</span></div>
            {!intrusionCount ? (
              <div className="empty-feature">
                <h3>No intrusion alerts recorded</h3>
                <p>When a model predicts an intrusion, it will appear here.</p>
                <button className="primary-button" onClick={() => setActiveTab("Traffic Analysis")}>Run a prediction →</button>
              </div>
            ) : (
              <div className="alert-list">
                {detectionHistory.filter((item) => Number(item.prediction) === 1).map((item) => (
                  <article className="alert-item" key={item.id}>
                    <div className="alert-indicator">!</div>
                    <div className="alert-content">
                      <div className="alert-title-row"><strong>Intrusion prediction</strong><span className="result-pill alert-pill">REVIEW</span></div>
                      <p>{item.message || "The model classified this traffic record as an intrusion."}</p>
                      <small>{new Date(item.timestamp).toLocaleString()} · {item.model === "svm" ? "SVM" : "Decision Tree"}</small>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <p className="matrix-disclaimer">Alerts are model predictions, not confirmed incidents.</p>
          </section>
        )}
        {activeTab === "Reports" && (
          <>
            <section className="panel">
              <div className="eyebrow">REPORT GENERATION</div>
              <h2>Detection Reports</h2>
              <p className="feature-muted">Export saved predictions or print a report to PDF.</p>
              <div className="report-stat-grid">
                <div><span>Total predictions</span><strong>{totalPredictions}</strong></div>
                <div><span>Intrusion predictions</span><strong className="danger-text">{intrusionCount}</strong></div>
                <div><span>Normal predictions</span><strong className="safe-text">{normalCount}</strong></div>
                <div><span>Intrusion rate</span><strong>{intrusionRate}%</strong></div>
              </div>
              <div className="report-actions">
                <button className="primary-button" onClick={exportCSV} disabled={!totalPredictions}>↓ Download CSV report</button>
                <button className="outline-button" onClick={() => window.print()}>Print / Save as PDF</button>
              </div>
            </section>
            <section className="panel report-preview">
              <div className="eyebrow">REPORT PREVIEW</div>
              <h2>NetSentinel Prediction Summary</h2>
              <p>Generated: {new Date().toLocaleString()}</p>
              <p>Recorded predictions: <strong>{totalPredictions}</strong></p>
              <p>Intrusion classifications: <strong>{intrusionCount}</strong></p>
              <p>Normal classifications: <strong>{normalCount}</strong></p>
              <p>Intrusion percentage: <strong>{intrusionRate}%</strong></p>
              <p className="matrix-disclaimer">These are model classifications, not verified incidents.</p>
            </section>
          </>
        )}
        {activeTab === "ML Models" && (
          <>
            <section className="model-intro panel">
              <div>
                <div className="eyebrow">MODEL LABORATORY</div>
                <h2>Two classifiers. One detection workflow.</h2>
                <p>Both models receive NSL-KDD features through the FastAPI service.</p>
              </div>
              <div className="model-intro-mark">ML<span>41</span></div>
            </section>
            <section className="models-grid">
              <article className="model-card">
                <div className="model-card-top"><span className="model-card-icon">◇</span><span className="model-chip">CLASSIFIER 01</span></div>
                <h2>Decision Tree</h2>
                <p>A tree-based classifier that learns decision rules from training records.</p>
                <div className="model-divider" />
                <div className="mini-row"><span>Model key</span><strong>decision_tree</strong></div>
                <div className="mini-row"><span>Accuracy</span><strong>79.08%</strong></div>
                <button className="primary-button" onClick={() => { setModel("decision_tree"); setActiveTab("Traffic Analysis"); }}>Use Decision Tree →</button>
              </article>
              <article className="model-card">
                <div className="model-card-top"><span className="model-card-icon blue">⌁</span><span className="model-chip blue-chip">CLASSIFIER 02</span></div>
                <h2>Support Vector Machine</h2>
                <p>SVM separates classes using a learned decision boundary.</p>
                <div className="model-divider" />
                <div className="mini-row"><span>Model key</span><strong>svm</strong></div>
                <div className="mini-row"><span>Accuracy</span><strong>75.31%</strong></div>
                <button className="outline-button" onClick={() => { setModel("svm"); setActiveTab("Traffic Analysis"); }}>Use SVM →</button>
              </article>
            </section>
            <ModelComparison />
            <ConfusionMatrices />
            <div className="model-note">
              <span>ⓘ</span>
              <p>Metrics are from held-out NSL-KDD test results, not live monitoring statistics.</p>
            </div>
          </>
        )}

{activeTab === "Live Device Detection" && (
  <section className="panel">
    <div className="panel-heading">
      <div>
        <div className="eyebrow">LOCAL NETWORK</div>
        <h2>Live Device Detection</h2>
        <p>
          Discover ARP-cache devices, nearby Bluetooth devices,
          and visible Wi-Fi networks or mobile hotspots.
        </p>
      </div>
      <span className="panel-icon">⌘</span>
    </div>

    {/* Existing ARP scanner and new external scan button */}
    <div className="feature-toolbar">
      <button
        className="primary-button"
        onClick={scanDevices}
        disabled={devicesLoading}
      >
        {devicesLoading ? "Scanning..." : "↻ Scan Network"}
      </button>

      <button
        className="primary-button"
        onClick={scanExternalDevices}
        disabled={externalScanLoading}
      >
        {externalScanLoading
          ? "Scanning Bluetooth & Wi-Fi..."
          : "Scan Bluetooth & Wi-Fi"}
      </button>

      <span>
        ARP Entries: <strong>{devices.length}</strong>
      </span>
    </div>

    {/* Existing ARP errors */}
    {devicesError && (
      <div className="error-box">
        <h3>Device scan error</h3>
        <p>{devicesError}</p>
      </div>
    )}

    {/* New Bluetooth/Wi-Fi errors */}
    {externalScanError && (
      <div className="error-box">
        <h3>External scan notice</h3>
        <p>{externalScanError}</p>
      </div>
    )}

    {externalScanTime && (
      <p className="feature-muted">
        Last Bluetooth/Wi-Fi scan: {externalScanTime}
      </p>
    )}

    {/* Existing ARP empty state */}
    {!devices.length && !devicesLoading && !devicesError && (
      <div className="empty-feature">
        <h3>No ARP entries loaded yet</h3>
        <p>Click Scan Network to retrieve the current ARP cache.</p>
      </div>
    )}

    {devicesLoading && (
      <p className="feature-muted">
        Retrieving ARP-cache information...
      </p>
    )}

    {/* Existing ARP table */}
    {devices.length > 0 && (
      <div className="table-responsive">
        <table className="comparison-table feature-table">
          <thead>
            <tr>
              <th>IP Address</th>
              <th>MAC Address</th>
              <th>Entry Type</th>
              <th>Status</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={`${device.ip}-${device.mac}`}>
                <td>{device.ip}</td>
                <td>{device.mac}</td>
                <td>{device.entry_type}</td>
                <td>
                  <span className="result-pill normal-pill">
                    {device.status}
                  </span>
                </td>
                <td>
                  {device.last_seen
                    ? new Date(device.last_seen).toLocaleString()
                    : "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* New Bluetooth discovery table */}
    <div className="panel-heading">
      <div>
        <div className="eyebrow">BLUETOOTH</div>
        <h3>Nearby Bluetooth Devices</h3>
        <p>
          Advertised Bluetooth Low Energy device names and signal information.
        </p>
      </div>
      <span className="result-pill">
        {bluetoothResults.length} Found
      </span>
    </div>

    <div className="table-responsive">
      <table className="comparison-table feature-table">
        <thead>
          <tr>
            <th>Device Name</th>
            <th>Bluetooth Address</th>
            <th>Signal (RSSI)</th>
            <th>Discovery Type</th>
          </tr>
        </thead>
        <tbody>
          {bluetoothResults.length === 0 ? (
            <tr>
              <td colSpan={4}>
                No Bluetooth devices found in the latest scan.
                Devices must be discoverable or advertise BLE.
              </td>
            </tr>
          ) : (
            bluetoothResults.map((device, index) => (
              <tr key={`${device.address}-${index}`}>
                <td>{device.name || "Unknown device"}</td>
                <td>{device.address || "Unavailable"}</td>
                <td>{device.rssi ?? "Unavailable"}</td>
                <td>{device.type || "Bluetooth Low Energy"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* New nearby Wi-Fi and hotspot table */}
    <div className="panel-heading">
      <div>
        <div className="eyebrow">WI-FI DISCOVERY</div>
        <h3>Nearby Wi-Fi Networks & Hotspots</h3>
        <p>
          Visible Wi-Fi names; a network name does not confirm
          which phone hosts it or whether a device is connected.
        </p>
      </div>
      <span className="result-pill">
        {wifiNetworks.length} Found
      </span>
    </div>

    <div className="table-responsive">
      <table className="comparison-table feature-table">
        <thead>
          <tr>
            <th>Network / Hotspot Name</th>
            <th>Authentication</th>
            <th>Encryption</th>
            <th>Signal</th>
          </tr>
        </thead>
        <tbody>
          {wifiNetworks.length === 0 ? (
            <tr>
              <td colSpan={4}>
                No Wi-Fi networks found in the latest scan.
              </td>
            </tr>
          ) : (
            wifiNetworks.map((network, index) => (
              <tr key={`${network.ssid}-${index}`}>
                <td>{network.ssid || "(Hidden SSID)"}</td>
                <td>{network.authentication || "Unknown"}</td>
                <td>{network.encryption || "Unknown"}</td>
                <td>{network.signal || "Unknown"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    
<section className="panel">
  <div className="panel-heading">
    <div>
      <div className="eyebrow">MACHINE LEARNING</div>
      <h2>Device Traffic Prediction</h2>
      <p>
        Select a discovered device, then choose a model to classify
        the available sample traffic features.
      </p>
    </div>
  </div>

  <h3>Select a device</h3>

  <div className="table-responsive">
    <table className="comparison-table feature-table">
      <thead>
        <tr>
          <th>Device Name</th>
          <th>Discovery Source</th>
          <th>Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {[
          ...devices.map((d) => ({
            name: d.hostname || d.name || d.ip || "Unknown device",
            address: d.ip || d.mac || "Unavailable",
            source: "ARP",
            id: `arp-${d.ip}-${d.mac}`,
          })),
          ...bluetoothResults.map((d) => ({
            name: d.name || "Unknown Bluetooth device",
            address: d.address || "Unavailable",
            source: "Bluetooth",
            id: `bt-${d.address}`,
          })),
          ...wifiNetworks.map((d, i) => ({
            name: d.ssid || "Hidden Wi-Fi network",
            address: d.bssid || "Unavailable",
            source: "Wi-Fi / Hotspot",
            id: `wifi-${d.bssid || d.ssid}-${i}`,
          })),
        ].map((device) => (
          <tr key={device.id}>
            <td>{device.name}</td>
            <td>{device.source}</td>
            <td>{device.address}</td>
            <td>
              <button
                className="primary-button"
                onClick={() => {
                  setSelectedDevice(device);
                  setShowModelOptions(false);
                  setDevicePrediction(null);
                  setPredictionError("");
                }}
              >
                {selectedDevice?.id === device.id
                  ? "Selected"
                  : "Select Device"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {selectedDevice && (
    <div className="empty-feature">
      <h3>Selected Device: {selectedDevice.name}</h3>
      <p>
        Source: {selectedDevice.source} · Address: {selectedDevice.address}
      </p>

      <button
        className="primary-button"
        onClick={() => setShowModelOptions((previous) => !previous)}
      >
        {showModelOptions ? "Hide Models" : "Predict"}
      </button>
    </div>
  )}

  {showModelOptions && selectedDevice && (
    <div className="empty-feature">
      <h3>Choose a Machine Learning Model</h3>
      <p>Select which existing model to run.</p>

      <div className="feature-toolbar">
        <button
          className="primary-button"
          disabled={predictionLoading}
          onClick={() => predictSelectedDevice("svm")}
        >
          {predictionLoading ? "Predicting..." : "Predict with SVM"}
        </button>

        <button
          className="primary-button"
          disabled={predictionLoading}
          onClick={() => predictSelectedDevice("decision_tree")}
        >
          {predictionLoading
            ? "Predicting..."
            : "Predict with Decision Tree"}
        </button>
      </div>
    </div>
  )}

  {predictionError && (
    <div className="error-box" role="alert">
      <h3>Prediction Error</h3>
      <p>{predictionError}</p>
    </div>
  )}

  {devicePrediction && (
    <div className="empty-feature">
      <div className="eyebrow">PREDICTION RESULT</div>
      <h3>{devicePrediction.deviceName}</h3>
      <p>
        Model:{" "}
        {devicePrediction.model === "svm" ? "SVM" : "Decision Tree"}
      </p>

      <h2
        style={{
          color:
            Number(devicePrediction.prediction) === 1
              ? "#ff5c70"
              : "#35dfb5",
        }}
      >
        {Number(devicePrediction.prediction) === 1
          ? "INTRUSION"
          : "NORMAL"}
      </h2>

      <p>{devicePrediction.message}</p>

      <p className="feature-muted">
        Based on sample traffic features. This is not a verified
        classification of the selected device's actual network traffic.
      </p>
    </div>
  )}
</section>

    {/* Prediction limitation */}
    <div className="empty-feature">
      <h3>Network Traffic Classification</h3>
      <p>
        Device discovery identifies names and visible network information.
        Normal or Intrusion predictions require valid traffic features
        for the existing machine-learning models.
      </p>
    </div>

    <p className="feature-muted">
      ARP entries, Bluetooth devices, and Wi-Fi networks are different
      discovery results. Not every discovered name represents a connected
      device, and some devices may not advertise their names.
    </p>
  
    <p className="matrix-disclaimer">
      This page displays ARP cache entries, which may include broadcast
      or multicast addresses and may not represent every connected device.
    </p>
  </section>
)}
        <footer>
          <span>NETSENTINEL · ACADEMIC PROJECT</span>
          <span>React + FastAPI + Scikit-learn</span>
          <span>Demo inputs · Not live monitoring</span>
        </footer>
      </main>
    </div>
  );
}
export default App;