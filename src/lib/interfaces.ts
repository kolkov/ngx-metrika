export interface CallbackOptions {
  callback?: () => any;
  ctx?: any;
}

export interface CommonOptions extends CallbackOptions {
  params?: any;
  title?: any;
}

export interface MetrikaHitOptions extends CommonOptions {
  referer?: string;
}

export interface NgxMetrikaConfig {
  id: string | number;
  trackPageViews?: boolean;
  webvisor?: boolean;
}
