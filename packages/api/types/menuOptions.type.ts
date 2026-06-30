// 메뉴 옵션 도메인 타입의 단일 소스는 @spaceorder/db 가 소유한다.
// (Prisma Json 컬럼 타이핑에 db 가 직접 필요로 하므로 db-tier 에 둔다.)
// 프론트엔드는 @spaceorder/api/types 를 contract surface 로 사용하도록 여기서 re-export 한다.
export * from "@spaceorder/db/types/menuOptions.type";
