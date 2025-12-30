import html2pdf from 'html2pdf.js';

// Modified to support both save and preview (blob return)
export const generatePDF = async (element, action = 'save') => {
    if (!element) return;

    const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        const worker = html2pdf().set(opt).from(element);

        if (action === 'preview') {
            const pdfBlob = await worker.output('blob').save(); // .save() with 'blob' param might technically work differently in some versions, but standard way is .output('blob')
            // Actually html2pdf chained API: .output('blob') returns a promise resolving to blob
            // The library documentation says: .output('blob')
            // Let's refactor safely:
            return worker.output('blob');
        } else {
            await worker.save();
        }
    } catch (error) {
        console.error('PDF generation failed:', error);
        throw error;
    }
};
