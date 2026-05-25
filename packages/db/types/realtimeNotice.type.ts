export type OrderCreateNoticeMessage = {
  owner?: string;
  customer?: string;
};

export type NoticeLevel = "info" | "success" | "error";

export type OrderRealtimeEvent = {
  notice?: {
    level: NoticeLevel;
    message: OrderCreateNoticeMessage;
    sound?: boolean;
  };
};
