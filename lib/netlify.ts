

export function getNetlifyPreviewUrl(body: string) {
    let previewUrl = null;

    // Method 1: Look for markdown links [text](url) format
    const markdownLinkMatch = body?.match(
      /\[([^\]]*\.netlify\.app[^\]]*)\]\(([^)]*\.netlify\.app[^)]*)\)/i
    );
    if (markdownLinkMatch) {
      previewUrl = markdownLinkMatch[2]; // Use the URL part of the markdown link
    }

    // Method 2: Look for direct netlify.app URLs
    if (!previewUrl) {
      const directUrlMatch = body?.match(
        /https:\/\/[^\s\)]+\.netlify\.app[^\s\)]*/i
      );
      if (directUrlMatch) {
        previewUrl = directUrlMatch[0];
      }
    }

    if (!previewUrl) {
      const deployPreviewMatch = body?.match(
        /https:\/\/deploy-preview-\d+--[^\s\)]+\.netlify\.app[^\s\)]*/i
      );
      if (deployPreviewMatch) {
        previewUrl = deployPreviewMatch[0];
      }
    }

    if (!previewUrl) {
      const generalPreviewMatch = body?.match(
        /https:\/\/[^\s\)]*deploy-preview[^\s\)]*\.netlify\.app[^\s\)]*/i
      );
      if (generalPreviewMatch) {
        previewUrl = generalPreviewMatch[0];
      }
    }

    return previewUrl;
}