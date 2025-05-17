document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOM fully loaded");

  const nameField = document.getElementById('name');
  const timeField = document.getElementById('time');
  const locationField = document.getElementById('location');
  const submitButton = document.querySelector('input[type="submit"]');
  const form = document.getElementById('userForm');

  if (!nameField || !submitButton || !form) {
    console.error("❌ Error: Required form elements not found!");
    return;
  }

  submitButton.disabled = true; // Disable submit button by default
  timeField.value = new Date().toLocaleString(); // Auto-fill current time

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        locationField.value = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
        console.log("📍 Location fetched successfully");
      },
      (error) => {
        console.error("⚠️ Error fetching location:", error.message);
        alert("❗ Please allow location access for accurate attendance tracking.");
      }
    );
  }

  console.log("⏳ Setting up face recognition interval...");

  setInterval(async () => {
    console.log("🔍 Checking face recognition...");

    try {
      const response = await fetch('http://127.0.0.1:5000/get_name', { cache: "no-cache" });

      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

      const data = await response.json();
      console.log("✅ Detected Name:", data.name || "No name detected");

      if (data.name && data.name !== "Unknown") {
        nameField.value = data.name;
        submitButton.disabled = false; // Enable submit button
      } else {
        nameField.value = "";
        submitButton.disabled = true; // Disable submit button
      }
    } catch (error) {
      console.error("❌ Error fetching name:", error);
    }
  }, 2000);

  // ✅ Prevent redirection & send form data via fetch()
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop form from redirecting

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

      alert("✅ Attendance submitted successfully!"); // Show popup
      form.reset(); // Clear form fields after submission
      submitButton.disabled = true; // Disable submit button again
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("❌ Submission failed. Please try again.");
    }
  });
});
