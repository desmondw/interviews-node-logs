'use strict'

module.exports = (logSources, printer) => {
    // generate an array of popped logs in order of date
    var poppedLogs = [];
    logSources.forEach(function(src, i){
        src.popAsync().then(function(log) {
            sortInsertLog(log, i);
        }).then(function(){
            if (poppedLogs.length == logSources.length){
                printLogs();
            }
        });
    });

    // print logs
    function printLogs() {
        let lastLog = poppedLogs.shift();
        printer.print(lastLog);

        // print the first log and pop a new one from the same source
        logSources[lastLog.sourceIndex].popAsync().then(function(newLog){
            if (sortInsertLog(newLog, lastLog.sourceIndex))
                printLogs();
            else {
                // print remaining logs after sources exhausted
                poppedLogs.forEach(function(log){
                    printer.print(log);
                });
            }
        });
    }

    // inserts logs into a sorted list
    function sortInsertLog(log, sourceIndex) {
        if (!log) return false;
        log.sourceIndex = sourceIndex; // add a reference to the source so we can pull the next one

        // insert in proper place
        for (let i = 0; i < poppedLogs.length; i++){
            if (log.date < poppedLogs[i].date){
                poppedLogs.splice(i, 0, log);
                return true;
            }
        }
        poppedLogs.push(log); // last date OR empty array
        return true;
    }
}