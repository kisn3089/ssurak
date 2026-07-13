interface DomainTokenPayload {
  email?: string;
  username?: string;
}

/** JWT에 담아 보내는 페이로드. */
export interface TokenPayload extends DomainTokenPayload {
  sub: string;
  role: "owner" | "admin";
  typ: "Bearer";
  aud?: string[];
  iss?: string;
}

/** `jwtDecode`로 복호화한 페이로드. 발급·만료 시각이 함께 들어온다. */
export interface TokenPayloadDecoded extends DomainTokenPayload {
  iat: number;
  exp: number;
}
