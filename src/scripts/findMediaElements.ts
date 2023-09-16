

export const findMediaElements = () => {
  const sources: HTMLMediaElement[] = [];
  const mediaElements = document.querySelectorAll<HTMLMediaElement>("audio, video");
    mediaElements.forEach((mediaElement) => {
      if (mediaElement.src !== '') {
        sources.push(mediaElement);
      }
    });
    return sources;
}
