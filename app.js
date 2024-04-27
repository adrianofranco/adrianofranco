// Import required modules
const http = require('http');
const fs = require('fs');
const path = require('path');


function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Define the path to the text file
const filePath = path.join(__dirname, `ascii-art/${rand(1, 3)}.txt`);

// Read the file and split it into an array of strings
const randomStrings = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
let asciiArt = Array.from(randomStrings).map(ascii => `<span>${ascii}</span>`).join('');

console.log(asciiArt); 

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Set response headers
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Handle requests to the /generate endpoint
    if (req.url === '/generate') {
        // Get a random string from the array

        // Send the random string as the response
        res.end(randomStrings);
    } else {
        // Handle requests to other endpoints
        res.end('Invalid endpoint');
    }
});

// Start the server on port 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});