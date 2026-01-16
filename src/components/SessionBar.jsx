import { useState } from "react";
import { useAppStore } from "../store/AppStore";

export default function SessionBar() {
  const { session, loginAs, setRole, logout } = useAppStore();
 
  console.log("SessionBar sees session:", session);
  
  const [name, setName] = useState("");
  const [role, setLocalRole] = useState("public");

  if (!session) {
    return (
      <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <strong>Start Session</strong>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select value={role} onChange={(e) => setLocalRole(e.target.value)}>
            <option value="public">Public</option>
            <option value="community">Community</option>
          </select>
~
          <button
            onClick={() => {
              if (!name.trim()) return;
              loginAs({ name: name.trim(), role });
            }}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 12,
        borderBottom: "1px solid #eee",
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div>
        Signed in as <strong>{session.name}</strong> ({session.role})
      </div>

      <select value={session.role} onChange={(e) => setRole(e.target.value)}>
        <option value="public">Public</option>
        <option value="community">Community</option>
      </select>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

