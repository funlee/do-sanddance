export function applySignalValues(sv, b) {
    if (!sv || !b || !b.signals || !b.signals.length)
        return;
    for (let key in sv) {
        let value = sv[key];
        let signalB = b.signals.filter(signal => signal.name === key)[0];
        if (signalB && signalB.bind) {
            signalB.value = value;
        }
    }
}
export function extractSignalValuesFromView(view, spec) {
    if (!view || !spec || !spec.signals || !spec.signals.length)
        return;
    const result = {};
    spec.signals.forEach((signalA) => {
        //bound to a UI control
        if (signalA.bind) {
            try {
                result[signalA.name] = view.signal(signalA.name);
            }
            catch (e) {
                // continue regardless of error
            }
        }
    });
    return result;
}
