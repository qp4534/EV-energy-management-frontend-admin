export type TermKey = 'age' | 'service' | 'privacy' | 'location';

export type TermIcon = 'flame' | 'battery' | 'location' | 'plus';

export type TermArticleSection = {
  type: 'article';
  heading: string;
  title: string;
  body?: string;
  bullets?: { icon?: TermIcon; text: string }[];
};

export type TermTableSection = {
  type: 'table';
  rows: { label: string; value: string }[];
};

export type TermParagraphSection = {
  type: 'paragraph';
  body: string;
};

export type TermSection = TermArticleSection | TermTableSection | TermParagraphSection;

export type TermContent = {
  key: TermKey;
  label: string;
  tabLabel: string;
  title: string;
  required: boolean;
  hasDetail: boolean;
  agreedAtNotice: string;
  sections: TermSection[];
};

export const TERMS: TermContent[] = [
  {
    key: 'age',
    label: '[필수] 만 14세 이상입니다',
    tabLabel: '만 14세 확인',
    title: '만 14세 이상 확인',
    required: true,
    hasDetail: false,
    agreedAtNotice: '동의 시점: 최초 가입',
    sections: [
      {
        type: 'paragraph',
        body: '본 서비스는 만 14세 미만 아동의 개인정보를 수집하지 않습니다. 이용자는 본인이 만 14세 이상임을 확인하며, 허위로 확인한 경우 발생하는 불이익에 대해 회사는 책임지지 않습니다.',
      },
      {
        type: 'paragraph',
        body: '만 14세 미만인 경우 서비스 가입이 제한됩니다.',
      },
    ],
  },
  {
    key: 'service',
    label: '[필수] 서비스 이용약관 동의',
    tabLabel: '서비스 이용약관',
    title: '서비스 이용약관 동의',
    required: true,
    hasDetail: true,
    agreedAtNotice: '동의 시점: 최초 가입',
    sections: [
      {
        type: 'article',
        heading: '제1조',
        title: '목적',
        body: '본 약관은 MijungE(이하 "회사")가 제공하는 전기차 에너지 관리 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.',
      },
      {
        type: 'article',
        heading: '제2조',
        title: '서비스의 내용',
        body: '회사는 다음과 같은 서비스를 제공합니다.',
        bullets: [
          { icon: 'flame', text: '열화상 카메라 기반 화재 위험 감지 및 알림' },
          { icon: 'battery', text: '배터리 상태 진단(SOH/RUL 예측) 및 디지털 배터리 여권 발급' },
          { icon: 'location', text: '충전소 위치 안내 및 AI 충전 가이드' },
          { icon: 'plus', text: '기타 회사가 정하는 부가 서비스' },
        ],
      },
      {
        type: 'article',
        heading: '제3조',
        title: '약관의 효력 및 변경',
        body: '회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 앱 내 공지사항을 통해 사전 고지합니다.',
      },
      {
        type: 'article',
        heading: '제4조',
        title: '이용자의 의무',
        body: '이용자는 차량 및 배터리 관련 정보를 사실대로 등록해야 하며, 허위 정보 입력으로 인한 서비스 오작동에 대해 회사는 책임을 지지 않습니다.',
      },
      {
        type: 'article',
        heading: '제5조',
        title: '서비스 이용 제한',
        body: '이용자가 관련 법령 및 본 약관을 위반한 경우, 회사는 사전 통지 없이 서비스 이용을 제한할 수 있습니다.',
      },
    ],
  },
  {
    key: 'privacy',
    label: '[필수] 개인정보 수집 및 이용 동의',
    tabLabel: '개인정보 수집',
    title: '개인정보 수집 및 이용 동의',
    required: true,
    hasDetail: true,
    agreedAtNotice: '동의 시점: 최초 가입',
    sections: [
      {
        type: 'table',
        rows: [
          { label: '수집 목적', value: '회원 가입 및 본인 확인, 서비스 제공, 고객 문의 응대' },
          { label: '수집 항목', value: '이름, 이메일, 비밀번호, 생년월일, 전화번호' },
          {
            label: '보유 및 이용 기간',
            value: '회원 탈퇴 시까지 (단, 관계 법령에 따라 별도 보관이 필요한 경우 해당 기간 동안 보관)',
          },
          {
            label: '동의 거부 권리',
            value: '동의를 거부할 권리가 있으나, 필수 항목 미동의 시 회원가입 및 서비스 이용이 제한됩니다.',
          },
        ],
      },
    ],
  },
  {
    key: 'location',
    label: '[선택] 위치기반서비스 이용약관',
    tabLabel: '위치기반서비스',
    title: '위치기반서비스 이용약관',
    required: false,
    hasDetail: true,
    agreedAtNotice: '동의 시점: 최초 가입',
    sections: [
      {
        type: 'article',
        heading: '제1조',
        title: '목적',
        body: '본 약관은 회사가 제공하는 위치기반서비스(충전소 위치 안내, 주변 충전소 추천 등)의 이용조건을 규정합니다.',
      },
      {
        type: 'article',
        heading: '제2조',
        title: '수집하는 위치정보',
        body: 'GPS 및 네트워크 기반 실시간 위치정보',
      },
      {
        type: 'article',
        heading: '제3조',
        title: '이용 목적',
        bullets: [
          { icon: 'location', text: '주변 충전소 검색 및 경로 안내' },
          { icon: 'location', text: '이용 가능 충전소 추천' },
        ],
      },
      {
        type: 'article',
        heading: '제4조',
        title: '보유 기간',
        body: '위치정보는 서비스 제공 목적 달성 즉시 파기하며, 별도로 저장하지 않는 것을 원칙으로 합니다.',
      },
      {
        type: 'article',
        heading: '제5조',
        title: '이용자의 권리',
        body: '이용자는 위치정보 수집에 대한 동의를 언제든지 철회할 수 있으며, 이 경우 위치 기반 기능(충전소 안내 등) 이용이 제한될 수 있습니다.',
      },
    ],
  },
];

export const TERM_KEYS = TERMS.map((term) => term.key);

export function getTermContent(key: TermKey): TermContent {
  const term = TERMS.find((t) => t.key === key);
  if (!term) {
    throw new Error(`Unknown term key: ${key}`);
  }
  return term;
}
