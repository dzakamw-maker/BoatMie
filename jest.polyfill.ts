import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, TransformStream } from 'stream/web';
import { MessageChannel, MessageEvent, MessagePort } from 'worker_threads';
Object.assign(global, { TextDecoder, TextEncoder, ReadableStream, TransformStream, MessageChannel, MessageEvent, MessagePort });
