import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import { PDFExtract } from 'pdf.js-extract';

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const uploadDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });

// Parse file content based on file type
export const parseFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let extractedText = '';

    // Extract text based on file type
    if (fileType.startsWith('image/')) {
      // Handle image files using Tesseract OCR
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
      extractedText = text;
    } 
    else if (fileType === 'application/pdf') {
      // Use pdf.js-extract instead of pdf-parse
      try {
        const pdfExtract = new PDFExtract();
        const options = {}; 
        const data = await pdfExtract.extract(filePath, options);
        // Combine all page content into a single string
        extractedText = data.pages.map(page => 
          page.content.map(item => item.str).join(' ')
        ).join('\n');
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        throw new Error('Failed to parse PDF file: ' + pdfError.message);
      }
    } 
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
             fileType === 'application/msword') {
      // Handle Word documents
      const dataBuffer = fs.readFileSync(filePath);
      const { value } = await mammoth.extractRawText({ buffer: dataBuffer });
      extractedText = value;
    } 
    else if (fileType === 'text/plain') {
      // Handle plain text files
      extractedText = fs.readFileSync(filePath, 'utf8');
    } 
    else {
      return res.status(400).json({ message: 'Unsupported file type.' });
    }

    // Clean up the uploaded file after processing
    fs.unlinkSync(filePath);

    // Return the extracted text
    res.json({ 
      extractedText, 
      fileName: req.file.originalname,
      message: 'File parsed successfully' 
    });

  } catch (error) {
    console.error('Error parsing file:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    res.status(500).json({ message: 'Error parsing file', error: error.message });
  }
};