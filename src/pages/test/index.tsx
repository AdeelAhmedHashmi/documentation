import { useState, useEffect } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

function ApiTesterComponent() {
  // Safe initial state for SSR
  const [baseUrl, setBaseUrl] = useState(
    "https://jsonplaceholder.typicode.com",
  );
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/posts/1");
  const [variables, setVariables] = useState("TOKEN=abc123");
  const [headers, setHeaders] = useState("Content-Type: application/json");
  const [body, setBody] = useState("{}");
  const [response, setResponse] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);

  // Load from localStorage after mount
  useEffect(() => {
    const storedBaseUrl = localStorage.getItem("baseUrl");
    const storedVariables = localStorage.getItem("variables");
    const storedHeaders = localStorage.getItem("headers");

    if (storedBaseUrl) setBaseUrl(storedBaseUrl);
    if (storedVariables) setVariables(storedVariables);
    if (storedHeaders) setHeaders(storedHeaders);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("baseUrl", baseUrl);
    localStorage.setItem("variables", variables);
    localStorage.setItem("headers", headers);
  }, [baseUrl, variables, headers]);

  // Helper functions
  const parseVariables = () => {
    const map: Record<string, string> = {};
    variables.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) map[key.trim()] = value.trim();
    });
    return map;
  };

  const applyVariables = (str: string, vars: Record<string, string>) => {
    let result = str;
    Object.keys(vars).forEach((key) => {
      result = result.replaceAll(`{{${key}}}`, vars[key]);
    });
    return result;
  };

  const parseHeaders = (vars: Record<string, string>) => {
    const obj: Record<string, string> = {};
    headers.split("\n").forEach((line) => {
      const [key, value] = line.split(":");
      if (key && value) obj[key.trim()] = applyVariables(value.trim(), vars);
    });
    return obj;
  };

  const sendRequest = async () => {
    try {
      setLoading(true);
      const vars = parseVariables();

      const url = applyVariables(baseUrl + endpoint, vars);
      const finalHeaders = parseHeaders(vars);
      const finalBody = applyVariables(body, vars);

      const res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: method !== "GET" ? finalBody : undefined,
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>Test Your API</h2>

      <div>
        <label>Base URL</label>
        <input
          style={{ width: "100%" }}
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>
        <input
          style={{ flex: 1, marginLeft: 10 }}
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        <button onClick={sendRequest} style={{ marginLeft: 10 }}>
          Send
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Variables (KEY=value)</label>
        <textarea
          rows={4}
          style={{ width: "100%" }}
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Headers (Key: Value)</label>
        <textarea
          rows={4}
          style={{ width: "100%" }}
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Body (JSON)</label>
        <textarea
          rows={5}
          style={{ width: "100%" }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Response</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <pre style={{ background: "#111", color: "#0f0", padding: 10 }}>
            {response ? JSON.stringify(response, null, 2) : "No response yet"}
          </pre>
        )}
      </div>
    </div>
  );
}

// Wrap in BrowserOnly so Docusaurus doesn't SSR it
export default function ApiTester() {
  return <BrowserOnly>{() => <ApiTesterComponent />}</BrowserOnly>;
}
