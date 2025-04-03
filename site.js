// Modules Intended To Use And Global Variables Selected
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
let sendOver = '';
let q = '';
let p = [];
var pop ;
const items = [];
const app = express();
const port = 3000;
const cors = require('cors');
const { send } = require('process');
const lists = [];
let uploadDestination = `./uploads/${q}`; // Change this to your desired folder name and path
const lo = [];

// End Of Called Variables Or Modules

// Calling The Cors use the Express Module
app.use(cors());

// Check if the folder already exists, if not, create it
if (!fs.existsSync(uploadDestination)) {
  fs.mkdirSync(uploadDestination);
  console.log('Uploads folder created.');
} else {
  console.log('Uploads folder already exists.');
}

// Creating A Storage Disk For The Destination

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDestination);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Uploading The Files In A Storage
const upload = multer({ storage: storage });

// Calling The file using the server /upload to upload the file by fetching

app.post('/upload', upload.single('file'), function (req, res) {
  const uploadedFile = req.file;
  console.log(uploadedFile)
  const uploadObject = JSON.parse(req.body.uploadObject);

  if (uploadedFile && uploadObject) {
    const fileName = uploadedFile.originalname;
    const { name, artist, year, genre } = uploadObject;
    // Process the file upload along with the extracted data
    // Save or perform operations with the file and other extracted data

    lo.push({ filename: fileName, name, artist, year, genre });

    res.send(`File '${fileName}' uploaded successfully.`);
  } else {
    res.status(400).send('File upload failed.');
  }
});
// Confirm The Names
app.get('/confirm', function (req, res) {
  res.json(lo);
});

// Use This server path to access the files saved
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Server Path to make the home of the server to load a html called index.html
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index') {
    const templatePath = './index.html';

    // Read the template file
    fs.readFile(templatePath, 'utf-8', (err, templateContent) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      // Send the response with the template content
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(templateContent);
    });
  }
   else {
    // Handle other routes or static files
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Use middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML page with a form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Use this to recieve the link, img, names , details and many info
app.get('/over', (req,res)=>{
  res.json([sendOver, pop])
})

// for the submit response for the posting and link request
app.post('/submit', (req, res) => {
    let { product_name, product_details } = req.body;
    q = product_name
    uploadDestination = `./uploads/${product_name}`;    
    if (!fs.existsSync(uploadDestination)) {
      fs.mkdirSync(uploadDestination);
      console.log('Uploads folder created.');
    } else {
      console.log('Uploads folder already exists.');
    }
    
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadDestination);
      },
      filename: function (req, file, cb) {
        // Change the filename to something else
        const newFilename = "your_desired_filename_here"; // Replace "your_desired_filename_here" with the desired filename
        cb(null, newFilename);
      }
    });
    
    const upload = multer({ storage: storage });

    app.post('/upload', upload.single('file'), function (req, res) {
      const uploadedFile = req.file;
      console.log(uploadedFile)
      const uploadObject = JSON.parse(req.body.uploadObject);
      if (uploadedFile && uploadObject) {
        const fileName = uploadedFile.originalname;
        pop = `${uploadedFile.path}`
        const { name, artist, year, genre } = uploadObject;
        console.log(name,fileName)
    
        // Process the file upload along with the extracted data
        // Save or perform operations with the file and other extracted data
    
        lo.push({ filename: fileName, name, artist, year, genre });
    
        res.send(`File '${fileName}' uploaded successfully.`);
      } else {
        res.status(400).send('File upload failed.');
      }
    });

    // Replacing the product name to have %20 included to avoid net error
    product_name = product_name.replace(/ /g, '%20');
    console.log(product_name)
    const listItem = `${product_name}/${generate()}`;
    lists.push(listItem);
    console.log(lists);
    items.push(`${listItem}:[details:${product_details}], [namep:${product_name}]`)

    // Redirect to the dynamically generated link
    //res.redirect(`http://localhost:3000/`/*${encodeURIComponent(listItem)}`*/);
    res.send({link:`http://localhost:3000/${listItem}`, names: lists, type: items, img:`uploads/${product_name.replace(/"%20/g, ' ')}/${q}`})
    sendOver = {link:`http://localhost:3000/${listItem}`, names: lists, type: items}

    lists.forEach((listItem) => {
      let num  = listItem;
      console.log(num)
      app.get(`/${listItem}`, (req,res) =>{
      const keyName = 'list1'; // Replace with the desired key name
      const matchingItem = items.find(item => item.includes(`${listItem}:[details:`));
      if (matchingItem) {
        const regex = /\[details:(.*?)\]/;
        const match = matchingItem.match(regex);
        if (match && match[1]) {
          const extractedProductDetails = match[1];
          console.log('Product Details:', extractedProductDetails);
          res.json(extractedProductDetails)
        } 
        else {
          console.error('Unable to extract product details');
        }
      } 
      else {
        console.error('Item not found');
      }

    })
        
  });
});
function generate() {
  const random = Math.random() * 20;
  return random;
}  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});