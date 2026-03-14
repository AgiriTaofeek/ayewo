import { requestID } from "elysia-requestid";

/**
 * Community Request ID Plugin
 *
 * Replaces custom implementation with industry-standard elysia-requestid.
 * Automatically handles X-Request-ID headers and injects 'requestID' into context.
 */
export const requestIdPlugin = requestID();
