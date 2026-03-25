# 배포 가이드 프롬프트 (Chrome Claude용)

아래 프롬프트를 Chrome Claude에게 전달하세요.

---

## 프롬프트

```
나는 "ToMarkdown"이라는 파일→마크다운 변환 웹서비스를 배포하려고 해.
모노레포 구조(frontend: Next.js 16 / backend: FastAPI + Python)이고,
GitHub 프라이빗 레포에 코드가 올라가 있어.

아래 순서대로 하나씩 진행을 도와줘. 각 단계마다 내가 해야 할 행동을
스크린샷 찍듯이 구체적으로 알려줘. 완료하면 다음 단계로 넘어가.

## 내 설정 정보
- 도메인: tomarkdown.com (Cloudflare에서 구매 예정)
- 프론트엔드: Vercel 배포 (Root Directory: frontend)
- 백엔드: Railway 배포 (Root Directory: backend, Dockerfile 있음)
- 8개 언어 지원 (en, ko, ja, zh, es, pt, de, fr)

## 배포 순서

### 1단계: Cloudflare 도메인 등록
- dash.cloudflare.com에서 tomarkdown.com 도메인 구매
- 완료 후 나에게 확인 요청

### 2단계: Railway 백엔드 배포
- railway.app에서 GitHub 레포 연결
- Root Directory: backend
- Dockerfile 자동 감지
- Networking에서 퍼블릭 도메인 생성
- 환경변수 설정:
  - ALLOWED_ORIGINS=https://tomarkdown.com
- 헬스체크 확인: /health 엔드포인트가 {"status":"ok"} 반환
- Railway URL 알려달라고 요청

### 3단계: Vercel 프론트엔드 배포
- vercel.com에서 같은 GitHub 레포 연결
- Root Directory: frontend
- 환경변수:
  - BACKEND_URL=https://[2단계 Railway URL]
  - NEXT_PUBLIC_SITE_URL=https://tomarkdown.com
- 빌드 & 배포

### 4단계: Cloudflare DNS 연결
- Cloudflare DNS 설정:
  - Type: CNAME
  - Name: @
  - Target: cname.vercel-dns.com
  - Proxy: DNS only (회색 구름) ← 중요! Vercel SSL과 충돌 방지
- www 서브도메인도 CNAME으로 추가

### 5단계: 배포 확인
확인할 URL 목록:
- https://tomarkdown.com → 영어 홈페이지
- https://tomarkdown.com/ko → 한국어
- https://tomarkdown.com/ja → 일본어
- https://tomarkdown.com/ko/pdf-to-markdown → 한국어 PDF 변환 페이지
- https://tomarkdown.com/sitemap.xml → 144개 URL 사이트맵

## 트러블슈팅 도움
배포 중 에러가 나면:
- Railway 빌드 로그 확인 방법 알려줘
- Vercel 빌드 에러 해결 방법 알려줘
- DNS 전파 대기 시간 안내해줘 (보통 1-5분, 최대 48시간)
- CORS 에러 시 ALLOWED_ORIGINS 환경변수 확인

각 단계를 하나씩 진행하자. 1단계부터 시작해줘.
```
