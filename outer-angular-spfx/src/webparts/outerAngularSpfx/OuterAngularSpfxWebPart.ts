import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './OuterAngularSpfxWebPart.module.scss';
import * as strings from 'OuterAngularSpfxWebPartStrings';
import SP_Service from '../../services/SPService';


//code for ### version 2 - rookie level
//https://github.com/SharePoint/sp-dev-docs/issues/9675
/*require("../../../../inner-angular-elements/dist/inner-angular-elements/browser/styles-5INURTSO.css");
import "../../../../inner-angular-elements/dist/inner-angular-elements/browser/polyfills-SCHOHYNV.js"
import "../../../../inner-angular-elements/dist/inner-angular-elements/browser/main-STR6NZHW.js"*/


//### version 3 - intermidiate  level
require("../../../../inner-angular-elements/dist/inner-angular-elements/browser/styles.css");
//import "../../../../inner-angular-elements/dist/spfxBundle.js"



//### version 4 - advanced level
//require("http://localhost:4200/styles.css");
//import "http://localhost:4200/polyfills.js"
//import "http://localhost:4200/main.js"


export interface IOuterAngularSpfxWebPartProps {
  description: string;
}

export default class OuterAngularSpfxWebPart extends BaseClientSideWebPart<IOuterAngularSpfxWebPartProps> {

  private _spService: SP_Service;


  public render(): void {
    //console.log("OUTER ANGULAR ### version 1 - dummy level");
    //console.log("OUTER ANGULAR ### version 2 - rookie level");
    //console.log("OUTER ANGULAR ### 3 - intermidiate level");
    console.log("OUTER ANGULAR ### 4 - advanced level");
    
    
    this._spService = new SP_Service(this.context)
    // @ts-ignore
    window._spService = this._spService


    //code for ### version 1 - dummy level
    //<link rel="stylesheet" href="/sites/playwithangular/ng/styles-5INURTSO.css">
    this.domElement.innerHTML = `
    <section>
      <!--<h1>### version 1 - dummy level</h1>-->
      <!--<h1>### version 2 - rookie level</h1>-->
      <!--<h1>### version 3 - intermidiate level</h1>-->
      <h1>### version 4 - advanced level</h1>
      
      <h2>### version 4.1 - SPService support in angular</h2>
      
      <app-root></app-root>
    </section>`;

    //code for ### version 1 - dummy level
    /*this.addJsPromise("/sites/playwithangular/ng/polyfills-SCHOHYNV.js").then(()=>
      this.addJsPromise("/sites/playwithangular/ng/main-I35CX3XL.js").then(()=>
        console.log("ng import done")
      )
    );*/


    //### version 4 - advanced level
    this.addJsPromise("http://localhost:4200/polyfills.js").then(()=>
      this.addJsPromise("http://localhost:4200/main.js").then(()=>
        console.log("ng import done")
      )
    );


  }


  //code for ### version 1 - dummy level
  private addJsPromise(u:string){
    return new Promise((resolve, reject) =>{
      let myScriptTag: HTMLScriptElement = document.createElement("script");
      myScriptTag.src = u;
      myScriptTag.type = "module";
      myScriptTag.onload = ()=>{
        console.log("addJsPromise " + u);
        resolve(null);
      };
      document.body.appendChild(myScriptTag);
    })
  }




  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
