const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

// GET /monitor/health
router.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  const status = dbState === 1 ? "up" : dbState === 2 ? "connecting" : "down";

  res.json({
    status,
    dbState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// GET /monitor/metrics
router.get("/metrics", (req, res) => {
  try {
    const memory = process.memoryUsage();

    res.json({
      pid: process.pid,
      uptime: process.uptime(),
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error(`Fehler bei /monitor/metrics: ${err.message}`);
    res.status(500).json({ message: "Interner Monitoring-Fehler" });
  }
});

module.exports = router;
