import loadImage from "./loadImage";

export default class AssetManager {
  private imageAssets: Map<string, HTMLImageElement> = new Map();
  private dataAssets: Map<string, any> = new Map();

  loadImage(src: string, slug?: string): Promise<Boolean> {
    return loadImage(src)
      .then((image) => this.imageAssets.set(slug || src, image))
      .then(() => true)
      .catch(() => false);
  }

  loadImages(srcs: Array<string>): Promise<Boolean> {
    return Promise.all(srcs.map((src) => this.loadImage(src)))
      .then(() => true)
      .catch(() => false);
  }

  image(key: string): HTMLImageElement | undefined {
    return this.imageAssets.get(key);
  }

  loadData(src:string, slug?:string): Promise<Boolean> {
    return fetch(src)
      .then(response => response.json())
      .then(data => this.dataAssets.set(slug||src, data))
      .then(() => true)
      .catch(() => false);
  }

  loadImageMap(src: {[k: string]: string}, namespace:string): Promise<Boolean> {
    return Promise.all(Object.entries(src).map(entry => this.loadImage(entry[1], namespace + ':' + entry[0])))
      .then(() => true)
      .catch(() => false);
  }

  imageMap(namespace:string): Map<string, HTMLImageElement> {
    const map = new Map<string,HTMLImageElement>();

    this.imageAssets.forEach((image, key) => {
      if (key.startsWith(namespace + ':')) {
        map.set(key.split(namespace + ':')[1], image)
      }
    })

    return map;
  }

  data<T>(key:string): T {
    return this.dataAssets.get(key) as T;
  }
}
