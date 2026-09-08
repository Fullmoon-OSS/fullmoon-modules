# Fullmoon Market

풀문(Fullmoon) 네트워크 통합 카탈로그 사이트예요.
**[market.fullmoon.ink](https://market.fullmoon.ink)**에서 서빙돼요.

SDK·공유 경제 API 위에 만들어진 봇·대시보드·도구의 공식 목록("플러그인 마켓")
을 보여줘요.

## 데이터는 어떻게 흘러가나요?

```
통합 개발자 → PR → fullmoon-sdk/registry/integrations.json (병합)
                              ↓ (이 사이트가 fetch)
        market.fullmoon.ink — 병합 즉시 반영, 빌드·배포 불필요
```

- 데이터 원본은 [fullmoon-sdk의 registry/integrations.json](https://github.com/Fullmoon-OSS/fullmoon-sdk/blob/main/registry/integrations.json)
  하나예요. 이 레포에는 데이터 카피가 없어요.
- 사이트는 정적이에요(index.html + CSS/JS). 서버나 빌드 과정이 없어서, 카탈로그가
  바뀌어도 다시 배포할 필요가 없어요.
- 렌더러는 레지스트리 문자열을 전부 escape하고 `https:` 링크만 허용해요.
  (등록 검증기도 https만 받지만, 렌더러는 이중으로 잠가요.)

## 로컬에서 돌려보기

정적 파일이라 서버만 있으면 돼요:

```bash
python3 -m http.server 8080
# http://127.0.0.1:8080
```

다른 레지스트리로 테스트하려면 `?registry=`로 갈아끼울 수 있어요. 단 **같은
오리진의 URL만** 받아요 — 원격 URL은 무시돼요(공식 도메인 위에 가짜 카탈로그를
그리는 피싱을 막기 위해서예요):

```
http://127.0.0.1:8080/?registry=http://127.0.0.1:8080/test-registry.json
```

## 디자인

[fullmoon.ink](https://fullmoon.ink)와 같은 **Moonwake** 디자인 언어를 따라요.
`assets/css/tokens.css`는 dalbit-web의 잠금 토큰 시트를 그대로 쓰고, 이 사이트는
토큰 조합만 해요. 새 색은 추가하지 않아요.

폰트(Hahmlet, IBM Plex Sans KR, IBM Plex Mono)는 SIL OFL 1.1이에요. 라이선스
전문과 저작권 고지는 `assets/fonts/`의 `OFL-*.txt`와 함께 배포해요.

## LLM·에이전트용 문서

사이트 루트에서 LLM용 문서를 서빙해요:

- [`/llms.txt`](https://market.fullmoon.ink/llms.txt) — 문서·데이터 링크 맵
  (llmstxt.org 관련)
- [`/llms-full.txt`](https://market.fullmoon.ink/llms-full.txt) — 플랫폼 전체를
  한 페이지로: 퀵스타트, 모든 엔드포인트 응답 형태, 에러 모델, 등록 절차

사람·LLM 공용 기계 명세는 fullmoon-economy-api의
[`openapi.yaml`](https://github.com/Fullmoon-OSS/fullmoon-economy-api/blob/main/openapi.yaml)과
fullmoon-sdk의 [`integrations.schema.json`](https://github.com/Fullmoon-OSS/fullmoon-sdk/blob/main/registry/integrations.schema.json)이에요.
각 레포의 `AGENTS.md`가 에이전트 기여자용 불변식을 요약해요.

## 등록

이 사이트에 직접 등록하지는 않아요. 등록 절차는
[fullmoon-sdk의 INTEGRATIONS.md](https://github.com/Fullmoon-OSS/fullmoon-sdk/blob/main/INTEGRATIONS.md)를
따라 주세요.

## 배포 (운영자용)

배포 스크립트와 nginx 설정은 운영 모노레포(`servers-network/scripts/deploy-market.sh`,
`infra/nginx/market.fullmoon.ink.conf`)에서 관리해요. 이 레포는 사이트 소스만
담아요.

## 라이선스

[MIT](./LICENSE)예요.
