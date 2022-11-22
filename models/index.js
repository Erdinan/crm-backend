require('dotenv').config()
const mongoose = require("mongoose")

CONNECTION_STRING = "mongodb+srv://Erdinan:Angkajaya123@crm-project.79vnwjs.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(MONGO_URL || "mongodb://localhost", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "CRM-Project"
})

const db = mongoose.connection

db.on("error", err => {
  console.error(err);
  process.exit(1)
})

db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port)
})

require("./contact")
require("./event")