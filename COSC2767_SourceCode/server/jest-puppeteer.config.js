module.exports = {
  launch: {
    args: [
      "--no-startup-window",
      "--no-first-run",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ],

    waitForInitialPage: false,
    headless: true, // set to false for debugging
    slowMo: 50, // Add a delay to visualize interactions
  },
  // server: {
  //   command: "docker run -p 27017:27017 --name test_db mongo && npm run dev", // Command to start your backend server
  //   port: 3000, // Port your backend runs on
  //   launchTimeout: 15000, // Timeout to wait for the server to start
  // },
  browserContext: "incognito", // Use "incognito" if you want isolated sessions per test
};
