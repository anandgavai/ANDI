'use strict';
//test data goes here
/**
 * @ngdoc function
 * @name andiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the andiApp
 */
var defaultFolder = '2016-01-14';
app.controller("PanelController",function(){
  this.tab=1;
  this.selectTab=function(setTab){
    this.tab=setTab;
  };
  this.isSelected=function(checkTab){
    return this.tab === checkTab;
  };

  this.previous =function(){
    return this.tab= this.tab-1;
  };
  this.next=function(){
    return this.tab = this.tab+1;
  };
});

app.controller('TableController', function($scope) {
  this.patient= pat;
  var dum={};
  this.tree_data = [];
  this.calculateAge = function (birthday) { // birthday is a date
    //var ageDifMs = Date.now() - birthday.getTime();
    var ageDifMs = Date.now();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
   };
  this.createPatientObject=function(){
   var age= this.calculateAge();
   dum= {"patient.id":$scope.patient.id,
         "patient.age":age,
         "patient.sex":$scope.patient.sex,
         "patient.education":$scope.patient.education
        };
   return dum;
  };
  this.createTestObject=function(){
   return $scope.patient.test.value;
  };
  this.exportCSV=function(){};
  this.getPat=function(){
    //return ($scope.patient.id);
     return ($scope.patient[0]);
  };
  this.changeEnvironment = function(val){
  };
});

app.controller('treeController', function($http,$scope,$timeout,$modal,$q) {
  this.tests    = [];
  this.treeArr  = [];
  this.txtvalue = '';
  this.txtReplace = '';
  this.isExpanded = false;
  $http.get('data/'+defaultFolder+'/tests.json').success(function (data) 
  {
    $scope.treeCtrl.tests =  data;
    $scope.patient.nomative = defaultFolder;
  });

  $http.get("data/folders.json").then(function(res){
      $scope.folders = {   "type": "select", 
        "value": defaultFolder, 
        "values": res.data 
      };
  });

  this.counter = 2;
  var tree;
  this.tabledata= {'0':'Table 0'};
  this.my_tree = tree = {};
  this.counterlimit = 0;
  this.col_defs = [
      {
          field: "label",
          sortable : true,                                        
          sortingType : "string"
      },
  ];
  this.expanding_property = {
      field: "id",
      displayName: "id Name",
      sortable : true,
      filterable: true
  };
  this.submited = false;
  this.selectedNode = {'total1to5': "", 'delayedrecall1to5': "", 'recognition1to5': "", 'total1to3': "", 'delrecall1to3': ""};
  

  this.my_tree_handler = function (branch) {
      console.log('you clicked on', branch)
  }
  this.getTreeData = function(val){
    $http.get('data/'+val+'/tests.json').success(function (data) 
    {
      $scope.treeCtrl.tests =  data;
      $scope.patient.nomative = val;
     /* $scope.treeCtrl.treeArr = _(data).chain()
                      .zip(_(data).pluck('children'))
                      .flatten()
                      .compact()
                      .value();*/
    });
  }

  this.treeExpanded = function(){
    $scope.$$postDigest( function () {
      if($scope.testSearch===''){
          $('.ivh-treeview-node-label').trigger('click')
          $scope.treeCtrl.isExpanded = false;
        }
        if($scope.testSearch.length===1 && $scope.treeCtrl.isExpanded===false){
          $('.ivh-treeview-node-label').trigger('click')
          $scope.treeCtrl.isExpanded = true;
        }
    });
  };

  this.awesomeCallback = function(node, tree) {
    // Do something with node or tree
  };
  this.otherAwesomeCallback = function(node, isSelected, tree) {
    // Do soemthing with node or tree based on isSelected
  };
  this.getSelectedNodes=function(node){
    //return node.label;
    if (node.isSelected==true || node.children.length>0) {
      return node.id;
    };
  };
  this.getjson=function (tests) {
     var k =JSON.stringify(tests);
     return k;
  };
  this.isActive = function(node) {
    if (node.isSelected==true) {
      return node.id;
    };
  };
  /// Important function for tree traversal 
  var arr=[];
  this.process = function(key,value) {
      arr.push(key + " : "+value);
  };
  this.traverse = function(o,func) {
      for (var i in o) {
          func.apply(this,[i,o[i]]);  
          if (o[i] !== null && typeof(o[i])=="object") {
              //going on step down in the object tree!!
              traverse(o[i],func);
          }
      }
  };
  this.fun2=function(tests){
    for (var i in tests){
      if (tests[i] !==null && typeof(tests[i]=="object")){
       for (j in tests.children){
       }   
      }
    }
  };
  //that's all... no magic, no bloated framework
  this.fun=function(tests){
      var arr=[];
      var coll=[];
      this.process = function(key,value) {
          arr.push(key + " : "+value);
      };
      this.traverse = function(o,func) {
          for (var i in o) {
              func.apply(this,[i,o[i]]);
              if (o[i] !== null && typeof(o[i])=="object" && o[i].isSelected) {
                  console.log(o[i].id);
                  this.traverse(o[i],func);
              }
          }
      };
      this.traverse(tests,this.process);
      return(arr)
  };
  // This function counts the number of occurance of each element in the array
  this.countArrElements = function (arr) {
      var a = [], b = [], prev;
      arr.sort();
      for ( var i = 0; i < arr.length; i++ ) {
          if ( arr[i] !== prev ) {
              a.push(arr[i]);
              b.push(1);
          } else {
              b[b.length-1]++;
          }
          prev = arr[i];
      }
      return [a, b];
  };
  this.addPatient=function(){
      if(this.counter<6){
        this.counterlimit++;
        this.tabledata[this.counterlimit] = 'Table '+this.counterlimit;
        this.counter++;
      }
  };
  // remove the selected column
  this.removeColumn = function (index) {
    // remove the column specified in index
    // you must cycle all the rows and remove the item
    // row by row
    //this.tabledata.splice(index, 1);
    delete this.tabledata[index];
    delete $scope.patient[index];
    this.counter--;
  };
  this.removePatient = function(){
    debugger;
  };


  this.submit=function(isValid){
  // check to make sure the form is completely valid
    if ($scope.patient.form.$invalid) {
        console.log("Hello World");
        $scope.treeCtrl.submited = true;
    }
    else{
      $scope.treeCtrl.submited = true;
      var limit = 1;
      var patientObj = {conf:$scope.patient.conf,sig:$scope.patient.sig,nomative:$scope.patient.nomative};
      for (var i in $scope.patient) {
        if(limit<this.counter){
          var patientTest = [];
          for (var key in $scope.patient[i].test) {
            if ($scope.patient[i].test.hasOwnProperty(key)) {
              var idField =  key;//(key).replace(/_/g," ");
              var labelField =  findTest(idField,'id');
              patientTest.push({
                                id:idField,
                                label:labelField.label,
                                Dataset:labelField.Dataset,
                                'SPSS name':labelField['SPSS name'],
                                highborder:labelField.highborder,
                                highweb:labelField.highweb,
                                lowborder:labelField.lowborder,
                                lowweb:labelField.lowweb,
                                value:$scope.patient[i].test[key]
                              });
            }
            patientObj[i] = {id:$scope.patient[i].id,
                            age:$scope.patient[i].age,
                            dob:$scope.patient[i].dob,
                            dot:$scope.patient[i].dot,
                            sex:$scope.patient[i].sex,
                            education:$scope.patient[i].education,
                            test:patientTest};
          }
          limit++;
        }
      }
      console.log(patientObj);

      /*var config = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
          }
      }
      $http.post('http://localhost/Compressed/formTestScores/index.php',patientObj, config)
      .success(function (data, status, headers, config) {
          console.log(data);
      })
      .error(function (data, status, header, config) {
        console.log(data);  
      });*/

    } 
  };

  this.uploadCsv = function(){
    var files = $("#fileContent")[0].files;
    if (files.length) {
      $scope.opts = {
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        templateUrl : 'views/modalContent.html',
        controller : ModalInstanceCtrl,
        resolve: {} // empty storage
      };
      $scope.opts.resolve.item = function() {
        return angular.copy({name:$scope.name}); // pass name to Dialog
      }
      var modalInstance = $modal.open($scope.opts);
      modalInstance.result.then(function(obj){
        $scope.treeCtrl.txtvalue = obj.txtvalue;
        var replacearr = obj.txtvalue.split(",");
        var r = new FileReader();
        r.onload = function(e) {
            var contents = e.target.result;
            var rows = contents.split('\n');
            $scope.patient[0] = {'id':'','age':'','dob':'','dot':'','sex':'','education':'','test':{}};
            angular.forEach(rows, function(val,key) {
              var data = val.split(',');
              if(key===1){
                var k = 1;
                for(var i=0;i<data.length;i++){
                  if(data[i]!=='' && i>1){
                    $scope.patient[k] = {'id':'','age':'','dob':'','dot':'','sex':'','education':'','test':{}};
                    $timeout(function() {
                      $scope.treeCtrl.counterlimit++;
                      $scope.treeCtrl.tabledata[$scope.treeCtrl.counterlimit] = 'Table '+$scope.treeCtrl.counterlimit;
                      $scope.treeCtrl.counter++;
                    }, 50);
                    k++;
                  }
                }
              }

              if(key>0){
                $timeout(function() {
                  for(var j=0;j<data.length;j++){
                    if(data[j]!=='' && j!==0){

                      if(key>6){
                        var field = data[0];//data[0].replace(/ /g,"_");//'#test'+j+'_'+data[0].replace(/ /g,"");
                        var fieldVal = data[j];//parseInt(data[j]);
                        if ($.inArray(fieldVal, replacearr) >= 0) {
                          fieldVal = 999999999;
                        }
                        else{
                          fieldVal = parseInt(fieldVal);
                        }
                        /*if(fieldVal===parseInt($scope.treeCtrl.txtvalue)){
                          fieldVal = parseInt($scope.treeCtrl.txtReplace);
                        }*/
                        $scope.patient.form['test'+(j-1)+'_'+field].$setViewValue(fieldVal);
                        $scope.patient[j-1].test[field] = fieldVal;
                        $('#test'+(j-1)+'_'+field.replace(/ /g,"_")).val(fieldVal);
                      }
                      else{
                        $scope.patient.form[data[0]+(j-1)].$setViewValue(data[j]);
                        var fieldVal = data[j];
                        if(data[0]==='age' || data[0]==='dob' || data[0]==='dot'){
                          fieldVal = new Date(data[j]);
                        }
                        $scope.patient[j-1][data[0]] = fieldVal;
                        $('#'+data[0]+(j-1)).val(data[j]);
                      }
                    } 
                  }
                  $('.remBtn').parent().html('Patient');
                  $("#fileContent").val(''); 
                }, 50);
              }

            });
        };
        r.readAsText(files[0]);  
            //on ok button press 
      },function(){
            //on cancel button press
            console.log("Modal Closed");
      });
    }
  }


  var findTest = function(value,findField){
    $scope.testid = {};
    $scope.keepgoing = true;
    childTest($scope.treeCtrl.tests,value,findField);
    $scope.keepgoing = true;
    return $scope.testid;
  }

  var childTest = function(scope,value,findField){
    angular.forEach(scope, function(childVal,childKey) {
      if($scope.keepgoing) {
        if(childVal.children.length>0){
          childTest(childVal.children,value,findField);
        }
        else
        {
          if(childVal[findField]===value){
            $scope.testid = childVal;
            $scope.keepgoing = false;
          }
        }
      }
    });
  }

  var ModalInstanceCtrl = function($scope, $modalInstance, $modal) {
    $scope.ok = function () {
      $modalInstance.close({txtvalue:$('#txtvalue').val()});
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
  //////////////////////////////////////////////////
  ////////////////////////////////////////////
  /////////////////////////////////////////
  // ENDs here make sure you adapt it :-)
});




var pat = [{
  "patient.id":9999,
  "patient.age":"12/12/1975",
  "patient.sex":0,
  "patient.education":"Higher Education"
},{
  "patient.id":3333,
  "patient.age":"22/02/1995",
  "patient.sex":1,
  "patient.education":"University Degree"
}
];


app.controller('plotController', function($scope){
  /* Chart options */
  this.lineChart=function(){
    if($scope.patient.chart=="line"){
      this.options = {
                  chart: {
                      type: 'cumulativeLineChart',
                      height: 450,
                      margin : {
                          top: 20,
                          right: 20,
                          bottom: 50,
                          left: 65
                      },
                      x: function(d){ return d[0]; },
                      y: function(d){ return d[1]/100; },
                      average: function(d) { return d.mean/100; },

                      color: d3.scale.category10().range(),
                      duration: 300,
                      useInteractiveGuideline: true,
                      clipVoronoi: false,
                      xAxis: {
                          axisLabel: 'X Axis',
                          tickFormat: function(d) {
                              return d3.time.format('%m/%d/%y')(new Date(d))
                          },
                          showMaxMin: false,
                          staggerLabels: true
                      },

                      yAxis: {
                          axisLabel: 'Y Axis',
                          tickFormat: function(d){
                              return d3.format(',.1%')(d);
                          },
                          axisLabelDistance: 0
                      }
                  }
      };

              /* Chart data */
      this.data = [
                  {
                      key: "Long",
                      values: [ [ 1083297600000 , -2.974623048543] , [ 1085976000000 , -1.7740300785979] , [ 1088568000000 , 4.4681318138177] , [ 1091246400000 , 7.0242541001353] , [ 1093924800000 , 7.5709603667586] , [ 1096516800000 , 20.612245065736] , [ 1099195200000 , 21.698065237316] , [ 1101790800000 , 40.501189458018] , [ 1104469200000 , 50.464679413194] , [ 1107147600000 , 48.917421973355] , [ 1109566800000 , 63.750936549160] , [ 1112245200000 , 59.072499126460] , [ 1114833600000 , 43.373158880492] , [ 1117512000000 , 54.490918947556] , [ 1120104000000 , 56.661178852079] , [ 1122782400000 , 73.450103545496] , [ 1125460800000 , 71.714526354907] , [ 1128052800000 , 85.221664349607] , [ 1130734800000 , 77.769261392481] , [ 1133326800000 , 95.966528716500] , [ 1136005200000 , 107.59132116397] , [ 1138683600000 , 127.25740096723] , [ 1141102800000 , 122.13917498830] , [ 1143781200000 , 126.53657279774] , [ 1146369600000 , 132.39300992970] , [ 1149048000000 , 120.11238242904] , [ 1151640000000 , 118.41408917750] , [ 1154318400000 , 107.92918924621] , [ 1156996800000 , 110.28057249569] , [ 1159588800000 , 117.20485334692] , [ 1162270800000 , 141.33556756948] , [ 1164862800000 , 159.59452727893] , [ 1167541200000 , 167.09801853304] , [ 1170219600000 , 185.46849659215] , [ 1172638800000 , 184.82474099990] , [ 1175313600000 , 195.63155213887] , [ 1177905600000 , 207.40597044171] , [ 1180584000000 , 230.55966698196] , [ 1183176000000 , 239.55649035292] , [ 1185854400000 , 241.35915085208] , [ 1188532800000 , 239.89428956243] , [ 1191124800000 , 260.47781917715] , [ 1193803200000 , 276.39457482225] , [ 1196398800000 , 258.66530682672] , [ 1199077200000 , 250.98846121893] , [ 1201755600000 , 226.89902618127] , [ 1204261200000 , 227.29009273807] , [ 1206936000000 , 218.66476654350] , [ 1209528000000 , 232.46605902918] , [ 1212206400000 , 253.25667081117] , [ 1214798400000 , 235.82505363925] , [ 1217476800000 , 229.70112774254] , [ 1220155200000 , 225.18472705952] , [ 1222747200000 , 189.13661746552] , [ 1225425600000 , 149.46533007301] , [ 1228021200000 , 131.00340772114] , [ 1230699600000 , 135.18341728866] , [ 1233378000000 , 109.15296887173] , [ 1235797200000 , 84.614772549760] , [ 1238472000000 , 100.60810015326] , [ 1241064000000 , 141.50134895610] , [ 1243742400000 , 142.50405083675] , [ 1246334400000 , 139.81192372672] , [ 1249012800000 , 177.78205544583] , [ 1251691200000 , 194.73691933074] , [ 1254283200000 , 209.00838460225] , [ 1256961600000 , 198.19855877420] , [ 1259557200000 , 222.37102417812] , [ 1262235600000 , 234.24581081250] , [ 1264914000000 , 228.26087689346] , [ 1267333200000 , 248.81895126250] , [ 1270008000000 , 270.57301075186] , [ 1272600000000 , 292.64604322550] , [ 1275278400000 , 265.94088520518] , [ 1277870400000 , 237.82887467569] , [ 1280548800000 , 265.55973314204] , [ 1283227200000 , 248.30877330928] , [ 1285819200000 , 278.14870066912] , [ 1288497600000 , 292.69260960288] , [ 1291093200000 , 300.84263809599] , [ 1293771600000 , 326.17253914628] , [ 1296450000000 , 337.69335966505] , [ 1298869200000 , 339.73260965121] , [ 1301544000000 , 346.87865120765] , [ 1304136000000 , 347.92991526628] , [ 1306814400000 , 342.04627502669] , [ 1309406400000 , 333.45386231233] , [ 1312084800000 , 323.15034181243] , [ 1314763200000 , 295.66126882331] , [ 1317355200000 , 251.48014579253] , [ 1320033600000 , 295.15424257905] , [ 1322629200000 , 294.54766764397] , [ 1325307600000 , 295.72906119051] , [ 1327986000000 , 325.73351347613] , [ 1330491600000 , 340.16106061186] , [ 1333166400000 , 345.15514071490] , [ 1335758400000 , 337.10259395679] , [ 1338436800000 , 318.68216333837] , [ 1341028800000 , 317.03683945246] , [ 1343707200000 , 318.53549659997] , [ 1346385600000 , 332.85381464104] , [ 1348977600000 , 337.36534373477] , [ 1351656000000 , 350.27872156161] , [ 1354251600000 , 349.45128876100]]
                      ,
                      mean: 250
                  },
                  {
                      key: "Short",
                      values: [ [ 1083297600000 , -0.77078283705125] , [ 1085976000000 , -1.8356366650335] , [ 1088568000000 , -5.3121322073127] , [ 1091246400000 , -4.9320975829662] , [ 1093924800000 , -3.9835408823225] , [ 1096516800000 , -6.8694685316805] , [ 1099195200000 , -8.4854877428545] , [ 1101790800000 , -15.933627197384] , [ 1104469200000 , -15.920980069544] , [ 1107147600000 , -12.478685045651] , [ 1109566800000 , -17.297761889305] , [ 1112245200000 , -15.247129891020] , [ 1114833600000 , -11.336459046839] , [ 1117512000000 , -13.298990907415] , [ 1120104000000 , -16.360027000056] , [ 1122782400000 , -18.527929522030] , [ 1125460800000 , -22.176516738685] , [ 1128052800000 , -23.309665368330] , [ 1130734800000 , -21.629973409748] , [ 1133326800000 , -24.186429093486] , [ 1136005200000 , -29.116707312531] , [ 1138683600000 , -37.188037874864] , [ 1141102800000 , -34.689264821198] , [ 1143781200000 , -39.505932105359] , [ 1146369600000 , -45.339572492759] , [ 1149048000000 , -43.849353192764] , [ 1151640000000 , -45.418353922571] , [ 1154318400000 , -44.579281059919] , [ 1156996800000 , -44.027098363370] , [ 1159588800000 , -41.261306759439] , [ 1162270800000 , -47.446018534027] , [ 1164862800000 , -53.413782948909] , [ 1167541200000 , -50.700723647419] , [ 1170219600000 , -56.374090913296] , [ 1172638800000 , -61.754245220322] , [ 1175313600000 , -66.246241587629] , [ 1177905600000 , -75.351650899999] , [ 1180584000000 , -81.699058262032] , [ 1183176000000 , -82.487023368081] , [ 1185854400000 , -86.230055113277] , [ 1188532800000 , -84.746914818507] , [ 1191124800000 , -100.77134971977] , [ 1193803200000 , -109.95435565947] , [ 1196398800000 , -99.605672965057] , [ 1199077200000 , -99.607249394382] , [ 1201755600000 , -94.874614950188] , [ 1204261200000 , -105.35899063105] , [ 1206936000000 , -106.01931193802] , [ 1209528000000 , -110.28883571771] , [ 1212206400000 , -119.60256203030] , [ 1214798400000 , -115.62201315802] , [ 1217476800000 , -106.63824185202] , [ 1220155200000 , -99.848746318951] , [ 1222747200000 , -85.631219602987] , [ 1225425600000 , -63.547909262067] , [ 1228021200000 , -59.753275364457] , [ 1230699600000 , -63.874977883542] , [ 1233378000000 , -56.865697387488] , [ 1235797200000 , -54.285579501988] , [ 1238472000000 , -56.474659581885] , [ 1241064000000 , -63.847137745644] , [ 1243742400000 , -68.754247867325] , [ 1246334400000 , -69.474257009155] , [ 1249012800000 , -75.084828197067] , [ 1251691200000 , -77.101028237237] , [ 1254283200000 , -80.454866854387] , [ 1256961600000 , -78.984349952220] , [ 1259557200000 , -83.041230807854] , [ 1262235600000 , -84.529748348935] , [ 1264914000000 , -83.837470195508] , [ 1267333200000 , -87.174487671969] , [ 1270008000000 , -90.342293007487] , [ 1272600000000 , -93.550928464991] , [ 1275278400000 , -85.833102140765] , [ 1277870400000 , -79.326501831592] , [ 1280548800000 , -87.986196903537] , [ 1283227200000 , -85.397862121771] , [ 1285819200000 , -94.738167050020] , [ 1288497600000 , -98.661952897151] , [ 1291093200000 , -99.609665952708] , [ 1293771600000 , -103.57099836183] , [ 1296450000000 , -104.04353411322] , [ 1298869200000 , -108.21382792587] , [ 1301544000000 , -108.74006900920] , [ 1304136000000 , -112.07766650960] , [ 1306814400000 , -109.63328199118] , [ 1309406400000 , -106.53578966772] , [ 1312084800000 , -103.16480871469] , [ 1314763200000 , -95.945078001828] , [ 1317355200000 , -81.226687340874] , [ 1320033600000 , -90.782206596168] , [ 1322629200000 , -89.484445370113] , [ 1325307600000 , -88.514723135326] , [ 1327986000000 , -93.381292724320] , [ 1330491600000 , -97.529705609172] , [ 1333166400000 , -99.520481439189] , [ 1335758400000 , -99.430184898669] , [ 1338436800000 , -93.349934521973] , [ 1341028800000 , -95.858475286491] , [ 1343707200000 , -95.522755836605] , [ 1346385600000 , -98.503848862036] , [ 1348977600000 , -101.49415251896] , [ 1351656000000 , -101.50099325672] , [ 1354251600000 , -99.487094927489]]
                      ,
                      mean: -60
                  },

                  {
                      key: "Gross",
                      mean: 125,
                      values: [ [ 1083297600000 , -3.7454058855943] , [ 1085976000000 , -3.6096667436314] , [ 1088568000000 , -0.8440003934950] , [ 1091246400000 , 2.0921565171691] , [ 1093924800000 , 3.5874194844361] , [ 1096516800000 , 13.742776534056] , [ 1099195200000 , 13.212577494462] , [ 1101790800000 , 24.567562260634] , [ 1104469200000 , 34.543699343650] , [ 1107147600000 , 36.438736927704] , [ 1109566800000 , 46.453174659855] , [ 1112245200000 , 43.825369235440] , [ 1114833600000 , 32.036699833653] , [ 1117512000000 , 41.191928040141] , [ 1120104000000 , 40.301151852023] , [ 1122782400000 , 54.922174023466] , [ 1125460800000 , 49.538009616222] , [ 1128052800000 , 61.911998981277] , [ 1130734800000 , 56.139287982733] , [ 1133326800000 , 71.780099623014] , [ 1136005200000 , 78.474613851439] , [ 1138683600000 , 90.069363092366] , [ 1141102800000 , 87.449910167102] , [ 1143781200000 , 87.030640692381] , [ 1146369600000 , 87.053437436941] , [ 1149048000000 , 76.263029236276] , [ 1151640000000 , 72.995735254929] , [ 1154318400000 , 63.349908186291] , [ 1156996800000 , 66.253474132320] , [ 1159588800000 , 75.943546587481] , [ 1162270800000 , 93.889549035453] , [ 1164862800000 , 106.18074433002] , [ 1167541200000 , 116.39729488562] , [ 1170219600000 , 129.09440567885] , [ 1172638800000 , 123.07049577958] , [ 1175313600000 , 129.38531055124] , [ 1177905600000 , 132.05431954171] , [ 1180584000000 , 148.86060871993] , [ 1183176000000 , 157.06946698484] , [ 1185854400000 , 155.12909573880] , [ 1188532800000 , 155.14737474392] , [ 1191124800000 , 159.70646945738] , [ 1193803200000 , 166.44021916278] , [ 1196398800000 , 159.05963386166] , [ 1199077200000 , 151.38121182455] , [ 1201755600000 , 132.02441123108] , [ 1204261200000 , 121.93110210702] , [ 1206936000000 , 112.64545460548] , [ 1209528000000 , 122.17722331147] , [ 1212206400000 , 133.65410878087] , [ 1214798400000 , 120.20304048123] , [ 1217476800000 , 123.06288589052] , [ 1220155200000 , 125.33598074057] , [ 1222747200000 , 103.50539786253] , [ 1225425600000 , 85.917420810943] , [ 1228021200000 , 71.250132356683] , [ 1230699600000 , 71.308439405118] , [ 1233378000000 , 52.287271484242] , [ 1235797200000 , 30.329193047772] , [ 1238472000000 , 44.133440571375] , [ 1241064000000 , 77.654211210456] , [ 1243742400000 , 73.749802969425] , [ 1246334400000 , 70.337666717565] , [ 1249012800000 , 102.69722724876] , [ 1251691200000 , 117.63589109350] , [ 1254283200000 , 128.55351774786] , [ 1256961600000 , 119.21420882198] , [ 1259557200000 , 139.32979337027] , [ 1262235600000 , 149.71606246357] , [ 1264914000000 , 144.42340669795] , [ 1267333200000 , 161.64446359053] , [ 1270008000000 , 180.23071774437] , [ 1272600000000 , 199.09511476051] , [ 1275278400000 , 180.10778306442] , [ 1277870400000 , 158.50237284410] , [ 1280548800000 , 177.57353623850] , [ 1283227200000 , 162.91091118751] , [ 1285819200000 , 183.41053361910] , [ 1288497600000 , 194.03065670573] , [ 1291093200000 , 201.23297214328] , [ 1293771600000 , 222.60154078445] , [ 1296450000000 , 233.35556801977] , [ 1298869200000 , 231.22452435045] , [ 1301544000000 , 237.84432503045] , [ 1304136000000 , 235.55799131184] , [ 1306814400000 , 232.11873570751] , [ 1309406400000 , 226.62381538123] , [ 1312084800000 , 219.34811113539] , [ 1314763200000 , 198.69242285581] , [ 1317355200000 , 168.90235629066] , [ 1320033600000 , 202.64725756733] , [ 1322629200000 , 203.05389378105] , [ 1325307600000 , 204.85986680865] , [ 1327986000000 , 229.77085616585] , [ 1330491600000 , 239.65202435959] , [ 1333166400000 , 242.33012622734] , [ 1335758400000 , 234.11773262149] , [ 1338436800000 , 221.47846307887] , [ 1341028800000 , 216.98308827912] , [ 1343707200000 , 218.37781386755] , [ 1346385600000 , 229.39368622736] , [ 1348977600000 , 230.54656412916] , [ 1351656000000 , 243.06087025523] , [ 1354251600000 , 244.24733578385]]
                  },
                  {
                      key: "S&P 1500",
                      values: [ [ 1083297600000 , -1.7798428181819] , [ 1085976000000 , -0.36883324836999] , [ 1088568000000 , 1.7312581046040] , [ 1091246400000 , -1.8356125950460] , [ 1093924800000 , -1.5396564170877] , [ 1096516800000 , -0.16867791409247] , [ 1099195200000 , 1.3754263993413] , [ 1101790800000 , 5.8171640898041] , [ 1104469200000 , 9.4350145241608] , [ 1107147600000 , 6.7649081510160] , [ 1109566800000 , 9.1568499314776] , [ 1112245200000 , 7.2485090994419] , [ 1114833600000 , 4.8762222306595] , [ 1117512000000 , 8.5992339354652] , [ 1120104000000 , 9.0896517982086] , [ 1122782400000 , 13.394644048577] , [ 1125460800000 , 12.311842010760] , [ 1128052800000 , 13.221003650717] , [ 1130734800000 , 11.218481009206] , [ 1133326800000 , 15.565352598445] , [ 1136005200000 , 15.623703865926] , [ 1138683600000 , 19.275255326383] , [ 1141102800000 , 19.432433717836] , [ 1143781200000 , 21.232881244655] , [ 1146369600000 , 22.798299192958] , [ 1149048000000 , 19.006125095476] , [ 1151640000000 , 19.151889158536] , [ 1154318400000 , 19.340022855452] , [ 1156996800000 , 22.027934841859] , [ 1159588800000 , 24.903300681329] , [ 1162270800000 , 29.146492833877] , [ 1164862800000 , 31.781626082589] , [ 1167541200000 , 33.358770738428] , [ 1170219600000 , 35.622684613497] , [ 1172638800000 , 33.332821711366] , [ 1175313600000 , 34.878748635832] , [ 1177905600000 , 40.582332613844] , [ 1180584000000 , 45.719535502920] , [ 1183176000000 , 43.239344722386] , [ 1185854400000 , 38.550955100342] , [ 1188532800000 , 40.585368816283] , [ 1191124800000 , 45.601374057981] , [ 1193803200000 , 48.051404337892] , [ 1196398800000 , 41.582581696032] , [ 1199077200000 , 40.650580792748] , [ 1201755600000 , 32.252222066493] , [ 1204261200000 , 28.106390258553] , [ 1206936000000 , 27.532698196687] , [ 1209528000000 , 33.986390463852] , [ 1212206400000 , 36.302660526438] , [ 1214798400000 , 25.015574480172] , [ 1217476800000 , 23.989494069029] , [ 1220155200000 , 25.934351445531] , [ 1222747200000 , 14.627592011699] , [ 1225425600000 , -5.2249403809749] , [ 1228021200000 , -12.330933408050] , [ 1230699600000 , -11.000291508188] , [ 1233378000000 , -18.563864948088] , [ 1235797200000 , -27.213097001687] , [ 1238472000000 , -20.834133840523] , [ 1241064000000 , -12.717886701719] , [ 1243742400000 , -8.1644613083526] , [ 1246334400000 , -7.9108408918201] , [ 1249012800000 , -0.77002391591209] , [ 1251691200000 , 2.8243816569672] , [ 1254283200000 , 6.8761411421070] , [ 1256961600000 , 4.5060912230294] , [ 1259557200000 , 10.487179794349] , [ 1262235600000 , 13.251375597594] , [ 1264914000000 , 9.2207594803415] , [ 1267333200000 , 12.836276936538] , [ 1270008000000 , 19.816793904978] , [ 1272600000000 , 22.156787167211] , [ 1275278400000 , 12.518039090576] , [ 1277870400000 , 6.4253587440854] , [ 1280548800000 , 13.847372028409] , [ 1283227200000 , 8.5454736090364] , [ 1285819200000 , 18.542801953304] , [ 1288497600000 , 23.037064683183] , [ 1291093200000 , 23.517422401888] , [ 1293771600000 , 31.804723416068] , [ 1296450000000 , 34.778247386072] , [ 1298869200000 , 39.584883855230] , [ 1301544000000 , 40.080647664875] , [ 1304136000000 , 44.180050667889] , [ 1306814400000 , 42.533535927221] , [ 1309406400000 , 40.105374449011] , [ 1312084800000 , 37.014659267156] , [ 1314763200000 , 29.263745084262] , [ 1317355200000 , 19.637463417584] , [ 1320033600000 , 33.157645345770] , [ 1322629200000 , 32.895053150988] , [ 1325307600000 , 34.111544824647] , [ 1327986000000 , 40.453985817473] , [ 1330491600000 , 46.435700783313] , [ 1333166400000 , 51.062385488671] , [ 1335758400000 , 50.130448220658] , [ 1338436800000 , 41.035476682018] , [ 1341028800000 , 46.591932296457] , [ 1343707200000 , 48.349391180634] , [ 1346385600000 , 51.913011286919] , [ 1348977600000 , 55.747238313752] , [ 1351656000000 , 52.991824077209] , [ 1354251600000 , 49.556311883284]]
                  }
      ];
    }
  };
  
});