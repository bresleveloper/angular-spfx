
# big-ng-spfx


## versions:

* spfx version is 1.19.0, that requires node >=18.17.1 <19.0.0.
* latest node 18 is 18.20.4, using that
* compatable NG version for that node is 17.x or 18.x, installing latest which resulted in 18.1.2

so

* Angular CLI	  : 18.1.2
* Node			  : 18.20.4
* Package Manager : npm 10.7.0
* SPFX			  : 1.19.0


see more [here](https://stackoverflow.com/questions/60248452/is-there-a-compatibility-list-for-angular-angular-cli-and-node-js)
and [here](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/compatibility)


## journey 
lets do some tests and see how smart we can go.

example with angular standalone feature (15.x+). doesnt really matter.


#### links
1. https://gonadn.medium.com/setup-angular-cli-elements-project-and-spfx-as-two-projects-solution-b733f1776ee4
2. https://www.youtube.com/watch?v=2aqLrw4zs4I&ab_channel=MicrosoftCommunityLearning
3. https://www.linkedin.com/pulse/using-angular-sharepoint-framework-spfx-part-i-krunal-rohit
4. https://www.angulararchitects.io/en/blog/angular-elements-web-components-with-standalone-components/


### version 1 - dummy level

#### create folders and solutions
1. create main folder (say `big-ng-spfx`)
2. create angular project, ng new ... (say `inner-angular-elements`)
3. create subfolder for spfx (say `outer-angular-spfx`)
4. inside create spfx solution with `yo` .... and create spfx

#### build 1 - dummy level
1. inside ng project run `ng build` (creates `\dist` folder)
2. inside office 365 create new SharePoint site (say `play with angular`)
3. create new DocLib (say `ng`)
4. upload there all files from `\dist\inner-angular-elements\browser` folder, only browser! 
5. in spfx change html to link + app-root from `\dist\inner-angular-elements\browser\index.csr.html` and change href to DocLoc route like `/sites/playwithangular/ng/`
```
      <link rel="stylesheet" href="/sites/playwithangular/ng/styles-5INURTSO.css">
      <app-root></app-root>
```
6. spfx does not allow to directly user innerHTML script tag, so we need to do it in the proper way, make fn:
```
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
```
and use 
```
  public render(): void {
    this.domElement.innerHTML = `
    <section>
      <link rel="stylesheet" href="/sites/playwithangular/ng/styles-5INURTSO.css">
      <app-root></app-root>
    </section>`;

    this.addJsPromise("/sites/playwithangular/ng/polyfills-SCHOHYNV.js").then(()=>
      this.addJsPromise("/sites/playwithangular/ng/main-I35CX3XL.js").then(()=>
        console.log("ng import done")
      )
    );
  }
```
7. make compiler not annyoing, in `tsconfig.json` add
```
  "compilerOptions": {
    "noUnusedLocals": false,
    "strictNullChecks":false,
```
8. gulp serve (or build and upload ect.)
```
    gulp build
    gulp bundle --ship
    gulp package-solution --ship
```
 ##### WORKING!!!!

now do whatever with your ng app and just upload to DocLib WITH THE SAME FILE NAME. might be annoying to fix file names everytime.




### version 2 - rookie level

lets make the SPFX compile the ng files. 

1. remove code above calling the JS files and add imports
```
require("../../../../inner-angular-elements/dist/inner-angular-elements/browser/styles-5INURTSO.css");
import "../../../../inner-angular-elements/dist/inner-angular-elements/browser/polyfills-SCHOHYNV.js"
import "../../../../inner-angular-elements/dist/inner-angular-elements/browser/main-I35CX3XL.js"
```
2. in the ng proj `npm install @angular/elements --save`. if you run like this you get error NG05104, since scripts run before the "render" function that add the html. i could theoretically play with the main.js and add some timeout ect., but eventually angular elements solves it better with browser custom elements.
3. this changes with or without standalone

#### in case of standalone

change main.ts like instuctions from here [angulararchitects.io](https://www.angulararchitects.io/en/blog/angular-elements-web-components-with-standalone-components/). here is the quick version (dont forget to change to the right element html tag!)
```
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
(async () => {
  const app = await createApplication();
  const appRoot = createCustomElement(AppComponent, {injector: app.injector,});
  customElements.define('app-root', appRoot);
})();
```

#### in case of non- standalone

change the `app.module` like this
* remove `bootstrap`
* add reference to  `CommonModule` in `imports`
* add this code per element (change tags ect.)
```
export class AppModule { 
  constructor(private injector: Injector, private router: Router, private location: Location) {
    const __AppComponent = createCustomElement(AppComponent, { injector });
    customElements.define('app-root', __AppComponent);
  }

  ngDoBootstrap(){
    this.router.initialNavigation();
  }
}
```

4. ng build, change file names in item 1 in this list
5. gulp away your spfx

### version 3 - intermidiate  level

now lets make our like a bit automated

(Error [object Object])[https://github.com/SharePoint/sp-dev-docs/issues/9675#issuecomment-2150221474]

(Module parse failed: Identifier has already been declared)[https://www.linkedin.com/pulse/sharepoint-framework-development-some-gotchas-how-solve-sergeev)


0. skip to 3, just add code from 2. 1+2 is buggy and useless, its just for demo.
1. in ng app `npm i concat` 
2. create new file in ng app root folder (say "bundle-for-spfx.js") with code to bundle output to 1 file. (SEE MY FILE AT GIT)[]. since in spfx 1.19 there is a bug about this bundling, and angular 18 creates a css file, therefor this step isn't the "real deal" and you can just stay with (soon tbd how to not add suffixes)
```
require("../../../../inner-angular-elements/dist/inner-angular-elements/browser/styles.css");
import "../../../../inner-angular-elements/dist/inner-angular-elements/browser/polyfills.js"
import "../../../../inner-angular-elements/dist/inner-angular-elements/browser/main.js"
```
3. in `gulpfile.js` add line `build.addSuppression(/Warning/gi);`. this will stop the problem with `gulp bundle --ship` exiting with `The build failed because a task wrote output to stderr. Exiting with exit code: 1`, so next step will work.
4. create `.bat` file (say "batman.bat") in root spfx dir with this code
```
(cd ../inner-angular-elements && ng build --output-hashing=none) && (cd ../outer-angular-spfx && gulp build && gulp bundle --ship && gulp package-solution --ship)
```
now you only need to run `batman.js` for your `.sppkg`



p.s. about step 2 you can see in my `batman.js` and my `bundle-for-spfx.js` what i did.



pro mission -> make also auto upload to tenant ect.





### version 4 - advanced level

now lets make a local dev, with auto-change-detection for live work 

1. ng app `ng-serve -o`
2. in spfx update `initialPage` at `config/serve.json`
3. use the `addJsPromise` all the way from version 1 with 
```
    this.addJsPromise("http://localhost:4200/polyfills.js").then(()=>
      this.addJsPromise("http://localhost:4200/main.js").then(()=>
        console.log("ng import done")
      )
    );
```
4. spfx folder `gulp trust-dev-cert` then `gulp serve`

dont forget to "fall back" to version 3 when building for tenant

now every change in the ng files will auto-update the ng server, and refresh the workbench page will populate the changes


### version 5 - pro level

make everything into 1 project with 1 generator ect.

i cant do that yet.... :)


also make something that knows between gulp serve and gulp build



## foreward

* added SPService support example, see spfx webpart and app-component




# HAVE FUN