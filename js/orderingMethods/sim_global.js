/**
 * Implements the method by Ankerst et al., but uses exhaustive search instead of ant colony optimization
 * from: Similarity Clustering of Dimensions for an Enhanced Visualization of Multidimensional Data
 * by: Mihael Ankerst, Stefan Berchtold, Daniel A. Keim
 */

/**
 * Computes the neighboring sequence with the highest overall similarity score using exhaustive search
 * @param dataArr
 * @param simMat
 * @returns {*}
 */
function sim_global(dataArr, simMat) {
    var allDim = [];
    var scores = [];
    var simMeasure = document.getElementById("similarity").value;
    for (var i = 0; i < dataArr[0].length - 1; i++) {
        allDim.push(i);
    }
    var allpermutation = permutator(allDim);
    for (var nc = 0; nc < allpermutation.length; nc++) {
        var score = getScore(allpermutation[nc], simMat);
        scores.push(score);
    }
    if (simMeasure === "euclidean") {
        return allpermutation[getMinIndex(scores)[0]];
    } else if (simMeasure === "pcc") {
        return allpermutation[getMaxIndex(scores)[0]];
    }
}


/**
 * Get the similarity score for a given neighboring sequence
 * @param nc
 * @param simMat
 * @returns {number}
 */
function getScore(nc, simMat) {
    var score = 0;
    for (var dim = 0; dim < nc.length; dim++) {
        if (dim !== nc.length - 1) {
            score = score + simOfTwo(nc[dim], nc[dim + 1], simMat);
            } else {
            score = score + simOfTwo(nc[dim], nc[0], simMat);
        }
    }
    return score;
}

/**
 * get the similarity score for two dimensions from the similarity matrix
 * @param dim1
 * @param dim2
 * @param simMat
 * @returns {*}
 */
function simOfTwo(dim1, dim2, simMat) {
    var firstDim, lastDim;
    if (dim1 > dim2) {
        firstDim = dim1;
        lastDim = dim2;
    } else if (dim1 < dim2) {
        firstDim = dim2;
        lastDim = dim1;
    } else {
        throw ("Error: two identical dimensions." + dim1 + dim2);

    }
    return simMat[firstDim][lastDim];
}