const ipp = require("ipp");
const fs = require("fs");

let indev_flag = true;
let config;

if(indev_flag) config = null;
else {
    try {
        config = JSON.parse(fs.readFileSync("./config.json"));
    } catch (e) {
        config = null;
        console.log("Error occured when parsing .config file: " + e);
    }
}


let printer_ip;

if(indev_flag) printer_ip = "192.168.0.170";
else printer_ip = config.ip;

let printer = ipp.Printer(`http://${printer_ip}:631/ipp/print`);
let buffer;

try {
    buffer = fs.readFileSync("test.urf");
} catch (e) {
    console.log("Error occured when opening pdf file: " + e);
}

printer.execute("Print-Job", {
    "operation-attributes-tag": {
//TODO: change requesting-user-name for real user + job name
//document_format should be changed
		"attributes-charset": "utf-8",
		"attributes-natural-language": "en",
        "requesting-user-name": "guest",
        "job-name": "Test-URF",
        "document-format": "image/urf"
    },
    data: buffer
}, (err, res) => {
    if(err) console.log(err);
    else console.log(res);
    
	console.log(res['job-attributes-tag']);

});

