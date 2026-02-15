import { useState, useEffect } from "react";

export default function ApiTester() {
  // Base URL
  const [baseUrl, setBaseUrl] = useState(
    localStorage.getItem("baseUrl") || "https://jsonplaceholder.typicode.com",
  );

  // Request config
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/posts/1");

  // Variables (like tokens)
  const [variables, setVariables] = useState(
    localStorage.getItem("variables") || "TOKEN=abc123",
  );

  // Headers
  const [headers, setHeaders] = useState(
    localStorage.getItem("headers") || "Content-Type: application/json",
  );

  // Body
  const [body, setBody] = useState("{}");

  // Response
  const [response, setResponse] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("baseUrl", baseUrl);
    localStorage.setItem("variables", variables);
    localStorage.setItem("headers", headers);
  }, [baseUrl, variables, headers]);

  // Parse variables like KEY=value
  const parseVariables = () => {
    const map: Record<string, string> = {};
    variables.split("\n").forEach((line: string) => {
      const [key, value] = line.split("=");
      if (key && value) map[key.trim()] = value.trim();
    });
    return map;
  };

  // Replace {{VAR}} in strings
  const applyVariables = (str: any, vars: any) => {
    let result = str;
    Object.keys(vars).forEach((key) => {
      result = result.replaceAll(`{{${key}}}`, vars[key]);
    });
    return result;
  };

  // Parse headers
  const parseHeaders = (vars: Record<string, string>) => {
    const obj: Record<string, string> = {};
    headers.split("\n").forEach((line) => {
      const [key, value] = line.split(":");
      if (key && value) {
        obj[key.trim()] = applyVariables(value.trim(), vars);
      }
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

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>Test Your Api</h2>

      {/* Base URL */}
      <div>
        <label>Base URL</label>
        <input
          style={{ width: "100%" }}
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>

      {/* Method + Endpoint */}
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

      {/* Variables */}
      <div style={{ marginTop: 10 }}>
        <label>Variables (KEY=value)</label>
        <textarea
          rows={4}
          style={{ width: "100%" }}
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
        />
      </div>

      {/* Headers */}
      <div style={{ marginTop: 10 }}>
        <label>Headers (Key: Value)</label>
        <textarea
          rows={4}
          style={{ width: "100%" }}
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
        />
      </div>

      {/* Body */}
      <div style={{ marginTop: 10 }}>
        <label>Body (JSON)</label>
        <textarea
          rows={5}
          style={{ width: "100%" }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      {/* Response */}
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
