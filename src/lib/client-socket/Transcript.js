/** The server will send multiple messages that correspond to
 * the same chunk of audio, improving the transcription on each
 * message. The following class is a helper to keep track
 * of the current state of the transcript.
 */
class Transcript {
  constructor() {
    /** @type {Map<number, {words: string, is_final: boolean}>} */
    this.chunks = new Map();
  }

  /** @argument {any} jsonFromServer */
  addServerAnswer(jsonFromServer) {
    const words = JSON.parse(jsonFromServer).channel.alternatives[0].transcript;
    if (words !== "") {
      this.chunks.set(jsonFromServer.start, {
        words,
        // if "is_final" is true, we will never have future updates for this
        // audio chunk.
        is_final: jsonFromServer.is_final,
      });
    }
  }

  /** @returns {HTMLElement} */
  getString() {
    const data = [];
    [...this.chunks.entries()]
      .sort((entryA, entryB) => entryA[0] - entryB[0])
      .forEach((entry) => {
        data.push([entry[1].words, entry[1].is_final]);
      });
    return data;
  }
}

export default Transcript;
