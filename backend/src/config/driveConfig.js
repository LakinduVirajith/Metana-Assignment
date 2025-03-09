import { google } from "googleapis";
import auth from "./googleAuth.js";
import { Readable } from "stream";

const drive = google.drive({ version: "v3", auth });

export const uploadFileToDrive = async (file) => {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    try {
        const response = await drive.files.create({
            requestBody: {
                name: file.originalname,
                parents: [folderId],
            },
            media: {
                mimeType: file.mimetype,
                body: bufferStream,
            },
        });

        // MAKE THE FILE PUBLICLY ACCESSIBLE
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: { role: "reader", type: "anyone" },
        });

        const fileUrl = `https://drive.google.com/uc?id=${response.data.id}`;
        return fileUrl;
    } catch (error) {
        console.error("Google Drive upload error:", error);
        throw error;
    }
};
