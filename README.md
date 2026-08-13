# EV Energy Management — Frontend Admin

전기차 배터리/충전 관리 앱의 프론트엔드입니다. [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) 기반으로 iOS/Android/Web을 하나의 코드베이스로 개발합니다.

> 폴더 구조의 배경과 결정 사항은 [`앱_프론트엔드_폴더구조_최종안.md`](./앱_프론트엔드_폴더구조_최종안.md) 문서를 참고하세요. 이 README는 "어떻게 설치하고 실행하는지"와 "실제 코드가 어떻게 배치되어 있는지"를 정리한 실무용 가이드입니다.

## 기술 스택

| 구분 | 내용 |
|---|---|
| 프레임워크 | Expo SDK 57, Expo Router (파일 기반 라우팅) |
| 언어 | TypeScript |
| UI | React Native 0.86, react-native-web |
| 전역 상태 | Zustand (`persist` 미들웨어로 로그인 상태 유지) |
| 통신 | axios (`src/api/client.ts`) |
| 인증 토큰 저장 | expo-secure-store(네이티브) / localStorage(웹, 개발용) |

**백엔드(`EV-energy-management-backend`)와 연동되어 있습니다.** `src/api/client.ts`의 axios 인스턴스가 `EXPO_PUBLIC_API_URL`을 호출하며, 로그인/차량/배터리/알림/공지/리포트/충전소/AI 챗봇까지 전체 기능이 실 서버 기준으로 동작합니다. 상세 API 정의는 [백엔드 API](#백엔드-api) 문단을 참고하세요.

> 참고로 `src/api/*.ts`의 각 함수는 `EXPO_PUBLIC_USE_MOCK` 값에 따라 목업 데이터로도 동작할 수 있게 만들어져 있습니다 (서버 없이 UI만 확인하고 싶을 때 사용).

## 시작하기

### 1. 요구 사항

- Node.js 20 LTS 이상
- (네이티브 실행 시) Android Studio 또는 Xcode — 웹만 볼 거면 필요 없음

### 2. 설치

```bash
npm install
```

### 3. 실행

```bash
npm run web       # 웹 브라우저에서 실행 (가장 빠르게 확인 가능)
npm run android   # 안드로이드 에뮬레이터/기기
npm run ios       # iOS 시뮬레이터 (macOS 전용)
npm run start     # QR코드로 Expo Go 앱에서 실행
```

`npm run web`으로 켜면 로그인 화면(`/login`)으로 리다이렉트됩니다. 로그인 버튼을 누르면 목업 로그인이 성공 처리되어 5개 탭 화면으로 진입합니다.

### 4. 기타 명령어

```bash
npx tsc --noEmit   # 타입 체크
npm run lint       # ESLint 검사
```

## 폴더 구조

```text
src/
├── app/                    # 화면 & 라우팅 (Expo Router, 파일 경로 = URL 경로)
│   ├── _layout.tsx         # 최상위 레이아웃 — 로그인 여부에 따라 (auth)/(tabs) 접근 제어
│   ├── index.tsx           # 최초 진입, 로그인 여부로 리다이렉트만 함
│   ├── (auth)/             # 로그인 전 화면 (login, signup, find-id, reset-pw)
│   ├── (tabs)/             # 로그인 후 하단 5개 탭
│   │   ├── home/           # 홈 탭 (차량 등록 여부로 화면 분기)
│   │   ├── mypage/         # 마이페이지 탭
│   │   ├── vehicle.tsx, battery-passport.tsx, guide-chat.tsx
│   └── notification/       # 알림 목록/상세 (탭과 별개의 공통 영역)
│
├── components/             # 재사용 UI 컴포넌트
│   ├── common/              # 어디서든 쓰는 공용 UI (Header, InputField, BaseModal)
│   ├── home/                 # 홈 탭 전용 (등록/미등록 분기 화면)
│   └── (그 외 개별 파일들)      # vehicle-card, battery-gauge 등 도메인별 컴포넌트
│
├── store/                  # Zustand 전역 상태 ("무엇을 들고 있을지")
│   ├── auth-store.ts        # 로그인 여부/토큰/유저 (기기에 영속 저장됨)
│   ├── vehicle-store.ts     # 차량 등록 여부/대표 차량
│   └── notification-store.ts
│
├── hooks/                  # 화면에서 store+api를 조합해 쓰는 진입점
│   ├── use-auth.ts           # 로그인/로그아웃
│   └── use-vehicle.ts        # 차량 등록 여부 확인, 등록 처리
│
├── api/                    # 서버 통신 (지금은 전부 목업 데이터 반환)
│   ├── client.ts             # axios 인스턴스 + 토큰 자동 첨부 + 401 처리
│   └── auth.ts, vehicle.ts, battery.ts, report.ts, charger.ts, notification.ts
│
├── utils/                  # 순수 함수 (날짜/배터리/숫자 포맷팅)
├── types/                  # 도메인별 TypeScript 타입
└── constants/theme.ts      # 색상, 여백 등 디자인 토큰
```

### 폴더별 역할을 한 줄로 요약하면

```text
store/   → 무엇을 전역으로 들고 있을지 (상태)
hooks/   → 그 상태를 화면에서 어떻게 꺼내 쓸지 (진입점)
api/     → 서버랑 어떻게 통신할지 (지금은 목업)
utils/   → 값을 화면에 어떻게 보여줄지 (순수 변환)
```

화면(`app/`)에서는 `api/`를 직접 부르지 않고 항상 `hooks/`를 거칩니다. 예를 들어 홈 탭(`app/(tabs)/home/index.tsx`)은 `useVehicle().isRegistered` 하나만 확인해서 등록/미등록 화면을 분기합니다.

## 라우팅 & 인증 흐름

- 로그인 전에는 `(auth)` 그룹만, 로그인 후에는 `(tabs)`와 `notification`만 접근할 수 있도록 루트 `app/_layout.tsx`에서 `Stack.Protected`로 막아뒀습니다.
- `auth-store`의 `isLoggedIn` 값이 바뀌면(로그아웃 버튼, 혹은 API에서 401 응답을 받아 자동 로그아웃) 화면이 알아서 로그인 쪽으로 이동합니다. 화면 코드에서 수동으로 네비게이션할 필요가 없습니다.
- 로그인 토큰은 앱을 껐다 켜도 유지됩니다 (네이티브는 SecureStore, 웹은 localStorage).

## 백엔드 API

Base URL: `EXPO_PUBLIC_API_URL` (`.env`)에서 설정. 로그인/회원가입 관련 일부를 제외한 모든 요청에 `Authorization: Bearer <token>` 헤더가 자동으로 붙습니다 (`src/api/client.ts`). 응답 401 시 자동 로그아웃 처리됩니다.

### 인증 / 계정 — `api/auth.ts`

| Method | Path | 역할 |
|---|---|---|
| POST | `/api/auth/login` | 로그인, JWT 토큰 발급 |
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/email/send-code` | 회원가입용 이메일 인증코드 발송 |
| POST | `/api/auth/email/verify-code` | 이메일 인증코드 검증 |
| POST | `/api/auth/password/reset/send-code` | 비밀번호 재설정용 인증코드 발송 |
| POST | `/api/auth/find-email` | 이름/전화번호/생년월일로 아이디(이메일) 찾기 |
| POST | `/api/auth/password/reset` | 비밀번호 재설정 |
| GET | `/api/auth/me` | 내 프로필 조회 |
| PATCH | `/api/auth/me` | 내 프로필 수정 (이름/전화번호/푸시설정/비밀번호 등) |
| POST | `/api/auth/me/profile-image/upload-url` | 프로필 사진 업로드용 S3 presigned URL 발급 |
| DELETE | `/api/auth/me` | 회원 탈퇴 |
| POST | `/api/auth/logout` | 로그아웃 |

### 차량 — `api/vehicle.ts`

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/cars` | 내 차량 목록 조회 |
| GET | `/api/battery-passports` | (차량 목록에 SOH 표시를 위해 함께 조회) |
| POST | `/api/cars` | 차량 등록 |
| GET | `/api/cars/{carId}` | 차량 단건 조회 |
| PUT | `/api/cars/{carId}` | 차량 정보 수정 (닉네임, 대표 차량 여부 등) |
| DELETE | `/api/cars/{carId}` | 차량 삭제 |
| POST | `/api/cars/{carId}/image/upload-url` | 차량 사진 업로드용 S3 presigned URL 발급 |

### 배터리 여권 — `api/battery.ts`

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/battery-passports` | 차량별 배터리 상태(SOH, 온도, 전압, 전류, 잔존수명) 조회 |

### 디지털 트윈 — `api/twin.ts`

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/twin-frames/car/{carId}` | 차량의 최신 상태(온도, 위험도) 조회 — 홈 화면 상태 카드에 사용 |

### 충전소 지도 — `api/charger.ts`

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/charging-stations` | 전체 충전소 목록(위치, 충전기 대수, 이용 가능 대수, 대기시간) 조회 — 홈/지도 화면에 사용 |

### 충전 수요 예측 — `api/demand.ts`

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/charging-demand/current` | 시간/요일/월 기준 현재 충전 혼잡도(여유/보통/혼잡) 조회 — 홈 화면 배지에 사용 |

### 알림 — `api/notification.ts`

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/notifications` | 내 알림 목록 조회 |
| GET | `/api/notifications/{id}` | 알림 상세 조회 |
| PATCH | `/api/notifications/{id}/read` | 알림 읽음 처리 |

### 공지사항 — `api/notice.ts`

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/notices` | 공지사항 목록 조회 |
| GET | `/api/notices/{id}` | 공지사항 상세 조회 |

### AI 리포트 — `api/report.ts`

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/ai-reports` | 내 차량 기준 AI 분석 리포트 목록 조회 |
| GET | `/api/ai-reports/{id}` | 리포트 상세 조회 |

### AI 충전 가이드 챗봇 — `api/chat.ts`

| Method | Path | 역할 |
|---|---|---|
| POST | `/api/v1/chat/messages` | 챗봇 메시지 전송 및 답변 수신 (충전 가이드 대화) |

## 파트 나눠서 작업할 때 참고

도메인별로 관련 파일이 아래처럼 묶여 있어서, 기능 단위로 파트를 나누면 됩니다.

| 도메인 | 관련 파일 |
|---|---|
| 인증/회원 | `app/(auth)/*`, `store/auth-store.ts`, `hooks/use-auth.ts`, `api/auth.ts`, `types/auth.ts` |
| 차량 | `app/(tabs)/vehicle.tsx`, `app/(tabs)/mypage/vehicle-manage.tsx`, `store/vehicle-store.ts`, `hooks/use-vehicle.ts`, `api/vehicle.ts`, `components/vehicle-card.tsx` |
| 배터리 여권 | `app/(tabs)/battery-passport.tsx`, `api/battery.ts`, `components/battery-gauge.tsx`, `components/battery-timeline.tsx` |
| 리포트/충전소 | `app/(tabs)/home/report.tsx`, `app/(tabs)/home/map.tsx`, `api/report.ts`, `api/charger.ts`, `components/charger-list-item.tsx` |
| AI 충전 가이드 | `app/(tabs)/guide-chat.tsx`, `components/chat-bubble.tsx` |
| 마이페이지/알림 | `app/(tabs)/mypage/*`, `app/notification/*`, `store/notification-store.ts`, `api/notification.ts`, `components/notification-item.tsx` |

**공통 규칙**

- 파일명: kebab-case (`vehicle-card.tsx`), 폴더명도 동일
- 확장자: JSX가 있으면 `.tsx`, 순수 로직/타입/훅/API면 `.ts`
- 경로 별칭: `@/`는 `src/`를 가리킵니다 (예: `@/components/vehicle-card`)
- 다른 사람이 만든 도메인의 데이터가 필요하면 `api/`에 직접 접근하지 말고, 해당 도메인의 `types/`와 (있다면) `hooks/`를 통해 가져가세요 — 나중에 목업이 실제 서버 호출로 바뀌어도 영향을 받지 않습니다.

## 더 알아보기

- [Expo 공식 문서 (v57)](https://docs.expo.dev/versions/v57.0.0/) — 이 프로젝트는 Expo가 최근 크게 바뀌었으므로 코드 작성 전 반드시 이 버전 문서를 확인하세요.
- [Expo Router 문서](https://docs.expo.dev/router/introduction/)
