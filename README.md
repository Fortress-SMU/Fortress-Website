# FORTRESS · The Sky Breaker

게임 소개 사이트다. 프레임워크·외부 패키지 설치 없이 HTML, CSS, JavaScript로 구성했다. 운영 주소는 <https://sky-breaker.vercel.app/>이며, GitHub 저장소는 [Fortress-SMU/Fortress-Website](https://github.com/Fortress-SMU/Fortress-Website)다.

2026-10-15 사용자 지시에 따라 이 웹사이트의 수정은 검증 후 GitHub `main` 업로드와 Vercel 프로덕션 최신화·실제 접속 확인까지 함께 수행한다. 세부 규칙은 [AGENTS.md](AGENTS.md)를 따른다.

## 미리보기

Node.js 22 이상에서 저장소 폴더를 열고 실행한다.

```powershell
npm run dev
```

브라우저에서 <http://127.0.0.1:4173>을 연다. 종료는 터미널에서 `Ctrl+C`.

서버 없이 `dist/index.html`을 직접 여는 방식도 고려해 경로와 스크립트를 구성했다. 다만 Codex 인앱 브라우저는 보안 정책상 `file:` URL을 허용하지 않아 직접 파일 열기는 검증하지 못했다. 위 로컬 HTTP 방식으로 검수하는 것을 권장한다. 국가 자동 판별은 HTTP API가 있어야 하므로 파일 직접 열기에서는 영어가 기본이다.

## 화면 구성

- 공통: 중앙 게임 로고, 상단 우측 `EN / 한국어`, 로고 아래 네 개 메뉴.
- HOME: 예고편 포스터/영상 영역과 우측 하단 Steam 링크.
- GAME: 스토리와 등장 캐릭터 두 개의 임시 영역.
- DEVELOPMENT: 엔진·협업 툴·게임 내 구현 방식의 세 영역.
- FORTRESS: 가로 팀 소개와 조현우 → 조준환 → 강민우 → 최윤서 순서의 네 칸. 데스크톱 4열, 휴대폰 2열.
- 본문: 팀원 역할 외 미제공 세부 내용은 한국어 `고유번호: 임시 내용입니다`, 영어 `ID: Temporary content.`. 이름은 요청한 한글 표기를 두 언어에서 유지한다.

| 팀원 | 한국어 역할 | 영어 역할 |
|---|---|---|
| 조현우 | 팀장 (Team Leader), 보스 청룡 개발 | Team Leader, Cheongryong Boss Development |
| 조준환 | 기획/시나리오, 주인공 진헌 개발 | Game Planning / Scenario, Jinhun (Protagonist) Development |
| 강민우 | 보스 우태 개발, 적 캐릭터 개발 | Wootae Boss Development, Enemy Character Development |
| 최윤서 | 맵 디자인, 적 캐릭터 개발 | Map Design, Enemy Character Development |

## 언어 선택과 국가 판별

우선순위는 **직접 선택하여 저장한 언어 → 한국(KR)으로 확인된 접속 국가 → 영어**이다.

- 첫 방문의 기본 언어는 영어다.
- `api/country.js`가 Vercel의 `x-vercel-ip-country` 헤더를 읽어 `KR`이면 한국어로 바꾼다.
- 국가 확인 실패·2초 시간 초과·오프라인·국가 정보 없는 호스팅에서는 영어를 유지한다.
- 언어 버튼으로 선택한 값은 `localStorage`의 `fortress.language`에 저장한다. 저장이 차단되어도 현재 방문 중 선택은 작동한다.
- 국가 응답이 지연되는 동안 언어를 직접 바꿔도 사용자의 선택이 우선한다.
- 브라우저 언어·시간대를 접속 국가로 간주하지 않으며 GPS 권한이나 외부 IP 조회 API를 사용하지 않는다. 국가 정보는 저장하지 않는다.
- 국가 API는 방문자별 결과이므로 `Cache-Control: private, no-store`를 사용한다.
- 국가 판별은 IP 기반이라 VPN/프록시 사용 시 그 접속 지역을 따를 수 있다.

로컬 서버는 기본적으로 `{ "country": null }`을 반환한다. 실제 Vercel 국가 응답은 운영 주소의 `/api/country`에서 확인하며, 다른 국가의 실제 접속은 별도 검증이 필요하다. 아래는 국가 분기를 확인하는 명시적 모의 실행이며 실제 접속 국가 확인이 아니다.

```powershell
node scripts/serve.mjs --port=4174 --country=KR
```

<http://127.0.0.1:4174>에서 저장한 언어가 없는 경우 한국어로 바뀐다. 새 첫 방문을 재현하려면 브라우저 개발자 도구에서 `fortress.language` 항목을 지우거나 새 브라우저 프로필을 사용한다.

근거: [Vercel 요청 헤더](https://vercel.com/docs/headers/request-headers#x-vercel-ip-country), [Node.js 함수 작성](https://vercel.com/docs/functions/runtimes/node-js).

## 콘텐츠 교체

| 대상 | 파일 / 위치 |
|---|---|
| 본문 임시 문구 | `dist/index.html`의 `data-placeholder` 요소. 현재는 `dist/app.js`가 언어별 임시 문구를 공통 생성한다. 실제 문구 적용 시 요소에 `data-en`, `data-ko`를 넣고 `data-placeholder`를 제거한다. |
| 화면 구성 / 스타일 | `dist/index.html`, `dist/styles.css` |
| 한영 로고 | `dist/assets/logo-en.png`, `dist/assets/logo-ko.png` |
| 포스터 | `dist/assets/key-art.png` |
| 예고편 | `dist/settings.js`의 `trailerSrc`. 승인된 MP4/WebM 파일 경로나 직접 재생 URL을 넣는다. YouTube 페이지 주소는 직접 영상 파일이 아니다. |
| Steam 링크 | `dist/settings.js`의 `steamUrl` |

**예고편은 미제공 상태**다. 현재 재생 버튼은 임시 안내 모달을 연다. 실제 영상이 재생되는 초안으로 간주하지 않는다. 무관한 게임 내 컷신 파일은 사용하지 않았다. 포스터는 기존 마케팅 이미지다.

Steam 링크에는 현재 게임 App ID `4838950`을 사용했다. 로컬 운영 문서에서 App ID를 확인했으며 공개 상점 페이지 열람은 이번 작업에서 검증하지 못했다. 상점 심사/공개 상태에 따라 외부 링크의 표시 결과가 달라질 수 있다.

## 파일 구조와 검증

```text
dist/                 정적 사이트. 별도 빌드 없음
  assets/             복사한 기존 로고/키아트 및 favicon
  index.html
  styles.css
  app.js              탭, 한영 표시, 모달
  language.js         언어 선택 우선순위
  settings.js         예고편/Steam 설정
api/country.js        향후 Vercel에서 사용할 국가 API
scripts/serve.mjs     127.0.0.1 전용 로컬 미리보기
tests/language.test.mjs
vercel.json           추후 배포용 정적 경로/API 설정만 준비
```

```powershell
npm test
```

검증 캡처와 상세 결과는 `preview/`에 저장할 수 있으며 Git에서는 제외한다. 실제 국가 헤더·공개 도메인·외부 영상 재생은 향후 배포/콘텐츠 연결 후 별도 검증한다.

## 에셋 출처

한영 로고와 키아트는 기존 승인본 `Steam Images/Final_2026-10-11`에서 원본과 동일한 SHA-256으로 복사했다. 새 이미지 생성·원본 편집은 없다. Steam 아이콘은 기존 SteamCMD 클라이언트의 SteamLogo.png를 복사했으며 Steam은 Valve의 상표다. 세부 경로와 해시는 [ASSETS.md](ASSETS.md)에 기록한다.
