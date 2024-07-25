import {SPHttpClient,SPHttpClientResponse,} from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export default class SP_Service {
    //usage in spfx component : 
    // private _spService: SP_Service  = new SP_Service(this.context)
    constructor(public context: WebPartContext) { }


    //$select=Title,Order....
    public getListItems(listName: string, $select:string = '', $filter:string ='', $top:number = 1000, skipTokenIdValue?:number): Promise<any> {
        return this.getListItemsFromWeb(this.context.pageContext.web.absoluteUrl, listName, $select, $filter, $top, skipTokenIdValue);
    }

    public getListItemsFromWeb(web:string, listName: string, $select:string = '', $filter:string ='', $top:number = 1000, skipTokenIdValue?:number): Promise<any> {
        let $skip = skipTokenIdValue ? `$skiptoken=Paged=TRUE%26p_ID=${skipTokenIdValue}` : "";
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.get(
                web +
                `/_api/web/lists/GetByTitle('${listName}')/Items?$top=${$top}&${ $select ? $select : '' }&${ $filter ? $filter : '' }&${$skip}&s$inlinecount=allpage`, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data) => {
                        console.log('list items for', listName, data);
                        resolve(data);
                    });
                });
        });
        
        return promise;
    }

    public getListItem(listName: string, id:number): Promise<any> {
        return this.getListItemFromWeb(this.context.pageContext.web.absoluteUrl, listName, id);
    }

    public getListItemFromWeb(web:string, listName: string, id:number): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.get(
                web +
                `/_api/web/lists/GetByTitle('${listName}')/Items(${id})`, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data) => {
                        console.log('list item for', listName, id, data);
                        resolve(data);
                    });
                });
        });
        
        return promise;
    }

    public getFiles(listName: string, $select:string = '', $filter:string = ''): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.get(
                this.context.pageContext.web.absoluteUrl +
                `/_api/web/lists/GetByTitle('${listName}')/RootFolder/Files?$top=1000&${ $select ? $select : '' }&${ $filter ? $filter : '' }`, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data) => {
                        console.log('list items for', listName, data);
                        resolve(data);
                    });
                });
        });
        
        return promise;
    }


    public createListItem(listName: string, body: object): Promise<any> {
        // const spOpts: string = JSON.stringify({
        //     'Title': `Ã—â€ºÃ—â€¢Ã—ÂªÃ—Â¨Ã—Âª 4`, 'name': 'Ã—Â©Ã—Â 4', 'age': 80
        // });
        const spOpts: string = JSON.stringify(body);
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items`, SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=nometadata',
                    'odata-version': ''
                },
                body: spOpts
            })
                .then((response: SPHttpClientResponse) => {
                    console.log(`Status code: ${response.status}`);
                    console.log(`Status text: ${response.statusText}`);
                    response.json().then((responseJSON: JSON) => {
                        console.log(responseJSON);
                        resolve(responseJSON);
                    });
                });
        });
        return promise
    }

    public updateListItem(listName: string, id: number, body: object): Promise<any> {
        // const spOpts: string = JSON.stringify({
        //     'Title': `Title 2`, 'name': 'Ã—Â©Ã—Â 2222', 'age': 756
        // });
        const spOpts: string = JSON.stringify(body);
        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items(${id})`,
                SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=nometadata',
                    'odata-version': '',
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'MERGE'
                },
                body: spOpts
            })
                .then((response: SPHttpClientResponse) => {
                    console.log(`response: ${response.status}`);
                    resolve(response);
                });
        });
        return promise
    }

    public deleteListItem(listName: string, id: number): Promise<any> {

        let promise = new Promise((resolve, reject) => {
            this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items(${id})`,
                SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=nometadata',
                    'odata-version': '',
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'DELETE'
                },
            })
                .then((response: SPHttpClientResponse) => {
                    console.log(`response: ${response.status}`);
                    resolve(response);
                });
        });
        return promise
    }

    //get userid from current user using the loginname
    public getUserId(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            const payload: string = JSON.stringify({
                'logonName': this.context.pageContext.user.loginName // i:0#.f|membership|firstname.lastname@contoso.onmicrosoft.com      
              });
              var postData = {
                body: payload
              };
            this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/ensureuser'`, SPHttpClient.configurations.v1, postData)
                .then((response: SPHttpClientResponse) => {
                    response.json().then((data) => {
                        console.log('user id', data);
                        resolve(data);
                    });
                });
        });
        return promise;
    }


}


// use
    // this.getListItems('test');
    // this.updateListItems('test', 2, obj);
    // this.createListItem('test', obj);
    // this.deleteListItem('test', 2);
    // this.getUserId();