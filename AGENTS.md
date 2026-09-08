# AGENTS.md — 이 레포에서 일하는 에이전트용 (짧은 불변식)

- 이 사이트는 **정적**이다. 빌드 단계·백엔드·프레임워크를 도입하지 않는다.
- 카탈로그 데이터의 원본은 fullmoon-sdk의 `registry/integrations.json`
  하나뿐이다. 데이터 카피를 이 레포에 두지 않는다. 유일한 예외:
  `test-registry.json`은 README가 안내하는 로컬 테스트 픽스처로 커밋을 유지한다.
- `assets/js/market.js`의 방어를 유지한다: 레지스트리 문자열 전부 `esc()`,
  href는 `safeUrl()`로 https만, `?registry=` 오버라이드는 same-origin만.
- `assets/css/tokens.css`는 dalbit-web의 잠금 토큰 시트다. 임의 수정 금지,
  새 색 추가 금지 — market.css는 토큰 조합만 한다.
- `llms.txt` / `llms-full.txt`는 사람·LLM 문서의 요약이다. API 사실이 바뀌면
  fullmoon-economy-api(openapi.yaml)와 함께 갱신한다.
- 공개 문구는 친절한 해요체(별도 지시 없으면 무조건). 표·코드 블록은 예외.
- 커밋: Conventional Commits. 브랜치: `<type>/<slug>`.
