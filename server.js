const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));

app.use(session({
    secret: 'node_tutorial',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    if (!req.session.notes) {
        req.session.notes = [];
    }
    next();
});

function getNotesFromDatabase(req) {
    return req.session.notes || [];
}

app.get("/notes", async function (req, res) {
    try {
        const notes = getNotesFromDatabase(req);
        console.log("reading notes", notes);
        res.send(notes);
    } catch (error) {
        console.error("Error reading notes", error);
        res.status(500).json({ error: "Error reading notes" });
    }
});

app.post("/notes", async function (req, res) {
    try {
        let note = req.body.note;
        req.session.notes.push({ id: Date.now(), text: note });
        console.log("added note", req.session.notes);
        res.end();
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

app.delete("/notes/:id", async function (req, res) {
    try {
        const noteId = parseInt(req.params.id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        req.session.notes = req.session.notes.filter((note) => note.id !== noteId);
        console.log("deleted note", req.session.notes);
        res.end();
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
