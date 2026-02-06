import * as migration_20260206_085305_initial from './20260206_085305_initial';

export const migrations = [
  {
    up: migration_20260206_085305_initial.up,
    down: migration_20260206_085305_initial.down,
    name: '20260206_085305_initial'
  },
];
