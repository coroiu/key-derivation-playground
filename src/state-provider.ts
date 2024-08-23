import { UserKey } from './crypto.service'

type User = {
  id: string;
  userKey: UserKey;
}

export class StateProvider {
  users = new Map<string, User>();

  setUser(user: User) {
    this.users.set(user.id, user);
  }

  // Simulates: stateProvider.getUserState$(USER_KEY, userId)
  getUserKey(userId: string): UserKey | undefined {
    let user = this.users.get(userId);
    return user?.userKey;
  }
}