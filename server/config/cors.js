const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://nexamind-ai-qwog.vercel.app",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

if (process.env.RAILWAY_PUBLIC_DOMAIN) {
  allowedOrigins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (origin.endsWith(".vercel.app") || origin.endsWith(".github.io")) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
