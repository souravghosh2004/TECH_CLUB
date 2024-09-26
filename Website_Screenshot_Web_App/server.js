const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to serve static files and parse JSON
app.use(express.static('public'));
app.use(express.json());

// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle screenshot capture
app.post('/capture', async (req, res) => {
    const { url } = req.body;

    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return res.status(400).send('Invalid URL');
    }

    const fileName = `screenshot-${Date.now()}.png`;
    const filePath = path.join(__dirname, fileName); // Full path to the screenshot file

    try {
        // Launch Puppeteer in headless mode
        const browser = await puppeteer.launch({
            headless: true, // Set to false for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add sandbox flags if running in restricted environments
        });

        const page = await browser.newPage();

        // Navigate to the provided URL with increased timeout and wait for network idle
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 }); // Timeout set to 60 seconds

        // Take a screenshot and save it locally
        await page.screenshot({ path: filePath });

        // Close the browser after capturing the screenshot
        await browser.close();

        // Set headers to force download the screenshot
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error("Error downloading screenshot:", err);
                res.status(500).send('Error downloading the screenshot');
            }
            // Clean up the file after download
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        // Log any error that occurs during the screenshot process
        console.error("Error capturing screenshot:", error);
        res.status(500).send('Failed to capture screenshot: ' + error.message);
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
