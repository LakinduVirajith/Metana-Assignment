import { uploadFileToDrive } from "../config/driveConfig.js";
import { parsePDF } from "../utils/parsePDF.js";
import { parseDocx } from "../utils/parseDocx.js";
import { saveDataToSheet } from "../config/sheetsConfig.js";
import { sendFollowUpEmail } from "./emailService.js";
import axios from "axios";
import moment from "moment-timezone";
import cron from "node-cron";

const WEBHOOK_URL = "https://rnd-assignment.automations-3d6.workers.dev/";

export const processCVSubmission = async (name, email, phoneNumber, timeZone, cvFile) => {
    try {
        if (!cvFile) {
            throw new Error("CV file is required");
        }

        // STEP 1: UPLOAD FILE
        let fileUrl;
        try {
            fileUrl = await uploadFileToDrive(cvFile);
        } catch (error) {
            throw new Error(`Error uploading file to drive: ${error.message}`);
        }

        // STEP 2: PARSE THE CV
        let extractedData;
        try {
            if (cvFile.mimetype === "application/pdf") {
                extractedData = await parsePDF(cvFile.buffer);
            } else if (cvFile.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                extractedData = await parseDocx(cvFile.buffer);
            } else {
                throw new Error("Invalid file format");
            }
        } catch (error) {
            throw new Error(`Error parsing CV: ${error.message}`);
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
                education: [extractedData.education],
                qualifications: [extractedData.qualifications],
                projects: [extractedData.projects],
                cv_public_link: fileUrl,
            },
            metadata: {
                applicant_name: name,
                email: email,
                status: "prod",
                cv_processed: true,
                processed_timestamp: new Date().toISOString(),
            },
        };

        try {
            await axios.post(WEBHOOK_URL, payload, {
                headers: { "X-Candidate-Email": email },
            });
        } catch (error) {
            throw new Error(`Error sending webhook request: ${error.message}`);
        }

        // STEP 6: SCHEDULE EMAIL IN 24 HOURS
        const delayInMilliseconds = 24 * 60 * 60 * 1000;
        const currentTimeInTimeZone = moment.tz(timeZone);
        const nextDay = currentTimeInTimeZone.add(delayInMilliseconds, "milliseconds");

        console.log(`Scheduled follow-up email for ${email} at ${nextDay}`);
        try {
            cron.schedule(
                `${nextDay.minutes()} ${nextDay.hours()} * * *`,
                () => {
                    sendFollowUpEmail(email, name);
                    job.stop();
                }, 
                {
                    scheduled: true,
                    timezone: timeZone,
                }
            );
        } catch (error) {
            throw new Error(`Error scheduling follow-up email: ${error.message}`);
        }

        return { success: true, message: "CV processed, webhook sent, and email scheduled!", cvUrl: fileUrl };
    } catch (error) {
        console.error(`Error processing CV submission: ${error.message}`);
        return { success: false, message: `Error processing CV submission: ${error.message}` };
    }
};
