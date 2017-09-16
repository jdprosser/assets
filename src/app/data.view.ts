export class DataView {
 
   data: any[];

   constructor(public name: string,
               data: any[]) {
      this.data = data;
      console.log("Have set DataView data" + data[0]._id);
   }

}