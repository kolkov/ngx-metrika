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

export interface MetrikaHitEventOptions {
  url: string;
  hitOptions?: MetrikaHitOptions;
}

export interface MetrikaGoalEventOptions {
  type: string;
  commonOptions?: CommonOptions;
}

export interface NgxMetrikaConfig {
  id: string | number;
  trackPageViews?: boolean;
  webvisor?: boolean;
  triggerEvent?: boolean;
}

export class NgxMetrikaConfig implements NgxMetrikaConfig {
  triggerEvent? = true;
}
