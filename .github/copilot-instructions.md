# GitHub Copilot Instructions — ssurak frontend

## Project Overview

**프론트엔드 전용 저장소입니다.** Turborepo + **pnpm workspaces** 기반 모노레포로, Next.js 앱 2개와 공유 패키지로 구성됩니다.

백엔드(NestJS · Prisma · MySQL · Redis · Socket.IO)는 별도 저장소(<https://github.com/kisn3089/ssurak-backend>)에 있습니다. 이 저장소는 백엔드와 **REST + Socket.IO로만** 통신하며 DB나 Prisma에 직접 접근하지 않습니다. `@ssurak/db` 패키지는 더 이상 존재하지 않습니다.

## Tech Stack & Versions

### Package Manager & Runtime

- **pnpm**: 9.0.0+ (REQUIRED — 절대 npm/yarn 사용 금지)
- **Node.js**: >= 22
- **TypeScript**: 6.0.3
- **Turborepo**: 2.6.x

### Apps (apps/)

#### order — 고객용 주문 앱

- **Framework**: Next.js 16 (App Router), React 19
- **React Compiler**: ENABLED (`reactCompiler: true`)
- **Styling**: Tailwind CSS v4 + PostCSS (`@tailwindcss/postcss`)
- **Module Type**: ESM (`"type": "module"`)
- **Port**: 3000
- **Workspace Dependencies**: `@ssurak/api`, `@ssurak/ui`

#### console — 매장 관리자용 콘솔 앱

- **Framework**: Next.js 16 (App Router), React 19
- **React Compiler**: ENABLED (`reactCompiler: true`)
- **Styling**: Tailwind CSS v4
- **Data Fetching**: `@tanstack/react-query` v5
- **Data Table**: `@tanstack/react-table` v8
- **Form**: `react-hook-form` + `@hookform/resolvers` + zod
- **Realtime**: `socket.io-client`
- **Module Type**: ESM (`"type": "module"`)
- **Port**: 3001
- **Workspace Dependencies**: `@ssurak/api`, `@ssurak/auth`, `@ssurak/ui`

두 앱 모두 `transpilePackages: ["@ssurak/ui", "@ssurak/api", "@ssurak/auth"]`, 경로 별칭 `@/*` → `./src/*`.

### Shared Packages (packages/)

#### @ssurak/api

- **역할**: 백엔드와의 계약 전담 — 도메인 타입, axios 클라이언트, React Query 훅, Zod 스키마
- **구성**: `src/types/`, `src/core/`, `src/hooks/`, `src/schemas/`, `src/utils/`
- **Dependencies**: `@ssurak/auth`, axios, `@tanstack/react-query`, zod, react

#### @ssurak/auth

- **역할**: JWT 토큰 타입·유틸(jwt-decode), 인증 Provider
- **Dependencies**: 없음 (리프 패키지)

#### @ssurak/ui

- **Component Library**: Radix UI (`@radix-ui/react-*`), Shadcn 스타일
- **Styling**: Tailwind CSS v4, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Icons**: `lucide-react`, **Animation**: `motion`

#### @ssurak/lintconfig

- ESLint 9 FlatConfig — base.js, next.js, react-internal.js

#### @ssurak/tsconfig

- base.json, nextjs.json, react-library.json

### Workspace Dependencies

```text
order   → @ssurak/api, @ssurak/ui
console → @ssurak/api, @ssurak/auth, @ssurak/ui
@ssurak/api → @ssurak/auth
```

로컬 패키지는 `workspace:*` 프로토콜로 참조합니다. `@ssurak/api` → `@ssurak/auth`는 **단방향**입니다. 두 패키지가 공유하는 타입(예: `TokenPayload`)은 순환 참조를 피하기 위해 리프인 `auth`에 둡니다.

## Coding Standards & Guidelines

### 도메인 타입은 API 응답 기준으로 선언

타입은 `packages/api/src/types/<entity>/<entity>.interface.ts`에 직접 선언합니다. DB 스키마가 아니라 **실제 API 응답**을 기준으로 합니다.

1. 서버 내부용 `id`는 클라이언트로 내려오지 않으므로 **선언하지 않습니다.** 식별자는 `publicId`(cuid2)입니다.
2. 날짜는 `Date`가 아니라 **ISO `string`** 입니다.
3. nullable 필드는 `?` 옵셔널이 아니라 **`string | null`** 로 선언합니다 (JSON wire format 일치).
4. 엔티티 이름을 그대로 씁니다 (`Menu`, `Table`, `Order`). `XResponse`는 복합 응답에만 (`OrderWithItemsResponse` 등).
5. 파생 응답은 유틸리티 타입(`Omit`, `Pick`, 교차 타입)으로 만듭니다 — 필드를 복붙하지 않습니다.

Enum은 런타임 값으로도 쓰이므로 **const object 패턴**으로 선언합니다:

```typescript
export const OrderStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
```

### 배럴 금지 — 서브패스로 import

`index.ts` 배럴 파일을 만들지 않습니다. 각 패키지는 `package.json`의 `exports` 서브패스 맵으로 `./src/**`를 노출하고, 소비자는 심볼이 정의된 모듈을 직접 import합니다.

**✅ Good:**

```typescript
import { OrderStatus } from "@ssurak/api/types/order/order.interface";
import { httpOrder } from "@ssurak/api/core/order/order/httpOrder";
import useSuspenseWithAuth from "@ssurak/api/hooks/useSuspenseWithAuth";
```

**❌ Bad:**

```typescript
import { OrderStatus, httpOrder } from "@ssurak/api";
```

### HTTP 함수는 body를 반환

`packages/api/src/core/`의 http 함수는 응답 body를 벗겨서 도메인 타입을 반환합니다. 이 함수들은 React Query의 `queryFn`/`mutationFn`으로 들어가고 반환값이 그대로 캐시에 저장되는데, `AxiosResponse`는 직렬화가 불가능하고(`config`에 어댑터·transform 함수, `request` 객체) `config.headers`에 `Authorization`까지 담고 있어 서버 prefetch + `dehydrate()` 경계를 넘지 못합니다.

**✅ Good:**

```typescript
async function fetchList({ storeId }: FetchTableListParams): Promise<Table[]> {
  const response = await http.get<Table[]>(prefix(storeId));
  return response.data;
}
```

`AxiosResponse<T>`를 반환하는 건 **호출부가 응답 헤더(주로 `Set-Cookie`)를 필요로 할 때뿐입니다** — 현재 `httpAuth.createAccessToken`, `httpAuth.refreshAccessToken`, `httpSession.createSession` 세 개뿐입니다.

### TypeScript Rules

1. **타입 단언(`as`)으로 타입 에러를 해결하지 마세요.** 제네릭 기본값, 교차/유니온 타입, 타입 좁히기로 해결합니다.

   **❌ Bad:**

   ```typescript
   const menus = response.data as Menu[];
   ```

   **✅ Good:**

   ```typescript
   const response = await http.get<Menu[]>(`${prefix}/menus`);
   return response.data;
   ```

   (const object enum 선언의 `as const`는 예외입니다.)

2. **Strict Type Safety** — strict mode, no implicit any, null/undefined 명시적 처리

3. **Naming** — 직관적이지 않은 축약어를 타입·함수·변수 이름에 쓰지 않습니다.

### Code Quality

1. **과설계 지양** — 요청받은 것과 명백히 필요한 것만 변경합니다.
2. **보안** — 시스템 경계(사용자 입력, 외부 API)에서 검증합니다. XSS 등 OWASP Top 10을 확인하되, 내부 코드에 불필요한 검증을 추가하지 않습니다.
3. **주석/문서** — 커밋 메시지는 영어, 코드 주석은 한국어 또는 영어. 로직이 자명하지 않은 곳에만 주석을 답니다.
4. **React** — React Compiler가 활성화되어 있으니 컴파일러 친화적 패턴을 씁니다. 복잡한 로직은 커스텀 훅으로 분리합니다.

### Language & Style

- 코드 리뷰 코멘트는 **한국어 존댓말**
- 기술 용어는 영어 그대로
- 간결하고 명확한 문장, 필요하면 불릿 사용

## Common Commands

```bash
# Development (백엔드 API가 8080에 떠 있어야 함 — 별도 저장소)
pnpm dev                 # 두 앱 모두
pnpm dev:order           # order (3000)
pnpm dev:console         # console (3001)

# Build & Quality
pnpm build               # 전체 빌드
pnpm lint                # ESLint (--max-warnings 0)
pnpm format              # Prettier

# 패키지 지정
pnpm build --filter=@ssurak/order
pnpm lint --filter=@ssurak/ui
```

⚠️ `pnpm check-types`는 현재 `@ssurak/ui`에만 스크립트가 있어 나머지를 검증하지 않습니다. 타입 검증은 해당 패키지에서 `npx tsc --noEmit`을 직접 실행하세요.

## Environment Variables

루트 `.env`가 아니라 **앱별 `.env`** 를 사용합니다 (`apps/*/.env.example` 참고).

```env
# order, console 공통
NEXT_PUBLIC_API_SSURAK_URL=http://localhost:8080       # 브라우저 클라이언트용
NEXT_PUBLIC_SSURAK_INTERNAL_URL=http://localhost:8080  # 서버 컴포넌트/라우트 핸들러용

# console 전용
NEXT_PUBLIC_ORDER_APP_URL=http://localhost:3000        # 테이블 QR 코드 생성
COOKIE_DOMAIN=.ssurak.com                              # production 전용
```

## Important Notes

1. **항상 pnpm 사용** (npm/yarn 금지)
2. **패키지별 스크립트가 아니면 저장소 루트에서 실행**
3. **`--filter=<package-name>`** 으로 특정 패키지만 대상 지정
4. **타입은 `@ssurak/api/types/...`에서** import — `@ssurak/db`는 더 이상 없습니다
5. **배럴 없음** — 항상 서브패스로 직접 import
6. **ESLint strict** — `--max-warnings 0`
7. **husky pre-push**가 `pnpm build`를 실행하므로 빌드가 깨지면 push가 막힙니다
