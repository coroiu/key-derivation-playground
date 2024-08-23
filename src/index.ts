import { CryptoService } from "./crypto.service";
import { KeyGenerationService } from "./key-generation.service";
import { WebCryptoFunctionService } from "./web-crypto-function.service";
import { StateProvider } from "./state-provider";
import { DerivedKeyGenerationService } from "./derived-key-generation.service";

async function run() {
  const cryptoFunctionService = new WebCryptoFunctionService();
  const keyGenerationService = new KeyGenerationService(cryptoFunctionService);
  const stateProvider = new StateProvider();
  const cryptoService = new CryptoService(stateProvider, keyGenerationService);

  const derivedKeyGenerationService = new DerivedKeyGenerationService(
    stateProvider
  );

  const userId = "fakeUserId";
  await cryptoService.initAccount(userId);

  const derivedKeyPair = derivedKeyGenerationService.getKeyPair(
    userId,
    "ServerRequestSigning"
  );
  console.log(derivedKeyPair);

  const subtleCryptoKey = await global.crypto.subtle.importKey(
    "raw",
    derivedKeyPair.privateKey,
    { name: "Ed25519" },
    true,
    ["sign"]
  );

  console.log(subtleCryptoKey);
}

run().catch(console.error);
