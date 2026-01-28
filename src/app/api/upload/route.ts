import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('file');

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files received' }, { status: 400 });
        }

        const uploadedUrls = [];

        for (const file of files) {
            if (file instanceof File) {
                const buffer = Buffer.from(await file.arrayBuffer());
                // Simple cleanup of filename
                const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
                // Storing in a general uploads folder matching PRD roughly (pg/uploads/...)
                // Ideally we use pgId, but we don't have it yet.
                const key = `pg/uploads/${fileName}`;

                const uploadParams = {
                    Bucket: process.env.AWS_S3_BUCKET!,
                    Key: key,
                    Body: buffer,
                    ContentType: file.type,
                };

                await s3.send(new PutObjectCommand(uploadParams));
                // Construct URL assuming standard S3 URL format
                const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
                uploadedUrls.push(url);
            }
        }

        return NextResponse.json({ success: true, urls: uploadedUrls });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
