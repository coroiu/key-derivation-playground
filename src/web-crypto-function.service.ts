type CsprngArray = Uint8Array;

export class WebCryptoFunctionService {
  subtle = global.crypto.subtle;

  async aesGenerateKey(bitLength = 128 | 192 | 256 | 512): Promise<CsprngArray> {
    if (bitLength === 512) {
      // 512 bit keys are not supported in WebCrypto, so we concat two 256 bit keys
      const key1 = await this.aesGenerateKey(256);
      const key2 = await this.aesGenerateKey(256);
      return new Uint8Array([...key1, ...key2]) as CsprngArray;
    }
    const aesParams = {
      name: "AES-CBC",
      length: bitLength,
    };

    const key = await this.subtle.generateKey(aesParams, true, ["encrypt", "decrypt"]);
    const rawKey = await this.subtle.exportKey("raw", key);
    return new Uint8Array(rawKey) as CsprngArray;
  }
}