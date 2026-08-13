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

**⚠️ 대부분의 화면은 아직 백엔드 서버가 없습니다.** `src/api/*.ts`의 함수 대부분은 실제 서버 대신 목업(mock) 데이터를 지연 응답으로 반환합니다. 백엔드가 준비되면 해당 파일 내부만 axios 실호출로 교체하면 되고, 화면/훅 코드는 수정할 필요가 없도록 설계되어 있습니다.

- 다만 `api/charger.ts`, `api/demand.ts`는 실제 연동 완료 — 지도 화면(`home/map.tsx`)의 충전소 목록/거리순 정렬과 "지금 시간대 충전 수요" 배지는 `GET /api/charging-demand/current`(backend가 FastAPI 충전 수요 예측 서비스를 프록시)를 실호출합니다. 각 충전소의 여유/보통/혼잡 배지는 이 수요 수준 + 실시간 대기 인원을 조합해 프론트에서 계산합니다.

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
