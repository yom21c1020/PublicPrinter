const ipp = require("ipp");
const fs = require("fs");

let indev_flag = true;
let config;

if(indev_flag) config = null;
else {
    try {
        config = JSON.parse(fs.readFileSync("./config.json"));
    } catch {
        config = null;
    }
}


let printer_ip;

if(indev_flag) printer_ip = "192.168.0.170";
else printer_ip = config.ip;

let printer = ipp.printer("http://" + toString(printer_ip) + ":631/ipp/print");
let buffer = fs.readFileSync("test.pdf");

printer.execute("Print-Job", {
    "operation-attributes-tag": {
//TODO: change requesting-user-name for real user + job name
//document_format should be changed
        "requesting-user-name": "user",
        "job-name": "Test",
        "document-format": "application/pdf"
    },
    data: buffer
}, (err, res) => {
    if(err) console.log(err);
    else console.log(res);
});

