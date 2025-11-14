import { GoogleGenAI, Type, Modality } from "@google/genai";
// import { sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
// import { auth } from "./firebaseConfig";

// import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebaseConfig";
import { UserProfile, Question, Feedback, Sponsor, CareerGoalOption, WorkExperienceItem, PrepContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractJson = <T,>(text: string | undefined): T | null => {
    if (!text) return null;
    const match = text.match(/```(json)?\s*([\s\S]*?)\s*```/);
    const jsonString = match ? match[2] : text;
    
    try {
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
            return JSON.parse(jsonString.substring(firstBrace, lastBrace + 1));
        }
        const firstBracket = jsonString.indexOf('[');
        const lastBracket = jsonString.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket > firstBracket) {
            return JSON.parse(jsonString.substring(firstBracket, lastBracket + 1));
        }
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        console.error("Original text:", text);
        return null;
    }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            } else {
                reject(new Error('FileReader result is not a string'));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    });
};

const formatTestScores = (profile: UserProfile): string => {
    let scoresString = '';
    const { testScores } = profile;

    const waivers = [];
    if (testScores.waiverIB) waivers.push('IB/IGCSE');
    if (testScores.waiverIndianBoard) waivers.push('Indian Board (CBSE/ICSE/State)');
    if (testScores.waiverUniversity) waivers.push('University Waiver');
    if (waivers.length > 0) {
        scoresString += `English Test Waived (${waivers.join(', ')}). `;
    }

    const scores = [];
    if (testScores.ielts) scores.push(`IELTS: ${testScores.ielts}/9.0`);
    if (testScores.toefl) scores.push(`TOEFL iBT: ${testScores.toefl}/120`);
    if (testScores.pte) scores.push(`PTE: ${testScores.pte}/90`);
    if (testScores.duolingo) scores.push(`Duolingo: ${testScores.duolingo}/160`);
    if (testScores.gre) scores.push(`GRE: ${testScores.gre}/340`);
    if (testScores.sat) scores.push(`Digital SAT: ${testScores.sat}/1600`);
    if (testScores.gmat) scores.push(`GMAT: ${testScores.gmat}/800`);
    if (testScores.otherTestName && testScores.otherTestScore) {
        scores.push(`${testScores.otherTestName}: ${testScores.otherTestScore}`);
    }

    if (scores.length > 0) {
        scoresString += `Scores: ${scores.join(', ')}.`;
    }

    return scoresString.trim() || 'Not Provided';
};

const formatSponsors = (sponsors: Sponsor[]): string => {
    if (!sponsors || sponsors.length === 0 || sponsors[0].type === '') return 'Not Provided';

    const formatIncome = (inr?: string, usd?: string): string => {
        if (inr && usd) {
            return `₹${inr} Lakhs (approx. $${usd} USD)`;
        }
        if (usd) {
            return `$${usd} USD`;
        }
        if (inr) {
            return `₹${inr} Lakhs`;
        }
        return 'N/A';
    };

    return sponsors.map((sponsor, index) => {
        let details = `Sponsor ${index + 1}: (${sponsor.type}) `;

        switch (sponsor.type) {
            case 'Parents':
                if (sponsor.fatherOccupation) {
                    const income = formatIncome(sponsor.fatherAnnualIncomeINR, sponsor.fatherAnnualIncomeUSD);
                    details += `Father - Occupation: ${sponsor.fatherOccupation}, Annual Income: ${income}. `;
                }
                if (sponsor.motherOccupation) {
                    details += `Mother - Occupation: ${sponsor.motherOccupation}`;
                    if (sponsor.motherOccupation.toLowerCase() !== 'homemaker') {
                        const income = formatIncome(sponsor.motherAnnualIncomeINR, sponsor.motherAnnualIncomeUSD);
                        details += `, Annual Income: ${income}.`;
                    }
                }
                break;
            case 'Father':
                if (sponsor.fatherOccupation) {
                     const income = formatIncome(sponsor.fatherAnnualIncomeINR, sponsor.fatherAnnualIncomeUSD);
                     details += `Occupation: ${sponsor.fatherOccupation}, Annual Income: ${income}.`;
                }
                break;
            case 'Mother':
                 if (sponsor.motherOccupation) {
                     details += `Occupation: ${sponsor.motherOccupation}`;
                    if (sponsor.motherOccupation.toLowerCase() !== 'homemaker') {
                        const income = formatIncome(sponsor.motherAnnualIncomeINR, sponsor.motherAnnualIncomeUSD);
                        details += `, Annual Income: ${income}.`;
                    }
                }
                break;
            case 'Other Family Member':
                 const income = formatIncome(sponsor.otherAnnualIncomeINR, sponsor.otherAnnualIncomeUSD);
                 details += `Relationship: ${sponsor.otherRelationship || 'N/A'}. Occupation: ${sponsor.otherOccupation || 'N/A'}. Annual Income: ${income}.`;
                break;
            case 'Corporate Sponsor':
            case 'Government Sponsor':
                details += `Name: ${sponsor.sponsorName || 'N/A'}.`;
                break;
            case 'University Scholarship':
                details += `Type: ${sponsor.scholarshipType}. `;
                if (sponsor.scholarshipType === 'Partial') details += `Amount: $${sponsor.scholarshipAmountUSD || 'N/A'} USD.`;
                break;
            case 'Graduate Assistantship (TA/RA)':
                details += `Type: ${sponsor.assistantshipDetails || 'N/A'}. Tuition Waiver: ${sponsor.assistantshipWaiver}. `;
                if (sponsor.assistantshipWaiver === 'Partial') details += `Waiver Amount: $${sponsor.assistantshipWaiverAmount || 'N/A'} USD. `;
                details += `Stipend: ${sponsor.hasStipend}. `;
                if (sponsor.hasStipend === 'Yes') details += `Stipend Amount: $${sponsor.stipendAmount || 'N/A'} USD.`;
                break;
            case 'Out-of-state tuition waiver':
                details += `Waiver Amount: $${sponsor.waiverAmount || 'N/A'} USD.`;
                break;
        }
        return details.trim();
    }).join(' | ');
};

const formatWorkExperience = (experience: WorkExperienceItem[]): string => {
    if (!experience || experience.length === 0) return 'None';

    return experience.map((exp, index) => {
        let details = `Experience ${index + 1}: (${exp.type}) ${exp.position} at ${exp.company}.`;
        details += ` Duration: ${exp.startMonth} ${exp.startYear} - ${exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}.`;
        if (exp.salary) {
            details += ` Salary: ${exp.salary}.`;
        }
        if (exp.description) {
            details += ` Description: ${exp.description}.`;
        }
        return details.trim();
    }).join(' | ');
};


export const generatePrepPlan = async (profile: UserProfile): Promise<PrepContent | null> => {
    const constructedBackground = `${profile.lastQualification} from ${profile.indianUniversity} (${profile.grade})`;
    const testScoresSummary = formatTestScores(profile);
    const sponsorSummary = formatSponsors(profile.sponsors);
    const careerGoalsSummary = profile.careerGoals.goal ? `${profile.careerGoals.goal}: ${profile.careerGoals.details}` : 'Not Provided';
    const workExperienceSummary = formatWorkExperience(profile.workExperience);
    
    let prompt = `
        You are an expert US visa interview coach for a student from India speaking to a native American English-speaking Visa Officer.
        Your response MUST be a single, valid JSON object.

        **Core Instructions:**
        1.  **Questions:** MUST be short and direct, mimicking a real US visa officer. Questions should NEVER mention converted currency amounts (e.g., USD equivalents of INR), as they would only know the local currency figures provided on the application.
        2.  **Model Answers:** MUST be a bulleted list (<ul>). Each point should be concise, factual, and confident. When discussing income provided in both INR and USD in the profile, the model answer MUST state the INR amount first, followed by the approximate USD equivalent in parentheses (e.g., "My father's income is ₹27 Lakhs, which is about $30,000 USD.").
        3.  **Guidance:** MUST be a bulleted list (<ul>) of advanced tips and psychological strategies for answering.
        4.  **Formatting:** For both "modelAnswer" and "guidance", use <mark>, <strong>, and <u class="underline-red"> to highlight key phrases, important concepts, and critical warnings.

        **Student Profile:**
        - University: "${profile.university}"
        - Course: "${profile.courseLevel} in ${profile.course}"
        - Background: "${constructedBackground}"
        - Experience: "${workExperienceSummary}"
        - Sponsors: "${sponsorSummary}"
        - Goals in India: "${careerGoalsSummary}"
        - Scores: "${testScoresSummary}"`;
    
    if (profile.additionalDetails) {
        prompt += `\n- Additional Profile Notes: "${profile.additionalDetails}"`;
    }
    if (profile.hasRefusal === 'yes') prompt += `\n- IMMIGRATION HISTORY (CRITICAL): Previous visa refusal noted (Type: ${profile.refusalType}, Reason: ${profile.refusalReason}).`;
    if (profile.hasTraveled === 'yes') prompt += `\n- IMMIGRATION HISTORY: Previous US travel: ${profile.travelDetails}.`;
    if (profile.hasPetition === 'yes') prompt += `\n- IMMIGRATION HISTORY (CRITICAL): Immigrant petition filed: ${profile.petitionDetails}.`;
    
    prompt += `

        **Question Generation Logic:**
        Your primary goal is to create a list of 25-30 questions. This list MUST cover every topic listed in the "Required Question Topics" section below.
        After ensuring all required topics are covered, you can use the following "Context-Specific Instructions" to generate additional, more challenging, or follow-up questions that are deeply personalized to the student's profile. These context-specific questions ENHANCE the interview practice; they DO NOT REPLACE the required topics.

        **Context-Specific Instructions (for additional/follow-up questions):**
        - **Sponsors:** For example, after asking the mandatory 'Who is sponsoring you?', you might ask a follow-up like, 'Your sponsor is a university scholarship. What makes you a more deserving candidate than other applicants?'
        - **Experience:** If the student has work experience, after covering their background, you could ask a follow-up: 'How does your role as a Software Intern directly prepare you for your Master's in Data Science?'
        - **Goals in India:** After asking about future plans, you can add a challenging question to test their conviction, such as 'You plan to start a company in a competitive market. What is your contingency plan if it doesn't succeed?'
        - **Scores:** If an English test waiver is noted, you MUST add a specific question like 'I see your English test was waived. How will you handle the academic rigor of a US graduate program?'
        - **Additional Notes:** Scan the 'Additional Profile Notes' for one unique point (e.g., a specific award, a YouTube channel, a gap). Formulate one highly specific question based on this unique detail. This should be an additional question.
    `;

    prompt += `

        **JSON Structure & Tasks:**
        1.  "keyTalkingPoints": A premium-formatted HTML string in a <div class="ai-content-card prose prose-slate max-w-none">. Start with <h2>. Provide a conversational intro. Then, use your Google Search tool to find 3-5 unique, factual, and impressive reasons for choosing this specific program at this university (e.g., mention specific research labs, renowned professors, unique curriculum structures, or strong industry connections). Format this as a <ul>, using rich formatting as instructed.
        2.  "sections": An array of objects. Each object must have a "title" and "questions" array.
            - The "title" MUST be one of these exact strings: "Course & University Selection", "Financial Profile", "Future Plans & Ties to India", "Immigration History & General Questions".
            - The "questions" array within each section should contain objects, each with "question", "guidance", and "modelAnswer", following all core instructions above.
            - Generate a total of 25-30 questions distributed logically across these sections, ensuring complete coverage of the required topics below.

        **Required Question Topics (must be covered, no repeats, distribute across sections):**
        Why this university?, Why this course?, Why USA?, Who is sponsoring?, Plans after graduation?, Relatives in US?, Why not study in India?, Academic background?, Test scores?, How will this help career in India?, Parents' occupation?, How many universities applied to?, Knowledge of the city?, Ever been to US before?, What if visa is rejected?, Long-term professional aspirations?, Why this intake (Fall/Spring)?, Intentions for CPT/OPT?, Scope of your field in India upon return?, Explain academic/professional gaps?, Who is in your family?, Family assets in India?, How will you manage living expenses?, Final year project?, What makes your profile strong?
    `;
    
    if (profile.hasRefusal === 'yes') prompt += `\n- ALSO INCLUDE THESE HISTORY-BASED QUESTIONS (in the correct section): "Your previous F-1 visa was refused. What has significantly changed in your profile since then?" and "Can you explain your understanding of why your previous application was not successful?".`;
    if (profile.hasTraveled === 'yes') prompt += `\n- ALSO INCLUDE THIS HISTORY-BASED QUESTION: "You previously visited the US. What was the highlight of your trip?".`;
    if (profile.hasPetition === 'yes') prompt += `\n- ALSO INCLUDE THESE HISTORY-BASED QUESTIONS: "An immigrant petition was filed for you. Why should I believe you will return to India after your studies?" and "Can you explain your current intentions regarding that petition?".`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        return extractJson<PrepContent>(response.text);
    } catch (error) {
        console.error("Gemini API Error (generatePrepPlan):", error);
        throw new Error("Failed to generate prep plan from AI.");
    }
};

export const analyzeAnswer = async (question: string, answer: string): Promise<Feedback | null> => {
    const systemPrompt = `You are an expert US Consular Officer simulator, providing feedback on a student's SPOKEN interview answer. The user's answer is a raw speech-to-text transcript.

**Core Directive: Evaluate this as spoken language, not a written essay.**
- **DO NOT** comment on punctuation or grammar that is natural in speech.
- **FOCUS EXCLUSIVELY** on the substance and delivery from a visa officer's perspective.

**Context-Aware Evaluation:** Your primary task is to assess if the answer is appropriate *for the specific question asked*. Not all answers need to convey non-immigrant intent. Forcing it into every response is unnatural and should be penalized.

**Evaluation Criteria (Adapt based on question type):**
1.  **Relevance & Directness:** Does the answer directly address the question? This is always the top priority.
2.  **Clarity and Conciseness:** Is the answer easy to follow, or is it rambling?
3.  **Confidence:** Does the word choice project confidence and preparation?
4.  **Non-Immigrant Intent (When Applicable):**
    *   **CRITICAL for questions about:** future plans after graduation, career goals, family ties, finances, and reasons for returning. For these, the answer MUST strongly reinforce non-immigrant intent.
    *   **LESS IMPORTANT for questions about:** academic choices, university details, past work experience. For these, a direct, factual answer is more important. Do not penalize the answer for omitting a direct statement about returning home if the question doesn't call for it.

**JSON Output (Strict):**
Your response MUST be a single JSON object with "score" and "feedback".
1.  "score": Integer from 1 to 10.
2.  "feedback": An HTML string using two divs: <div class="feedback-section feedback-positive"> and <div class="feedback-section feedback-improvement">.
    - Inside each, use a <h5> title. Use <mark> to quote the student's spoken phrases, <strong> for key advice, and <u class="underline-red"> for critical warnings.
    - Your feedback MUST be extremely detailed and actionable. For "Areas for Improvement", provide specific examples. Use subheadings like <h5>What to say</h5> and <h5>What to avoid</h5> with bulleted lists (<ul>) to give clear, actionable advice.`;

    const userQuery = `Question: "${question}"\nApplicant's Answer: "${answer}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: userQuery }] }],
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.INTEGER,
                            description: 'The score from 1 to 10.'
                        },
                        feedback: {
                            type: Type.STRING,
                            description: 'The HTML formatted feedback string.'
                        },
                    },
                    required: ['score', 'feedback'],
                }
            }
        });
        return extractJson<Feedback>(response.text);
    } catch (error) {
        console.error("Gemini API Error (analyzeAnswer):", error);
        throw new Error("Failed to get feedback from AI.");
    }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string | null> => {
    try {
        const base64Audio = await blobToBase64(audioBlob);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: audioBlob.type,
                            data: base64Audio,
                        },
                    },
                    {
                        text: "Transcribe this audio recording accurately. This is from a non-native English speaker from India preparing for a US visa interview. Provide only the clean transcript without any additional commentary, introductory phrases like 'Here is the transcript', or markdown formatting."
                    }
                ]
            },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Gemini API Error (transcribeAudio):", error);
        throw new Error("Failed to transcribe audio due to an API error.");
    }
};

export const translateText = async (htmlContent: string, language: 'hi' | 'gu'): Promise<string | null> => {
    const langName = language === 'hi' ? 'Hindi' : 'Gujarati';
    const prompt = `Translate the following HTML content to ${langName}. Maintain ALL original HTML tags, classes, and structure. Only translate the text content inside the tags. Do not add any explanatory text before or after the HTML.\n\n${htmlContent}`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }]
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API Error (translateText):", error);
        throw new Error("Failed to translate content.");
    }
};

export const getOccupationSuggestions = async (occupation: string): Promise<string[] | null> => {
    if (!occupation) return null;
    const systemPrompt = `You are an expert at refining job titles for an international audience. A student from India is describing their parent's occupation for a US visa application. 
    Your task is to provide 3-4 alternative, professional-sounding titles that would be clearly understood in the US. Embellish slightly for a positive impression but keep it realistic.
    Your response MUST be a single, valid JSON array of strings. Do not include the original title.
    
    Example 1: User enters "kirana store owner". You return ["Retail Proprietor", "General Store Manager", "Small Business Owner"].
    Example 2: User enters "works in LIC". You return ["Insurance Agent", "Financial Services Professional", "Life Insurance Advisor"].
    Example 3: User enters "Saree business". You return ["Textile Business Owner", "Apparel Retailer", "Ethnic Wear Entrepreneur"].
    Example 4: User enters "farming". You return ["Agricultural Business Owner", "Farm Proprietor", "Agribusiness Manager"].`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: `Original Occupation: "${occupation}"` }] }],
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        return extractJson<string[]>(response.text);
    } catch (error) {
        console.error("Gemini API Error (getOccupationSuggestions):", error);
        throw new Error("Failed to get occupation suggestions from AI.");
    }
};

export const embellishCareerGoal = async (goal: CareerGoalOption | '', details: string): Promise<string | null> => {
    if (!goal || !details) return null;

    const prompt = `You are an expert career coach advising an Indian student for their US F-1 visa interview. Their chosen career path upon returning to India is to "${goal}". They have provided this initial description: "${details}". 
    
    Your task is to rewrite this description into a single, concise, and ambitious sentence using professional, American-style business jargon. The new sentence must sound impressive, clearly demonstrate strong ties to India, and logically connect to their US education.
    
    Respond with ONLY the embellished sentence, without any quotation marks or introductory phrases.
    
    Example Input: goal="Start My Own Company", details="a company to help farmers use tech"
    Example Output: I intend to launch an AgriTech startup to revolutionize supply chain logistics for local farmers in my region, leveraging the data analytics skills from my Master's program.`;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }]
        });
        return response.text?.trim() || null;
    } catch (error) {
        console.error("Gemini API Error (embellishCareerGoal):", error);
        throw new Error("Failed to get career goal suggestion from AI.");
    }
};

export const getPronunciation = async (universityName: string): Promise<{ phonetic: string; audio: string | null } | null> => {
    try {
        const [phoneticResponse, audioResponse] = await Promise.all([
            ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ parts: [{ text: `Provide the American English phonetic spelling for the university name: "${universityName}".
                Example: for "Purdue University", respond with "per-DOO yoo-nuh-VUR-suh-tee".
                Respond with ONLY the phonetic spelling text and nothing else.` }] }]
            }),
            ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: universityName }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Charon' },
                        },
                    },
                },
            })
        ]);

        const phonetic = phoneticResponse.text?.trim() || '';
        const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;

        if (!phonetic && !base64Audio) {
            return null;
        }

        return { phonetic, audio: base64Audio };

    } catch (error) {
        console.error("Gemini API Error (getPronunciation):", error);
        return null;
    }
};



// const setupRecaptcha = () => {
//   window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
//     size: 'invisible',
//     callback: (response) => {
//       console.log('Recaptcha verified');
//     }
//   }, auth);
// };

// const sendOTP = (phoneNumber: string) => {
//   setupRecaptcha();
//   const appVerifier = window.recaptchaVerifier;
//   signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//     .then((confirmationResult) => {
//       window.confirmationResult = confirmationResult;
//       alert('OTP sent!');
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };



// const verifyOTP = (otp: string) => {
//     window.confirmationResult
//       .confirm(otp)
//       .then((result) => {
//         console.log("User verified:", result.user);
//       })
//       .catch((error) => {
//         console.error("Invalid OTP", error);
//       });
//   };
  


// Mock Authentication Functions
export const sendOtp = async (phoneNumber: string): Promise<boolean> => {
    console.log(`Simulating sending OTP to ${phoneNumber}. For demo purposes, the OTP is 123456.`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real application, this would involve an API call to a backend service.
    // We'll return true to simulate a successful send.
    return true;
};

export const verifyOtp = async (phoneNumber: string, otp: string): Promise<boolean> => {
    console.log(`Simulating verifying OTP "${otp}" for phone number ${phoneNumber}.`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real application, this would be an API call to verify the OTP.
    // For this simulation, we'll use a hardcoded value.
    return otp === '123456';
};




// Mock Email Authentication Functions
export const sendEmailOtp = async (email: string): Promise<boolean> => {
    console.log(`Simulating sending OTP to ${email}. For demo purposes, the OTP is 123456.`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
};



// const actionCodeSettings = {
//     url: window.location.origin + "/auth-complete",
//     handleCodeInApp: true,
//   };

  

// export const sendEmailOtp = async (email: string) => {
//     await sendSignInLinkToEmail(auth, email, actionCodeSettings);
//     window.localStorage.setItem("emailForSignIn", email);
//     return true;
//   };


  
// export const verifyEmailOtp = async (email: string, link: string) => {
//     if (signInWithEmailLink(auth, email, link)) {
//       return true;
//     }
//     return false;
//   };


export const verifyEmailOtp = async (email: string, otp: string): Promise<boolean> => {
    console.log(`Simulating verifying OTP "${otp}" for email ${email}.`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return otp === '123456';
};