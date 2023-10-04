// const express = require('express')
// const multer = require('multer')
// const cors = require('cors')
// const host = '127.0.0.1'
// const port = 5000
// const app = express()
// app.use(cors())

// const storage  = multer.diskStorage({
//     destination: function(req, file, callback) {
//         callback(null, __dirname + '/uploads')
//     },
//     filename: function(req, file, callback) {
//         callback(null, file.originalname)
//     }
// })

// const uploads = multer({storage: storage})

// app.post('/uploads', uploads.single('uploadfile'), (req, res) => {
//     console.log('hello1',req)
//     res.json({status: 'Successfully1!'})
// })

// app.get('/uploads/:filename', (req, res) => {
//     const filename = req.params.filename
//     console.log('viewing!!!');
//     res.sendFile(`${__dirname}/uploads/${filename}`)
// })

// app.listen(port, host, () => {
//     console.log('Server running on port 5000')
// })


const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors')

const fs = require('fs');

const app = express();
const port = 5000;
app.use(cors())


// Set up a Multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uploadFilename = `${path.basename(file.originalname, ext)}.signed${ext}`;
    cb(null, uploadFilename);
  },
});

const upload = multer({ storage: storage });


app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename
    console.log('viewing!!!');
    res.sendFile(`${__dirname}/uploads/${filename}`)
})
// Define a route for handling file uploads
app.post('/uploads', upload.single('uploadfile'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    const originalFileName = req.file.originalname;
    const uploadedFileName = req.file.filename;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileServerUrl = `${baseUrl}/uploads/${uploadedFileName}`;

    res.json({
      Status: true,
      Message: '',
      FileName: originalFileName,
      FileServer: fileServerUrl,
    });
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error.message,
      FileName: '',
      FileServer: '',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
