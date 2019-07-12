export interface CallbackOptions {
  callback?: () => any;
  ctx?: any;
}

export interface CommonOptions extends CallbackOptions {
  params?: any;
}

export interface MetrikaHitOptions extends CommonOptions {
  title?: any;
  referer?: string;
}

export interface MetrikaHitEventOptions {
  url: string;
  hitOptions?: MetrikaHitOptions;
}

export interface MetrikaGoalEventOptions {
  target: string;
  options?: CommonOptions;
}

export interface NgxMetrikaConfig {
  id: number;
  trackPageViews?: boolean;
  webvisor?: boolean;
  triggerEvent?: boolean;
  defer?: boolean;
  clickmap?: boolean;
  trackLinks?: boolean;
  accurateTrackBounce?: boolean;
}
