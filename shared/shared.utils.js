import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

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
      Bucket: "instaclone-uploads-hmchung",
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

// // AWS S3 버킷에서 사진을 삭제하는 함수
// export const handleDeletePhotoFromAWS = async (fileUrl, folderName) => {
//   const decodedUrl = decodeURI(fileUrl);
//   const filePath = decodedUrl.split("/" + folderName + "/")[1];
//   const fileName = `${folderName}/${filePath}`;

//   await new S3()
//     .deleteObject({
//       Bucket: "instaclone-uploads-hmchung", // 본인 버킷 이름
//       Key: fileName,
//     })
//     .promise();
// };
