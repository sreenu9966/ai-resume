import html2pdf from 'html2pdf.js';

// Modified to support both save and preview (blob return)
export const generatePDF = async (element, action = 'save', fileName = 'resume.pdf') => {
    if (!element) return;

    const opt = {
        margin: 0, // No margin to maximize space
        filename: fileName,
        image: { type: 'jpeg', quality: 1.0 }, // Maximum quality, no compression
        html2canvas: { scale: 3, useCORS: true, scrollY: 0, windowWidth: 1200, letterRendering: true }, // Higher scale for crisp text
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Try to avoid unnecessary breaks
    };

    try {
        const worker = html2pdf().set(opt).from(element);

        if (action === 'preview') {
            return worker.output('blob');
        } else {
            // .save() returns a promise, await it.
            // Sometimes it might resolve before the file is fully written on disk (browser handled),
            // but if it throws, it's a real error.
            return await worker.save();
        }
    } catch (error) {
        console.error('PDF generation failed:', error);
        throw error;
    }
};
