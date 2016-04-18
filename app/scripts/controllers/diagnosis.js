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
    //console.log(JSON.stringify(patientObj));
    $scope.submitData1 = JSON.stringify(patientObj);
    $scope.submitData = $scope.submitData1.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")
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

app.controller('plotController', function($scope,$http,diagnosisService){

  /* Chart options */
  this.lineChart=function(){
    if($scope.patient.chart=="line"){
      var patientObj = $scope.$parent.submitData;
      /*$http.get('data/patientoutput2.json').success(function (data) 
      {
        diagnosisService.lineChart(data);
      });*/
      var config = {
          headers: {
              'Content-Type': 'application/json;'
          }
      }
      $http.post('http://145.100.58.103:5000/formTestScores',patientObj, config)
      .success(function (data, status, headers, config) {
          console.log(data);
          diagnosisService.lineChart(data);
      })
      .error(function (data, status, header, config) {
        console.log(data);  
      });


    }
  };

});

