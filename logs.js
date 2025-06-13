const date = require("date-fns");
const { v4: uuidv4 } = require("uuid");


const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, fileName) => {
    const dateTime = `${date.format(new Date(), "yyyy-MM-dd HH:mm:ss")}`;
    const logTime = `${dateTime} - ${uuidv4()} - ${message}\n`;
    console.log(logTime);

    try {
        if (!fs.existsSync(path.join(__dirname, "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "logs"));
        }
        if (fileName === "errLog.txt") {
            await fsPromises.appendFile(path.join(__dirname, "logs", "errLog.txt"), logTime);
        } else {
            await fsPromises.appendFile(path.join(__dirname, "logs", fileName), logTime);
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = logEvents;