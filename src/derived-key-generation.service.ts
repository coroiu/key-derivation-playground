import { HDKey } from "micro-key-producer/slip10.js";
import { StateProvider } from "./state-provider";
import { Tagged } from "type-fest";

const DerivationPaths = {
  ServerRequestSigning: "m/0'/0'",
  ServerVerifiedRequestSigning: "m/0'/1'",
};

type DerivedKeyId = keyof typeof DerivationPaths;

// Note: Opaque is deprecated in favor of Tagged
type DerivedPrivateKeys = {
  [KeyId in DerivedKeyId]: Tagged<Uint8Array, `${KeyId}-private`>;
};
type DerivedPublicKeys = {
  [KeyId in DerivedKeyId]: Tagged<Uint8Array, `${KeyId}-public`>;
};

export type DerivedPrivateKey<KeyId extends DerivedKeyId> =
  DerivedPrivateKeys[KeyId];
export type DerivedPublicKey<KeyId extends DerivedKeyId> =
  DerivedPrivateKeys[KeyId];

export type AnyDerivedPrivateKey = DerivedPrivateKeys[DerivedKeyId];
export type AnyDerivedPublicKey = DerivedPrivateKeys[DerivedKeyId];

export type DerivedKeyPair<KeyId extends DerivedKeyId> = {
  publicKey: DerivedPrivateKey<KeyId>;
  privateKey: DerivedPublicKey<KeyId>;
};

export class DerivedKeyGenerationService {
  constructor(private stateProvider: StateProvider) {}

  getKeyPair<KeyId extends DerivedKeyId>(
    userId: string,
    keyId: KeyId
  ): DerivedKeyPair<KeyId> {
    const userKey = this.stateProvider.getUserKey(userId);

    if (userKey === undefined) {
      throw new Error("User key not found.");
    }

    const hdKey = HDKey.fromMasterSeed(userKey.key);
    const derivationPath = DerivationPaths[keyId];
    const derivedKey = hdKey.derive(derivationPath);

    return {
      publicKey: derivedKey.publicKeyRaw as DerivedPublicKey<KeyId>,
      privateKey: derivedKey.privateKey as DerivedPrivateKey<KeyId>,
    };
  }
}
