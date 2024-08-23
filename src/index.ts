import { CryptoService } from "./crypto.service";
import { KeyGenerationService } from "./key-generation.service";
import { WebCryptoFunctionService } from "./web-crypto-function.service";
import { StateProvider } from "./state-provider";
import { DerivedKeyGenerationService } from "./derived-key-generation.service";
import { Utils } from "./utils";

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

  // Node doesn't support importing raw keys, so we need to convert it to PKCS8
  // const subtleCryptoKey = await global.crypto.subtle.importKey(
  //   "raw",
  //   derivedKeyPair.privateKey,
  //   { name: "Ed25519" },
  //   true,
  //   ["sign"]
  // );

  const privateKeyAsHex = Utils.fromBufferToHex(derivedKeyPair.privateKey);
  // Hacky way to convert raw key to PKCS8 which is just ANS.1 metadata + raw key
  // Tip: https://lapo.it/asn1js/ is a great tool for ASN.1 decoding
  const privateKeyAsPkcs8 =
    "302e020100300506032b657004220420" + privateKeyAsHex;

  const subtleCryptoKey = await global.crypto.subtle.importKey(
    "pkcs8",
    Utils.fromHexToArray(privateKeyAsPkcs8),
    { name: "Ed25519" },
    true,
    ["sign"]
  );

  console.log(subtleCryptoKey);
}

run().catch(console.error);
