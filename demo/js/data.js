/*
 * 사이트 콘텐츠 데이터
 *
 * - SITE: 확정된 기본 정보
 * - PROJECTS: 프로젝트 목록. 지금 들어 있는 4개는 화면 구성을 보여주는 샘플(sample: true)입니다.
 *   실제 프로젝트로 교체할 때는 항목을 수정·추가하고 sample 줄을 지우면 됩니다.
 *   이미지가 준비되면 art 대신 이미지 경로를 쓰도록 main.js의 렌더링 부분을 바꾸면 됩니다.
 *
 *   type: '건축 설계' | '자동화' | '연구'
 *   art : 'louver' | 'dots' | 'strings' | 'truchet'  (자동 생성 이미지 종류)
 *   seed: 숫자를 바꾸면 같은 종류에서 다른 무늬가 나옵니다.
 */
window.SITE = {
  name: '윤현석',
  role: '건축가',
  field: '설계 자동화',
  email: 'davidoff1126@gmail.com',
};

window.PROJECTS = [
  {
    id: 'sample-drawing-automation',
    sample: true,
    title: '반복 도면 작업 자동화',
    year: '2026',
    type: '자동화',
    art: 'louver',
    seed: 11,
    summary: '도면 작업 중 반복되는 단계를 자동화한 사례를 소개하는 자리입니다.',
    overview: '프로젝트의 배경과 해결하려던 문제, 접근 방법을 이곳에 적습니다.',
    role: '입력 예정',
    period: '입력 예정',
    location: '입력 예정',
    scale: '입력 예정',
    tools: [],
    result: '작업 시간 변화 등 정량 성과를 이곳에 적습니다.',
  },
  {
    id: 'sample-area-quantity',
    sample: true,
    title: '면적·물량 산출 도구',
    year: '2026',
    type: '자동화',
    art: 'dots',
    seed: 23,
    summary: '모델과 도면에서 면적표와 물량을 자동으로 집계한 사례를 소개하는 자리입니다.',
    overview: '프로젝트의 배경과 해결하려던 문제, 접근 방법을 이곳에 적습니다.',
    role: '입력 예정',
    period: '입력 예정',
    location: '입력 예정',
    scale: '입력 예정',
    tools: [],
    result: '작업 시간 변화 등 정량 성과를 이곳에 적습니다.',
  },
  {
    id: 'sample-housing',
    sample: true,
    title: '주거 건축 설계',
    year: '2025',
    type: '건축 설계',
    art: 'truchet',
    seed: 37,
    summary: '건축 설계 프로젝트를 소개하는 자리입니다. 배치, 평면, 입면 이미지가 들어갑니다.',
    overview: '프로젝트의 개요와 설계 개념을 이곳에 적습니다.',
    role: '입력 예정',
    period: '입력 예정',
    location: '입력 예정',
    scale: '입력 예정',
    tools: [],
    result: '준공 여부, 수상 등 결과를 이곳에 적습니다.',
  },
  {
    id: 'sample-alternatives',
    sample: true,
    title: '설계 대안 생성 연구',
    year: '2025',
    type: '연구',
    art: 'strings',
    seed: 41,
    summary: '조건을 바꿔 가며 설계 대안을 생성하고 비교한 연구를 소개하는 자리입니다.',
    overview: '연구의 배경과 방법, 검증 과정을 이곳에 적습니다.',
    role: '입력 예정',
    period: '입력 예정',
    location: '입력 예정',
    scale: '입력 예정',
    tools: [],
    result: '연구 결과와 활용 방안을 이곳에 적습니다.',
  },
];
