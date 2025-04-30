const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).send("مرحبا، CORS شغّال!");
  });
});
