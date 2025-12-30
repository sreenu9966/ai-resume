import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to convert File to Base64
const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

/**
 * @deprecated functionality moved to parseResumeWithGemini (Multimodal)
 * Kept to prevent build/runtime crashes if old references exist.
 */
export const extractTextFromPDF = async (file) => {
    console.warn("extractTextFromPDF is deprecated. Use parseResumeWithGemini directly with File object.");
    return "";
};

export const parseResumeWithGemini = async (input, apiKey) => {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Switching to 1.5 Flash 002 (Latest Stable) to fix 404
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });

        let promptConfig = [];

        // Define the prompt text
        const promptText = `
            You are an expert ATS Resume Parser. 
            Extract the following information from the resume provided and return it as a VALID JSON object.
            
            The JSON structure MUST strictly match this schema:
            {
                "personal": {
                    "fullName": "",
                    "email": "",
                    "phone": "",
                    "location": "",
                    "role": "", // Job Title
                    "summary": ""
                },
                "education": [
                    {
                        "id": "generated-unique-id",
                        "school": "",
                        "degree": "",
                        "year": "", // e.g. "2020 - 2024" or "2024"
                        "description": "" // Percentage or CGPA if available
                    }
                ],
                "experience": [
                    {
                        "id": "generated-unique-id",
                        "company": "",
                        "role": "",
                        "duration": "",
                        "description": "" // Summarized bullet points
                    }
                ],
                "projects": [
                    {
                        "id": "generated-unique-id",
                        "name": "",
                        "description": "",
                        "link": "",
                        "date": ""
                    }
                ],
                "skills": [
                    "Skill 1", "Skill 2" 
                ],
                 "achievements": [
                    {
                         "id": "generated-unique-id",
                         "title": "Achievement description"
                    }
                ],
                "extras": [
                    {
                        "id": "generated-unique-id",
                        "type": "normal",
                        "text": "" 
                    }
                ]
            }

            IMPORTANT RULES:
            - Return ONLY the JSON object. No Markdown formatting (no \`\`\`json).
            - Ensure all IDs are generated strings.
            - If a field is missing, leave it as empty string or empty array.
            - Return only valid JSON.
        `;

        // Handle Input (Text or File)
        if (typeof input === 'string') {
            promptConfig = [promptText, input];
        } else if (input instanceof File) {
            const imagePart = await fileToGenerativePart(input);
            promptConfig = [promptText, imagePart];
        } else {
            throw new Error("Invalid input type. Expected string or File.");
        }

        const result = await model.generateContent(promptConfig);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present
        const jsonString = textResponse.replace(/^```json\n/, '').replace(/\n```$/, '').trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini Parsing Error:", error);
        // Throw the real error message (e.g. 401, 400, Quota Exceeded) to the UI
        throw new Error(error.message || "Failed to parse resume with AI");
    }
};

export const enhanceTextWithGemini = async (text, type = 'summary', apiKey) => {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });

        let promptText = "";
        if (type === 'summary') {
            promptText = `
                You are a professional Resume Writer.
                Rewrite the following professional summary to be more impactful, concise, and ATS-friendly.
                Use professional action words. Keep it within 3-4 sentences.
                
                Original Text: "${text}"
                
                Return ONLY the rewritten text. No markdown, no quotes.
            `;
        } else if (type === 'experience') {
            promptText = `
                You are a professional Resume Writer.
                Rewrite the following job description into concise, impactful bullet points.
                Focus on achievements and metrics if possible.
                
                Original Text: "${text}"
                
                Return ONLY the rewritten text as a bulleted list (using •).
            `;
        }

        const result = await model.generateContent(promptText);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Enhance Error:", error);
        throw new Error(error.message || "Failed to enhance text");
    }
};
