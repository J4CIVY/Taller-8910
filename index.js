const express = require('express');
const multer = require('multer');
const {Upload} = require("@aws-sdk/lib-storage");
const {S3Client} = require("@aws-sdk/client-s3");

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 10 } // 10 MB
});

const s3 = new S3Client({
    credentials: {
        accessKeyId: 'jamesa.cespedesi@konradlorenz.edu.co',
        secretAccessKey: '#AJaci960419*'
    },
    region: 'us-east-1'
});

//prueba
app.get('/upload', (req, res) => {
    res.send('Esta es la página de carga de archivos.');
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const params = {
            Bucket: 'colask',
            Key: req.file.originalname,
            Body: req.file.buffer
        };

        const data = await new Upload({
            client: s3,
            params
        }).done();
        res.send('Archivo cargado con éxito. URL: ' + data.Location);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar el archivo: ' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
