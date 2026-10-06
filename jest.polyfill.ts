import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, TransformStream } from 'stream/web';
import { MessageChannel,  MessagePort } from 'worker_threads';
Object.assign(global, { TextDecoder, TextEncoder, ReadableStream, TransformStream, MessageChannel,  MessagePort });
