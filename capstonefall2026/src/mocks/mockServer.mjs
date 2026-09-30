// Article followed: https://medium.com/@irbaye/setting-up-express-from-scratch-a-step-by-step-guide-cbc142213089
// Also, ChatGPT was used to help with boilerplate code and the first API method (POST volunteer-inquiries)
import express from "express";
import { validateVolunteerInquiry } from "./validation-logic/volunteerInquiries.mjs";
import { validationError, generateId } from "./validation-logic/validationHelpers.mjs";
import cors from "cors";

const app = express();
const PORT = 4000;

// Allow browser to access this mock server
app.use(cors({
  origin: "http://localhost:3000",
}));

// !!! IMPORTANT !!! Parse incoming JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// https://blog.postman.com/how-to-create-a-rest-api-with-node-js-and-express/
// Use async to prevent blocking
app.post("/api/v1/volunteer-inquiries", async (req, res) => {
  const body = req.body;

  // ---- Validation ----
  const fields = await validateVolunteerInquiry(body);
  
  // ---- Responses -----
  // Validation failure response
  if (Object.keys(fields).length > 0) {
        return validationError(res, fields);
    }

 // Success response
    res.status(201).json({
         requestId: generateId("TS"),
         status: "received",
        message: "Your assistance request has been received.",
    })
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});