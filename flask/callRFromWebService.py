import rpy2
from flask import Flask
from flask import request
import json 
from numpy import *
from rpy2.robjects.numpy2ri import numpy2ri
import scipy as sp
from pandas import *
import pickle
from rpy2.robjects.packages import importr
import rpy2.robjects as ro
import rpy2.rinterface as rinterface
import pandas.rpy.common as com
from rpy2.robjects.packages import SignatureTranslatedAnonymousPackage
import subprocess
import sys
from rpy2.robjects import pandas2ri
pandas2ri.activate()


app = Flask(__name__)

@app.route('/')
def run_script():
    ro.r('x=c()')
    ro.r('x[1]=22')
    ro.r('x[2]=44')
    s = str(ro.r['x'])
    return s

@app.route('/demoTestScores',methods=['GET','POST'])
def api_demoTestScores():
    if request.headers['Content-Type']=='application/json':
        return "JSON Object: " + json.dumps(request.json)


"""
@app.route('/formTestScores',methods=['GET','POST'])
def api_formTestScores():
    if request.headers['Content-Type']=='application/json':
        #jsonlite=importr('jsonlite')
        myPyJSON= request.data
        ro.r('myJSON <- fromJSON({})'.format(repr(myPyJSON)))
        ro.r('source("/home/anandgavai/ANDI/flask/functionforandi.R")')
        t = json.dumps(ro.r('myFunc({})'.format(repr(myPyJSON))))
        #return ro.r('whichtestindexes')
        print t
        return t
"""

@app.route('/formTestScores',methods=['GET','POST'])
def api_formTestScores():
    if request.headers['Content-Type']=='application/json':
        #jsonlite=importr('jsonlite')
        myPyJSON=request.data
        print myPyJSON
        p = subprocess.Popen(["Rscript", "functionforandi.R"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        t = p.communicate(myPyJSON)
        print t
        return t


if __name__ == '__main__':
    app.debug=True
    app.run()
