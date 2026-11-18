// src/controllers/create.controller.js

import axios from "axios";

// Define and EXPORT the function. Do not call it.
export const fetchAndSendData = async (req, res) => {
  try {
    // 1. Fetch data from your other API
    console.log("Fetching data from internal API...");
    const response = await axios.get("http://10.250.50.214:3000/api/v1/admin/formated");
    const dataToForward = response.data;

    console.log("Data fetched. Forwarding to Python AI service...", dataToForward);

    // 2. Send the fetched data to the Python AI service
    const pythonResponse = await axios.post("http://10.250.50.77:8000/generate", dataToForward);

    console.log("Received response from Python AI service.");

    // 3. Send the final timetable back to the original client (e.g., your website)
    res.status(200).json(pythonResponse.data);

  } catch (error) {
    // This is the robust error handling from our previous discussions
    if (error.response) {
      console.error("Error from Python service:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error("Network Error: Could not connect to a service.", error.message);
      return res.status(503).json({ error: "A required service is unavailable." });
    } else {
      console.error("An unexpected error occurred:", error.message);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  }
};
// fetchAndSendData()

// DO NOT ADD fetchAndSendData() HERE