const fs = require("fs");
let path = require("path");
module.exports = function(app) {
    app.get("/api/notes", (req, res) => {
        res.json(JSON.parse(fs.readFileSync(path.join(__dirname, "../db/db.json"), 'utf8'))); //return whole database
    });
    app.post("/api/notes", (req, res) => {
        const dbpath = path.join(__dirname, "../db/db.json");
        let existingIds = [],
            newNote = req.body;
        let db = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
        db.forEach(data => existingIds.push(data.id)); //get existing id's
        //generate new ids until you get a unqiue one
        do {
            newNote.id = [...Array((10 + ~~(Math.random() * 20)))].map(i => (Math.floor(Math.random() * 36)).toString(36)).join('');
        } while (existingIds.includes(newNote.id));
        db.push(newNote); //add to js db
        fs.writeFileSync(dbpath, JSON.stringify(db)); //save to file
        res.json(newNote);
    });
    app.delete("/api/notes/:id", (req, res) => {
        const dbpath = path.join(__dirname, "../db/db.json");
        let db = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
        const deleteIndex = db.indexOf(db.find(element => element.id === req.params.id)); // get index
        db.splice(deleteIndex, 1); //deleting from array
        fs.writeFileSync(dbpath, JSON.stringify(db)); //save
        res.json(req.body);
    });
};