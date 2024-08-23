import { CryptoService } from './crypto.service';
import { KeyGenerationService } from './key-generation.service';
import { WebCryptoFunctionService } from './web-crypto-function.service';
import { StateProvider } from './state-provider';
import { DerivedKeyGenerationService } from './derived-key-generation.service';

async function run() {
  const cryptoFunctionService = new WebCryptoFunctionService();
  const keyGenerationService = new KeyGenerationService(cryptoFunctionService);
  const stateProvider = new StateProvider();
  const cryptoService = new CryptoService(stateProvider, keyGenerationService);

  const derivedKeyGenerationService = new DerivedKeyGenerationService(stateProvider);

  const userId = "fakeUserId";
  await cryptoService.initAccount(userId);

  const derivedKeyPair = derivedKeyGenerationService.getKeyPair(userId, "ServerRequestSigning");
  console.log(derivedKeyPair);

  // NOTE: Not supported because SubtleCrypto does not support P-256k1 (also known as secp256k1)
  // This is the curve used by BIP32
  // const subtleCryptoKey = await global.crypto.subtle.importKey("raw", derivedKeyPair.privateKey, { name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign']);

  // console.log(subtleCryptoKey);
}

run().catch(console.error);
