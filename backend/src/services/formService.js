import { uploadFileToDrive } from "../config/driveConfig.js";
import { parsePDF } from "../utils/parsePDF.js";
import { parseDocx } from "../utils/parseDocx.js";
import { saveDataToSheet } from "../config/sheetsConfig.js";
import axios from "axios";

const WEBHOOK_URL = "https://rnd-assignment.automations-3d6.workers.dev/";

export const processCVSubmission = async (name, email, phoneNumber, cvFile) => {
    if (!cvFile) {
        throw new Error("CV file is required");
    }

    // STEP 1: UPLOAD FILE
    const fileUrl = await uploadFileToDrive(cvFile);

    // STEP 2: PARSE THE CV
    let extractedData;
    if (cvFile.mimetype === "application/pdf") {
        extractedData = await parsePDF(cvFile.buffer);
    } else if (cvFile.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        extractedData = await parseDocx(cvFile.buffer);
    } else {
        throw new Error("Invalid file format");
    }

    // STEP 3: COMBINE DATA
    const dataToSave = {
        name,
        email,
        phoneNumber,
        education: extractedData.education,
        qualifications: extractedData.qualifications,
        projects: extractedData.projects,
        cvUrl: fileUrl,
    };

    // STEP 4: SAVE TO GOOGLE SHEETS
    const saveResult = await saveDataToSheet(dataToSave);
    if (!saveResult) {
        throw new Error("Error saving data to Google Sheets");
    }

    // STEP 5: SEND WEBHOOK REQUEST
    const payload = {
        cv_data: {
            personal_info: { name, email, phoneNumber },
            education: extractedData.education,
            qualifications: extractedData.qualifications,
            projects: extractedData.projects,
            cv_public_link: fileUrl,
        },
        metadata: {
            applicant_name: name,
            email: email,
            status: "testing",
            cv_processed: true,
            processed_timestamp: new Date().toISOString(),
        },
    };

    await axios.post(WEBHOOK_URL, payload, {
        headers: { "X-Candidate-Email": email },
    });

    return { success: true, message: "Form, CV processed, and webhook sent successfully!", cvUrl: fileUrl };
};
