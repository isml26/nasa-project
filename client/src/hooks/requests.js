import axios from "axios"

const API_URL = "";
async function httpGetPlanets() {
  const res = await axios.get(`${API_URL}/planets`);
  return res.data;
}
// Load launches, sort by flight number, and return as JSONN
async function httpGetLaunches() {
  const res = await axios.get(`${API_URL}/launches`);
  const data = res.data
  return data.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.log(error);
    return {
      of: false,
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};