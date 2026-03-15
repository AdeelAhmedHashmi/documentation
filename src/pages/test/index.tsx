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
    <div className="api-tester">
      <div className="api-tester__header">
        <h2>Test Your API</h2>
        <p>Quickly send requests and inspect responses.</p>
      </div>

      <div className="api-tester__field">
        <label className="api-tester__label">Base URL</label>
        <input
          className="api-tester__input"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>

      <div className="api-tester__row">
        <select
          className="api-tester__select"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>
        <input
          className="api-tester__input api-tester__input--grow"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        <button className="api-tester__button" onClick={sendRequest}>
          Send
        </button>
      </div>

      <div className="api-tester__field">
        <label className="api-tester__label">Variables (KEY=value)</label>
        <textarea
          rows={4}
          className="api-tester__textarea"
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
        />
      </div>

      <div className="api-tester__field">
        <label className="api-tester__label">Headers (Key: Value)</label>
        <textarea
          rows={4}
          className="api-tester__textarea"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
        />
      </div>

      <div className="api-tester__field">
        <label className="api-tester__label">Body (JSON)</label>
        <textarea
          rows={5}
          className="api-tester__textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="api-tester__response">
        <h3>Response</h3>
        {loading ? (
          <p className="api-tester__muted">Loading...</p>
        ) : (
          <pre className="api-tester__pre">
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
