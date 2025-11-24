"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function AuthTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // Registrierung
  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setMessage("✅ Registrierung erfolgreich! Check deine E-Mails.");
      console.log("SignUp:", data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setMessage("❌ Fehler: " + errorMessage);
    }
  };

  // Login
  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setMessage("✅ Login erfolgreich!");
      setUser(data.user);
      console.log("SignIn:", data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setMessage("❌ Fehler: " + errorMessage);
    }
  };

  // Aktuellen User checken
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    setMessage(data.user ? "✅ User eingeloggt" : "❌ Kein User eingeloggt");
    console.log("Current User:", data.user);
  };

  // Logout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMessage("✅ Logout erfolgreich");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>🔐 Supabase Auth Test</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            fontSize: "16px",
          }}
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={handleSignUp} style={{ padding: "10px 20px" }}>
          Registrieren
        </button>
        <button onClick={handleSignIn} style={{ padding: "10px 20px" }}>
          Einloggen
        </button>
        <button onClick={checkUser} style={{ padding: "10px 20px" }}>
          User checken
        </button>
        <button onClick={handleSignOut} style={{ padding: "10px 20px" }}>
          Logout
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: "15px",
            background: message.includes("✅") ? "#d4edda" : "#f8d7da",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          {message}
        </div>
      )}

      {user && (
        <div
          style={{
            padding: "15px",
            background: "#e7f3ff",
            borderRadius: "5px",
          }}
        >
          <h3>Eingeloggter User:</h3>
          <pre style={{ fontSize: "12px" }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
