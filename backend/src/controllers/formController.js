import { uploadFileToDrive } from "../config/driveConfig.js";
import { parsePDF } from "../utils/parsePDF.js";
import { parseDocx } from "../utils/parseDocx.js";
import { saveDataToSheet } from "../config/sheetsConfig.js";

export const submitFormWithFile = async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        const cvFile = req.file;

        if (!cvFile) {
            return res.status(400).json({ message: "CV file is required" });
        }

        // STEP 1: HANDLE THE FILE UPLOAD
        const fileUrl = await uploadFileToDrive(cvFile);

        let extractedData;

        // STEP 2: PARSE THE CV BASED ON THE FILE TYPE
        if (cvFile.mimetype === "application/pdf") {
        extractedData = await parsePDF(cvFile.buffer);
        } else if (cvFile.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            extractedData = await parseDocx(cvFile.buffer);
        } else {
            return res.status(400).json({ message: "Invalid file format" });
        }

        // STEP 3: COMBINE THE EXTRACTED DATA WITH FORM DATA
        const dataToSave = {
            name,
            email,
            phoneNumber,
            ...extractedData.education,
            ...extractedData.qualifications,
            ...extractedData.projects,
            cvUrl: fileUrl
        };

        // STEP 4: SAVE ALL DATA TO GOOGLE SHEETS
        const saveResult = await saveDataToSheet(dataToSave);

        if (saveResult) {
            res.json({
                success: true,
                message: "Form and CV processed successfully!",
                cvUrl: fileUrl,
            });
        } else {
            res.status(500).json({ success: false, message: "Error saving data to Google Sheets" });
        }
    } catch (error) {
        console.error("Error processing the form:", error);
        res.status(500).json({ success: false, message: "Submission failed" });
    }
};
