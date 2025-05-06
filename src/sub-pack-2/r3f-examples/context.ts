import { createContext } from 'react';

export const wxContext = createContext<
  WechatMiniprogram.Wx | WechatMiniprogram.Component.TrivialInstance | null
>(null);
