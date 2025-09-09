// Background job to process surf alerts
// This would typically run as a cron job or scheduled function

import { processAlerts } from "../lib/email-alerts.js"

async function runAlertProcessor() {
  console.log("[ALERT PROCESSOR] Starting alert processing job...")

  try {
    await processAlerts()
    console.log("[ALERT PROCESSOR] Alert processing completed successfully")
  } catch (error) {
    console.error("[ALERT PROCESSOR] Error processing alerts:", error)
  }
}

// Run the processor
runAlertProcessor()

// In a production environment, this would be scheduled to run every 3 hours:
// 0 */3 * * * node scripts/04-alert-processor.js
