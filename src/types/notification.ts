export type NotiType = '긴급' | '경고' | '주의' | '정상';

export type Notification = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  type?: NotiType; 
  hasReport?: boolean;
};