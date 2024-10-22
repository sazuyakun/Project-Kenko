import express from "express";
import { MongoClient } from "mongodb";
import userRoutes from "./src/routes/user.js";
import cors from "cors";
import FitbitApiClient from "fitbit-node";

const app = express();
const port = 8080;

const fitbitClient = new FitbitApiClient({
  clientId: '23PVQ5',
  clientSecret: '9d883b5b6547fbef5fad1ae6cb8d13e7'
});

// Helper function to get tokens from MongoDB
async function getStoredTokens(db) {
  const tokens = await db.collection('fitbit_tokens').findOne({ type: 'access_tokens' });
  return tokens;
}

// Helper function to save tokens to MongoDB
async function saveTokens(db, tokens) {
  await db.collection('fitbit_tokens').updateOne(
    { type: 'access_tokens' },
    { 
      $set: { 
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        updated_at: new Date()
      }
    },
    { upsert: true }
  );
}

async function startApp() {
  try {
    app.use(cors({
      origin: 'http://localhost:5173', // Allow only this origin
      optionsSuccessStatus: 200,
      credentials: true, // Allow credentials
    }));
  
    app.use(express.json());

    const mongo = await MongoClient.connect(
      "mongodb+srv://nayakswadhin25:1111111q@cluster0.pbbcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    const db = mongo.db();
    app.set("db", db);

    // Add back the authorize route
    app.get("/authorize", (req, res) => {
      // Define the scopes you need
      const scopes = "activity heartrate location nutrition profile";
      const redirectUrl = "http://localhost:8080/callback";
      
      // Get the authorization URL
      const authorizationUrl = fitbitClient.getAuthorizeUrl(
        scopes,
        redirectUrl
      );
      
      // Redirect to Fitbit's authorization page
      res.redirect(authorizationUrl);
    });

    app.get("/callback", async (req, res) => {
      try {
        const { code } = req.query;
        const redirectUrl = "http://localhost:8080/callback";
        const tokenResponse = await fitbitClient.getAccessToken(code, redirectUrl);
        
        // Store tokens in MongoDB
        await saveTokens(db, tokenResponse);

        res.status(200).json({
          message: "Authorization successful",
          ...tokenResponse
        });
      } catch (error) {
        console.error("Error fetching Fitbit access token:", error);
        res.status(500).json({ error: "Failed to get Fitbit access token." });
      }
    });

    // Authentication Status Endpoint
    app.get("/auth/status", async (req, res) => {
      try {
        const tokens = await getStoredTokens(db);
        if (!tokens || !tokens.access_token) {
          return res.status(401).json({ authorized: false });
        }
        return res.json({ authorized: true });
      } catch (error) {
        console.error("Error checking auth status:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // Test endpoint - Get Profile
    app.get("/test/profile", async (req, res) => {
      try {
        const tokens = await getStoredTokens(db);
        if (!tokens || !tokens.access_token) {
          return res.status(401).json({ 
            error: "No access token. Please authorize first at /authorize" 
          });
        }
        const response = await fitbitClient.get("/profile.json", tokens.access_token);
        res.json(response[0]);
      } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // Test endpoint - Get Steps
    app.get("/test/steps", async (req, res) => {
      try {
        const tokens = await getStoredTokens(db);
        if (!tokens || !tokens.access_token) {
          return res.status(401).json({ 
            error: "No access token. Please authorize first at /authorize" 
          });
        }
        const response = await fitbitClient.get("/activities/steps/date/today/1d.json", tokens.access_token);
        res.json(response[0]);
      } catch (error) {
        console.error("Error fetching steps:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // Test endpoint - Get Heart Rate
    app.get("/test/heartrate", async (req, res) => {
      try {
        const tokens = await getStoredTokens(db);
        if (!tokens || !tokens.access_token) {
          return res.status(401).json({ 
            error: "No access token. Please authorize first at /authorize" 
          });
        }
        const response = await fitbitClient.get("/activities/heart/date/today/1d.json", tokens.access_token);
        res.json(response[0]);
      } catch (error) {
        console.error("Error fetching heart rate:", error);
        res.status(500).json({ error: error.message });
      }
    });

  
  
    app.use("/user", userRoutes);

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log('Steps to test:');
      console.log('1. Visit /authorize first');
      console.log('2. After authorization, try these endpoints:');
      console.log('   - /auth/status'); // New status check
      console.log('   - /test/profile');
      console.log('   - /test/steps');
      console.log('   - /test/heartrate');
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

startApp();