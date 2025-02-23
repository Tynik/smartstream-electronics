import { parse } from 'parse-multipart-data';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';

import type { FileRecord, UploadFileType } from '../netlify.types';
import { FIREBASE_BUCKET_NAME, FIREBASE_FILE_TYPE_STORAGE_FOLDER_MAP } from '../netlify.constants';
import { createHandler } from '../netlify.helpers';
import { assertUserRole, withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type UploadProductFileData = {
  type: {
    name: 'type';
    data: Buffer;
  };
  file: {
    filename: string;
    type: string;
    name: string;
    data: Buffer;
  };
};

export const handler = createHandler(
  { allowMethods: ['POST'] },
  withCredentials(async ({ event, userRecord }) => {
    assertUserRole(userRecord, 'admin');

    const contentType = event.headers['content-type'];
    if (!contentType) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Content type is not present in headers',
        },
      };
    }

    const boundary = contentType.split('=').pop();
    if (!boundary) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Boundary cannot be identified',
        },
      };
    }

    if (!event.body) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Body is empty',
        },
      };
    }

    const parts = parse(Buffer.from(event.body, 'base64'), boundary);

    const data = parts.reduce((result, part) => {
      if (part.name) {
        // @ts-expect-error
        result[part.name] = part;
      }

      return result;
    }, {} as UploadProductFileData);

    const fileType = data.type.data.toString() as UploadFileType | undefined;

    const folder = fileType ? FIREBASE_FILE_TYPE_STORAGE_FOLDER_MAP[fileType] : null;
    if (!folder) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: `Folder cannot be identified by passed type "${fileType}"`,
        },
      };
    }

    const bucket = getStorage().bucket(FIREBASE_BUCKET_NAME);

    const fileId = uuidv4();
    const filePath = `${folder}/${fileId}`;

    const file = bucket.file(filePath);

    await file.save(data.file.data, {
      metadata: {
        contentType: data.file.type,
      },
    });

    const url = await getDownloadURL(file);

    const fileRecord: FileRecord = {
      url,
      id: fileId,
      name: data.file.filename,
      type: data.file.type,
      path: filePath,
    };

    await netlifyStores.files.create(fileRecord.id, fileRecord);

    return {
      status: 'ok',
      data: fileRecord,
    };
  }),
);
