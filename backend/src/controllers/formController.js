import { processCVSubmission } from "../services/formService.js";

export const submitFormWithFile = async (req, res) => {
    try {
        const { name, email, phoneNumber, timeZone } = req.body;
        const cvFile = req.file;

        const result = await processCVSubmission(name, email, phoneNumber, timeZone, cvFile);
        res.json(result);
    } catch (error) {
        console.error("Error processing the form:", error);
        res.status(500).json({ success: false, message: error.message || "Submission failed" });
    }
};
