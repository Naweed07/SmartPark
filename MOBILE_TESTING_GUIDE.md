# SmartPark Mobile Testing & Presentation Guide

This guide explains how to properly run the SmartPark application on a mobile device so that hardware GPS features and the interactive map function perfectly during a live presentation.

## Why is a Tunnel Needed?
Modern mobile browsers (iOS Safari, Android Chrome) block hardware GPS geolocation APIs unless the website is served over a secure **HTTPS** connection. 
Because your local laptop serves the app over `http://localhost:3000` or an insecure Wi-Fi IP address like `http://192.168.x.x`, the mobile device will refuse to drop the location pin. 

To solve this, we use a secure SSH tunnel to instantly wrap your local app in a temporary public HTTPS link.

---

## 🚀 How to Run the App on Your Phone (Step-by-Step)

### Step 1: Start the Backend server
1. Open a terminal in the `backend` folder.
2. Run your server:
   ```bash
   npm run dev
   ```
   *(Ensure it connects to MongoDB and says "Server running on port 5000")*

### Step 2: Start the Frontend Next.js app
1. Open a second terminal in the `frontend` folder.
2. Run the Next.js app:
   ```bash
   npm run dev
   ```
   *(Make sure it is running on port 3000)*

### Step 3: Create the Secure HTTPS Tunnel
We will use a built-in Windows command that requires no installation. It forwards your port 3000 to the web securely.

1. Open a **brand new PowerShell terminal window** anywhere on your computer.
2. Type or paste this exact command:
   ```powershell
   ssh -R 80:localhost:3000 nokey@localhost.run
   ```
3. Press **Enter**.
4. *(Optional)* If it asks "Are you sure you want to continue connecting?", type `yes` and press Enter.

### Step 4: Open the App on Your Phone
1. Look at the output of the terminal from Step 3. At the very bottom, it will print a line that looks like this:
   `tunneled with tls termination, https://[random-string].lhr.life`
2. Type that exact **`https://...lhr.life`** link into your mobile phone's web browser.
3. Your mobile phone will ask **"Would you like to use your current location?"**
4. Click **Allow**.

**🎯 Success!** The map on the Search page and the Owner Dashboard will now lock onto your true physical GPS location!

---

## Troubleshooting

- **Network Error when logging in on mobile:** If you ever restart the Next.js server, make sure you don't accidentally revert the `src/utils/api.js` file back to `localhost:5000`. The frontend is permanently configured to proxy API requests dynamically over the tunnel, making it bulletproof.
- **Tunnel connection closed:** The `localhost.run` tunnel is temporary. If you close your laptop lid or the terminal window dies, the link will break. Simply run the SSH command again to generate a new link before your presentation.
