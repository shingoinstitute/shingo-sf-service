export interface JSONObject {
    contents: string;
}

export interface QueryRequest {
    action: string;
    fields: string[];
    table: string;
    clauses: string;
}

export interface IdRequest {
    object: string;
    ids: string[];
}

export interface RecordsRequest {
    object: string;
    records: JSONObject[];
}

export interface DescribeRequest {
    object: string;
}

export interface SearchRequest {
    search: string;
    retrieve: string;
}

export interface QueryResponse {
    totalSize: number;
    done: false;
    records: object[];
}

export interface SuccessObject {
    id: string;
    success: boolean;
    errors: any[];
}

export interface SearchResults {
    searchRecords: any[];
}

export interface SFError {
    metadata: any;
}
