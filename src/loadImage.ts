export default function loadImage(src:string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;

    image.onload = () => resolve(image);
    image.onerror = (event) => reject(event);
  })
}
