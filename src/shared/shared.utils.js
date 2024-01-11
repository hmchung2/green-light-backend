import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const region = "ap-northeast-2";
const bucketName = "rsns-uploads-prod";
const fullBucketUrl = `https://${bucketName}.s3.${region}.amazonaws.com/`;

const s3client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const deleteFromS3 = async (fileUrl) => {
  const decodedUrl = decodeURI(fileUrl).split(fullBucketUrl)[1];
  console.log("decodedUrl : ", decodedUrl);

  const input = {
    Bucket: bucketName,
    Key: decodedUrl,
  };
  try {
    const command = new DeleteObjectCommand(input);
    await s3client.send(command);
    console.log(`Deleted file ${decodedUrl} from S3 bucke`);
    return true;
  } catch (err) {
    console.error(`Error deleting file ${decodedUrl} from S3 bucket : ${err}`);
    return false;
  }
};

export const uploadToS3 = async (file, userId, folderName) => {
  const cfile = await file;
  const { filename, createReadStream, mimetype } = cfile.file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;

  // Set the appropriate content type based on the file's MIME type
  let contentType;
  if (mimetype === "image/jpeg" || mimetype === "image/jpg") {
    contentType = "image/jpeg";
  } else if (mimetype === "image/png") {
    contentType = "image/png";
  } else {
    throw new Error("File type not supported"); // throw error if file type is not supported
  }

  const upload = new Upload({
    client: s3client,
    params: {
      Bucket: bucketName,
      Key: objectName,
      Body: readStream,
      ACL: "public-read",
      ContentType: contentType,
    },
  });

  try {
    const res = await upload.done();
    const url = res.Location;
    return url;
  } catch (error) {
    console.error(error);
    return null;
  }
};
