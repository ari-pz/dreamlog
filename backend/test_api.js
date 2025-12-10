// TEST API ENDPOINTS DE INDEX.JS

const axios = require("axios");

const baseUrl = "http://localhost:3000/api";

// Lista de endpoints a testear
const endpoints = [
  "/users",
  "/posts",
  "/categories"
//  "/lunas",
//  "/comments"
];


async function testEndpoints() {
  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(baseUrl + endpoint);
      console.log(`✔️  GET ${endpoint} OK - status ${res.status}`);
    } catch (err) {
      console.log(`❌ GET ${endpoint} ERROR`);
      if (err.response) {
        console.log("status:", err.response.status);
        console.log("message:", err.response.data);
      } else {
        console.log(err.message);
      }
    }
  }
}

testEndpoints();

