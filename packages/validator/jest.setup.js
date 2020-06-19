import "jest-canvas-mock";
import { MessageChannel, MessagePort } from "worker_threads";

self.MessageChannel = MessageChannel;
self.MessagePort = MessagePort;
