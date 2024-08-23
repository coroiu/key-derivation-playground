import { SymmetricCryptoKey } from './symmetric-crypto-key';
import { WebCryptoFunctionService } from './web-crypto-function.service';

export class KeyGenerationService {
  constructor(private cryptoFunctionService: WebCryptoFunctionService) {}

  async createKey(bitLength: 256 | 512): Promise<SymmetricCryptoKey> {
    const key = await this.cryptoFunctionService.aesGenerateKey(bitLength);
    return new SymmetricCryptoKey(key);
  }
}