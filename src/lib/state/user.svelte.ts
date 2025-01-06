interface UserData {
  isAuthenticated: boolean;
  userId: string | undefined;

  resetAuth(): void;
  authenticate(userId: string) : void;
}

export const userState = $state<UserData>({
  isAuthenticated: false,
  userId: undefined, 

  resetAuth() {
    this.isAuthenticated = false
    this.userId = undefined
  },

  authenticate(userId: string) {
    this.isAuthenticated = true
    this.userId = userId
  },
})

