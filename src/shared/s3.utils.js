import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
const region = "ap-northeast-2";
const bucketName = "rsns-uploads-prod";
const fullBucketUrl = `https://${bucketName}.s3.${region}.amazonaws.com/`;
//https://rsns-uploads-prod.s3.ap-northeast-2.amazonaws.com/avatars/glawdys-hodiesne-sans-titre-1.jpg

export const isFileFromS3 = (url) => {
  return typeof url === 'string' && url.startsWith(fullBucketUrl);
};

const s3client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const deleteFromS3 = async (fileUrl) => {
  const decodedUrl = decodeURI(fileUrl).split(fullBucketUrl)[1];
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
  const { createReadStream, filename, mimetype } = await file;
  const fileStream = createReadStream(); // ✅ 반드시 여기서만 한번 소비

  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const upload = new Upload({
    client: s3client,
    params: {
      Bucket: bucketName,
      Key: objectName,
      Body: fileStream,
      ACL: "public-read",
      ContentType: mimetype,
    },
  });

  return (await upload.done()).Location;
};