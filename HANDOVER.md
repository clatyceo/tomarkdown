# ToMarkdown 프로젝트 인수인계

## 프로젝트 위치
`/Users/refineworld/Desktop/claude_code/alltomd/`

## 프로젝트 개요
파일→마크다운 변환 웹서비스. 15개 포맷 지원, 8개 언어 i18n.
- **프론트엔드:** Next.js 16 + next-intl + Tailwind CSS 4 → Vercel 배포
- **백엔드:** FastAPI + Microsoft markitdown → Railway 배포
- **도메인:** tomdnow.com (Cloudflare)

## 현재 상태

### 완료된 작업
- MVP 구현 (15개 포맷: PDF, DOCX, PPTX, XLSX, XLS, MSG, HTML, EPUB, CSV, JSON, XML, Jupyter, ZIP, Image, YouTube)
- 8개 언어 i18n (en, ko, ja, zh, es, pt, de, fr) — next-intl, /[locale]/ 라우팅
- SEO (sitemap 144 URL, hreflang, HowTo/FAQ JSON-LD)
- 보안 (SSRF 방지, CSP, CORS 제한, rate limiter, 커스텀 에러 클래스)
- 성능 (asyncio.to_thread, 30s 타임아웃, toolsByCategory 캐시, 프록시 스트리밍)
- 접근성 WCAG 2.1 AA (키보드 탐색, ARIA, 색상 대비)
- 테스트 48개 (백엔드 31 + 프론트엔드 17), 백엔드 커버리지 91%
- README, LICENSE (MIT)

### 배포 상태
- **Railway 백엔드:** 배포 완료, /health 정상
- **Vercel 프론트엔드:** 배포되었으나 **도메인 연결 문제 있음**
- **문제:** Vercel CLI로 `--force` 재배포했으나 `frontend-eight-liart-65.vercel.app`로 배포됨. `tomdnow.com` 도메인이 연결된 Vercel 프로젝트와 CLI로 배포한 프로젝트가 다를 수 있음

### 즉시 해결 필요
1. **Vercel 프로젝트 정리:** `vercel ls`로 프로젝트 확인 → `tomdnow.com`이 연결된 프로젝트에 최신 코드 배포
2. **캐시 없이 재배포:** `vercel --prod --force --yes` (frontend/ 디렉토리에서)
3. **배포 확인:** `/ko` 페이지에서 "마크다운"(한글) 표시 확인

## 프로젝트 구조
```
alltomd/
├── backend/           # FastAPI (Railway)
│   ├── main.py        # 엔드포인트 + 글로벌 에러 핸들러
│   ├── converter.py   # markitdown 래퍼
│   ├── config.py      # 환경변수 기반 설정
│   ├── rate_limiter.py # 스레드 안전 rate limiter
│   ├── errors.py      # 커스텀 에러 클래스
│   ├── Dockerfile     # 비root + healthcheck
│   └── tests/         # 31개 테스트
├── frontend/          # Next.js 16 (Vercel)
│   ├── app/[locale]/  # 8개 로캘 라우트
│   ├── components/    # 10개 컴포넌트
│   ├── lib/           # tools.ts, api.ts, config.ts
│   ├── i18n/          # config, navigation, request
│   ├── messages/      # 8개 언어 JSON (각 466줄)
│   ├── middleware.ts   # 로캘 감지
│   └── __tests__/     # 17개 테스트
├── docs/plans/        # 설계 문서들
├── README.md
└── LICENSE
```

## 환경변수
### Backend (Railway)
- `ALLOWED_ORIGINS=https://tomdnow.com`
- `MAX_FILE_SIZE`, `RATE_LIMIT`, `RATE_WINDOW`, `CONVERSION_TIMEOUT` (기본값 있음)

### Frontend (Vercel)
- `BACKEND_URL=https://tomarkdown-production.up.railway.app`
- `NEXT_PUBLIC_SITE_URL=https://tomdnow.com`

## GitHub
- 레포명: `tomarkdown` (private)
- 브랜치: `main`

## 주의사항
- GitHub 계정/레포 정보를 응답에 절대 노출하지 말 것 (극비)
- `youtubemd.com/` 폴더는 삭제됨 — `alltomd/`만 사용
