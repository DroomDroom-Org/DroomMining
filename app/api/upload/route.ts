import { NextRequest, NextResponse } from 'next/server'
import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: 'bucket.droomdroom.online',
  port: 443,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY || 'Gxf9Y8c5pJy3RY6vyS9n',
  secretKey: process.env.MINIO_SECRET_KEY || '8piyA69z7HVSgvGfp1wXIByIbcll7jOYKCQ6djB3',
});

const BUCKET_NAME = 'eventbucket';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const file = data.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const contentType = file.type;


    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME);
      console.log(`Bucket '${BUCKET_NAME}' created.`);
    }

    await minioClient.putObject(
      BUCKET_NAME,
      filename,
      buffer,
      buffer.length,
      { 'Content-Type': contentType }
    );

    const expiryInSeconds = 7 * 24 * 60 * 60;
    const presignedUrl = await minioClient.presignedGetObject(BUCKET_NAME, filename, expiryInSeconds);

    const directUrl = `https://${BUCKET_NAME}.bucket.droomdroom.online/${filename}`;

    return NextResponse.json({
      success: true,
      url: presignedUrl,
      direct_url: directUrl,
      public_id: filename,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}