const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express  = require("express");
const cors     = require("cors");
const axios    = require("axios");
const supabase = require("./supabase");

const app = express();
app.use(express.json());
app.use(cors());

// ═══════════════════════════════════════════════════
//  AUTH  —  /auth
//  action: "signup" | "login"
//  Stores users in the public.users table (username, password, role)
// ═══════════════════════════════════════════════════
app.post("/auth", async (req, res) => {
  const { username, password, action, role } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Username and password are required." });
  }

  // ── Sign Up ──────────────────────────────────────
  if (action === "signup") {
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password, role: role || 'patient' }])
      .select()
      .single();

    if (error) {
      console.error("[Auth] Signup error:", error);
      return res.json({ success: false, message: error.message || "Signup failed." });
    }

    return res.json({
      success: true,
      message: "Signup successful!",
      userId: data.id,
    });
  }

  // ── Login ────────────────────────────────────────
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    return res.json({ success: false, message: "Invalid credentials." });
  }

  res.json({
    success: true,
    message: "Login successful!",
    userId: data.id,
    role: data.role // Send role back to frontend just in case
  });
});

// ═══════════════════════════════════════════════════
//  AI ROUTE  —  /store-report
//  Calls the Python AI backend and stores the result in medical_reports
// ═══════════════════════════════════════════════════
app.post("/store-report", async (req, res) => {
  const { userId, heartRate, spo2, temperature, scanType } = req.body;

  try {
    // 1. Call the Python AI Backend for analysis
    const response = await axios.post("http://localhost:8000/api/analyze-vitals", {
      heart_rate: heartRate,
      spo2: spo2,
      temperature: temperature,
      ecg_irregularity: 0.0
    });

    const aiOut = response.data;
    const confidenceScore = aiOut.lstm_result?.confidence 
      ? Math.round(aiOut.lstm_result.confidence * 100) 
      : (aiOut.confidence ? Math.round(aiOut.confidence * 100) : null);

    // 2. Save the scan metrics AND the AI output into the database
    await supabase.from("medical_reports").insert([
      {
        user_id:           userId || null,
        scan_type:         scanType || 'Targeted Scan',
        heart_rate:        heartRate,
        spo2:              spo2,
        temperature:       temperature,
        condition:         aiOut.ui_label || aiOut.condition || "Unknown",
        diagnosis_summary: aiOut.voice_summary || aiOut.consensus || "No details",
        confidence_score:  confidenceScore
      },
    ]);

    // 3. Return the AI results to the frontend UI
    res.json({
      success: true,
      data: aiOut
    });
  } catch (err) {
    console.error("[Store Report] Error:", err.message);
    res.json({ success: false, message: "AI processing or DB storage failed.", error: err.message });
  }
});

// ═══════════════════════════════════════════════════
//  Health check
// ═══════════════════════════════════════════════════
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = 5003;
app.listen(PORT, () => console.log(`[VitalsGuard Node API] Running on port ${PORT}`));
