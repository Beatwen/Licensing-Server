import axios from 'axios';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';
const isDevelopment = isBrowser ? import.meta.env.DEV : process.env.NODE_ENV === 'development';
const API_URL = isBrowser ? import.meta.env.VITE_API_URL : process.env.API_URL;
const API_KEY = isBrowser ? import.meta.env.VITE_API_KEY : process.env.API_KEY;

// Maximum number of retries for sending logs
const MAX_RETRIES = 3;

// Disable server logging in development mode to prevent 403 errors
const ENABLE_SERVER_LOGGING = !isDevelopment;

class Logger {
  private static instance: Logger;
  private logQueue: any[] = [];
  private isProcessing = false;
  private retryCount = 0;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async processQueue() {
    if (this.isProcessing || this.logQueue.length === 0) return;

    this.isProcessing = true;
    const logs = [...this.logQueue];
    this.logQueue = [];

    try {
      // Only attempt to send logs if server logging is enabled and we have an API URL and API KEY
      if (ENABLE_SERVER_LOGGING && API_URL && API_KEY) {
        await axios.post(`${API_URL}/logs`, { logs }, {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
          }
        });
        
        // Reset retry count on success
        this.retryCount = 0;
      } else if (ENABLE_SERVER_LOGGING) {
        console.warn('Logger: Missing API_URL or API_KEY, logs will not be sent to server');
      }
    } catch (error) {
      console.error('Failed to send logs to server:', error);
      
      // Increment retry count
      this.retryCount++;
      
      // If we've exceeded the retry limit, stop trying to send logs
      if (this.retryCount >= MAX_RETRIES) {
        console.warn(`Logger: Exceeded maximum retry attempts (${MAX_RETRIES}), logs will not be sent to server`);
        this.retryCount = 0;
      } else {
        // If sending fails, add logs back to queue
        this.logQueue = [...logs, ...this.logQueue];
      }
    }

    this.isProcessing = false;
    if (this.logQueue.length > 0 && this.retryCount < MAX_RETRIES) {
      this.processQueue();
    }
  }

  private log(level: string, ...args: any[]) {
    // Always log to console in development
    if (isDevelopment) {
      const timestamp = new Date().toISOString();
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : arg
      ).join(' ');

      // Log to console with appropriate method
      switch (level) {
        case 'error':
          console.error(`[${timestamp}] ${message}`);
          break;
        case 'warn':
          console.warn(`[${timestamp}] ${message}`);
          break;
        case 'debug':
          console.debug(`[${timestamp}] ${message}`);
          break;
        default:
          console.log(`[${timestamp}] ${message}`);
      }

      // Add to queue for server logging only if server logging is enabled
      if (ENABLE_SERVER_LOGGING) {
        this.logQueue.push({
          timestamp,
          level,
          message,
          source: 'frontend'
        });

        this.processQueue();
      }
    }
  }

  public info(...args: any[]) {
    this.log('info', ...args);
  }

  public error(...args: any[]) {
    this.log('error', ...args);
  }

  public warn(...args: any[]) {
    this.log('warn', ...args);
  }

  public debug(...args: any[]) {
    this.log('debug', ...args);
  }
}

export const logger = Logger.getInstance(); 