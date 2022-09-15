// const fs = require('fs');
// s3.listBuckets({}, (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });

// const params = {
//     Bucket: 'ignacio-s3-demo'
// }
// s3.listObjectsV2(params, (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });

// const paramsGetObject = {
//     Bucket: "ignacio-s3-demo",
//     Key: 'images/miImage.png'
// }
// s3.getObject(paramsGetObject, (err, data) => {
//     if(err) throw err;
//     console.log(data);
//     fs.writeFile('imagen-s3.png', data.Body, 'binary', (err) => {
//         if (err) throw err;
//         console.log("Image saved");
//     });
// });

require('dotenv').config()
const AWS = require('aws-sdk');
const BUCKET_NAME='ignacio-s3-demo'
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    signatureVersion: process.env.SIGNATURE_VERSION,
    region: process.env.REGION 
});

const express = require('express')
const app = express()
const port = 8080

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.get('/url/:type/:key', async (req, res) => {
    const type = req.params.type === "get" ? "getObject" : "putObject"
    const key = req.params.key;
    const url = await getUrl(key, type); 
    return res.send({ url: url }).status(200);
})

async function getUrl(key, type) {
    return await s3.getSignedUrlPromise(type, {
       Bucket: BUCKET_NAME,
       Key: key,
       Expires: 60 * 30,
    });
}