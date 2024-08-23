import { KeyGenerationService } from './key-generation.service';
import { StateProvider } from './state-provider';
import { SymmetricCryptoKey } from './symmetric-crypto-key';

export type UserKey = SymmetricCryptoKey;

export class CryptoService {
  constructor(
    private readonly stateProvider: StateProvider,
    private readonly keyGenerationService: KeyGenerationService,
  ) {}

  async initAccount(userId: string): Promise<{
    userKey: UserKey;
    // publicKey: string;
    // privateKey: EncString;
  }> {
    // const activeUserId = await firstValueFrom(this.stateProvider.activeUserId$);

    // if (activeUserId == null) {
    //   throw new Error("Cannot initilize an account if one is not active.");
    // }

    // Verify user key doesn't exist
    // const existingUserKey = await this.getUserKey(activeUserId);

    // if (existingUserKey != null) {
    //   this.logService.error("Tried to initialize account with existing user key.");
    //   throw new Error("Cannot initialize account, keys already exist.");
    // }

    const userKey = (await this.keyGenerationService.createKey(512)) as UserKey;

    this.stateProvider.setUser({ id: userId, userKey });
    // const [publicKey, privateKey] = await this.makeKeyPair(userKey);
    // await this.setUserKey(userKey, activeUserId);
    // await this.stateProvider
    //   .getUser(activeUserId, USER_ENCRYPTED_PRIVATE_KEY)
    //   .update(() => privateKey.encryptedString);

    return {
      userKey,
      // publicKey,
      // privateKey,
    };
  }
}