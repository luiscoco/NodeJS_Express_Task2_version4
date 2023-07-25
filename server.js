const express = require('express'); // Require Express module
const session = require('express-session'); // Require Express session module
const path = require('path');
const bodyParser = require('body-parser'); // Require body-parser module

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, './public')));

// Add session middleware
app.use(session({
    secret: 'node_tutorial',
    resave: true,
    saveUninitialized: true
}));

// Middleware to parse JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In-memory array to store notes
let notes = []; // Your array of notes (already defined)

// Function to fetch notes from the in-memory array (no actual database needed)
function getNotesFromDatabase() {
  return new Promise((resolve) => {
    // Assuming that the notes are already available in the 'notes' array
    resolve(notes);
  });
}

// Now you can define your routes and other configurations for the app
app.get("/notes", async function (req, res) {
  try {
    const notes = await getNotesFromDatabase();
    console.log("reading notes", notes);
    res.send(notes);
  } catch (error) {
    console.error("Error reading notes", error);
    res.status(500).send("Error reading notes");
  }
});

app.post("/notes", async function (req, res) {
    try {
        let note = req.body.note; // Assuming the request contains the 'note' field in the body
        notes.push({ id: Date.now(), text: note });
        console.log("added note", notes);
        res.end();
    } catch (err) {
        // Handle any potential errors here
        console.error("Error occurred:", err);
        res.status(500).send("Something went wrong.");
    }
});

app.delete("/notes/:id", async function (req, res) {
    try {
        const noteId = parseInt(req.params.id);

        // Simulating an asynchronous operation using setTimeout
        await new Promise((resolve) => setTimeout(resolve, 1000));

        notes = notes.filter((note) => note.id !== noteId);
        console.log("deleted note", notes);
        res.end();
    } catch (err) {
        // Handle any potential errors here
        console.error("Error occurred:", err);
        res.status(500).send("Something went wrong.");
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
