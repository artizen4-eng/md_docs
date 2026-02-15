# Markdown → 문서 변환기

LLM이 출력한 Markdown 결과물을 Word 친화적 문서로 변환하는 웹 앱입니다.

## 기능

- ⚡ 실시간 Markdown → 일반 문서 변환
- 📋 클립보드 복사 (Word에 바로 붙여넣기)
- 📄 Word 파일(.docx) 내보내기
- ⚙️ 프리셋 시스템 (보고서, 회의록, 간단한 메모)
- 🎨 세부 설정 커스터마이징
- 💾 LocalStorage에 프리셋 저장

## 개발

```bash
# 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build
```

## 기술 스택

- React 18 + TypeScript
- Vite 5
- Tailwind CSS v4
- Zustand (상태 관리)
- marked (Markdown 파싱)

## 배포

[Cloudflare Pages](https://pages.cloudflare.com)에 배포됩니다.

## 라이선스

MIT
