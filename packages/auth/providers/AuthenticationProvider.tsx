"use client";

import React from "react";

type AuthInfo = { accessToken: string };

export const defaultAuth: AuthInfo = {
  accessToken: "",
};

type VoidCallback = () => void;
type AuthInfoContextType = {
  authInfo: AuthInfo;
  setAuthInfo: React.Dispatch<React.SetStateAction<AuthInfo>>;
  signOut: VoidCallback;
  cacheClear?: VoidCallback;
};

const AuthInfoContext = React.createContext<AuthInfoContextType | null>(null);

type AuthenticationProviderProps = React.PropsWithChildren & {
  serverSignOut: VoidCallback;
};
export default function AuthenticationProvider({
  children,
  serverSignOut,
}: AuthenticationProviderProps) {
  const [authInfo, setAuthInfo] = React.useState<AuthInfo>(defaultAuth);

  const signOut = () => {
    serverSignOut();
    setAuthInfo(defaultAuth);
  };

  return (
    <AuthInfoContext.Provider
      value={{ authInfo, setAuthInfo, signOut, cacheClear: undefined }}
    >
      {children}
    </AuthInfoContext.Provider>
  );
}

export function useAuthInfo() {
  const context = React.useContext(AuthInfoContext);
  if (!context) {
    throw new Error("useAuthInfo must be used within AuthenticationProvider");
  }

  return context;
}
