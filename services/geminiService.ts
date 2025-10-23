
import { GoogleGenAI, Type, Part } from "@google/genai";
import { EducationalResources, BloomLevel } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    educationalResources: {
      type: Type.OBJECT,
      properties: {
        quiz: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswer: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                        },
                        required: ['question', 'options', 'correctAnswer', 'explanation']
                    }
                }
            },
            required: ['title', 'questions']
        },
        caseStudy: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                scenario: { type: Type.STRING },
                questions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'scenario', 'questions']
        },
        videoScript: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                scenes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            sceneNumber: { type: Type.INTEGER },
                            visuals: { type: Type.STRING },
                            narration: { type: Type.STRING },
                        },
                        required: ['sceneNumber', 'visuals', 'narration']
                    }
                }
            },
            required: ['title', 'scenes']
        },
        infographic: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                keyPoints: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            point: { type: Type.STRING },
                            visualSuggestion: { type: Type.STRING },
                        },
                        required: ['point', 'visualSuggestion']
                    }
                }
            },
            required: ['title', 'keyPoints']
        },
        activity: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'description', 'steps', 'materials']
        }
      },
      required: ['quiz', 'caseStudy', 'videoScript', 'infographic', 'activity']
    }
  },
  required: ['educationalResources']
};

const fileToGenerativeInlinePart = (file: File): Promise<Part> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          const base64Data = (reader.result as string)?.split(',')[1];
          if (base64Data) {
              resolve({
                  inlineData: {
                      mimeType: file.type,
                      data: base64Data,
                  },
              });
          } else {
              reject(new Error("Failed to read file or file is empty."));
          }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
};

const textFileToGenerativePart = async (file: File): Promise<Part> => {
    const text = await file.text();
    return { text: `\n\n--- Contenu du fichier ${file.name} ---\n${text}\n--- Fin du fichier ${file.name} ---` };
};

const getPrompt = (bloomLevel: BloomLevel): string => {
  return `
    ROLE: Vous êtes un expert en ingénierie pédagogique et un spécialiste du domaine traité dans le contenu source.
    
    TÂCHE: Transformer le [Contenu Source] (fourni sous forme de texte et/ou de divers fichiers) en un ensemble de ressources pédagogiques multimodales. Votre mission principale est non seulement d'analyser le contenu fourni, mais aussi de **réutiliser et d'intégrer activement des éléments (textes, données, concepts, schémas) issus des fichiers joints** dans les ressources que vous générez.
    
    CONTRAINTES:
    1.  Rigueur Scientifique: Maintenir une rigueur scientifique et une exactitude absolues basées sur TOUT le contenu fourni.
    2.  Transposition Didactique: Appliquer les principes de la transposition didactique pour rendre le contenu accessible, engageant et adapté à un public apprenant.
    3.  Complexité Cognitive: Adapter la complexité de TOUTES les ressources générées au niveau de la Taxonomie de Bloom spécifié: "${bloomLevel}".
    
    INSTRUCTION IMPORTANTE: Analysez le texte fourni ci-dessous ainsi que tous les fichiers joints (images, documents texte, PDF, diaporamas, etc.) pour construire votre réponse. **Vous devez explicitement réutiliser des extraits, des données, ou des concepts provenant de ces fichiers** pour formuler les questions du quiz, construire le scénario de l'étude de cas, et concevoir les autres matériels. Par exemple, une question de quiz pourrait être basée sur une diapositive spécifique d'une présentation jointe.
    
    FORMAT DE SORTIE:
    Vous devez répondre UNIQUEMENT avec un objet JSON valide qui correspond au schéma fourni. La racine de l'objet doit être une clé unique "educationalResources" contenant toutes les ressources.
  `;
};

const SUPPORTED_INLINE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.oasis.opendocument.text', // .odt
  'application/vnd.oasis.opendocument.spreadsheet', // .ods
  'application/vnd.oasis.opendocument.presentation', // .odp
]);

export const generateResources = async (content: string, bloomLevel: BloomLevel, files: File[]): Promise<EducationalResources> => {
    const prompt = getPrompt(bloomLevel);
    
    const instructionPart: Part = { text: prompt };
    const contentPart: Part[] = content.trim() ? [{ text: `[Contenu Source Textuel Principal]:\n\`\`\`\n${content}\n\`\`\`` }] : [];

    const filePartsPromises: Promise<Part | null>[] = files.map(file => {
        if (file.type === "text/plain") {
            return textFileToGenerativePart(file);
        } else if (SUPPORTED_INLINE_MIME_TYPES.has(file.type) || file.type.startsWith("image/")) {
            return fileToGenerativeInlinePart(file);
        }
        console.warn(`Unsupported file type: ${file.type}. Skipping file: ${file.name}`);
        return Promise.resolve(null);
    });

    const resolvedFileParts = (await Promise.all(filePartsPromises)).filter(p => p !== null) as Part[];

    const allParts: Part[] = [
        instructionPart,
        ...contentPart,
        ...resolvedFileParts
    ];
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: allParts },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const text = response.text.trim();
        const parsedJson = JSON.parse(text);

        return parsedJson.educationalResources as EducationalResources;
    } catch (error) {
        console.error("Error generating or parsing Gemini response:", error);
        if (error instanceof Error) {
           console.error("Error message:", error.message);
        }
        throw new Error("Failed to parse the response from the AI. The format might be incorrect.");
    }
};
