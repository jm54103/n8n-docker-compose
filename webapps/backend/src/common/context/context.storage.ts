// context.storage.ts (ตัวอย่างการทำ Storage แบบง่าย)
import { AsyncLocalStorage } from 'async_hooks';
export const userContext = new AsyncLocalStorage<{ userId: string }>();