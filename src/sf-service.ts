import { join } from 'path';
import { promisifyAll } from 'bluebird';
import { QueryRequest, QueryResponse, JSONObject,
         IdRequest, RecordsRequest, SuccessObject,
         SearchRequest, SearchResults, SFError } from './index';
import * as grpc from 'grpc';

const sfservices = grpc.load(join(__dirname, './sf_services.proto')).sfservices;

export class SalesforceService {
    private client: any;

    constructor(uri = `${process.env.SF_API}:80`) {
        this.client = promisifyAll(this.getClient(uri));
    }

    private getClient(uri: string) {
        return new sfservices.SalesforceMicroservices(uri, grpc.credentials.createInsecure());
    }

    /**
     * Queries the Salesforce instance
     * @param query The query object
     * @returns The query response
     */
    public async query(query: QueryRequest): Promise<QueryResponse> {
        const response: JSONObject = await this.client.queryAsync(query);
        return JSON.parse(response.contents);
    }

    /**
     * Retrieves Salesforce objects
     * @param data The id request object
     * @returns The objects
     */
    public async retrieve(data: IdRequest): Promise<object> {
        const response: JSONObject = await this.client.retrieveAsync(data);
        return JSON.parse(response.contents);
    }

    /**
     * Creates Salesforce records
     * @param data The record object
     * @returns A success object
     */
    public async create(data: RecordsRequest): Promise<SuccessObject[]> {
        const response: JSONObject = await this.client.createAsync(data);
        return JSON.parse(response.contents);
    }

    /**
     * Updates Salesforce records
     * @param data The record object
     * @returns A success object
     */
    public async update(data: RecordsRequest): Promise<SuccessObject[]> {
        const response: JSONObject = await this.client.updateAsync(data);
        return JSON.parse(response.contents);
    }

    /**
     * Deletes Salesforce objects
     * @param data The id request object
     * @returns A success object
     */
    public async delete(data: IdRequest): Promise<SuccessObject[]> {
        const response: JSONObject = await this.client.deleteAsync(data);
        return JSON.parse(response.contents);
    }

    // tslint:disable:max-line-length
    /**
     * Describes a Salesforce object
     * @param object The Salesforce object name
     * @returns A describe object. See the [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_describe.htm)
     */
    public async describe(object: string): Promise<object> {
    // tslint:enable:max-line-length
        const response = await this.client.describeAsync({ object });
        return JSON.parse(response.contents);
    }

    /**
     * Searches the Salesforce instance
     * @param data The search request object
     * @returns The search result
     */
    public async search(data: SearchRequest): Promise<SearchResults> {
        const response = await this.client.searchAsync(data);
        return JSON.parse(response.contents);
    }

    /**
     * Parses a gRPC error
     * @param error The error to be parsed
     * @returns The error data as an object or string if not an object, or the original error
     */
    public static parseErrorMeta(error: SFError): string | object {
        try {
            return JSON.parse(error.metadata.get('error-bin').toString());
        } catch (caught) {
            if (error.metadata.get('error-bin')) return error.metadata.get('error-bin').toString();
            else return error;
        }
    }
}
