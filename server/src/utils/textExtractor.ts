import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const extractTextFromFile = async (
  buffer: Buffer,
  mimetype: string,
  filename: string
): Promise<string> => {
  try {
    if (mimetype === 'application/pdf' || filename.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      return data.text || '';
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      filename.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } else if (mimetype === 'text/plain' || filename.endsWith('.txt')) {
      return buffer.toString('utf-8');
    }
    
    // Fallback: try utf-8 string
    return buffer.toString('utf-8');
  } catch (err: any) {
    console.error('Error extracting text from file:', err);
    throw new Error(`Failed to extract text from ${filename}: ${err.message}`);
  }
};
