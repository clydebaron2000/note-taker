const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let path = require("path");
const idLength = (10 + ~~(Math.random() * 20));
module.exports = function(app) {
    app.get("/api/notes", (req, res) => {
        const dbPath = path.join(__dirname, "../db/db.json");
        (async() => {
            const db = JSON.parse(await readFileAsync(dbPath, 'utf8'));
            res.json(db); //return whole database
        })();
    });
    app.post("/api/notes", (req, res) => {
        // req.body is available since we're using the body parsing middleware
        const dbPath = path.join(__dirname, "../db/db.json");
        (async() => {
            let existingIds = [],
                newID, newNote = req.body;
            let db = JSON.parse(await readFileAsync(dbPath, 'utf8'));
            //get existing id's
            db.forEach(data => existingIds.push(data.id));
            //generate new ids until you get a unqiue one
            do {
                newID = [...Array(idLength)].map(i => (Math.floor(Math.random() * 36)).toString(36)).join('');
            } while (existingIds.includes(newID));
            //assign
            newNote.id = newID;
            //add do js db
            db.push(newNote);
            //save to file
            writeFileAsync(dbPath, JSON.stringify(db));
            res.json(newNote);
        })();
    });
    app.delete("/api/notes/:id", (req, res) => {
        const dbPath = path.join(__dirname, "../db/db.json");
        (async() => {
            let db = JSON.parse(await readFileAsync(dbPath, 'utf8'));
            //get delete index from .find method. req.params returns a string
            const deleteIndex = db.indexOf(db.find(element => element.id === req.params.id)); // get index
            db.splice(deleteIndex, 1); //deleting from array
            writeFileAsync(dbPath, JSON.stringify(db)); //save
            res.json(req.body);
        })();
    });
};