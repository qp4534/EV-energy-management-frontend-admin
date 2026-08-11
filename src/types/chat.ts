export type ChatSource = {
  chunkId?: string | null;
  title: string;
  sourceType?: string | null;
  page?: number | null;
  clause?: string | null;
  url?: string | null;
  score?: number | null;
};

export type ChatMessageResult = {
  answer: string;
  sources: ChatSource[];
};
