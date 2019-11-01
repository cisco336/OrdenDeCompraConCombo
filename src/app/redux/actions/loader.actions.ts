import { Action } from '@ngrx/store';

export const LOADER_ON = '[LOADER] Start loader';
export const LOADER_OFF = '[LOADER] Stop loader';

// Iniciar el loader
export class StartLoader implements Action {
  readonly type = LOADER_ON;
}

// Detener el loader
export class StopLoader implements Action {
  readonly type = LOADER_OFF;
}

export type Actions = StartLoader | StopLoader;
