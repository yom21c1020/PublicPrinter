const ipp = require("ipp");
const fs = require("fs");
const {spawnSync} = require("child_process");
require("dotenv").config();

const printerIP = process.env.PRINTER_HOST;
console.log("Printer IP: " + printerIP);
const printer = ipp.Printer(`http://${printerIP}:631/ipp/print`);
const fileName = "test.pdf";

let buffer;

const convertPDFToURF = (fileName) => {
    const pdf = fs.readFileSync(fileName);
    const urf = spawnSync("cupsfilter", [
        "-p", "slc515w.ppd",
        "-m", "image/urf",
        "-o", "media=iso_a4_210x297mm",
        "-o", "print-scaling=auto",
        "-" 
   ], {input: pdf}).stdout;
   return urf;
}

try {
    buffer = convertPDFToURF(fileName);
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
    data: buffer,
}, (err, res) => {
    if(err) console.log(err);
    else console.log(res);
    
	console.log(res['job-attributes-tag']);
});
