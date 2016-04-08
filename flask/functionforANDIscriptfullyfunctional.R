
########## THIS PART NEEDS TO BE COMMENTED OUT FOR THE WEBSITE ###########
#input
setwd("//home//anandgavai//ANDI//flask")
library(jsonlite)
library(lubridate)
json <- fromJSON("myJSON.json")
##########################################################################

myFunc<-function(json){
no.patients <- length(head(json,-3))
mypatdata <- NULL
for( i in 1:(no.patients) ){
  demos <- unlist(head(json[[i]],4))
  testinfo <- json[[i]][5][[1]]
  mypatdata <- rbind( mypatdata, cbind( matrix(rep(demos, nrow(testinfo)), nrow(testinfo), byrow = T), testinfo))
}

colnames( mypatdata) <- c("patid", "date", "SEX", "EDU", "uniqueid", "label",
                       "score")
mypatdata$patid <- as.numeric(as.character(mypatdata$patid))
mypatdata$AGE <- as.period(interval(ymd(substring(mypatdata$date,1,10)),now()))$year - 65
mypatdata$EDU <- as.numeric(as.character(mypatdata$EDU))
mypatdata$conf <- as.numeric(json$conf)
mypatdata$sig <- json$sig
mypatdata$nomative <- json$nomative

# defaultvalues
load("//home//anandgavai//ANDI//flask//summarystats.RData")

ANDImetadata <- read.csv("//home//anandgavai//ANDI//flask//metadataforMMNCandpatient.csv") 
uniqueID <- ANDImetadata$uniqueid



covariancemat <- betweencov + withincov
rownames(covariancemat) <- uniqueID
colnames(covariancemat) <- uniqueID

# selection of appropriate sections of matrices and vectors, given which tests the patient has completed
# and applying the same transformations to the patient data that were applied to the control data

# whichtestnames <- uniqueIDs[whichtestindexes]
# 
totaloutputdataframe <- NULL
whichtests <- unique(mypatdata$uniqueid)
for( pat in unique(mypatdata$patid)){
pat = mypatdata$patid[1]
  
mydata <- mypatdata[mypatdata$patid == pat,]
mydata$score <- ((mydata$score ^ ANDImetadata$mybestpowertransform[ANDImetadata$uniqueid %in% mydata$uniqueid] 
                 * sign(ANDImetadata$mybestpowertransform[ANDImetadata$uniqueid %in% mydata$uniqueid]) - 
                   ANDImetadata$mymean.transformedscores[ANDImetadata$uniqueid %in% mydata$uniqueid]) /
                      ANDImetadata$mysd.transformedscores[ANDImetadata$uniqueid %in% mydata$uniqueid]) *
                          ANDImetadata$recode[ANDImetadata$uniqueid %in% mydata$uniqueid]



C <- covariancemat[ rownames(covariancemat) %in% whichtests, colnames(covariancemat) %in% whichtests]
P <- nrow(mydata)
inv.C <- solve(C)

#
rownames(beta) <- rep(ANDImetadata$uniqueid,4)
betaselection <- beta[rownames(beta) %in% whichtests]
mydata$pred <- (t( c(1, mydata$SEX[1], mydata$AGE[1], mydata$EDU[1])) %x% diag(1,P)) %*% t(t(betaselection))

tstatistics <- NULL
pvalues <- NULL
Tsquared <- NULL

est.n <- ANDImetadata$Nfinal[ANDImetadata$uniqueid %in% mydata$uniqueid]
min.est.n <- min(est.n)
dfs <- est.n - 1
g <- ( min.est.n  + 1 ) / min.est.n 

Tsquared <- ( 1 / g ) * ( ( min.est.n - P ) / ( ( min.est.n - 1 ) * P ) ) * t( mydata$pred - mydata$score ) %*% inv.C %*% ( mydata$pred - mydata$score )

tstatistics <- ((mydata$score - mydata$pred) / ( sqrt(diag(C)) / sqrt(est.n))) * (1 / sqrt(est.n + 1))


tailed <- mydata$sig[1]
if( tailed == "oneTailedLeft"){
  pvalues <- pt(tstatistics, dfs, lower = FALSE)
}

if( tailed == "oneTailedRight"){
  pvalues <- pt(tstatistics, dfs, lower = TRUE)
}

if( tailed == "twoTailed"){
  pvalues <- pt(abs(tstatistics), dfs, lower = FALSE) * 2
}
# 
# if( pvaluecorrection == "None"){
#   pvalues[i,] <- pvalues[i,]
# }
# if( pvaluecorrection == "Bonferroni"){
#   pvalues[i,] <- p.adjust(pvalues[i,], method = "bonferroni")
# }
# if( pvaluecorrection == "Holm"){
#   pvalues[i,] <- p.adjust(pvalues[i,], method = "holm")
# }



if( tailed == "oneTailedLeft"){
  inneredge <- qt( (1 - ( mydata$conf[1]  / 100)), dfs, lower.tail = T)
  outeredge <- rep(99999,P)
  }

if( tailed == "oneTailedRight"){
  inneredge <- rep(-99999,P)
  outeredge <- qt( (1 - ( mydata$conf[1]  / 100)), dfs, lower.tail = F)
}

if( tailed == "twoTailed"){
  inneredge <- qt( (1 - ( mydata$conf[1] / 100)) / 2, dfs)
  outeredge <- abs( qt( (1 - ( mydata$conf[1] / 100)) / 2, dfs))
}

tstatistics <- round(tstatistics, 2)


pvalues <- round( pvalues, 3)


longtestnames <- paste(ANDImetadata$Long.name.1, ANDImetadata$Long.name.2, ANDImetadata$Long.name.3[!is.na(ANDImetadata$Long.name.3)])


myoutputdataframe <- data.frame( 
  id = mydata$patid, 
  testname = mydata$uniqueid, 
  longtestname = longtestnames[ANDImetadata$uniqueid %in% mydata$uniqueid] , 
  inneredge = inneredge, 
  outeredge = outeredge, 
  univariateT = tstatistics,
  multivariateT = rep(Tsquared,each = P))
totaloutputdataframe <- rbind( totaloutputdataframe, myoutputdataframe)
}
myoutputdata <- toJSON( myoutputdataframe,pretty = T)
return (myoutputdata)
}


myFunc(json)
