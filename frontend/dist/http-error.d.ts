export type HTTPErrorResponse = {
    code: string;
    message: string;
    params?: Record<string, string>;
    request_id: string;
};
export declare function parseHTTPErrorResponse(value: unknown): HTTPErrorResponse | null;
export declare function readHTTPErrorResponse(response: Response): Promise<HTTPErrorResponse | null>;
