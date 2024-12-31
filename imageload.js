document.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('img[src*="random.html"]');
    if (!img) return;

    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Handle iframe load
    iframe.onload = function() {
        // Try to get the image from iframe
        const iframeDoc = iframe.contentWindow.document;
        const iframeImg = iframeDoc.querySelector('img');
        
        if (iframeImg) {
            // If we found an image in the iframe, use its src directly
            img.src = iframeImg.src;
            iframe.remove();
        } else {
            // If no image found yet, wait for postMessage
            window.addEventListener('message', async function messageHandler(event) {
                if (event.data.type === 'blobUrl') {
                    // Fetch the blob URL
                    try {
                        const response = await fetch(event.data.url);
                        const blob = await response.blob();
                        
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            // Update main image with base64 data
                            img.src = reader.result;
                            
                            // Clean up
                            URL.revokeObjectURL(event.data.url);
                            iframe.remove();
                            window.removeEventListener('message', messageHandler);
                            
                            // Display color info if needed
                            const color = localStorage.getItem('lastGeneratedColor');
                            if (color) {
                                console.log('Generated color:', color);
                            }
                        };
                        reader.readAsDataURL(blob);
                    } catch (error) {
                        console.error('Error processing image:', error);
                    }
                }
            });
        }
    };

    // Start loading the random.html in the iframe
    iframe.src = img.src;
});
