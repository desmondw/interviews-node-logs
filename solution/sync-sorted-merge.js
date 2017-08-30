'use strict'

module.exports = (logSources, printer) => {
    // generate an array of popped logs in order of date
    var poppedLogs = [];
    logSources.forEach(function(src, i){
        sortInsertLog(src.pop(), i);
    });

    // print logs
    while (poppedLogs[0]) {
        // print the first log and pop a new one from the same source
        let lastLog = poppedLogs.shift();
        printer.print(lastLog);

        let newLog = logSources[lastLog.sourceIndex].pop();
        sortInsertLog(newLog, lastLog.sourceIndex);
    }

    // inserts logs into a sorted list
    function sortInsertLog(log, sourceIndex) {
        if (!log) return;
        log.sourceIndex = sourceIndex; // add a reference to the source so we can pull the next one

        // insert in proper place
        for (let i = 0; i < poppedLogs.length; i++){
            if (log.date < poppedLogs[i].date){
                poppedLogs.splice(i, 0, log);
                return;
            }
        }
        poppedLogs.push(log); // last date OR empty array
    }
}