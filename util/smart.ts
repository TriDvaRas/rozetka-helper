import nj from 'numjs'
export default function solveSmart(values: number[][], weights: number[]) {
    const A = nj.array(values)
    const w = nj.array(weights)
    const cMins = nj.array(A.T.tolist().map(x => Math.min(...x)))
    const cMaxs = nj.array(A.T.tolist().map(x => Math.max(...x)))
    const d = cMaxs.subtract(cMins)
    const y = w.divide(w.sum())
    console.log({ cMins, cMaxs, y });
    // console.log(cMaxs);
    // console.log(y);
    // console.log(values.length);
    const _normA = []
    for (const row of A.tolist()) {
        _normA.push(nj.array(row).subtract(cMins).divide(d).tolist())
    }
    console.log({_normA});
    const normA = nj.array(_normA)
    console.log({normA});
    const res = normA.tolist().map(x => nj.dot(x, y).get(0))
    console.log({res});
    return res
}