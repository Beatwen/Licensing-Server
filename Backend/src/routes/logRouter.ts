import { Router, Request, Response } from "express";

const logRouter = Router();

logRouter.post("/", (req: Request, res: Response) => {
  const { logs } = req.body;

  if (!Array.isArray(logs)) {
    res.status(400).json({ error: "Logs must be an array" });
    return;
  }

  logs.forEach((log) => {
    const { timestamp, level, message, source } = log;
    // Format the log message
    const formattedMessage = `[${source}] ${timestamp} ${level.toUpperCase()}: ${message}`;
    
    // Use the appropriate console method based on log level
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  });

  res.status(200).json({ success: true });
});

export default logRouter; 