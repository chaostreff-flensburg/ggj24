export type Sound = {
  fileName: string,
  slug: string,
  source: AudioBufferSourceNode
}

export class AudioManager {
  private soundList: Array<Sound>;
  private initialized: boolean;
  private context: AudioContext;

  constructor() {
    this.soundList = []
    this.initialized = false;
    this.context = new AudioContext();

    this.init().then(() => {
    })
  }

  async init() {
    this.soundList = Array<Sound> = await (await fetch("audio/sounds.json")).json()
    this.soundList.forEach(async (s: Sound) => {
      let buffer: AudioBuffer = await this.context.decodeAudioData((await (await fetch(`./audio/${s.fileName}`)).arrayBuffer()))
      const source = new AudioBufferSourceNode(this.context);
      source.buffer = buffer;
      source.connect(this.context.destination);
      s.source = source
    })
    if (this.soundList?.length > 0) {
      this.initialized = true
    }

  }

  isReady() {
    let result = this.initialized && this.soundList.length > 0
    return result
  }

  getSoundObject(slug: string) {
    let obj = this.soundList.filter(s => s.slug == slug)
    return obj?.length > 0 ? obj[0] : null
  }

  playSound(slug: string) {
    if (this.isReady()) {
      let sound = this.getSoundObject(slug)
      if (sound && sound.source) {
        sound.source.start(0);
      }
    } else {
      console.error("Can't play sound. Audiomanager is not ready.")
    }

  }
}