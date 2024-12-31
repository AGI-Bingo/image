document.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('img[src*="random.html"]');
    if (!img) return;

    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = img.src;
    document.body.appendChild(iframe);

    // Listen for the blob URL from the iframe
    window.addEventListener('message', async function(event) {
        if (event.data.type === 'blobUrl') {
            // Fetch the blob URL and convert to base64
            const response = await fetch(event.data.url);
            const blob = await response.blob();
            
            const reader = new FileReader();
            reader.onloadend = function() {
                // Update image source with base64 data
                img.src = reader.result;
                
                // Clean up
                URL.revokeObjectURL(event.data.url);
                iframe.remove();
                
                // Display color info if needed
                const color = localStorage.getItem('lastGeneratedColor');
                if (color) {
                    console.log('Generated color:', color);
                    // You can display this color somewhere if needed
                }
            };
            reader.readAsDataURL(blob);
        }
    });
});
