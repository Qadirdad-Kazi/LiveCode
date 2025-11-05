import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

export async function exportAsScreenshot(iframeElement) {
  try {
    const canvas = await html2canvas(iframeElement.contentDocument.body, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    canvas.toBlob((blob) => {
      saveAs(blob, 'livecode-screenshot.png');
    });
  } catch (error) {
    console.error('Screenshot export error:', error);
    throw error;
  }
}

export async function exportAsPDF(iframeElement) {
  try {
    const canvas = await html2canvas(iframeElement.contentDocument.body, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('livecode-export.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
}

export async function exportAsVideo(iframeElement, duration = 5000) {
  // Note: This is a simplified implementation
  // For full video recording, you'd want to use MediaRecorder API
  // or a library like recordrtc
  try {
    const frames = [];
    const frameCount = 30; // 30 frames for 5 seconds
    const interval = duration / frameCount;

    for (let i = 0; i < frameCount; i++) {
      await new Promise(resolve => setTimeout(resolve, interval));
      const canvas = await html2canvas(iframeElement.contentDocument.body, {
        backgroundColor: '#ffffff',
        scale: 1,
        useCORS: true
      });
      frames.push(canvas.toDataURL('image/png'));
    }

    // Note: Actual video creation would require additional libraries
    // This is a placeholder that saves frames
    console.log('Video frames captured:', frames.length);
    return frames;
  } catch (error) {
    console.error('Video export error:', error);
    throw error;
  }
}

