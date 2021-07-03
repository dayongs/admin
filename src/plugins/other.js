// <el-table-column
//     prop="full_address"
//     label="地址"
//     width="280">
//     <!--        <template slot-scope="scope" class="block" >-->
//     <!--          {{showCity(scope.row.province_code , scope.row.city_code, scope.row.district_code)+ scope.row.address}}-->
//     <!--        </template>-->
// </el-table-column>


//代码转城市1
// showCity(province,city,district){
//     let  address=''
//     const areasData=JSON.parse(localStorage.getItem('areasData'))//object //转为对象
//     if(province){
//         let obj1=this.findName(province,areasData)
//         address=obj1.label+'.'
//         if(city){
//             let obj2=this.findName(city,obj1.children)
//             address+=obj2.label+'.'
//             if(district){
//                 let obj3=this.findName(district,obj2.children)
//                 address+=obj3.label
//             }
//         }
//     }else {
//         return
//     }
//     return address
// }
// //代码转城市2
// findName(code,obj){
//     const index=obj.findIndex(element => element.value === code)
//     // console.log(obj[index].label)
//     return obj[index]
// },
